import React from "react";

const Sidebar: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <aside
    className={`w-sidebar bg-secondary-bg border-r border-border flex flex-col overflow-hidden ${className}`}
    role="complementary"
    aria-label="Application sidebar"
  >
    {children}
  </aside>
);

export default Sidebar;
