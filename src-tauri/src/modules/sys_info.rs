use serde::Serialize;
use sysinfo::System;

#[derive(Serialize, Clone)]
pub struct SystemInfo {
    os_name: String,
    os_version: String,
    os_arch: String,
    hostname: String,
    uptime: String,
}

#[tauri::command]
pub fn get_system_info() -> SystemInfo {
    let uptime_secs = System::uptime();
    let uptime_str = format!(
        "{} days, {} hours, {} min",
        uptime_secs / 86400,
        (uptime_secs % 86400) / 3600,
        (uptime_secs % 3600) / 60
    );

    SystemInfo {
        os_name: System::name().unwrap_or_else(|| "N/A".to_string()),
        os_version: System::os_version().unwrap_or_else(|| "N/A".to_string()),
        os_arch: System::cpu_arch().unwrap_or_else(|| "N/A".to_string()),
        hostname: System::host_name().unwrap_or_else(|| "N/A".to_string()),
        uptime: uptime_str,
    }
}
