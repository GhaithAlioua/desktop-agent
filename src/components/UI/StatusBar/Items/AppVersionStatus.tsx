import React, { useState } from "react";
import StatusItem from "../StatusItem";

const AppVersionStatus: React.FC = () => {
  const [version] = useState<string>("v1.0.0");

  return <StatusItem title={`Desktop Agent ${version}`}>{version}</StatusItem>;
};

export default AppVersionStatus;
