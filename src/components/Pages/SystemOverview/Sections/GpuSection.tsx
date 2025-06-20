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
  const getGpuDisplayName = (gpu: GpuInfo, index: number) => {
    // Use dynamic device type from wgpu enum
    switch (gpu.device_type) {
      case "DiscreteGpu":
        return "Primary Graphics Card";
      case "IntegratedGpu":
        return "Integrated Graphics";
      case "VirtualGpu":
        return "Virtual Graphics";
      case "Cpu":
        return "CPU Graphics";
      default:
        return `GPU ${index + 1}`;
    }
  };

  const formatBackendDisplay = (backend: string) => {
    // Convert wgpu enum values to user-friendly display names
    return backend
      .split(", ")
      .map((b) => {
        switch (b) {
          case "Vulkan":
            return "Vulkan";
          case "Dx12":
            return "DirectX 12";
          case "Dx11":
            return "DirectX 11";
          case "Metal":
            return "Metal";
          case "Gl":
            return "OpenGL";
          case "BrowserWebGpu":
            return "WebGPU";
          default:
            return b;
        }
      })
      .join(", ");
  };

  return (
    <InfoCard title="GPU">
      <div className="bg-secondary-bg rounded-lg p-4">
        {"Ok" in gpuInfo ? (
          gpuInfo.Ok.length === 0 ? (
            <div className="text-center text-neutral-400">
              No GPU information available
            </div>
          ) : (
            <div className="space-y-6">
              {gpuInfo.Ok.map((gpu: GpuInfo, index: number) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-lg font-semibold text-main-text mb-3 border-b border-border pb-2">
                    {getGpuDisplayName(gpu, index)}
                  </h3>
                  <InfoRow
                    label="Model"
                    value={displayValueWithSeverity(gpu.name, "gpu_name").value}
                    severity={
                      displayValueWithSeverity(gpu.name, "gpu_name").severity
                    }
                  />
                  {gpu.driver_info &&
                    gpu.driver_info !== "Unavailable" &&
                    !gpu.driver_info.startsWith("32.0") && (
                      <InfoRow
                        label="Driver Version"
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
                    )}
                  {gpu.backend && gpu.backend !== "Unknown" && (
                    <InfoRow
                      label="Graphics APIs"
                      value={
                        displayValueWithSeverity(
                          formatBackendDisplay(gpu.backend),
                          "gpu_backend"
                        ).value
                      }
                      severity={
                        displayValueWithSeverity(
                          formatBackendDisplay(gpu.backend),
                          "gpu_backend"
                        ).severity
                      }
                    />
                  )}
                </div>
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
