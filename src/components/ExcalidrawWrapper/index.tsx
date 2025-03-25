import React, { useEffect, useRef, useState } from "react";
import { ShieldQuestion } from "lucide-react";

import { Excalidraw, WelcomeScreen } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

import {
  useLocalParticipant,
  useConnectionState,
} from "@livekit/components-react";
import { ConnectionState, Track } from "livekit-client";
import Image from "next/image";
import { useRouter } from "next/router";

const ExcalidrawWrapper: React.FC = () => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();

  const excalidrawContainerRef = useRef<HTMLDivElement>(null);
  const publishingCanvasRef = useRef<HTMLCanvasElement>(null);
  const shouldUpdatePublishingCanvasRef = useRef(false);
  const prevCanvasStateRef = useRef<string>("");

  const publishingMediaStreamTrackRef = useRef<MediaStreamTrack | null>(null);

  const { localParticipant } = useLocalParticipant();
  const roomState = useConnectionState();

  const canvasUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Effect to handle publishing the canvas track when connected,
  // and cleaning up when disconnected or unmounted.
  useEffect(() => {
    const updatePublishingCanvas = async () => {
      if (
        !excalidrawContainerRef.current ||
        !publishingCanvasRef.current ||
        !shouldUpdatePublishingCanvasRef.current
      )
        return;

      // Copies the current Excalidraw canvas to the hidden canvas.
      const ctx = publishingCanvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(
          0,
          0,
          publishingCanvasRef.current.width,
          publishingCanvasRef.current.height
        );
        ctx.drawImage(
          excalidrawContainerRef.current.querySelector(
            "canvas"
          ) as HTMLCanvasElement,
          0,
          0,
          publishingCanvasRef.current.width,
          publishingCanvasRef.current.height
        );

        shouldUpdatePublishingCanvasRef.current = false;
      }
    };

    const setupMediaStreamIfNotAlreadyUp = () => {
      // If connected, set up the hidden canvas dimensions.
      if (
        publishingCanvasRef.current &&
        !publishingMediaStreamTrackRef.current
      ) {
        // Capture the canvas stream (30 fps is used here; adjust if needed)
        const stream = publishingCanvasRef.current.captureStream(30);
        const track = stream.getVideoTracks()[0];

        // Publish the captured video track with a custom name.
        localParticipant.publishTrack(track, {
          name: "excalidraw",
          source: Track.Source.Unknown,
        });

        publishingMediaStreamTrackRef.current = track;
      }
    };

    const clearMediaStream = () => {
      if (publishingMediaStreamTrackRef.current) {
        localParticipant.unpublishTrack(publishingMediaStreamTrackRef.current);
        publishingMediaStreamTrackRef.current.stop();
        publishingMediaStreamTrackRef.current = null;
      }
    };

    const setupCanvasUpdateIntervalIfNotAlreadyUp = () => {
      // Start the interval to update the publishing canvas if the Excalidraw API is available.
      if (!canvasUpdateIntervalRef.current) {
        canvasUpdateIntervalRef.current = setInterval(
          updatePublishingCanvas,
          1000 / 30
        );
      }
    };

    const clearCanvasUpdateInterval = () => {
      // Clear the interval if it exists.
      if (canvasUpdateIntervalRef.current) {
        clearInterval(canvasUpdateIntervalRef.current);
        canvasUpdateIntervalRef.current = null;
      }
    };

    const cleanup = () => {
      clearMediaStream();
      clearCanvasUpdateInterval();
    };

    // When the room is not connected, cleanup any published track and clear the update interval.
    if (roomState !== ConnectionState.Connected) {
      cleanup();
      return;
    }

    setupMediaStreamIfNotAlreadyUp();
    setupCanvasUpdateIntervalIfNotAlreadyUp();

    // Cleanup function: clear the interval and unpublish the track.
    return () => {
      cleanup();
    };
  }, [roomState, localParticipant]);

  const { query } = useRouter();
  const tutorName =
    query.tutor === "ondre"
      ? "Ondre"
      : query.tutor === "ryan"
      ? "Ryan"
      : "Learner";

  useEffect(() => {
    if (excalidrawAPI) {
      excalidrawAPI.onChange((_, state) => {
        const newStateJson = JSON.stringify(state);
        const prevStateJson = prevCanvasStateRef.current;

        if (newStateJson === prevStateJson) {
          return;
        } else {
          prevCanvasStateRef.current = newStateJson;
          shouldUpdatePublishingCanvasRef.current = true;
        }
      });
    }
  }, [excalidrawAPI]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div
        ref={excalidrawContainerRef}
        style={{ height: "100%", width: "100%" }}
      >
        <Excalidraw excalidrawAPI={(api) => setExcalidrawAPI(api)}>
          <WelcomeScreen>
            <WelcomeScreen.Center>
              <WelcomeScreen.Center.Logo>
                <Image
                  src="https://cdn.prod.website-files.com/600f0ea5652fe47991474630/602428438327a78cb4e7fcb3_learnerlogo.svg"
                  alt="Learner Logo"
                  width={200}
                  height={200}
                />
              </WelcomeScreen.Center.Logo>
              <WelcomeScreen.Center.Heading>
                AI Tutor - {tutorName}
              </WelcomeScreen.Center.Heading>

              <WelcomeScreen.Center.Menu>
                <WelcomeScreen.Center.MenuItemLink
                  icon={<ShieldQuestion size={20} />}
                  href="https://www.notion.so/Guide-page-1c10b86d6e8e80ef99e9f853aced27e3?pvs=4"
                >
                  How to use the tool
                </WelcomeScreen.Center.MenuItemLink>

                <WelcomeScreen.Center.MenuItemHelp />
              </WelcomeScreen.Center.Menu>
            </WelcomeScreen.Center>

            <WelcomeScreen.Hints.MenuHint />
            <WelcomeScreen.Hints.ToolbarHint />
            <WelcomeScreen.Hints.HelpHint />
          </WelcomeScreen>
        </Excalidraw>
      </div>

      {/* Hidden canvas used to publish the video track */}
      <canvas ref={publishingCanvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default ExcalidrawWrapper;
