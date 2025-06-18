import React from "react";
import SidebarItem from "../SidebarItem";

interface AboutItemProps {
  isSelected: boolean;
  onSelect: () => void;
  className?: string;
}

const AboutItem: React.FC<AboutItemProps> = ({
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
      About
    </SidebarItem>
  );
};

export default AboutItem;
