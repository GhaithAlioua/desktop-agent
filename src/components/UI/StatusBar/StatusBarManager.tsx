import React from "react";
import DockerStatus from "./Items/DockerStatus";
import AppVersionStatus from "./Items/AppVersionStatus";

// Status bar item configuration
export interface StatusItemConfig {
  id: string;
  component: React.ComponentType<{ className?: string }>;
  className?: string;
  enabled?: boolean;
}

// Centralized status bar items configuration
export const STATUS_ITEMS: StatusItemConfig[] = [
  {
    id: "docker",
    component: DockerStatus,
    enabled: true,
  },
  {
    id: "app-version",
    component: AppVersionStatus,
    enabled: true,
  },
  // Future items can be easily added here:
  // {
  //   id: "network-status",
  //   component: NetworkStatus,
  //   enabled: true,
  // },
  // {
  //   id: "system-resources",
  //   component: SystemResourcesStatus,
  //   enabled: true,
  // },
];

// Component to render all status bar items
const StatusBarManager: React.FC = () => {
  return (
    <div className="flex items-center justify-end gap-[0.5cm] w-full pl-[20px] pr-[20px]">
      {STATUS_ITEMS.filter((item) => item.enabled !== false).map((item) => {
        const Component = item.component;
        return <Component key={item.id} className={item.className} />;
      })}
    </div>
  );
};

export default StatusBarManager;
