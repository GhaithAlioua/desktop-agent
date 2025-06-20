import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import InfoCard from "./UI/InfoCard";
import InfoRow from "./UI/InfoRow";

interface SystemInfo {
  os_name: string;
  os_version: string;
  os_arch: string;
  hostname: string;
  uptime: string;
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
        setError("Failed to fetch system information.");
        console.error(err);
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
    <div className="p-6 w-full h-full flex items-start justify-center">
      <InfoCard title="Operating System">
        <InfoRow label="Name:" value={systemInfo.os_name} />
        <InfoRow label="Version:" value={systemInfo.os_version} />
        <InfoRow label="Architecture:" value={systemInfo.os_arch} />
        <InfoRow label="Hostname:" value={systemInfo.hostname} />
        <InfoRow label="Uptime:" value={systemInfo.uptime} />
      </InfoCard>
    </div>
  );
};

export default SystemOverviewPage;
