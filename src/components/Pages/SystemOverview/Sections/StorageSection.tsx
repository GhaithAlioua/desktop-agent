import React from "react";
import InfoCard from "../UI/InfoCard";
import InfoRow from "../UI/InfoRow";
import {
  StorageInfo,
  StorageDeviceInfo,
  SysInfoError,
  RustResult,
  formatError,
} from "../systemInfoTypes";

interface StorageSectionProps {
  storageInfo: RustResult<StorageInfo, SysInfoError>;
}

const StorageSection: React.FC<StorageSectionProps> = ({ storageInfo }) => {
  return (
    <InfoCard title="Storage" className="lg:col-span-2">
      <div className="bg-secondary-bg rounded-lg p-4">
        {"Ok" in storageInfo ? (
          <>
            {storageInfo.Ok.devices.length > 0 ? (
              <div className="space-y-4">
                {storageInfo.Ok.devices.map(
                  (device: StorageDeviceInfo, index: number) => (
                    <div key={index} className="bg-secondary-bg rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-main-text">
                            {device.name} ({device.mount_point})
                          </h4>
                          <p className="text-sm text-secondary-text">
                            File System: {device.file_system}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-secondary-text">
                            Total Space: {device.total_space_gb.toFixed(1)} GB
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-secondary-text mb-2">
                          <span>Usage</span>
                          <span>{device.used_percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-blue-200 h-3 rounded-sm">
                          <div
                            className="bg-orange-500 h-3 rounded-sm transition-all duration-300"
                            style={{
                              width: `${Math.min(
                                device.used_percentage,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-secondary-text mt-1">
                          <span>
                            Used: {device.used_space_gb.toFixed(1)} GB
                          </span>
                          <span>
                            Available: {device.available_space_gb.toFixed(1)} GB
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center text-secondary-text py-8">
                No storage devices detected
              </div>
            )}
          </>
        ) : (
          <InfoRow
            label="Error"
            value={formatError(storageInfo.Err)}
            isError={true}
          />
        )}
      </div>
    </InfoCard>
  );
};

export default StorageSection;
