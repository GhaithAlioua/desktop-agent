use bollard::Docker;
use serde::{Deserialize, Serialize};
use std::time::Duration;

#[derive(Debug, Serialize, Deserialize)]
struct DockerStatus {
    is_running: bool,
    version: Option<DockerVersion>,
    error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct DockerVersion {
    version: String,
    api_version: String,
    os: String,
    arch: String,
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn get_docker_status() -> Result<DockerStatus, String> {
    // Try to connect to Docker - if this fails, Docker is not running
    let docker = match Docker::connect_with_local_defaults() {
        Ok(docker) => docker,
        Err(e) => {
            return Ok(DockerStatus {
                is_running: false,
                version: None,
                error: Some(format!("Docker is not running: {}", e)),
            })
        }
    };

    // Get Docker version to verify connection and get version info
    let version_info = match tokio::time::timeout(Duration::from_secs(5), docker.version()).await {
        Ok(Ok(info)) => info,
        Ok(Err(e)) => {
            return Ok(DockerStatus {
                is_running: false,
                version: None,
                error: Some(format!("Failed to get version: {}", e)),
            })
        }
        Err(_) => {
            return Ok(DockerStatus {
                is_running: false,
                version: None,
                error: Some("Docker version request timed out".to_string()),
            })
        }
    };

    let version = DockerVersion {
        version: version_info
            .version
            .unwrap_or_else(|| "Unknown".to_string()),
        api_version: version_info
            .api_version
            .unwrap_or_else(|| "Unknown".to_string()),
        os: version_info.os.unwrap_or_else(|| "Unknown".to_string()),
        arch: version_info.arch.unwrap_or_else(|| "Unknown".to_string()),
    };

    Ok(DockerStatus {
        is_running: true,
        version: Some(version),
        error: None,
    })
}

#[tauri::command]
async fn get_docker_version() -> Result<DockerVersion, String> {
    let docker = Docker::connect_with_local_defaults()
        .map_err(|e| format!("Docker is not running: {}", e))?;

    let version_info = tokio::time::timeout(Duration::from_secs(5), docker.version())
        .await
        .map_err(|_| "Docker version request timed out".to_string())?
        .map_err(|e| format!("Failed to get Docker version: {}", e))?;

    Ok(DockerVersion {
        version: version_info
            .version
            .unwrap_or_else(|| "Unknown".to_string()),
        api_version: version_info
            .api_version
            .unwrap_or_else(|| "Unknown".to_string()),
        os: version_info.os.unwrap_or_else(|| "Unknown".to_string()),
        arch: version_info.arch.unwrap_or_else(|| "Unknown".to_string()),
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_docker_status,
            get_docker_version
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
