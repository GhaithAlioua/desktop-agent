import React from "react";

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, children, className }) => {
  return (
    <div
      className={`bg-primary-bg border border-border rounded-lg p-4 w-full max-w-2xl text-primary-text ${className}`}
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <hr className="border-border mb-4" />
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};

export default InfoCard;
