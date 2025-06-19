import React from "react";
import SidebarItem from "../SidebarItem";

interface SystemOverviewItemProps {
  isSelected: boolean;
  onSelect: () => void;
  className?: string;
}

const SystemOverviewItem: React.FC<SystemOverviewItemProps> = ({
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
      System Overview
    </SidebarItem>
  );
};

export default SystemOverviewItem;
