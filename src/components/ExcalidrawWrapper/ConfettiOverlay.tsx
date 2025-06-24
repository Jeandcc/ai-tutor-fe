import React, { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";

import { useAICommand } from "../../hooks/useAICommand";

interface ConfettiCommand {
  duration?: string;
}

const ConfettiOverlay: React.FC = () => {
  const { connected, latestCommand } =
    useAICommand<ConfettiCommand>("THROW_CONFETTI");

  const [showConfetti, setShowConfetti] = useState(false);

  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const idOfLastCommand = useRef<null | string>();

  useEffect(() => {
    if (
      connected &&
      latestCommand &&
      idOfLastCommand.current !== latestCommand._feId
    ) {
      if (timeoutId.current) clearTimeout(timeoutId.current);

      const BASE_DURATION_MS = 4000;
      const extraDurationMS = parseFloat(latestCommand.duration || "1") * 1000;
      const totalConfettiDuration = BASE_DURATION_MS + extraDurationMS;

      setShowConfetti(true);

      idOfLastCommand.current = latestCommand._feId;
      timeoutId.current = setTimeout(
        () => setShowConfetti(false),
        totalConfettiDuration
      );
    }
  }, [latestCommand, connected]);

  return (
    <Confetti
      numberOfPieces={showConfetti ? 200 : 0}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
};

export default ConfettiOverlay;
