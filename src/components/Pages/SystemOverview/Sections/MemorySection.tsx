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

  const usedPercentage =
    typeof memoryInfo.used_gb === "number" &&
    typeof memoryInfo.total_gb === "number" &&
    memoryInfo.total_gb > 0
      ? (memoryInfo.used_gb / memoryInfo.total_gb) * 100
      : null;
  const getUsageColor = (percentage: number | null) => {
    if (percentage === null) return "bg-gray-500";
    return "bg-progress-blue";
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
          <h3 className="font-medium text-primary-text mb-3">RAM</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Total:</span>
              <span className="font-medium text-primary-text">
                {memoryInfo.total_gb > 0
                  ? `${memoryInfo.total_gb.toFixed(1)} GB`
                  : "Total memory unavailable"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Used:</span>
              <span className="font-medium text-primary-text">
                {memoryInfo.used_gb >= 0
                  ? `${memoryInfo.used_gb.toFixed(1)} GB`
                  : "Used memory unavailable"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Free:</span>
              <span className="font-medium text-primary-text">
                {memoryInfo.free_gb >= 0
                  ? `${memoryInfo.free_gb.toFixed(1)} GB`
                  : "Free memory unavailable"}
              </span>
            </div>

            <div className="pt-2">
              <div className="flex justify-between items-center text-sm text-secondary-text">
                <span>Usage</span>
                <span>
                  {usedPercentage !== null && usedPercentage > 0
                    ? `${usedPercentage.toFixed(1)}%`
                    : "Usage percentage unavailable"}
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
