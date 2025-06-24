import React from "react";
import { useAICommand } from "../../hooks/useAICommand";

type CursorData = {
  x: string;
  y: string;
  visible: boolean;
};

const RemoteCursorOverlay: React.FC<{}> = ({}) => {
  const { connected, latestCommand } = useAICommand<CursorData>("CURSOR_MOVE");

  if (!connected || !latestCommand || !latestCommand.visible) return null;

  const percentX = Math.max(0, Math.min(100, parseInt(latestCommand.x, 10)));
  const percentY = Math.max(0, Math.min(100, parseInt(latestCommand.y, 10)));

  return (
    <div
      style={{
        position: "absolute",
        pointerEvents: "none",
        left: `${percentX}%`,
        top: `${percentY}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 10,
        transition: "left 0.05s, top 0.05s",
      }}
    >
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <path d="M2 2L22 12L13 13L12 22L2 2Z" fill="#007bff" />
      </svg>
    </div>
  );
};

export default RemoteCursorOverlay;
