import React from "react";

interface InfoRowProps {
  label: string;
  value: string;
  isError?: boolean;
  severity?: "info" | "warning";
}

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  value,
  isError = false,
  severity = "info",
}) => {
  const getValueClassName = () => {
    if (isError) {
      return "text-red-500 font-medium";
    }
    switch (severity) {
      case "warning":
        return "text-yellow-500 font-medium";
      case "info":
      default:
        return "text-main-text";
    }
  };

  const containerClassName = isError
    ? "bg-red-50 border border-red-200 rounded-md p-3"
    : "border-b border-border pb-3";

  return (
    <div className={`flex justify-between items-center ${containerClassName}`}>
      <span className="text-secondary-text">{label}</span>
      <span className={getValueClassName()}>{value}</span>
    </div>
  );
};

export default InfoRow;
