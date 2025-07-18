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
  memory_total_gb?: number;
  memory_used_gb?: number;
  utilization_percent?: number;
  temperature_celsius?: number;
}

export interface MemoryInfo {
  total_gb: number;
  used_gb: number;
  free_gb: number;
}

export interface StorageDevice {
  name: string;
  total_size: number;
  used_size: number;
  available_size: number;
  unit: string; // "GB" or "TB"
}

export interface StorageInfo {
  devices: StorageDevice[];
}

export interface PerformanceInfo {
  overall_score?: number;
  cpu_benchmark_score?: number;
  gpu_benchmark_score?: number;
  memory_benchmark_score?: number;
  storage_benchmark_score?: number;
}

// Rust error types that match the backend
export type SysInfoError = 
  | { System: string }
  | { Nvml: string };

// Rust Result type
export type RustResult<T, E> = 
  | { Ok: T }
  | { Err: E };

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

// Helper function to format errors from Rust Result
export function formatError(error: SysInfoError): string {
  return getErrorMessage(error);
}

// Helper to unwrap Rust-style Result objects
export function unwrapResult<T>(result: any): T | SysInfoError {
  if (result && typeof result === "object") {
    if ("Ok" in result) return result.Ok;
    if ("Err" in result) return result.Err;
  }
  return result;
} 