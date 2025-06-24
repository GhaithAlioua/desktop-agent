use nvml_wrapper::Nvml;
use serde::Serialize;
use sysinfo::{Disks, System};
use thiserror::Error;

/// Constants for memory calculations
const MB_IN_BYTES: u64 = 1024 * 1024;
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
    pub memory_total_mb: Option<u64>,
    pub memory_used_mb: Option<u64>,
    pub utilization_percent: Option<u32>,
    pub temperature_celsius: Option<u32>,
}

/// Memory information
#[derive(Serialize, Clone)]
pub struct MemoryInfo {
    pub total_mb: u64,
    pub used_mb: u64,
    pub free_mb: u64,
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
    pub total_gb: f64,
    pub used_gb: f64,
    pub available_gb: f64,
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

/// Collect operating system information
fn get_os_info() -> Result<OperatingSystemInfo, SysInfoError> {
    let name = System::name().unwrap_or_else(|| "Unknown".to_string());
    let version = System::os_version().unwrap_or_else(|| "Unknown".to_string());
    let kernel_version = System::kernel_version().unwrap_or_else(|| "Unknown".to_string());
    let uptime = System::uptime();
    println!("[DEBUG] OS Name: {}", name);
    println!("[DEBUG] OS Version: {}", version);
    println!("[DEBUG] Kernel Version: {}", kernel_version);
    println!("[DEBUG] Uptime: {}", uptime);
    Ok(OperatingSystemInfo {
        name,
        version,
        kernel_version,
        hostname: "Unknown".to_string(), // Not available in sysinfo 0.35.2
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
    println!("[DEBUG] CPU Frequency: {}", frequency);
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
    let total_mb = sys.total_memory() / 1024;
    let used_mb = sys.used_memory() / 1024;
    let free_mb = sys.free_memory() / 1024;
    println!("[DEBUG] Memory Total: {} MB", total_mb);
    println!("[DEBUG] Memory Used: {} MB", used_mb);
    println!("[DEBUG] Memory Free: {} MB", free_mb);
    Ok(MemoryInfo {
        total_mb,
        used_mb,
        free_mb,
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
            let total = disk.total_space() as f64 / GB_IN_BYTES;
            let available = disk.available_space() as f64 / GB_IN_BYTES;
            let used = total - available;
            println!(
                "[DEBUG] Disk: {} | Total: {:.2} GB | Used: {:.2} GB | Available: {:.2} GB",
                disk.name().to_string_lossy(),
                total,
                used,
                available
            );
            StorageDevice {
                name: disk.name().to_string_lossy().to_string(),
                total_gb: total,
                used_gb: used,
                available_gb: available,
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
        let name = device.name().unwrap_or_else(|_| "Unknown GPU".to_string());
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
            memory_total_mb: memory.as_ref().map(|m| m.total / MB_IN_BYTES),
            memory_used_mb: memory.as_ref().map(|m| m.used / MB_IN_BYTES),
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
