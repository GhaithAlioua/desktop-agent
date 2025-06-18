import React from "react";
import SidebarItem from "../SidebarItem";

interface SettingsItemProps {
  isSelected: boolean;
  onSelect: () => void;
  className?: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  isSelected,
  onSelect,
  className = "",
}) => {
  return (
    <SidebarItem
      className={className}
      isSelected={isSelected}
      onClick={onSelect}
    >
      Settings
    </SidebarItem>
  );
};

export default SettingsItem;
