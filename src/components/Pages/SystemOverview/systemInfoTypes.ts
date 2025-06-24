// This file centralizes all type definitions and helper functions for the System Overview page
// to ensure consistency and improve maintainability for the redsys marketplace MVP.

// TypeScript types matching the Rust backend SystemInfo structure
export interface OperatingSystemInfo {
  name: string;
  version: string;
  kernel_version: string;
  hostname: string;
  uptime: number;
}

export interface CpuInfo {
  brand: string;
  frequency: number;
  physical_cores: number;
  logical_cores: number;
}

export interface GpuInfo {
  name: string;
  memory_total_mb?: number;
  memory_used_mb?: number;
  utilization_percent?: number;
  temperature_celsius?: number;
}

export interface MemoryInfo {
  total_mb: number;
  used_mb: number;
  free_mb: number;
}

export interface StorageDevice {
  name: string;
  total_gb: number;
  used_gb: number;
  available_gb: number;
}

export interface StorageInfo {
  devices: StorageDevice[];
}

// Rust error types that match the backend
export type SysInfoError = 
  | { System: string }
  | { Nvml: string };

export interface SystemInfo {
  os: OperatingSystemInfo | SysInfoError;
  cpu: CpuInfo | SysInfoError;
  gpu: GpuInfo[] | SysInfoError;
  memory: MemoryInfo | SysInfoError;
  storage: StorageInfo | SysInfoError;
}

// Helper type guards
export function isError<T>(result: T | SysInfoError): result is SysInfoError {
  return typeof result === 'object' && result !== null && 
    ('System' in result || 'Nvml' in result);
}

export function isSuccess<T>(result: T | SysInfoError): result is T {
  return !isError(result);
}

// Helper function to get error message
export function getErrorMessage(error: SysInfoError): string {
  if ('System' in error) return error.System;
  if ('Nvml' in error) return error.Nvml;
  return 'Unknown error';
}

// Helper to unwrap Rust-style Result objects
export function unwrapResult<T>(result: any): T | SysInfoError {
  if (result && typeof result === "object") {
    if ("Ok" in result) return result.Ok;
    if ("Err" in result) return result.Err;
  }
  return result;
} 