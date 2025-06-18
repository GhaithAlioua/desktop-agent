import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export interface StatusItemProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
}

const StatusItem: React.FC<StatusItemProps> = ({
  children,
  className = "",
  title,
  onClick,
}) => {
  const content = (
    <div
      className={`px-3 py-0.5 text-secondary-text text-xs font-medium cursor-pointer h-[22px] flex items-center hover:text-white ${className}`}
      onClick={onClick}
      role="status"
    >
      {children}
    </div>
  );

  if (title) {
    // Convert \n to <br> tags for proper line breaks in tooltips
    const tooltipContent = title.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < title.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));

    return (
      <Tippy
        content={tooltipContent}
        arrow={true}
        placement="top"
        delay={[200, 0]}
        duration={[100, 50]}
      >
        {content}
      </Tippy>
    );
  }

  return content;
};

export default StatusItem;
