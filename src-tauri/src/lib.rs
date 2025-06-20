// This file is the main entry point for the Rust library.
// It sets up the Tauri application and initializes our custom modules.

// Declare the modules that contain our application's core logic.
pub mod modules;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Get the state from the docker module
    let docker_state = modules::docker::get_docker_state();

    tauri::Builder::default()
        .setup(move |app| {
            let app_handle = app.handle().clone();
            // Call the initialization function from the docker module
            tauri::async_runtime::spawn(async move {
                modules::docker::initialize_docker_monitoring(app_handle).await;
            });
            Ok(())
        })
        .manage(docker_state)
        .invoke_handler(tauri::generate_handler![
            modules::docker::get_docker_status,
            modules::docker::get_docker_version,
            modules::docker::subscribe_to_docker_events,
            modules::sys_info::get_system_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
