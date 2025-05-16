import React, { useEffect, useRef } from "react";

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

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatContainerLastScrollHeightRef = useRef<number | null>(null);

  /**
   * Enable microphone when connected
   */
  useEffect(() => {
    if (connected) {
      localParticipant.setMicrophoneEnabled(true);
    }
  }, [connected, localParticipant]);

  /**
   * Handles auto-scrolling functionality for the chat container.
   */
  useEffect(() => {
    const element = chatContainerRef.current;
    if (!element) {
      return;
    }

    const mutationCallback = () => {
      if (!chatContainerRef.current) return;

      const currentElement = chatContainerRef.current;
      const { scrollTop, scrollHeight, clientHeight } = currentElement;

      // Retrieve the scrollHeight from before the DOM mutation
      const prevScrollHeight = chatContainerLastScrollHeightRef.current;

      const toleranceInPx = 10;

      // Determine if the user was at the bottom before new content was added.
      // This is true if their previous scroll position + clientHeight was close to the previous scrollHeight.
      // If prevScrollHeight is null (e.g., first mutation), assume they were "at bottom" if not scrolled (scrollTop is 0).
      const wasAtBottom =
        prevScrollHeight === null
          ? scrollTop === 0 && clientHeight >= scrollHeight - toleranceInPx // Handles initial load/empty state
          : scrollTop + clientHeight >= prevScrollHeight - toleranceInPx;

      if (wasAtBottom) {
        currentElement.scrollTop = scrollHeight; // Scroll to the new bottom
      }

      chatContainerLastScrollHeightRef.current = scrollHeight;
    };

    chatContainerLastScrollHeightRef.current = element.scrollHeight;

    const observer = new MutationObserver(mutationCallback);
    observer.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      chatContainerLastScrollHeightRef.current = null;
    };
  }, []);

  return (
    <div
      className="bg-gray-900/90"
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          width: "30%",
          minWidth: 240,
          maxWidth: 500,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <MediaSidebar connected={connected} />
        </div>

        <div
          ref={chatContainerRef}
          style={{ flexGrow: 1, flexBasis: 0, overflow: "auto" }}
        >
          <ChatSidebar connected={connected} />
        </div>

        <div style={{ marginTop: "auto", flexShrink: 0 }}>
          <MediaControlBar connected={connected} onConnect={onConnect} />
        </div>
      </div>

      <div
        style={{
          flexGrow: 1,
        }}
      >
        <ExcalidrawWrapper />
      </div>
    </div>
  );
};

export default Playground;
