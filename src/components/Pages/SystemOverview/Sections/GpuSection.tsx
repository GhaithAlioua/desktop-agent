import React from "react";
import InfoCard from "../UI/InfoCard";
import InfoRow from "../UI/InfoRow";
import {
  GpuInfo,
  SysInfoError,
  RustResult,
  displayValueWithSeverity,
  formatError,
} from "../systemInfoTypes";

interface GpuSectionProps {
  gpuInfo: RustResult<GpuInfo[], SysInfoError>;
}

const GpuSection: React.FC<GpuSectionProps> = ({ gpuInfo }) => {
  return (
    <InfoCard title="GPU">
      <div className="bg-secondary-bg rounded-lg p-4">
        {"Ok" in gpuInfo ? (
          gpuInfo.Ok.length === 0 ? (
            <div className="text-center text-neutral-400">
              No GPU information available
            </div>
          ) : (
            <div className="space-y-3">
              {gpuInfo.Ok.map((gpu: GpuInfo, index: number) => (
                <React.Fragment key={index}>
                  <InfoRow
                    label={`GPU ${index + 1} Name`}
                    value={displayValueWithSeverity(gpu.name, "gpu_name").value}
                    severity={
                      displayValueWithSeverity(gpu.name, "gpu_name").severity
                    }
                  />
                  <InfoRow
                    label={`GPU ${index + 1} Driver`}
                    value={
                      displayValueWithSeverity(gpu.driver, "gpu_driver").value
                    }
                    severity={
                      displayValueWithSeverity(gpu.driver, "gpu_driver")
                        .severity
                    }
                  />
                  <InfoRow
                    label={`GPU ${index + 1} Driver Info`}
                    value={
                      displayValueWithSeverity(
                        gpu.driver_info,
                        "gpu_driver_info"
                      ).value
                    }
                    severity={
                      displayValueWithSeverity(
                        gpu.driver_info,
                        "gpu_driver_info"
                      ).severity
                    }
                  />
                  <InfoRow
                    label={`GPU ${index + 1} Backend`}
                    value={
                      displayValueWithSeverity(gpu.backend, "gpu_backend").value
                    }
                    severity={
                      displayValueWithSeverity(gpu.backend, "gpu_backend")
                        .severity
                    }
                  />
                  <InfoRow
                    label={`GPU ${index + 1} Device Type`}
                    value={
                      displayValueWithSeverity(
                        gpu.device_type,
                        "gpu_device_type"
                      ).value
                    }
                    severity={
                      displayValueWithSeverity(
                        gpu.device_type,
                        "gpu_device_type"
                      ).severity
                    }
                  />
                  <InfoRow
                    label={`GPU ${index + 1} Vendor ID`}
                    value={
                      displayValueWithSeverity(
                        gpu.vendor_id.toString(),
                        "gpu_vendor_id"
                      ).value
                    }
                    severity={
                      displayValueWithSeverity(
                        gpu.vendor_id.toString(),
                        "gpu_vendor_id"
                      ).severity
                    }
                  />
                  <InfoRow
                    label={`GPU ${index + 1} Device ID`}
                    value={
                      displayValueWithSeverity(
                        gpu.device_id.toString(),
                        "gpu_device_id"
                      ).value
                    }
                    severity={
                      displayValueWithSeverity(
                        gpu.device_id.toString(),
                        "gpu_device_id"
                      ).severity
                    }
                  />
                </React.Fragment>
              ))}
            </div>
          )
        ) : (
          <InfoRow
            label="Error"
            value={formatError(gpuInfo.Err)}
            isError={true}
          />
        )}
      </div>
    </InfoCard>
  );
};

export default GpuSection;
