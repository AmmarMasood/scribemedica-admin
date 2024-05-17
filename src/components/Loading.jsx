import React from "react";
import { Spin } from "antd";

function Loading({ show }) {
  return (
    show && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <Spin size="large" />
      </div>
    )
  );
}

export default Loading;
