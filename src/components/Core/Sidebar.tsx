import React from "react";

const Sidebar: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <aside
    className={`w-sidebar bg-primary-bg border-r border-border flex flex-col overflow-hidden ${className}`}
    role="complementary"
    aria-label="Sidebar"
  >
    {children}
  </aside>
);

export default Sidebar;
