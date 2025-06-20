use serde::Serialize;
use sysinfo::{CpuRefreshKind, Disks, RefreshKind, System};
use thiserror::Error;
use wgpu;

// --- Custom Error Type for Structured Error Handling ---
#[derive(Debug, Error, Serialize, Clone)]
pub enum SysInfoError {
    #[error("Failed to retrieve system information: {0}")]
    SystemData(String),
    #[error("No CPU information was found on the system.")]
    NoCpuFound,
    #[error("Registry Error: {0}")]
    Registry(String),
    #[error("Storage information unavailable: {0}")]
    StorageError(String),
    #[error("GPU information unavailable: {0}")]
    GpuError(String),
}

// --- Constants for Performance and Maintainability ---
const BYTES_TO_GB: f64 = 1.0 / 1024.0 / 1024.0 / 1024.0;
const SECONDS_PER_MINUTE: u64 = 60;
const SECONDS_PER_HOUR: u64 = 60 * SECONDS_PER_MINUTE;
const SECONDS_PER_DAY: u64 = 24 * SECONDS_PER_HOUR;

// --- Helper Functions ---
fn format_uptime(seconds: u64) -> String {
    let days = seconds / SECONDS_PER_DAY;
    let hours = (seconds % SECONDS_PER_DAY) / SECONDS_PER_HOUR;
    let minutes = (seconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE;
    format!("{} days, {} hours, {} min", days, hours, minutes)
}

#[cfg(target_os = "windows")]
fn get_windows_specific_info() -> Result<WindowsSpecificInfo, SysInfoError> {
    use winreg::enums::*;
    use winreg::RegKey;

    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let current_version_path = "SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion";
    let crypto_path = "SOFTWARE\\Microsoft\\Cryptography";

    let current_version = hklm.open_subkey(current_version_path).map_err(|e| {
        SysInfoError::Registry(format!(
            "Failed to open key '{}': {}",
            current_version_path, e
        ))
    })?;

    let crypto = hklm.open_subkey(crypto_path).map_err(|e| {
        SysInfoError::Registry(format!("Failed to open key '{}': {}", crypto_path, e))
    })?;

    let current_build: String = current_version
        .get_value("CurrentBuild")
        .unwrap_or_default();
    let ubr: u32 = current_version.get_value("UBR").unwrap_or(0);

    Ok(WindowsSpecificInfo {
        edition: current_version.get_value("ProductName").unwrap_or_default(),
        full_build_number: format!("{}.{}", current_build, ubr),
        display_version: current_version
            .get_value("DisplayVersion")
            .unwrap_or_default(),
        install_date_timestamp: current_version.get_value("InstallDate").unwrap_or(0),
        registered_owner: current_version
            .get_value("RegisteredOwner")
            .unwrap_or_default(),
        registered_organization: current_version
            .get_value("RegisteredOrganization")
            .unwrap_or_default(),
        machine_guid: crypto.get_value("MachineGuid").unwrap_or_default(),
    })
}

// --- Public Data Structures (DTOs) ---
#[derive(Serialize, Clone)]
pub struct GeneralInfo {
    os_name: String,
    kernel_version: String,
    architecture: String,
    hostname: String,
    uptime: String,
}

#[derive(Serialize, Clone)]
pub struct WindowsSpecificInfo {
    edition: String,
    full_build_number: String,
    display_version: String,
    install_date_timestamp: u64,
    registered_owner: String,
    registered_organization: String,
    machine_guid: String,
}

#[derive(Serialize, Clone)]
pub struct OperatingSystemInfo {
    general: GeneralInfo,
    #[serde(skip_serializing_if = "Option::is_none")]
    windows_specific: Option<WindowsSpecificInfo>,
}

/// Contains detailed information about a CPU.
#[derive(Serialize, Clone)]
pub struct CpuInfo {
    brand: String,
    frequency: u64,
    physical_core_count: u32,
    logical_core_count: u32,
    vendor_id: String,
}

/// Contains comprehensive information about a GPU adapter.
///
/// This struct provides detailed GPU information collected using the wgpu crate,
/// including hardware specifications, driver details, and performance characteristics.
/// All fields are validated during collection to ensure data integrity.
#[derive(Serialize, Clone)]
pub struct GpuInfo {
    /// The human-readable name of the GPU (e.g., "NVIDIA GeForce RTX 3060")
    name: String,
    /// The driver brand/name (e.g., "NVIDIA", "AMD", "Intel")
    brand: String,
    /// The specific driver name and version information
    driver: String,
    /// Detailed driver information including version and capabilities
    driver_info: String,
    /// The graphics API backend being used (e.g., "DirectX 12", "Vulkan")
    backend: String,
    /// The PCI vendor ID (unique identifier for the GPU manufacturer)
    vendor_id: u32,
    /// The PCI device ID (unique identifier for the specific GPU model)
    device_id: u32,
    /// The type of GPU device (e.g., "Discrete GPU", "Integrated GPU")
    device_type: String,
}

/// Contains detailed information about system memory.
#[derive(Serialize, Clone)]
pub struct MemoryInfo {
    total_memory_gb: f64,
    used_memory_gb: f64,
    free_memory_gb: f64,
    available_memory_gb: f64,
    used_memory_percentage: f32,
}

/// Contains detailed information about a storage device.
#[derive(Serialize, Clone)]
pub struct StorageDeviceInfo {
    name: String,
    mount_point: String,
    file_system: String,
    total_space_gb: f64,
    used_space_gb: f64,
    available_space_gb: f64,
    used_percentage: f32,
}

/// Contains detailed information about system storage.
#[derive(Serialize, Clone)]
pub struct StorageInfo {
    total_storage_gb: f64,
    used_storage_gb: f64,
    available_storage_gb: f64,
    used_storage_percentage: f32,
    devices: Vec<StorageDeviceInfo>,
}

/// A composite structure holding all collected system information.
/// Each field is a Result, allowing for partial success.
#[derive(Serialize, Clone)]
pub struct SystemInfo {
    os: Result<OperatingSystemInfo, SysInfoError>,
    cpu: Result<CpuInfo, SysInfoError>,
    gpu: Result<Vec<GpuInfo>, SysInfoError>,
    memory: Result<MemoryInfo, SysInfoError>,
    storage: Result<StorageInfo, SysInfoError>,
}

// --- Internal Data Collection ---
fn collect_os_info() -> Result<OperatingSystemInfo, SysInfoError> {
    let general_os_name = System::name().unwrap_or_else(|| "Unknown OS".to_string());
    let general_kernel_version;
    let windows_specific_info;

    #[cfg(target_os = "windows")]
    {
        let mut win_specific = get_windows_specific_info()?;
        win_specific.edition =
            System::long_os_version().unwrap_or_else(|| win_specific.edition.clone());
        general_kernel_version = win_specific.full_build_number.clone();
        windows_specific_info = Some(win_specific);
    }
    #[cfg(not(target_os = "windows"))]
    {
        general_kernel_version =
            System::kernel_version().unwrap_or_else(|| "Unknown kernel".to_string());
        windows_specific_info = None;
    }

    Ok(OperatingSystemInfo {
        general: GeneralInfo {
            os_name: general_os_name,
            kernel_version: general_kernel_version,
            architecture: System::cpu_arch(),
            hostname: System::host_name().unwrap_or_else(|| "Unknown hostname".to_string()),
            uptime: format_uptime(System::uptime()),
        },
        windows_specific: windows_specific_info,
    })
}

fn collect_cpu_info() -> Result<CpuInfo, SysInfoError> {
    let sys =
        System::new_with_specifics(RefreshKind::nothing().with_cpu(CpuRefreshKind::everything()));
    let cpus = sys.cpus();
    if cpus.is_empty() {
        return Err(SysInfoError::NoCpuFound);
    }
    let cpu = &cpus[0];
    Ok(CpuInfo {
        brand: cpu.brand().to_string(),
        frequency: cpu.frequency(),
        physical_core_count: System::physical_core_count().unwrap_or(0) as u32,
        logical_core_count: cpus.len() as u32,
        vendor_id: cpu.vendor_id().to_string(),
    })
}

async fn collect_gpu_info() -> Result<Vec<GpuInfo>, SysInfoError> {
    // Create wgpu instance with proper configuration for system information gathering
    let descriptor = wgpu::InstanceDescriptor {
        backends: wgpu::Backends::all(),
        flags: wgpu::InstanceFlags::default(),
        backend_options: wgpu::BackendOptions::default(),
    };
    let instance = wgpu::Instance::new(&descriptor);

    // Enumerate adapters with proper error handling
    let adapters = instance.enumerate_adapters(wgpu::Backends::all());

    if adapters.is_empty() {
        return Ok(Vec::new()); // No GPUs found is not an error
    }

    // Process adapters with validation and error handling
    let mut gpus = Vec::with_capacity(adapters.len());

    for (index, adapter) in adapters.into_iter().enumerate() {
        let info = adapter.get_info();

        // Validate essential GPU information
        if info.name.is_empty() {
            eprintln!("GPU {} has empty name, skipping", index);
            continue;
        }

        // Extract device type dynamically from wgpu
        let device_type = match info.device_type {
            wgpu::DeviceType::DiscreteGpu => "Discrete GPU",
            wgpu::DeviceType::IntegratedGpu => "Integrated GPU",
            wgpu::DeviceType::VirtualGpu => "Virtual GPU",
            wgpu::DeviceType::Cpu => "CPU",
            _ => "Unknown",
        };

        // Extract backend information dynamically from wgpu
        let backend = match info.backend {
            wgpu::Backend::Vulkan => "Vulkan",
            wgpu::Backend::Dx12 => "DirectX 12",
            wgpu::Backend::Metal => "Metal",
            wgpu::Backend::Gl => "OpenGL",
            wgpu::Backend::BrowserWebGpu => "WebGPU",
            _ => "Unknown",
        };

        // Extract vendor information dynamically from wgpu
        // Use the actual driver information provided by the system
        let vendor_name = if !info.driver.is_empty() {
            // Use the driver name as the vendor information (most accurate)
            &info.driver
        } else if !info.driver_info.is_empty() {
            // Fallback to driver info if driver name is empty
            &info.driver_info
        } else {
            // If no driver information is available, use a generic identifier
            "Unknown"
        };

        // Create GPU info with dynamically extracted data from wgpu
        let driver = info.driver.clone();
        gpus.push(GpuInfo {
            name: info.name,
            brand: vendor_name.to_string(),
            driver,
            driver_info: info.driver_info,
            backend: backend.to_string(),
            vendor_id: info.vendor,
            device_id: info.device,
            device_type: device_type.to_string(),
        });
    }

    Ok(gpus)
}

fn collect_memory_info() -> Result<MemoryInfo, SysInfoError> {
    let mut sys = System::new();
    sys.refresh_memory();
    let total = sys.total_memory();
    let used = sys.used_memory();
    let used_percentage = if total > 0 {
        (used as f32 / total as f32) * 100.0
    } else {
        0.0
    };
    Ok(MemoryInfo {
        total_memory_gb: total as f64 * BYTES_TO_GB,
        used_memory_gb: used as f64 * BYTES_TO_GB,
        free_memory_gb: sys.free_memory() as f64 * BYTES_TO_GB,
        available_memory_gb: sys.available_memory() as f64 * BYTES_TO_GB,
        used_memory_percentage: used_percentage,
    })
}

fn collect_storage_info() -> Result<StorageInfo, SysInfoError> {
    let disks = Disks::new_with_refreshed_list();
    let mut devices = Vec::new();
    for disk in disks.list() {
        let total_space = disk.total_space();
        let available_space = disk.available_space();
        let used_space = total_space.saturating_sub(available_space);
        let used_percentage = if total_space > 0 {
            (used_space as f32 / total_space as f32) * 100.0
        } else {
            0.0
        };
        devices.push(StorageDeviceInfo {
            name: disk.name().to_string_lossy().into_owned(),
            mount_point: disk.mount_point().to_string_lossy().into_owned(),
            file_system: disk.file_system().to_string_lossy().into_owned(),
            total_space_gb: total_space as f64 * BYTES_TO_GB,
            used_space_gb: used_space as f64 * BYTES_TO_GB,
            available_space_gb: available_space as f64 * BYTES_TO_GB,
            used_percentage,
        });
    }

    let total_storage_gb: f64 = devices.iter().map(|d| d.total_space_gb).sum();
    let used_storage_gb: f64 = devices.iter().map(|d| d.used_space_gb).sum();
    let used_storage_percentage = if total_storage_gb > 0.0 {
        (used_storage_gb / total_storage_gb * 100.0) as f32
    } else {
        0.0
    };

    Ok(StorageInfo {
        total_storage_gb,
        used_storage_gb,
        available_storage_gb: devices.iter().map(|d| d.available_space_gb).sum(),
        used_storage_percentage,
        devices,
    })
}

// --- Main Public Function ---

#[tauri::command]
pub async fn get_system_info() -> SystemInfo {
    SystemInfo {
        os: collect_os_info(),
        cpu: collect_cpu_info(),
        gpu: collect_gpu_info().await,
        memory: collect_memory_info(),
        storage: collect_storage_info(),
    }
}
