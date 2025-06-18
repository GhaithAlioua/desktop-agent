import React from "react";
import HomeItem from "./Items/HomeItem";
import SettingsItem from "./Items/SettingsItem";
import AboutItem from "./Items/AboutItem";

// Sidebar item configuration
export interface SidebarItemConfig {
  key: string;
  component: React.ComponentType<{
    isSelected: boolean;
    onSelect: () => void;
    className?: string;
  }>;
  enabled?: boolean;
}

// Centralized sidebar items configuration
export const SIDEBAR_ITEMS: SidebarItemConfig[] = [
  {
    key: "home",
    component: HomeItem,
    enabled: true,
  },
  {
    key: "settings",
    component: SettingsItem,
    enabled: true,
  },
  {
    key: "about",
    component: AboutItem,
    enabled: true,
  },
  // Future items can be easily added here:
  // {
  //   key: "docker",
  //   component: DockerItem,
  //   enabled: true,
  // },
  // {
  //   key: "system",
  //   component: SystemItem,
  //   enabled: true,
  // },
];

// Component to render all sidebar navigation items
interface SidebarNavigationProps {
  selected: string;
  onSelect: (key: string) => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="flex flex-col gap-2 p-2">
      {SIDEBAR_ITEMS.filter((item) => item.enabled !== false).map((item) => {
        const Component = item.component;
        return (
          <Component
            key={item.key}
            isSelected={selected === item.key}
            onSelect={() => onSelect(item.key)}
          />
        );
      })}
    </div>
  );
};

export default SidebarNavigation;
