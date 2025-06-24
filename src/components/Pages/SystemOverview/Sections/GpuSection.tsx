import React from "react";
import {
  GpuInfo,
  SysInfoError,
  isError,
  getErrorMessage,
} from "../systemInfoTypes";

interface GpuSectionProps {
  gpuInfo: GpuInfo[] | SysInfoError;
}

const GpuSection: React.FC<GpuSectionProps> = ({ gpuInfo }) => {
  if (!gpuInfo || typeof gpuInfo !== "object") {
    return (
      <div className="bg-accent-bg rounded-xl shadow p-6 border border-error text-error">
        Invalid GPU info
      </div>
    );
  }
  if (isError(gpuInfo)) {
    return (
      <div className="bg-accent-bg rounded-xl shadow p-6 border border-error text-error">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center mr-3">
            <span className="text-error text-lg">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-primary-text">GPU</h2>
        </div>
        <div className="text-error text-sm">
          Error: {getErrorMessage(gpuInfo)}
        </div>
      </div>
    );
  }

  if (!Array.isArray(gpuInfo) || gpuInfo.length === 0) {
    return (
      <div className="bg-accent-bg rounded-xl shadow p-6 border border-border">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
            <span className="text-purple-400 text-lg">🎮</span>
          </div>
          <h2 className="text-xl font-semibold text-primary-text">GPU</h2>
        </div>
        <div className="text-secondary-text text-sm">No GPUs detected</div>
      </div>
    );
  }

  return (
    <div className="bg-accent-bg rounded-xl shadow p-6 border border-border">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
          <span className="text-purple-400 text-lg">🎮</span>
        </div>
        <h2 className="text-xl font-semibold text-primary-text">GPU</h2>
      </div>
      <div className="border-t border-border mb-4" />

      <div className="space-y-4">
        {gpuInfo.map((gpu, index) => (
          <div
            key={index}
            className="border border-border rounded-lg p-4 bg-secondary-bg"
          >
            <h3 className="font-medium text-primary-text mb-3">
              {gpu.name || "Unknown GPU"}
            </h3>

            <div className="space-y-2">
              {gpu.memory_total_mb !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-secondary-text">Memory:</span>
                  <span className="font-medium text-primary-text">
                    {gpu.memory_used_mb !== undefined
                      ? `${gpu.memory_used_mb} / ${gpu.memory_total_mb} MB`
                      : `${gpu.memory_total_mb} MB`}
                  </span>
                </div>
              )}

              {gpu.utilization_percent !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-secondary-text">Utilization:</span>
                  <span className="font-medium text-primary-text">
                    {gpu.utilization_percent !== undefined
                      ? `${gpu.utilization_percent}%`
                      : "N/A"}
                  </span>
                </div>
              )}

              {gpu.temperature_celsius !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-secondary-text">Temperature:</span>
                  <span className="font-medium text-primary-text">
                    {gpu.temperature_celsius !== undefined
                      ? `${gpu.temperature_celsius}°C`
                      : "N/A"}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GpuSection;
