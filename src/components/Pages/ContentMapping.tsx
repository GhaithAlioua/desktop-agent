import React from "react";
import HomePage from "./Home/HomePage";
import SettingsPage from "./Settings/SettingsPage";
import AboutPage from "./About/AboutPage";

// Content mapping configuration
export const CONTENT_MAP: Record<string, React.ReactNode> = {
  home: <HomePage />,
  settings: <SettingsPage />,
  about: <AboutPage />,
  // Future pages can be easily added here:
  // docker: <DockerPage />,
  // system: <SystemPage />,
};

// Default content for unknown routes
export const DEFAULT_CONTENT = (
  <div className="text-secondary-text text-xl p-6">No content found.</div>
);
