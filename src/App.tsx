import React, { useState } from "react";
import Sidebar from "./components/Core/Sidebar";
import SidebarNavigation, {
  SIDEBAR_ITEMS,
} from "./components/UI/Sidebar/SidebarNavigation";
import ContentWindow from "./components/Core/ContentWindow";
import StatusBar from "./components/Core/StatusBar";
import StatusBarManager from "./components/UI/StatusBar/StatusBarManager";
import TitleBarSeparator from "./components/Layout/TitleBarSeparator";
import {
  CONTENT_MAP,
  DEFAULT_CONTENT,
} from "./components/Pages/ContentMapping";

const App: React.FC = () => {
  const [selected, setSelected] = useState<string>(SIDEBAR_ITEMS[0]?.key ?? "");

  return (
    <div
      className="flex flex-col h-screen bg-primary-bg"
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
      <StatusBar>
        <StatusBarManager />
      </StatusBar>
    </div>
  );
};

export default App;
