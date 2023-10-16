import React from "react";
import { ConfigProvider } from "antd";
import "./App.css";
import Entries from "entries";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "rgb(127, 171, 177)",
        },
      }}
    >
      <div className="App">
        <Entries />
      </div>
    </ConfigProvider>
  );
}

export default App;
