"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Mic,
  Monitor,
  Camera,
  X,
} from "lucide-react";
import { LocalParticipant, Track } from "livekit-client";
import {
  BarVisualizer,
  VideoTrack,
  useTrackToggle,
  useTracks,
  useVoiceAssistant,
} from "@livekit/components-react";

interface MediaSidebarProps {
  connected: boolean;
}

export function MediaSidebar({ connected }: MediaSidebarProps) {
  const [expanded, setExpanded] = useState(false);

  const voiceAssistant = useVoiceAssistant();
  const tracks = useTracks();

  const localTracks = tracks.filter(
    ({ participant }) => participant instanceof LocalParticipant
  );
  const localCameraTrack = localTracks.find(
    ({ source }) => source === Track.Source.Camera
  );
  const localCameraTrackToggle = useTrackToggle({
    source: Track.Source.Camera,
  });

  const localMicTrack = localTracks.find(
    ({ source }) => source === Track.Source.Microphone
  );
  const localMicTrackToggle = useTrackToggle({
    source: Track.Source.Microphone,
  });

  const localScreenShareTrack = localTracks.find(
    ({ source }) => source === Track.Source.ScreenShare
  );
  const localScreenShareTrackToggle = useTrackToggle({
    source: Track.Source.ScreenShare,
  });

  const localCanvasTrack = localTracks.find(
    ({ publication }) => publication.trackName === "excalidraw"
  );

  // Code below dictates the auto open/close of the sidebar based on active tracks.
  const prevTracksCountRef = useRef(0);
  useEffect(() => {
    const availableTracksOfInterest = [
      { track: voiceAssistant.audioTrack, toggle: undefined },
      { track: localCameraTrack, toggle: localCameraTrackToggle },
      { track: localMicTrack, toggle: localMicTrackToggle },
      { track: localScreenShareTrack, toggle: localScreenShareTrackToggle },
    ].filter(({ toggle, track }) => {
      return !!track && (!toggle || toggle.enabled);
    });

    const newCountOfAvailableTracks = availableTracksOfInterest.length;
    const prevCount = prevTracksCountRef.current;

    // If new tracks were added, force-expand the sidebar.
    if (newCountOfAvailableTracks > prevCount) {
      setExpanded(true);
    }
    // If no tracks are active, collapse the sidebar.
    else if (newCountOfAvailableTracks === 0) {
      setExpanded(false);
    }

    // If tracks are removed (currentCount < prevCount), do nothing to prevent auto-expansion
    // and allow manual control (e.g., via the toggle).
    prevTracksCountRef.current = newCountOfAvailableTracks;
  }, [
    voiceAssistant.audioTrack,
    localCameraTrack,
    localCameraTrackToggle,
    localMicTrack,
    localMicTrackToggle,
    localScreenShareTrack,
    localScreenShareTrackToggle,
  ]);

  if (!connected) {
    return null;
  }

  return (
    <div
      className={`fixed top-20 right-0 bottom-20 flex transition-all duration-300 z-40`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="self-center -ml-4 bg-gray-900 text-white p-1 rounded-l-md shadow-lg z-10"
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {expanded ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Sidebar content */}
      <div
        className={`flex flex-col gap-3 bg-gray-900/90 backdrop-blur-sm rounded-l-md shadow-lg overflow-hidden transition-all duration-300 ${
          expanded ? "w-40 p-3" : "w-0"
        }`}
      >
        {!!voiceAssistant.audioTrack && (
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 text-white text-xs font-medium">
                <Mic size={14} />
                <span>Tutor Audio</span>
              </div>
            </div>
            <div className="bg-gray-800 rounded-md p-2 h-20 flex items-center justify-center overflow-hidden">
              <div className="[--lk-va-bar-width:6px] [--lk-va-bar-gap:4px] [--lk-fg:var(--lk-theme-color)] w-full h-full flex items-center justify-center">
                <BarVisualizer
                  state={voiceAssistant.state}
                  trackRef={voiceAssistant.audioTrack}
                  barCount={10}
                  options={{ minHeight: 5 }}
                />
              </div>
            </div>
          </div>
        )}

        {!!localMicTrack && !!localMicTrackToggle.enabled && (
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 text-white text-xs font-medium">
                <Mic size={14} />
                <span>Input Audio</span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-md p-2 h-20 flex items-center justify-center overflow-hidden">
              <div className="[--lk-va-bar-width:6px] [--lk-va-bar-gap:4px] [--lk-fg:var(--lk-theme-color)] w-full h-full flex items-center justify-center">
                <BarVisualizer
                  trackRef={localMicTrack}
                  barCount={10}
                  options={{ minHeight: 5 }}
                />
              </div>
            </div>
          </div>
        )}

        {!!localScreenShareTrack && !!localScreenShareTrackToggle.enabled && (
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 text-white text-xs font-medium">
                <Monitor size={14} />
                <span>Screen Share</span>
              </div>
            </div>
            <div className="bg-gray-800 rounded-md overflow-hidden aspect-video">
              <VideoTrack
                trackRef={localScreenShareTrack}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {!!localCameraTrack && !!localCameraTrackToggle.enabled && (
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 text-white text-xs font-medium">
                <Camera size={14} />
                <span>Camera</span>
              </div>
            </div>
            <div className="bg-gray-800 rounded-md overflow-hidden aspect-video">
              <VideoTrack
                trackRef={localCameraTrack}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {!!localCanvasTrack && (
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1 text-white text-xs font-medium">
                <Camera size={14} />
                <span>Whiteboard</span>
              </div>
            </div>
            <div className="bg-gray-800 rounded-md overflow-hidden aspect-video">
              <VideoTrack
                trackRef={localCanvasTrack}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
