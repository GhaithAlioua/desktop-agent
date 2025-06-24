import React, { useState } from "react";
import Sidebar from "./components/Core/Sidebar";
import SidebarNavigation, {
  SIDEBAR_ITEMS,
} from "./components/UI/Sidebar/SidebarNavigation";
import ContentWindow from "./components/Core/ContentWindow";
import StatusBar from "./components/Core/StatusBar";
import TitleBarSeparator from "./components/Layout/TitleBarSeparator";
import {
  CONTENT_MAP,
  DEFAULT_CONTENT,
} from "./components/Pages/ContentMapping";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: "red", padding: 20 }}>
          App Error: {String(this.state.error)}
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [selected, setSelected] = useState<string>(SIDEBAR_ITEMS[0]?.key ?? "");

  return (
    <ErrorBoundary>
      <div
        className="flex flex-col h-screen bg-primary-bg text-primary-text"
        role="application"
        aria-label="Desktop Agent"
      >
        <TitleBarSeparator />
        <div className="flex flex-1 min-h-0">
          <Sidebar>
            <SidebarNavigation selected={selected} onSelect={setSelected} />
          </Sidebar>
          <ContentWindow>
            {CONTENT_MAP[selected] ?? DEFAULT_CONTENT}
          </ContentWindow>
        </div>
        <StatusBar />
      </div>
    </ErrorBoundary>
  );
};

export default App;
