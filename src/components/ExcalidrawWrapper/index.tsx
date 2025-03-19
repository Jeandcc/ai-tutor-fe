"use client";

import React, { useEffect, useRef, useState } from "react";

import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

import {
  useLocalParticipant,
  useConnectionState,
} from "@livekit/components-react";
import { ConnectionState, Track } from "livekit-client";

import "@excalidraw/excalidraw/index.css";

const ExcalidrawWrapper: React.FC = () => {
  // Ref for the Excalidraw container.
  const containerRef = useRef<HTMLDivElement>(null);

  // LiveKit hooks.
  const { localParticipant } = useLocalParticipant();
  const roomState = useConnectionState();

  // State to store the Excalidraw API and published video track.
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();

  const [publishedTrack, setPublishedTrack] = useState<MediaStreamTrack | null>(
    null
  );

  // Effect for publishing/unpublishing the canvas video track based on room connection.
  useEffect(() => {
    if (roomState !== ConnectionState.Connected) {
      // If not connected, unpublish and clean up.
      if (publishedTrack) {
        localParticipant.unpublishTrack(publishedTrack);
        publishedTrack.stop();
        setPublishedTrack(null);
      }

      return;
    }

    // If connected and we don't have a published track yet, initialize it.
    if (containerRef.current && !publishedTrack) {
      const excalidrawCanvas = containerRef.current.querySelector("canvas");
      if (!excalidrawCanvas) return;

      const stream = excalidrawCanvas.captureStream(30);
      const track = stream.getVideoTracks()[0];
      localParticipant.publishTrack(track, {
        name: "excalidraw",
        source: Track.Source.Unknown,
      });
      setPublishedTrack(track);
    }

    return () => {
      if (publishedTrack) {
        localParticipant.unpublishTrack(publishedTrack);
        publishedTrack.stop();
        setPublishedTrack(null);
      }
    };
  }, [roomState, excalidrawAPI, localParticipant, publishedTrack]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }}>
        <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api)} />
      </div>
    </div>
  );
};

export default ExcalidrawWrapper;
