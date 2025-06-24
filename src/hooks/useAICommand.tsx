import React, { useEffect, useState } from "react";
import { useConnectionState, useTextStream } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { v4 as uuid } from "uuid";

export function useAICommand<T extends Object>(commandType: string) {
  const roomState = useConnectionState();
  const { textStreams } = useTextStream(commandType);

  const [latestCommand, setLatestCommand] = useState<
    (T & { _feId: string }) | null
  >(null);

  useEffect(() => {
    console.log("TextStreams changed: -> ", textStreams);
  }, [textStreams]);

  useEffect(() => {
    const latest = textStreams.at(-1);

    let parsed: (T & { _feId: string }) | null = null;
    try {
      parsed = latest ? JSON.parse(latest.text) : null;
    } catch {
      parsed = null;
    }

    if (parsed) {
      parsed._feId = uuid();
    }

    setLatestCommand(parsed);
  }, [textStreams]);

  return {
    connected: roomState === ConnectionState.Connected,
    latestCommand: latestCommand,
  };
}
