import React from "react";
import {
  MemoryInfo,
  SysInfoError,
  isError,
  getErrorMessage,
} from "../systemInfoTypes";

interface MemorySectionProps {
  memoryInfo: MemoryInfo | SysInfoError;
}

const MemorySection: React.FC<MemorySectionProps> = ({ memoryInfo }) => {
  if (!memoryInfo || typeof memoryInfo !== "object") {
    return (
      <div className="bg-accent-bg rounded-xl shadow p-6 border border-error text-error">
        Invalid Memory info
      </div>
    );
  }
  if (isError(memoryInfo)) {
    return (
      <div className="bg-accent-bg rounded-xl shadow p-6 border border-error text-error">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center mr-3">
            <span className="text-error text-lg">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-primary-text">Memory</h2>
        </div>
        <div className="text-error text-sm">
          Error: {getErrorMessage(memoryInfo)}
        </div>
      </div>
    );
  }

  const totalGB =
    typeof memoryInfo.total_mb === "number" && memoryInfo.total_mb > 0
      ? (memoryInfo.total_mb / 1024).toFixed(1)
      : "N/A";
  const usedGB =
    typeof memoryInfo.used_mb === "number" && memoryInfo.used_mb > 0
      ? (memoryInfo.used_mb / 1024).toFixed(1)
      : "N/A";
  const freeGB =
    typeof memoryInfo.free_mb === "number" && memoryInfo.free_mb > 0
      ? (memoryInfo.free_mb / 1024).toFixed(1)
      : "N/A";
  const usedPercentage =
    typeof memoryInfo.used_mb === "number" &&
    typeof memoryInfo.total_mb === "number" &&
    memoryInfo.total_mb > 0
      ? (memoryInfo.used_mb / memoryInfo.total_mb) * 100
      : null;
  const getUsageColor = (percentage: number | null) => {
    if (percentage === null) return "bg-gray-500";
    if (percentage > 90) return "bg-red-500";
    if (percentage > 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-accent-bg rounded-xl shadow p-6 border border-border">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-yellow-900/30 rounded-lg flex items-center justify-center mr-3">
          <span className="text-yellow-400 text-lg">🧠</span>
        </div>
        <h2 className="text-xl font-semibold text-primary-text">Memory</h2>
      </div>
      <div className="border-t border-border mb-4" />

      <div className="space-y-4">
        <div className="border border-border rounded-lg p-4 bg-secondary-bg">
          <h3 className="font-medium text-primary-text mb-3">
            Memory Information
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Total:</span>
              <span className="font-medium text-primary-text">
                {totalGB} GB
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Used:</span>
              <span className="font-medium text-primary-text">{usedGB} GB</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Free:</span>
              <span className="font-medium text-primary-text">{freeGB} GB</span>
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
      </div>
    </div>
  );
};

export default MemorySection;
