import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import StatusItem from "../StatusItem";

interface DockerVersion {
  version: string;
  api_version: string;
  os: string;
  arch: string;
}

interface DockerStatus {
  is_running: boolean;
  is_paused: boolean;
  engine_version: DockerVersion | null;
  desktop_version: string | null;
  engine_update_available: boolean | null;
  desktop_update_available: boolean | null;
  error: string | null;
  container_count: number | null;
  last_checked: string | null;
}

const DockerStatus: React.FC = () => {
  const [status, setStatus] = useState<DockerStatus>({
    is_running: false,
    is_paused: false,
    engine_version: null,
    desktop_version: null,
    engine_update_available: null,
    desktop_update_available: null,
    error: "Initializing...",
    container_count: null,
    last_checked: null,
  });

  useEffect(() => {
    // Subscribe to Docker status updates
    const unsubscribe = listen<DockerStatus>(
      "docker-status-updated",
      (event) => {
        setStatus(event.payload);
      }
    );

    // Get initial status
    invoke<DockerStatus>("get_docker_status")
      .then(setStatus)
      .catch((error: unknown) => {
        console.error("Failed to get initial Docker status:", error);
        setStatus((prev) => ({
          ...prev,
          error: "Failed to connect to Docker",
        }));
      });

    // Subscribe to real-time updates
    invoke("subscribe_to_docker_events").catch((error: unknown) => {
      console.error("Failed to subscribe to Docker events:", error);
    });

    return () => {
      unsubscribe.then((fn) => fn());
    };
  }, []);

  const getStatusColor = (): string => {
    // Check if we're in the initializing/checking state
    if (
      status.error === "Initializing..." ||
      status.error === "Docker restarting..."
    ) {
      return "bg-gray-400"; // Grey for checking state
    }
    if (status.error && !status.is_running) return "bg-red-500";
    if (status.is_paused) return "bg-yellow-500";
    if (status.is_running) return "bg-green-500";
    return "bg-gray-400"; // Default to grey for checking state
  };

  const getStatusText = (): string => {
    // Check if we're in the initializing/checking state
    if (status.error === "Initializing...") {
      return "Checking Docker Status";
    }
    if (status.error === "Docker restarting...") {
      return "Restarting...";
    }
    if (status.error && !status.is_running) return "Not Running";
    if (status.is_paused) return "Paused";
    if (status.is_running) return "Running";
    return "Checking Docker Status"; // Default to checking state
  };

  const getTooltipContent = (): string => {
    // Handle checking/initializing states
    if (status.error === "Initializing...") {
      return "Status: Checking Docker status...";
    }
    if (status.error === "Docker restarting...") {
      return "Status: Docker is restarting...";
    }

    // When Docker is running, show status and version info
    if (status.is_running && !status.is_paused && !status.error) {
      const parts: string[] = [];
      parts.push(`Status: ${getStatusText()}`);

      if (status.engine_version) {
        const engineUpdateText =
          status.engine_update_available === true ? " (Update Available)" : "";
        parts.push(
          `Engine: ${status.engine_version.version}${engineUpdateText}`
        );
      }

      if (status.desktop_version) {
        const desktopUpdateText =
          status.desktop_update_available === true ? " (Update Available)" : "";
        parts.push(`Desktop: ${status.desktop_version}${desktopUpdateText}`);
      }

      return parts.join("\n");
    }

    // When Docker is not running, just show status
    return `Status: ${getStatusText()}`;
  };

  const getUpdateIndicator = (): React.ReactNode => {
    return null;
  };

  return (
    <div className="relative">
      <StatusItem title={getTooltipContent()}>
        Docker
        <span
          className={`inline-block w-2 h-2 rounded-full ${getStatusColor()} ml-1`}
        />
      </StatusItem>
      {getUpdateIndicator()}
    </div>
  );
};

export default DockerStatus;
