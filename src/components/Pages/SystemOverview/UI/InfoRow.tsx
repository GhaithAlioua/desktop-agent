import React from "react";

interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, className }) => {
  return (
    <div className={`flex justify-between items-center text-sm ${className}`}>
      <span className="text-secondary-text">{label}</span>
      <span className="text-primary-text font-medium">{value}</span>
    </div>
  );
};

export default InfoRow;
