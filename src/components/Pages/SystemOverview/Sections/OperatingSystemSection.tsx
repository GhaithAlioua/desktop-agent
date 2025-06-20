import React from "react";
import InfoCard from "../UI/InfoCard";
import InfoRow from "../UI/InfoRow";
import {
  OperatingSystemInfo,
  SysInfoError,
  RustResult,
  displayValueWithSeverity,
  formatError,
} from "../systemInfoTypes";

interface OperatingSystemSectionProps {
  osInfo: RustResult<OperatingSystemInfo, SysInfoError>;
}

const OperatingSystemSection: React.FC<OperatingSystemSectionProps> = ({
  osInfo,
}) => {
  return (
    <InfoCard title="Operating System" className="lg:col-span-2">
      <div className="bg-secondary-bg rounded-lg p-4">
        {"Ok" in osInfo ? (
          <>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-main-text mb-4 border-b border-border pb-2">
                  General Information
                </h3>
                <div className="space-y-3">
                  <InfoRow
                    label="OS Name"
                    value={
                      displayValueWithSeverity(
                        osInfo.Ok.general.os_name,
                        "os_name"
                      ).value
                    }
                    severity={
                      displayValueWithSeverity(
                        osInfo.Ok.general.os_name,
                        "os_name"
                      ).severity
                    }
                  />
                  <InfoRow
                    label="Kernel Version"
                    value={
                      displayValueWithSeverity(
                        osInfo.Ok.general.kernel_version,
                        "kernel_version"
                      ).value
                    }
                    severity={
                      displayValueWithSeverity(
                        osInfo.Ok.general.kernel_version,
                        "kernel_version"
                      ).severity
                    }
                  />
                  <InfoRow
                    label="Architecture"
                    value={
                      displayValueWithSeverity(
                        osInfo.Ok.general.architecture,
                        "architecture"
                      ).value
                    }
                    severity={
                      displayValueWithSeverity(
                        osInfo.Ok.general.architecture,
                        "architecture"
                      ).severity
                    }
                  />
                  <InfoRow
                    label="Hostname"
                    value={
                      displayValueWithSeverity(
                        osInfo.Ok.general.hostname,
                        "hostname"
                      ).value
                    }
                    severity={
                      displayValueWithSeverity(
                        osInfo.Ok.general.hostname,
                        "hostname"
                      ).severity
                    }
                  />
                  <InfoRow
                    label="Uptime"
                    value={
                      displayValueWithSeverity(
                        osInfo.Ok.general.uptime,
                        "uptime"
                      ).value
                    }
                    severity={
                      displayValueWithSeverity(
                        osInfo.Ok.general.uptime,
                        "uptime"
                      ).severity
                    }
                  />
                </div>
              </div>

              {osInfo.Ok.windows_specific && (
                <div>
                  <h3 className="text-lg font-semibold text-main-text mb-4 border-b border-border pb-2">
                    Windows Details
                  </h3>
                  <div className="space-y-3">
                    <InfoRow
                      label="Edition"
                      value={
                        displayValueWithSeverity(
                          osInfo.Ok.windows_specific.edition,
                          "edition"
                        ).value
                      }
                      severity={
                        displayValueWithSeverity(
                          osInfo.Ok.windows_specific.edition,
                          "edition"
                        ).severity
                      }
                    />
                    <InfoRow
                      label="Display Version"
                      value={
                        displayValueWithSeverity(
                          osInfo.Ok.windows_specific.display_version,
                          "display_version"
                        ).value
                      }
                      severity={
                        displayValueWithSeverity(
                          osInfo.Ok.windows_specific.display_version,
                          "display_version"
                        ).severity
                      }
                    />
                    <InfoRow
                      label="Build Number"
                      value={
                        displayValueWithSeverity(
                          osInfo.Ok.windows_specific.full_build_number,
                          "build_number"
                        ).value
                      }
                      severity={
                        displayValueWithSeverity(
                          osInfo.Ok.windows_specific.full_build_number,
                          "build_number"
                        ).severity
                      }
                    />
                    <InfoRow
                      label="Install Date"
                      value={
                        displayValueWithSeverity(
                          new Date(
                            osInfo.Ok.windows_specific.install_date_timestamp *
                              1000
                          ).toLocaleDateString(),
                          "install_date_timestamp"
                        ).value
                      }
                      severity={
                        displayValueWithSeverity(
                          new Date(
                            osInfo.Ok.windows_specific.install_date_timestamp *
                              1000
                          ).toLocaleDateString(),
                          "install_date_timestamp"
                        ).severity
                      }
                    />
                    <InfoRow
                      label="Registered Owner"
                      value={
                        displayValueWithSeverity(
                          osInfo.Ok.windows_specific.registered_owner,
                          "registered_owner"
                        ).value
                      }
                      severity={
                        displayValueWithSeverity(
                          osInfo.Ok.windows_specific.registered_owner,
                          "registered_owner"
                        ).severity
                      }
                    />
                    <InfoRow
                      label="Organization"
                      value={
                        displayValueWithSeverity(
                          osInfo.Ok.windows_specific.registered_organization,
                          "registered_organization"
                        ).value
                      }
                      severity={
                        displayValueWithSeverity(
                          osInfo.Ok.windows_specific.registered_organization,
                          "registered_organization"
                        ).severity
                      }
                    />
                    <InfoRow
                      label="Machine GUID"
                      value={
                        displayValueWithSeverity(
                          osInfo.Ok.windows_specific.machine_guid,
                          "machine_guid"
                        ).value
                      }
                      severity={
                        displayValueWithSeverity(
                          osInfo.Ok.windows_specific.machine_guid,
                          "machine_guid"
                        ).severity
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <InfoRow
            label="Error"
            value={formatError(osInfo.Err)}
            isError={true}
          />
        )}
      </div>
    </InfoCard>
  );
};

export default OperatingSystemSection;
