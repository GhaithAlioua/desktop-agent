use serde::Serialize;
use sysinfo::System;

#[derive(Serialize, Clone)]
pub struct OsInfo {
    os_name: String,
    os_build: String,
    os_arch: String,
    hostname: String,
}

#[derive(Serialize, Clone)]
pub struct CpuInfo {
    brand: String,
    frequency: u64,
    physical_core_count: u32,
    logical_core_count: u32,
}

#[derive(Serialize, Clone)]
pub struct SystemInfo {
    os: OsInfo,
    cpu: CpuInfo,
}

#[tauri::command]
pub fn get_system_info() -> Result<SystemInfo, String> {
    let sys = System::new_with_specifics(
        sysinfo::RefreshKind::new().with_cpu(sysinfo::CpuRefreshKind::everything()),
    );

    let kernel_version_full = System::kernel_version().ok_or("Failed to get kernel version.")?;
    let build_number = if kernel_version_full.contains("Windows NT") {
        kernel_version_full
            .split('.')
            .last()
            .unwrap_or(&kernel_version_full)
            .to_string()
    } else {
        kernel_version_full
    };

    let os_info = OsInfo {
        os_name: System::long_os_version().ok_or("Failed to get OS name.")?,
        os_build: build_number,
        os_arch: System::cpu_arch().ok_or("Failed to get OS architecture.")?,
        hostname: System::host_name().ok_or("Failed to get hostname.")?,
    };

    let cpus = sys.cpus();
    if cpus.is_empty() {
        return Err("No CPU information found.".to_string());
    }
    let cpu_info = CpuInfo {
        brand: cpus[0].brand().to_string(),
        frequency: cpus[0].frequency(),
        physical_core_count: sys
            .physical_core_count()
            .ok_or("Failed to get physical core count.")? as u32,
        logical_core_count: cpus.len() as u32,
    };

    Ok(SystemInfo {
        os: os_info,
        cpu: cpu_info,
    })
}
