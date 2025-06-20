import React from "react";
import InfoCard from "../UI/InfoCard";
import InfoRow from "../UI/InfoRow";
import {
  CpuInfo,
  SysInfoError,
  RustResult,
  displayValueWithSeverity,
  formatFrequency,
  formatError,
} from "../systemInfoTypes";

interface CpuSectionProps {
  cpuInfo: RustResult<CpuInfo, SysInfoError>;
}

const CpuSection: React.FC<CpuSectionProps> = ({ cpuInfo }) => {
  return (
    <InfoCard title="CPU">
      <div className="bg-secondary-bg rounded-lg p-4">
        {"Ok" in cpuInfo ? (
          <div className="space-y-3">
            <InfoRow
              label="Brand"
              value={displayValueWithSeverity(cpuInfo.Ok.brand, "brand").value}
              severity={
                displayValueWithSeverity(cpuInfo.Ok.brand, "brand").severity
              }
            />
            <InfoRow
              label="Vendor ID"
              value={
                displayValueWithSeverity(cpuInfo.Ok.vendor_id, "vendor_id")
                  .value
              }
              severity={
                displayValueWithSeverity(cpuInfo.Ok.vendor_id, "vendor_id")
                  .severity
              }
            />
            <InfoRow
              label="Frequency"
              value={
                displayValueWithSeverity(
                  formatFrequency(cpuInfo.Ok.frequency),
                  "frequency"
                ).value
              }
              severity={
                displayValueWithSeverity(
                  formatFrequency(cpuInfo.Ok.frequency),
                  "frequency"
                ).severity
              }
            />
            <InfoRow
              label="Physical Cores"
              value={
                displayValueWithSeverity(
                  cpuInfo.Ok.physical_core_count.toString(),
                  "physical_core_count"
                ).value
              }
              severity={
                displayValueWithSeverity(
                  cpuInfo.Ok.physical_core_count.toString(),
                  "physical_core_count"
                ).severity
              }
            />
            <InfoRow
              label="Logical Cores"
              value={
                displayValueWithSeverity(
                  cpuInfo.Ok.logical_core_count.toString(),
                  "logical_core_count"
                ).value
              }
              severity={
                displayValueWithSeverity(
                  cpuInfo.Ok.logical_core_count.toString(),
                  "logical_core_count"
                ).severity
              }
            />
          </div>
        ) : (
          <InfoRow
            label="Error"
            value={formatError(cpuInfo.Err)}
            isError={true}
          />
        )}
      </div>
    </InfoCard>
  );
};

export default CpuSection;
