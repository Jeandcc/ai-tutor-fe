import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useLatestCommand } from "../../hooks/useLatestCommand";

interface ConfettiCommand {
  duration?: string;
}

const ConfettiOverlay: React.FC = () => {
  const { connected, latestCommand } =
    useLatestCommand<ConfettiCommand>("THROW_CONFETTI");

  const [show, setShow] = useState(false);

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (connected && latestCommand) {
      setShow(true);
      if (timeoutId) clearTimeout(timeoutId);
      const duration = parseFloat(latestCommand.duration || "1") * 1000;
      const id = setTimeout(() => setShow(false), duration);
      setTimeoutId(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestCommand, connected]);

  if (!show) return null;

  return (
    <Confetti
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
