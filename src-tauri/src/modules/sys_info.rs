use nvml_wrapper::Nvml;
use serde::Serialize;
use sysinfo::{Disks, System};
use thiserror::Error;
use std::env;

/// Constants for memory calculations
const GB_IN_BYTES: f64 = 1024.0 * 1024.0 * 1024.0;

/// Error types for system information collection
#[derive(Debug, Error, Serialize, Clone)]
pub enum SysInfoError {
    #[error("System info error: {0}")]
    System(String),
    #[error("NVML error: {0}")]
    Nvml(String),
}

/// Operating system information
#[derive(Serialize, Clone)]
pub struct OperatingSystemInfo {
    pub name: String,
    pub version: String,
    pub kernel_version: String,
    pub hostname: String,
    pub uptime: u64,
}

/// CPU information
#[derive(Serialize, Clone)]
pub struct CpuInfo {
    pub brand: String,
    pub frequency: u64,
    pub physical_cores: usize,
    pub logical_cores: usize,
}

/// GPU information
#[derive(Serialize, Clone)]
pub struct GpuInfo {
    pub name: String,
    pub memory_total_gb: Option<f64>,
    pub memory_used_gb: Option<f64>,
    pub utilization_percent: Option<u32>,
    pub temperature_celsius: Option<u32>,
}

/// Memory information
#[derive(Serialize, Clone)]
pub struct MemoryInfo {
    pub total_gb: f64,
    pub used_gb: f64,
    pub free_gb: f64,
}

/// Storage information
#[derive(Serialize, Clone)]
pub struct StorageInfo {
    pub devices: Vec<StorageDevice>,
}

/// Individual storage device information
#[derive(Serialize, Clone)]
pub struct StorageDevice {
    pub name: String,
    pub total_size: f64,
    pub used_size: f64,
    pub available_size: f64,
    pub unit: String, // "GB" or "TB"
}

/// Complete system information
#[derive(Serialize, Clone)]
pub struct SystemInfo {
    pub os: Result<OperatingSystemInfo, SysInfoError>,
    pub cpu: Result<CpuInfo, SysInfoError>,
    pub gpu: Result<Vec<GpuInfo>, SysInfoError>,
    pub memory: Result<MemoryInfo, SysInfoError>,
    pub storage: Result<StorageInfo, SysInfoError>,
}

/// Formats bytes to gigabytes
fn bytes_to_gb(bytes: u64) -> f64 {
    bytes as f64 / GB_IN_BYTES
}

/// Formats bytes to the most appropriate unit (GB or TB)
fn format_storage_size(bytes: u64) -> (f64, &'static str) {
    let gb = bytes_to_gb(bytes);
    if gb >= 1024.0 {
        (gb / 1024.0, "TB")
    } else {
        (gb, "GB")
    }
}

/// Formats uptime from seconds to a human-readable string
fn format_uptime(seconds: u64) -> String {
    let days = seconds / 86400;
    let hours = (seconds % 86400) / 3600;
    let minutes = (seconds % 3600) / 60;
    
    if days > 0 {
        format!("{}d {}h {}m", days, hours, minutes)
    } else if hours > 0 {
        format!("{}h {}m", hours, minutes)
    } else {
        format!("{}m", minutes)
    }
}

/// Creates a user-friendly display name for storage devices
fn create_display_name(raw_name: &str, mount_point: &str) -> String {
    if !mount_point.is_empty() {
        // Use mount point if available (e.g., "C:\" -> "C:")
        if mount_point.ends_with('\\') || mount_point.ends_with('/') {
            let drive_letter = mount_point.chars().next().unwrap_or('?');
            format!("{}:", drive_letter)
        } else {
            mount_point.to_string()
        }
    } else if raw_name.contains(':') {
        // If raw name contains drive letter, format it nicely
        raw_name.to_string()
    } else {
        // Fallback to raw name
        raw_name.to_string()
    }
}

/// Gets the system hostname
fn get_hostname() -> Result<String, SysInfoError> {
    // Try multiple methods to get hostname
    if let Ok(hostname) = env::var("COMPUTERNAME") {
        // Windows
        return Ok(hostname);
    }
    
    if let Ok(hostname) = env::var("HOSTNAME") {
        // Linux/macOS
        return Ok(hostname);
    }
    
    // Fallback: try to get from system
    #[cfg(target_os = "windows")]
    {
        // Windows-specific hostname detection
        if let Ok(output) = std::process::Command::new("hostname").output() {
            if let Ok(hostname) = String::from_utf8(output.stdout) {
                return Ok(hostname.trim().to_string());
            }
        }
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        // Unix-like systems
        if let Ok(output) = std::process::Command::new("hostname").output() {
            if let Ok(hostname) = String::from_utf8(output.stdout) {
                return Ok(hostname.trim().to_string());
            }
        }
    }
    
    // Final fallback
    Err(SysInfoError::System("Could not determine hostname".to_string()))
}

/// Collect operating system information
fn get_os_info() -> Result<OperatingSystemInfo, SysInfoError> {
    let name = System::name()
        .ok_or_else(|| SysInfoError::System("Could not determine OS name".to_string()))?;
    let version = System::os_version()
        .ok_or_else(|| SysInfoError::System("Could not determine OS version".to_string()))?;
    let kernel_version = System::kernel_version()
        .ok_or_else(|| SysInfoError::System("Could not determine kernel version".to_string()))?;
    let uptime = System::uptime();
    let hostname = get_hostname()?;
    
    println!("[DEBUG] OS Name: {}", name);
    println!("[DEBUG] OS Version: {}", version);
    println!("[DEBUG] Kernel Version: {}", kernel_version);
    println!("[DEBUG] Hostname: {}", hostname);
    println!("[DEBUG] Uptime: {}", format_uptime(uptime));
    
    Ok(OperatingSystemInfo {
        name,
        version,
        kernel_version,
        hostname,
        uptime,
    })
}

/// Collect CPU information
fn get_cpu_info(sys: &System) -> Result<CpuInfo, SysInfoError> {
    let cpus = sys.cpus();
    if cpus.is_empty() {
        println!("[DEBUG] No CPUs found");
        return Err(SysInfoError::System("No CPUs found".to_string()));
    }
    
    let cpu = &cpus[0];
    let brand = cpu.brand().to_string();
    let frequency = cpu.frequency();
    let physical_cores = System::physical_core_count().unwrap_or(0);
    let logical_cores = cpus.len();
    
    println!("[DEBUG] CPU Brand: {}", brand);
    println!("[DEBUG] CPU Frequency: {} MHz", frequency);
    println!("[DEBUG] Physical Cores: {}", physical_cores);
    println!("[DEBUG] Logical Cores: {}", logical_cores);
    
    Ok(CpuInfo {
        brand,
        frequency,
        physical_cores,
        logical_cores,
    })
}

/// Collect memory information
fn get_memory_info(sys: &System) -> Result<MemoryInfo, SysInfoError> {
    let total_gb = bytes_to_gb(sys.total_memory());
    let used_gb = bytes_to_gb(sys.used_memory());
    let free_gb = bytes_to_gb(sys.free_memory());
    println!("[DEBUG] Memory Total: {:.2} GB", total_gb);
    println!("[DEBUG] Memory Used: {:.2} GB", used_gb);
    println!("[DEBUG] Memory Free: {:.2} GB", free_gb);
    Ok(MemoryInfo {
        total_gb,
        used_gb,
        free_gb,
    })
}

/// Collect storage information
fn get_storage_info() -> Result<StorageInfo, SysInfoError> {
    let disks = Disks::new_with_refreshed_list();
    println!("[DEBUG] Disks found: {}", disks.list().len());
    let devices = disks
        .list()
        .iter()
        .map(|disk| {
            let (total, unit) = format_storage_size(disk.total_space());
            let (available, _) = format_storage_size(disk.available_space());
            let used = total - available;
            
            // Get the raw disk name and mount point
            let raw_name = disk.name().to_string_lossy().to_string();
            let mount_point = disk.mount_point().to_string_lossy().to_string();
            
            // Clone for debug printing
            let raw_name_debug = raw_name.clone();
            let mount_point_debug = mount_point.clone();
            
            // Create a better display name
            let display_name = create_display_name(&raw_name, &mount_point);
            
            println!(
                "[DEBUG] Disk: Raw='{}' | Mount='{}' | Display='{}' | Total: {:.2} {} | Used: {:.2} {} | Available: {:.2} {}",
                raw_name_debug, mount_point_debug, display_name, total, unit, used, unit, available, unit
            );
            
            StorageDevice {
                name: display_name,
                total_size: total,
                used_size: used,
                available_size: available,
                unit: unit.to_string(),
            }
        })
        .collect();
    Ok(StorageInfo { devices })
}

/// Collect GPU information using NVIDIA Management Library
fn get_gpu_info() -> Result<Vec<GpuInfo>, SysInfoError> {
    let nvml = Nvml::init().map_err(|e| SysInfoError::Nvml(e.to_string()))?;
    let count = nvml
        .device_count()
        .map_err(|e| SysInfoError::Nvml(e.to_string()))?;
    println!("[DEBUG] NVML GPU count: {}", count);
    let mut gpus = Vec::new();
    for i in 0..count {
        let device = nvml
            .device_by_index(i)
            .map_err(|e| SysInfoError::Nvml(e.to_string()))?;
        let name = device.name()
            .map_err(|e| SysInfoError::Nvml(format!("Could not get GPU {} name: {}", i, e)))?;
        let memory = device.memory_info().ok();
        let utilization = device.utilization_rates().ok().map(|u| u.gpu);
        let temperature = device
            .temperature(nvml_wrapper::enum_wrappers::device::TemperatureSensor::Gpu)
            .ok();
        println!(
            "[DEBUG] GPU {}: {} | Mem: {:?} | Util: {:?} | Temp: {:?}",
            i, name, memory, utilization, temperature
        );
        gpus.push(GpuInfo {
            name,
            memory_total_gb: memory.as_ref().map(|m| bytes_to_gb(m.total)),
            memory_used_gb: memory.as_ref().map(|m| bytes_to_gb(m.used)),
            utilization_percent: utilization,
            temperature_celsius: temperature,
        });
    }
    Ok(gpus)
}

/// Tauri command to get complete system information
#[tauri::command]
pub async fn get_system_info() -> SystemInfo {
    let mut sys = System::new_all();
    sys.refresh_all();
    SystemInfo {
        os: get_os_info(),
        cpu: get_cpu_info(&sys),
        gpu: get_gpu_info(),
        memory: get_memory_info(&sys),
        storage: get_storage_info(),
    }
}
