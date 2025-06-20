import React from "react";
import { useConnectionState, useTextStream } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";

// TODO: Add a random id to each command that comes in for usage in
// hook-callers

export function useLatestCommand<T = any>(
  commandType: string
): {
  connected: boolean;
  latestCommand: T | null;
} {
  const roomState = useConnectionState();
  const { textStreams } = useTextStream(commandType);

  const latest = textStreams.at(-1);
  let parsed: T | null = null;
  try {
    parsed = latest ? JSON.parse(latest.text) : null;
  } catch {
    parsed = null;
  }

  return {
    connected: roomState === ConnectionState.Connected,
    latestCommand: parsed,
  };
}
