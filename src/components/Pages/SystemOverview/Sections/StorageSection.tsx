import React from "react";
import {
  StorageInfo,
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
    return "bg-progress-blue";
  };

  const formatStorageName = (name: string): string => {
    if (!name || name.trim() === "") {
      return "Storage device unavailable";
    }
    return name;
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
          const totalSize = device.total_size.toFixed(1);
          const usedSize = device.used_size.toFixed(1);
          const availableSize = device.available_size.toFixed(1);
          const usagePercentage =
            typeof device.used_size === "number" &&
            typeof device.total_size === "number" &&
            device.total_size > 0
              ? (device.used_size / device.total_size) * 100
              : null;
          return (
            <div
              key={index}
              className="border border-border rounded-lg p-4 bg-secondary-bg"
            >
              <h3 className="font-medium text-primary-text mb-3">
                {formatStorageName(device.name)}
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-secondary-text">Total:</span>
                  <span className="font-medium text-primary-text">
                    {totalSize} {device.unit}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-secondary-text">Used:</span>
                  <span className="font-medium text-primary-text">
                    {usedSize} {device.unit}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-secondary-text">Available:</span>
                  <span className="font-medium text-primary-text">
                    {availableSize} {device.unit}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm text-secondary-text">
                  <span>Usage</span>
                  <span>
                    {usagePercentage !== null && usagePercentage > 0
                      ? `${usagePercentage.toFixed(1)}%`
                      : "Usage percentage unavailable"}
                  </span>
                </div>

                <div className="pt-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getUsageColor(
                        usagePercentage
                      )} transition-all duration-300`}
                      style={{
                        width:
                          usagePercentage !== null
                            ? `${Math.min(usagePercentage, 100)}%`
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
