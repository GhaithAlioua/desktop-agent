import React from "react";

const TitleBarSeparator: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`border-t border-border ${className}`}
    role="separator"
    aria-label="Title bar separator"
  />
);

export default TitleBarSeparator;
