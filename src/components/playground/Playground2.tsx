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
    <div style={{ height: "100%", width: "100%" }}>
      <ExcalidrawWrapper />

      <MediaControlBar connected={connected} onConnect={onConnect} />

      <MediaSidebar connected={connected} />

      <ChatSidebar connected={connected} />
    </div>
  );
};

export default Playground;
