import React from "react";
import {
  CpuInfo,
  SysInfoError,
  isError,
  getErrorMessage,
} from "../systemInfoTypes";

interface CpuSectionProps {
  cpuInfo: CpuInfo | SysInfoError;
}

const CpuSection: React.FC<CpuSectionProps> = ({ cpuInfo }) => {
  if (!cpuInfo || typeof cpuInfo !== "object") {
    return (
      <div className="bg-accent-bg rounded-xl shadow p-6 border border-error text-error">
        Invalid CPU info
      </div>
    );
  }
  if (isError(cpuInfo)) {
    return (
      <div className="bg-accent-bg rounded-xl shadow p-6 border border-error text-error">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center mr-3">
            <span className="text-error text-lg">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-primary-text">CPU</h2>
        </div>
        <div className="text-error text-sm">
          Error: {getErrorMessage(cpuInfo)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-accent-bg rounded-xl shadow p-6 border border-border">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
          <span className="text-green-400 text-lg">⚡</span>
        </div>
        <h2 className="text-xl font-semibold text-primary-text">CPU</h2>
      </div>
      <div className="border-t border-border mb-4" />

      <div className="space-y-4">
        <div className="border border-border rounded-lg p-4 bg-secondary-bg">
          <h3 className="font-medium text-primary-text mb-3">
            Processor Information
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Brand:</span>
              <span className="font-medium text-primary-text">
                {cpuInfo.brand || "Unknown"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Frequency:</span>
              <span className="font-medium text-primary-text">
                {typeof cpuInfo.frequency === "number" && cpuInfo.frequency > 0
                  ? cpuInfo.frequency
                  : "N/A"}{" "}
                MHz
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Physical Cores:</span>
              <span className="font-medium text-primary-text">
                {typeof cpuInfo.physical_cores === "number" &&
                cpuInfo.physical_cores > 0
                  ? cpuInfo.physical_cores
                  : "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Logical Cores:</span>
              <span className="font-medium text-primary-text">
                {typeof cpuInfo.logical_cores === "number" &&
                cpuInfo.logical_cores > 0
                  ? cpuInfo.logical_cores
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CpuSection;
