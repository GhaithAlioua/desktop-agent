import React from "react";
import {
  OperatingSystemInfo,
  SysInfoError,
  isError,
  getErrorMessage,
} from "../systemInfoTypes";

interface OperatingSystemSectionProps {
  osInfo: OperatingSystemInfo | SysInfoError;
}

const OperatingSystemSection: React.FC<OperatingSystemSectionProps> = ({
  osInfo,
}) => {
  if (!osInfo || typeof osInfo !== "object") {
    return (
      <div className="bg-accent-bg rounded-xl shadow p-6 border border-error text-error">
        Invalid OS info
      </div>
    );
  }
  if (isError(osInfo)) {
    return (
      <div className="bg-accent-bg rounded-xl shadow p-6 border border-error text-error">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center mr-3">
            <span className="text-error text-lg">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-primary-text">
            Operating System
          </h2>
        </div>
        <div className="text-error text-sm">
          Error: {getErrorMessage(osInfo)}
        </div>
      </div>
    );
  }

  const formatUptime = (seconds: number | undefined): string => {
    if (typeof seconds !== "number" || isNaN(seconds)) return "N/A";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div className="bg-accent-bg rounded-xl shadow p-6 border border-border">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
          <span className="text-blue-400 text-lg">💻</span>
        </div>
        <h2 className="text-xl font-semibold text-primary-text">
          Operating System
        </h2>
      </div>
      <div className="border-t border-border mb-4" />

      <div className="space-y-4">
        <div className="border border-border rounded-lg p-4 bg-secondary-bg">
          <h3 className="font-medium text-primary-text mb-3">
            System Information
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Name:</span>
              <span className="font-medium text-primary-text">
                {osInfo.name || "Unknown"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Version:</span>
              <span className="font-medium text-primary-text">
                {osInfo.version || "Unknown"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Kernel Version:</span>
              <span className="font-medium text-primary-text">
                {osInfo.kernel_version || "Unknown"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Hostname:</span>
              <span className="font-medium text-primary-text">
                {osInfo.hostname || "Unknown"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Uptime:</span>
              <span className="font-medium text-primary-text">
                {formatUptime(osInfo.uptime)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatingSystemSection;
