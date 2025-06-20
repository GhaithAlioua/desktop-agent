// This file centralizes all type definitions and helper functions for the System Overview page
// to ensure consistency and improve maintainability.

// --- Type Definitions ---
export type RustResult<T, E> = { Ok: T } | { Err: E };

export type SysInfoError =
  | { SystemData: string }
  | { NoCpuFound: null }
  | { Registry: string }
  | { StorageError: string };

export interface GeneralInfo {
  os_name: string;
  kernel_version: string;
  architecture: string;
  hostname: string;
  uptime: string;
}

export interface WindowsSpecificInfo {
  edition: string;
  full_build_number: string;
  display_version: string;
  install_date_timestamp: number;
  registered_owner: string;
  registered_organization: string;
  machine_guid: string;
}

export interface OperatingSystemInfo {
  general: GeneralInfo;
  windows_specific?: WindowsSpecificInfo;
}

export interface CpuInfo {
  brand: string;
  frequency: number;
  physical_core_count: number;
  logical_core_count: number;
  vendor_id: string;
}

export interface GpuInfo {
  name: string;
  brand: string;
  driver: string;
  driver_info: string;
  backend: string;
  vendor_id: number;
  device_id: number;
  device_type: string;
}

export interface MemoryInfo {
  total_memory_gb: number;
  used_memory_gb: number;
  free_memory_gb: number;
  available_memory_gb: number;
  used_memory_percentage: number;
}

export interface StorageDeviceInfo {
  name: string;
  mount_point: string;
  file_system: string;
  total_space_gb: number;
  used_space_gb: number;
  available_space_gb: number;
  used_percentage: number;
}

export interface StorageInfo {
  total_storage_gb: number;
  used_storage_gb: number;
  available_storage_gb: number;
  used_storage_percentage: number;
  devices: StorageDeviceInfo[];
}

export interface SystemInfo {
  os: RustResult<OperatingSystemInfo, SysInfoError>;
  cpu: RustResult<CpuInfo, SysInfoError>;
  gpu: RustResult<GpuInfo[], SysInfoError>;
  memory: RustResult<MemoryInfo, SysInfoError>;
  storage: RustResult<StorageInfo, SysInfoError>;
}

// --- Helper Functions ---

/**
 * A centralized set of all fields considered critical for display.
 * If these are missing, a 'warning' severity will be used.
 */
const CRITICAL_FIELDS = new Set([
    "os_name", "kernel_version", "architecture", "hostname", "uptime",
    "display_version", "install_date_timestamp", "registered_owner",
    "registered_organization", "machine_guid", "edition",
    "brand", "vendor_id", "frequency", "physical_core_count", "logical_core_count",
    "gpu_name", "gpu_driver", "gpu_driver_info", "gpu_backend", "gpu_device_type", "gpu_vendor_id", "gpu_device_id"
]);

/**
 * Determines the display value and severity for a given piece of data.
 * - Returns the value with 'info' severity if present.
 * - Returns 'Unavailable' with 'warning' severity if the field is critical but missing.
 * - Returns 'Unavailable' with 'info' severity for non-critical missing fields.
 */
export const displayValueWithSeverity = (value: any, fieldName: string): { value: string, severity: 'info' | 'warning' } => {
  if (value !== null && value !== undefined && value !== "") {
    return { value: String(value), severity: "info" as const };
  }
  if (CRITICAL_FIELDS.has(fieldName)) {
    return { value: "Unavailable", severity: "warning" as const };
  }
  return { value: "Unavailable", severity: "info" as const };
};

/**
 * Formats a raw frequency value in MHz to a readable string in GHz.
 */
export const formatFrequency = (frequency: number): string => {
  return `${(frequency / 1000).toFixed(2)} GHz`;
};

/**
 * Formats a SysInfoError object into a user-friendly string.
 */
export const formatError = (error: SysInfoError): string => {
  if ("SystemData" in error) return error.SystemData;
  if ("NoCpuFound" in error) return "No CPU information found";
  if ("Registry" in error) return error.Registry;
  if ("StorageError" in error) return error.StorageError;
  return "An unexpected error occurred.";
}; 