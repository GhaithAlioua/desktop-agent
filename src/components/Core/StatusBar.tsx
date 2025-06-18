import React from "react";
import StatusBarManager from "../UI/StatusBar/StatusBarManager";

const StatusBar: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`h-status-bar bg-primary-bg border-t border-border flex items-center px-0 overflow-visible text-secondary-text ${className}`}
    role="status"
    aria-label="Status bar"
  >
    <StatusBarManager />
  </div>
);

export default StatusBar;
