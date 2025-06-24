import React from "react";
import InfoCard from "../UI/InfoCard";
import InfoRow from "../UI/InfoRow";
import {
  // NetworkInfo, // TODO: Define this type when network functionality is implemented
  SysInfoError,
  RustResult,
  formatError,
  // formatNetworkSpeed, // TODO: Define this function when network functionality is implemented
} from "../systemInfoTypes";

// TODO: Define NetworkInfo type when network functionality is implemented
interface NetworkInfo {
  network_type?: string;
  download_speed_mbps?: number;
  upload_speed_mbps?: number;
  latency_ms?: number;
  isp_name?: string;
  public_ip?: string;
  location_region?: string;
  location_country?: string;
}

// TODO: Define formatNetworkSpeed function when network functionality is implemented
const formatNetworkSpeed = (speed: number): string => {
  if (speed >= 1000) {
    return `${(speed / 1000).toFixed(1)} Gbps`;
  }
  return `${speed.toFixed(1)} Mbps`;
};

interface NetworkSectionProps {
  networkInfo: RustResult<NetworkInfo, SysInfoError>;
}

const NetworkSection: React.FC<NetworkSectionProps> = ({ networkInfo }) => {
  const getNetworkStatusIcon = (networkInfo: NetworkInfo) => {
    if (
      networkInfo.download_speed_mbps &&
      networkInfo.download_speed_mbps > 100
    ) {
      return "🚀"; // Fast
    } else if (
      networkInfo.download_speed_mbps &&
      networkInfo.download_speed_mbps > 25
    ) {
      return "📡"; // Good
    } else if (
      networkInfo.download_speed_mbps &&
      networkInfo.download_speed_mbps > 10
    ) {
      return "📶"; // Moderate
    } else {
      return "🌐"; // Basic
    }
  };

  const getNetworkStatusColor = (networkInfo: NetworkInfo) => {
    if (
      networkInfo.download_speed_mbps &&
      networkInfo.download_speed_mbps > 100
    ) {
      return "text-green-500"; // Fast
    } else if (
      networkInfo.download_speed_mbps &&
      networkInfo.download_speed_mbps > 25
    ) {
      return "text-blue-500"; // Good
    } else if (
      networkInfo.download_speed_mbps &&
      networkInfo.download_speed_mbps > 10
    ) {
      return "text-yellow-500"; // Moderate
    } else {
      return "text-gray-500"; // Basic
    }
  };

  return (
    <InfoCard title="Network">
      <div className="bg-secondary-bg rounded-lg p-4">
        {"Ok" in networkInfo ? (
          <div className="space-y-4">
            {/* Network Status */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">
                {getNetworkStatusIcon(networkInfo.Ok)}
              </span>
              <div>
                <h4
                  className={`font-semibold text-main-text ${getNetworkStatusColor(
                    networkInfo.Ok
                  )}`}
                >
                  Network Status
                </h4>
                <p className="text-sm text-secondary-text">
                  {networkInfo.Ok.network_type || "Connection type unavailable"}
                </p>
              </div>
            </div>

            {/* Speed Information */}
            <div className="space-y-3">
              {networkInfo.Ok.download_speed_mbps && (
                <InfoRow
                  label="Download Speed"
                  value={formatNetworkSpeed(networkInfo.Ok.download_speed_mbps)}
                  severity="info"
                />
              )}

              {networkInfo.Ok.upload_speed_mbps && (
                <InfoRow
                  label="Upload Speed"
                  value={formatNetworkSpeed(networkInfo.Ok.upload_speed_mbps)}
                  severity="info"
                />
              )}

              {networkInfo.Ok.latency_ms && (
                <InfoRow
                  label="Latency"
                  value={`${networkInfo.Ok.latency_ms.toFixed(1)} ms`}
                  severity={
                    networkInfo.Ok.latency_ms > 100 ? "warning" : "info"
                  }
                />
              )}
            </div>

            {/* Network Details */}
            <div className="space-y-3 pt-3 border-t border-border">
              {networkInfo.Ok.network_type && (
                <InfoRow
                  label="Connection Type"
                  value={networkInfo.Ok.network_type}
                  severity="info"
                />
              )}

              {networkInfo.Ok.isp_name && (
                <InfoRow
                  label="ISP"
                  value={networkInfo.Ok.isp_name}
                  severity="info"
                />
              )}

              {networkInfo.Ok.public_ip && (
                <InfoRow
                  label="Public IP"
                  value={networkInfo.Ok.public_ip}
                  severity="info"
                />
              )}

              {networkInfo.Ok.location_region && (
                <InfoRow
                  label="Region"
                  value={networkInfo.Ok.location_region}
                  severity="info"
                />
              )}

              {networkInfo.Ok.location_country && (
                <InfoRow
                  label="Country"
                  value={networkInfo.Ok.location_country}
                  severity="info"
                />
              )}
            </div>

            {/* Placeholder for speed test */}
            {!networkInfo.Ok.download_speed_mbps && (
              <div className="text-center text-secondary-text p-4 bg-accent-bg rounded-lg">
                <p className="text-sm">Speed test not available</p>
                <p className="text-xs mt-1">
                  Network speed testing will be available in future updates
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-red-500 p-4">
            Error: {formatError(networkInfo.Err)}
          </div>
        )}
      </div>
    </InfoCard>
  );
};

export default NetworkSection;
