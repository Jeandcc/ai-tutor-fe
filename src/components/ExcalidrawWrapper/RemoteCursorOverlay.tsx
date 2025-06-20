import React from "react";
import { useTextStream } from "@livekit/components-react";

type CursorData = {
  x: string;
  y: string;
  visible: boolean;
};

const RemoteCursorOverlay: React.FC<{
  containerRef: React.RefObject<HTMLDivElement>;
}> = ({ containerRef }) => {
  const { textStreams } = useTextStream("CURSOR_MOVE");

  // Get the latest cursor message
  const latest =
    textStreams.length > 0 ? textStreams[textStreams.length - 1] : null;
  let cursor: CursorData | null = null;
  try {
    cursor = latest ? JSON.parse(latest.text) : null;
  } catch {
    cursor = null;
  }

  // Get container size for positioning
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  React.useLayoutEffect(() => {
    if (containerRef.current) {
      setSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, [containerRef]);

  if (!cursor || !cursor.visible) return null;

  // Clamp position to container
  const left = Math.max(0, Math.min(parseFloat(cursor.x), size.width));
  const top = Math.max(0, Math.min(parseFloat(cursor.y), size.height));

  return (
    <div
      style={{
        position: "absolute",
        pointerEvents: "none",
        left,
        top,
        zIndex: 10,
        transition: "left 0.05s, top 0.05s",
      }}
    >
      {/* Simple cursor icon */}
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <path d="M2 2L22 12L13 13L12 22L2 2Z" fill="#007bff" />
      </svg>
    </div>
  );
};

export default RemoteCursorOverlay;
