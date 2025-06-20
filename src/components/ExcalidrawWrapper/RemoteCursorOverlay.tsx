import React from "react";
import { useConnectionState, useTextStream } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";

type CursorData = {
  x: string;
  y: string;
  visible: boolean;
};

const RemoteCursorOverlay: React.FC<{}> = ({}) => {
  const roomState = useConnectionState();
  const { textStreams } = useTextStream("CURSOR_MOVE");

  const latestCursorMoveCommand = textStreams.at(-1);
  let cursor: CursorData | null = null;
  try {
    cursor = latestCursorMoveCommand
      ? JSON.parse(latestCursorMoveCommand.text)
      : null;
  } catch {
    cursor = null;
  }

  console.log(cursor);

  if (roomState !== ConnectionState.Connected || !cursor || !cursor.visible)
    return null;

  const percentX = Math.max(0, Math.min(100, parseInt(cursor.x, 10)));
  const percentY = Math.max(0, Math.min(100, parseInt(cursor.y, 10)));

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
