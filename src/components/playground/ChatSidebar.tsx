"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { ConnectionState } from "livekit-client";
import {
  useConnectionState,
  useVoiceAssistant,
} from "@livekit/components-react";
import { TranscriptionTile } from "@/transcriptions/TranscriptionTile";
import { useConfig } from "@/hooks/useConfig";

interface ChatSidebarProps {
  connected: boolean;
}

export function ChatSidebar({ connected }: ChatSidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [hasAudioTrack, setHasAudioTrack] = useState(false);

  const connectionState = useConnectionState();
  const voiceAssistant = useVoiceAssistant();
  const { config } = useConfig();

  // Check if audio track is available
  useEffect(() => {
    setHasAudioTrack(!!voiceAssistant.audioTrack);
  }, [voiceAssistant.audioTrack]);

  // If not connected or no audio track, don't render
  if (connectionState !== ConnectionState.Connected || !hasAudioTrack) {
    return null;
  }

  return (
    <div
      className={`fixed top-20 left-0 bottom-20 flex transition-all duration-300 z-40`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="self-center -mr-4 bg-gray-900 text-white p-1 rounded-r-md shadow-lg z-10 order-last"
        aria-label={expanded ? "Collapse chat" : "Expand chat"}
      >
        {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Sidebar content */}
      <div
        className={`flex flex-col bg-gray-900/90 backdrop-blur-sm rounded-r-md shadow-lg overflow-hidden transition-all duration-300 ${
          expanded ? "w-60 p-3" : "w-0"
        }`}
      >
        {
          <div
            className="flex flex-col h-full"
            style={{ display: expanded ? "flex" : "none" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <MessageSquare size={16} />
                <span>Chat & Transcription</span>
              </div>
            </div>

            <div className="flex-1 overflow-hidden rounded-md">
              {voiceAssistant.audioTrack && (
                <TranscriptionTile
                  agentAudioTrack={voiceAssistant.audioTrack}
                  accentColor={config.settings.theme_color}
                />
              )}
            </div>
          </div>
        }
      </div>
    </div>
  );
}
