import React, { useEffect } from "react";

import dynamic from "next/dynamic";

import {
  useConnectionState,
  useLocalParticipant,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";

import { PlaygroundProps } from "./Playground";
import { MediaControlBar } from "./MediaControlBar";
import { MediaSidebar } from "./MediaSidebar";
import { ChatSidebar } from "./ChatSidebar";

const ExcalidrawWrapper = dynamic(
  async () => (await import("@/components/ExcalidrawWrapper")).default,
  {
    ssr: false,
  }
);

const Playground: React.FC<PlaygroundProps> = ({
  logo,
  themeColors,
  onConnect,
}) => {
  const roomState = useConnectionState();
  const { localParticipant } = useLocalParticipant();

  const connected = roomState === ConnectionState.Connected;

  /**
   * Enable microphone when connected
   */
  useEffect(() => {
    if (connected) {
      localParticipant.setMicrophoneEnabled(true);
    }
  }, [connected, localParticipant]);

  return (
    <div
      className="bg-gray-900/90"
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            width: "20%",
            minWidth: 240,
            maxWidth: 500,
          }}
        >
          <ChatSidebar connected={connected} />
        </div>

        <div
          style={{
            flexGrow: 1,
          }}
        >
          <ExcalidrawWrapper />
        </div>

        <div
          style={{
            width: "20%",
            minWidth: 240,
            maxWidth: 500,
          }}
        >
          <MediaSidebar connected={connected} />
        </div>
      </div>

      <div>
        <MediaControlBar connected={connected} onConnect={onConnect} />
      </div>
    </div>
  );
};

export default Playground;
