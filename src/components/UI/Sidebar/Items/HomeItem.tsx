import React from "react";
import SidebarItem from "../SidebarItem";

interface HomeItemProps {
  isSelected: boolean;
  onSelect: () => void;
  className?: string;
}

const HomeItem: React.FC<HomeItemProps> = ({
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
      Home
    </SidebarItem>
  );
};

export default HomeItem;
