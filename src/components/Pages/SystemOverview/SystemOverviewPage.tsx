import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { SystemInfo, unwrapResult } from "./systemInfoTypes";

// Import the new section components
import OperatingSystemSection from "./Sections/OperatingSystemSection";
import CpuSection from "./Sections/CpuSection";
import GpuSection from "./Sections/GpuSection";
import MemorySection from "./Sections/MemorySection";
import StorageSection from "./Sections/StorageSection";

// --- Main Component ---
const SystemOverviewPage: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        setIsLoading(true);
        const info = await invoke<SystemInfo>("get_system_info");
        setSystemInfo(info);
      } catch (err) {
        setFetchError(
          "Failed to retrieve system information from the backend."
        );
        console.error("Tauri invoke error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-secondary-text text-xl">
          Loading system information...
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 text-xl p-6 bg-red-50 border border-red-200 rounded-lg">
          Error: {fetchError}
        </div>
      </div>
    );
  }

  if (!systemInfo) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-secondary-text text-xl">
          No system information available.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full h-full overflow-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-main-text mb-8">
          System Overview
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <OperatingSystemSection osInfo={unwrapResult(systemInfo.os)} />
          <CpuSection cpuInfo={unwrapResult(systemInfo.cpu)} />
          <GpuSection gpuInfo={unwrapResult(systemInfo.gpu)} />
          <MemorySection memoryInfo={unwrapResult(systemInfo.memory)} />
          <StorageSection storageInfo={unwrapResult(systemInfo.storage)} />
        </div>
      </div>
    </div>
  );
};

export default SystemOverviewPage;
