import React from "react";
import InfoCard from "../UI/InfoCard";
import InfoRow from "../UI/InfoRow";
import {
  MemoryInfo,
  SysInfoError,
  RustResult,
  formatError,
} from "../systemInfoTypes";

interface MemorySectionProps {
  memoryInfo: RustResult<MemoryInfo, SysInfoError>;
}

const MemorySection: React.FC<MemorySectionProps> = ({ memoryInfo }) => {
  return (
    <InfoCard title="Memory (RAM)">
      <div className="bg-secondary-bg rounded-lg p-4">
        {"Ok" in memoryInfo ? (
          <>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-main-text">System RAM</h4>
              </div>
              <div className="text-right">
                <div className="text-sm text-secondary-text">
                  Total Memory: {memoryInfo.Ok.total_memory_gb.toFixed(1)} GB
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm text-secondary-text mb-2">
                <span>Usage</span>
                <span>{memoryInfo.Ok.used_memory_percentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-blue-200 h-3 rounded-sm">
                <div
                  className="bg-orange-500 h-3 rounded-sm transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      memoryInfo.Ok.used_memory_percentage,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-secondary-text mt-1">
                <span>Used: {memoryInfo.Ok.used_memory_gb.toFixed(1)} GB</span>
                <span>
                  Available: {memoryInfo.Ok.available_memory_gb.toFixed(1)} GB
                </span>
              </div>
            </div>
          </>
        ) : (
          <InfoRow
            label="Error"
            value={formatError(memoryInfo.Err)}
            isError={true}
          />
        )}
      </div>
    </InfoCard>
  );
};

export default MemorySection;
