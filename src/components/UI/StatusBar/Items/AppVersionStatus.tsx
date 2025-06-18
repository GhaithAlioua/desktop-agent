import React, { useState, useEffect } from "react";
import StatusItem from "../StatusItem";

interface AppVersionStatusProps {
  className?: string;
}

const AppVersionStatus: React.FC<AppVersionStatusProps> = ({
  className = "",
}) => {
  const [version, setVersion] = useState<string>("v1.0.0");
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Future: This will be replaced with actual version checking logic
  const checkForUpdates = async () => {
    setIsLoading(true);
    // TODO: Implement actual update checking logic
    // const updateInfo = await invoke("check_app_updates");
    // setUpdateAvailable(updateInfo.available);
    setIsLoading(false);
  };

  const getTooltipText = () => {
    if (isLoading) return "Checking for updates...";

    let tooltip = `App Version: ${version}`;
    if (updateAvailable) {
      tooltip += "\nUpdate available";
    } else {
      tooltip += "\nUp to date";
    }
    return tooltip;
  };

  return (
    <StatusItem
      className={className}
      title={getTooltipText()}
      onClick={checkForUpdates}
    >
      {version}
    </StatusItem>
  );
};

export default AppVersionStatus;
