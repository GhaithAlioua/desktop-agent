import React from "react";
import {
  StorageInfo,
  StorageDevice,
  SysInfoError,
  isError,
  getErrorMessage,
} from "../systemInfoTypes";

interface StorageSectionProps {
  storageInfo: StorageInfo | SysInfoError;
}

const StorageSection: React.FC<StorageSectionProps> = ({ storageInfo }) => {
  if (!storageInfo || typeof storageInfo !== "object") {
    return (
      <div className="bg-accent-bg rounded-xl shadow p-6 border border-error text-error">
        Invalid Storage info
      </div>
    );
  }
  if (isError(storageInfo)) {
    return (
      <div className="bg-accent-bg rounded-xl shadow p-6 border border-error text-error">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center mr-3">
            <span className="text-error text-lg">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-primary-text">Storage</h2>
        </div>
        <div className="text-error text-sm">
          Error: {getErrorMessage(storageInfo)}
        </div>
      </div>
    );
  }

  if (
    !("devices" in storageInfo) ||
    !Array.isArray(storageInfo.devices) ||
    storageInfo.devices.length === 0
  ) {
    return (
      <div className="bg-accent-bg rounded-xl shadow p-6 border border-border">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-indigo-900/30 rounded-lg flex items-center justify-center mr-3">
            <span className="text-indigo-400 text-lg">💾</span>
          </div>
          <h2 className="text-xl font-semibold text-primary-text">Storage</h2>
        </div>
        <div className="text-secondary-text text-sm">
          No storage devices detected
        </div>
      </div>
    );
  }

  const getUsageColor = (percentage: number | null) => {
    if (percentage === null) return "bg-gray-500";
    if (percentage > 90) return "bg-red-500";
    if (percentage > 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const formatStorageName = (name: string) => {
    // Clean up device names for better display
    return name
      .replace(/\\/g, "")
      .replace(/\./g, "")
      .replace(/^[A-Z]:/, "Drive");
  };

  return (
    <div className="bg-accent-bg rounded-xl shadow p-6 border border-border">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-indigo-900/30 rounded-lg flex items-center justify-center mr-3">
          <span className="text-indigo-400 text-lg">💾</span>
        </div>
        <h2 className="text-xl font-semibold text-primary-text">Storage</h2>
      </div>
      <div className="border-t border-border mb-4" />

      <div className="space-y-4">
        {storageInfo.devices.map((device, index) => {
          const totalGB =
            typeof device.total_gb === "number" && device.total_gb > 0
              ? device.total_gb.toFixed(1)
              : "N/A";
          const usedGB =
            typeof device.used_gb === "number" && device.used_gb > 0
              ? device.used_gb.toFixed(1)
              : "N/A";
          const availableGB =
            typeof device.available_gb === "number" && device.available_gb > 0
              ? device.available_gb.toFixed(1)
              : "N/A";
          const usedPercentage =
            typeof device.used_gb === "number" &&
            typeof device.total_gb === "number" &&
            device.total_gb > 0
              ? (device.used_gb / device.total_gb) * 100
              : null;
          return (
            <div
              key={index}
              className="border border-border rounded-lg p-4 bg-secondary-bg"
            >
              <h3 className="font-medium text-primary-text mb-3">
                {formatStorageName(device.name) || "Unknown Device"}
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-secondary-text">Total:</span>
                  <span className="font-medium text-primary-text">
                    {totalGB} GB
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-secondary-text">Used:</span>
                  <span className="font-medium text-primary-text">
                    {usedGB} GB
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-secondary-text">Available:</span>
                  <span className="font-medium text-primary-text">
                    {availableGB} GB
                  </span>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-secondary-text">Usage:</span>
                    <span className="font-medium text-primary-text">
                      {usedPercentage !== null
                        ? usedPercentage.toFixed(1) + "%"
                        : "N/A"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(
                        usedPercentage
                      )} transition-all duration-300`}
                      style={{
                        width:
                          usedPercentage !== null
                            ? `${Math.min(usedPercentage, 100)}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StorageSection;
