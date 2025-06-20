import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import InfoCard from "./UI/InfoCard";
import InfoRow from "./UI/InfoRow";

interface OsInfo {
  os_name: string;
  os_build: string;
  os_arch: string;
  hostname: string;
}

interface CpuInfo {
  brand: string;
  frequency: number;
  physical_core_count: number;
  logical_core_count: number;
}

interface SystemInfo {
  os: OsInfo;
  cpu: CpuInfo;
}

const SystemOverviewPage: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const info = await invoke<SystemInfo>("get_system_info");
        setSystemInfo(info);
      } catch (err) {
        setError(err as string);
        console.error("Error fetching system info:", err);
      }
    };

    fetchSystemInfo();
  }, []);

  if (error) {
    return <div className="text-red-500 text-xl p-6">Error: {error}</div>;
  }

  if (!systemInfo) {
    return <div className="text-secondary-text text-xl p-6">Loading...</div>;
  }

  return (
    <div className="p-6 w-full h-full flex items-start justify-center gap-6">
      <InfoCard title="Operating System">
        <InfoRow label="OS Name:" value={systemInfo.os.os_name} />
        <InfoRow label="OS Build:" value={systemInfo.os.os_build} />
        <InfoRow label="Architecture:" value={systemInfo.os.os_arch} />
        <InfoRow label="Hostname:" value={systemInfo.os.hostname} />
      </InfoCard>
      <InfoCard title="Processor">
        <InfoRow label="Brand:" value={systemInfo.cpu.brand} />
        <InfoRow
          label="Speed:"
          value={`${(systemInfo.cpu.frequency / 1000).toFixed(2)} GHz`}
        />
        <InfoRow
          label="Cores:"
          value={`${systemInfo.cpu.physical_core_count} (${systemInfo.cpu.logical_core_count} Threads)`}
        />
      </InfoCard>
    </div>
  );
};

export default SystemOverviewPage;
