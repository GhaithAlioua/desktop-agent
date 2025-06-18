import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import StatusItem from "../StatusItem";

interface DockerStatusProps {
  className?: string;
}

interface DockerStatus {
  is_running: boolean;
  version?: {
    version: string;
    api_version: string;
    os: string;
    arch: string;
  };
  error?: string;
}

interface DockerVersion {
  version: string;
  api_version: string;
  os: string;
  arch: string;
}

const DockerStatus: React.FC<DockerStatusProps> = ({ className = "" }) => {
  const [dockerStatus, setDockerStatus] = useState<DockerStatus | null>(null);
  const [dockerVersion, setDockerVersion] = useState<DockerVersion | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDockerStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const status: DockerStatus = await invoke("get_docker_status");
      setDockerStatus(status);
    } catch (err) {
      setError(err as string);
      setDockerStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDockerVersion = async () => {
    try {
      const version: DockerVersion = await invoke("get_docker_version");
      setDockerVersion(version);
    } catch (err) {
      setDockerVersion(null);
    }
  };

  const refreshDockerStatus = async () => {
    await fetchDockerStatus();
    await fetchDockerVersion();
  };

  useEffect(() => {
    refreshDockerStatus();
    const interval = setInterval(refreshDockerStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const getUpdateStatus = () => {
    if (!dockerVersion) return "Update status unknown";
    const version = dockerVersion.version;
    if (version && version >= "20.0.0") {
      return "Docker is up to date";
    }
    return "Docker update available";
  };

  const getTooltipText = () => {
    if (isLoading) return "Checking Docker status...";

    // If we have an error or no status, Docker is not running
    if (error) return "Docker is not running";

    // If we have status but Docker is not running
    if (dockerStatus && !dockerStatus.is_running) {
      return "Docker is not running";
    }

    // If we don't have status yet
    if (!dockerStatus) return "Docker is not running";

    // Docker is running - show simplified information
    let tooltip = "Docker is running";

    if (dockerStatus.version) {
      tooltip += `\nVersion: ${dockerStatus.version.version}`;
    }

    tooltip += `\n${getUpdateStatus()}`;

    return tooltip;
  };

  return (
    <StatusItem
      className={className}
      title={getTooltipText()}
      onClick={refreshDockerStatus}
    >
      Docker
    </StatusItem>
  );
};

export default DockerStatus;
