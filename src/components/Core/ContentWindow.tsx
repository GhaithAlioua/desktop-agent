import React from "react";

const ContentWindow: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <main
    className={`flex-1 bg-secondary-bg flex items-center justify-center overflow-auto text-primary-text ${className}`}
    role="main"
    aria-label="Main content area"
  >
    {children}
  </main>
);

export default ContentWindow;
