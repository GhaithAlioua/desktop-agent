import React from "react";

export interface SidebarItemProps {
  children: React.ReactNode;
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  children,
  className = "",
  isSelected = false,
  onClick,
}) => {
  return (
    <button
      className={`text-primary-text text-sm px-3 py-2 rounded transition-colors duration-100 text-left w-full ${
        isSelected ? "bg-accent-bg" : "hover:bg-white/5"
      } ${className}`}
      onClick={onClick}
      role="menuitem"
    >
      {children}
    </button>
  );
};

export default SidebarItem;
