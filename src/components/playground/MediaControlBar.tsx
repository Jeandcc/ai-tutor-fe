"use client";

import { useState, useEffect } from "react";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  ChevronUp,
  ChevronDown,
  PowerOff,
} from "lucide-react";
import { ConnectionState, Track } from "livekit-client";
import {
  useMediaDeviceSelect,
  useTrackToggle,
  useConnectionState,
} from "@livekit/components-react";

import { LoadingSVG } from "@/components/button/LoadingSVG";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Device type for better type safety
interface MediaDevice {
  deviceId: string;
  label: string;
}

// Props for connection control
interface ConnectionControlProps {
  connected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

// Props for media device control
interface MediaDeviceControlProps {
  deviceType: "camera" | "microphone";
  enabled: boolean;
  devices: MediaDevice[];
  selectedDeviceId: string;
  onToggle: () => void;
  onDeviceChange: (deviceId: string) => void;
}

// Connection Control Subcomponent
const ConnectionControl: React.FC<ConnectionControlProps> = ({
  connected,
  isConnecting,
  onConnect,
  onDisconnect,
}) => {
  // Media device selectors
  const micDeviceSelector = useMediaDeviceSelect({ kind: "audioinput" });
  const cameraDeviceSelector = useMediaDeviceSelect({ kind: "videoinput" });

  // Track toggles
  const { enabled: micEnabled, toggle: toggleMic } = useTrackToggle({
    source: Track.Source.Microphone,
  });
  const { enabled: cameraEnabled, toggle: toggleCamera } = useTrackToggle({
    source: Track.Source.Camera,
  });
  const { enabled: screenShareEnabled, toggle: toggleScreenShare } =
    useTrackToggle({
      source: Track.Source.ScreenShare,
    });

  // Device state management
  const [selectedMicDeviceId, setSelectedMicDeviceId] = useState<string>("");
  const [selectedCameraDeviceId, setSelectedCameraDeviceId] =
    useState<string>("");

  // Device selection effects
  useEffect(() => {
    const activeDevice = micDeviceSelector.devices.find(
      (device) => device.deviceId === micDeviceSelector.activeDeviceId
    );
    if (activeDevice) {
      setSelectedMicDeviceId(activeDevice.deviceId);
    }
  }, [micDeviceSelector.devices, micDeviceSelector.activeDeviceId]);

  useEffect(() => {
    const activeDevice = cameraDeviceSelector.devices.find(
      (device) => device.deviceId === cameraDeviceSelector.activeDeviceId
    );
    if (activeDevice) {
      setSelectedCameraDeviceId(activeDevice.deviceId);
    }
  }, [cameraDeviceSelector.devices, cameraDeviceSelector.activeDeviceId]);

  // Device change handlers
  const handleMicrophoneChange = (deviceId: string) => {
    micDeviceSelector.setActiveMediaDevice(deviceId);
  };

  const handleCameraChange = (deviceId: string) => {
    cameraDeviceSelector.setActiveMediaDevice(deviceId);
  };

  const microphoneDevices = micDeviceSelector.devices;
  const cameraDevices = cameraDeviceSelector.devices;

  if (!connected) {
    return (
      <div className="flex justify-center w-full">
        <Button
          variant="default"
          onClick={onConnect}
          disabled={isConnecting}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-2 min-w-[120px] flex items-center justify-center gap-2"
        >
          {isConnecting ? (
            <>
              <LoadingSVG diameter={16} strokeWidth={2} />
              <span>Connecting...</span>
            </>
          ) : (
            "Connect"
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full">
      <MediaDeviceControl
        deviceType="camera"
        enabled={cameraEnabled}
        devices={cameraDevices}
        selectedDeviceId={selectedCameraDeviceId}
        onToggle={toggleCamera}
        onDeviceChange={handleCameraChange}
      />

      <MediaDeviceControl
        deviceType="microphone"
        enabled={micEnabled}
        devices={microphoneDevices}
        selectedDeviceId={selectedMicDeviceId}
        onToggle={toggleMic}
        onDeviceChange={handleMicrophoneChange}
      />

      <div className="flex items-center gap-3">
        <Button
          variant={screenShareEnabled ? "outline" : "ghost"}
          size="icon"
          onClick={() => toggleScreenShare}
          className={`rounded-full ${
            screenShareEnabled ? "text-black" : "text-gray-400 bg-gray-800/50"
          }`}
        >
          {screenShareEnabled ? (
            <Monitor size={20} />
          ) : (
            <MonitorOff size={20} />
          )}
        </Button>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">
            {screenShareEnabled ? `Sharing screen` : "Screen Share Off"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-2 sm:ml-4">
        <Button
          variant="destructive"
          size="sm"
          onClick={onDisconnect}
          className="rounded-md px-4 flex items-center gap-2"
        >
          <PowerOff size={16} />
          <span>Disconnect</span>
        </Button>
      </div>
    </div>
  );
};

// Media Device Control Subcomponent
const MediaDeviceControl: React.FC<MediaDeviceControlProps> = ({
  deviceType,
  enabled,
  devices,
  selectedDeviceId,
  onToggle,
  onDeviceChange,
}) => {
  const icons = {
    camera: { on: Camera, off: CameraOff },
    microphone: { on: Mic, off: MicOff },
  };

  const Icon = enabled ? icons[deviceType].on : icons[deviceType].off;

  return (
    <div className="flex items-center gap-3">
      <Button
        variant={enabled ? "outline" : "ghost"}
        size="icon"
        onClick={onToggle}
        className={`rounded-full ${
          enabled ? "text-black" : "text-gray-400 bg-gray-800/50"
        }`}
      >
        <Icon size={20} />
      </Button>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">
          {enabled
            ? `${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} On`
            : `${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)} Off`}
        </span>
        {devices.length > 0 && (
          <Select
            value={selectedDeviceId}
            onValueChange={onDeviceChange}
            disabled={!enabled}
          >
            <SelectTrigger className="h-7 w-[180px] text-xs bg-gray-800/50 border-gray-700">
              <SelectValue placeholder={`Select ${deviceType}`} />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.deviceId} value={device.deviceId}>
                  {device.label ||
                    `${
                      deviceType.charAt(0).toUpperCase() + deviceType.slice(1)
                    } ${devices.indexOf(device) + 1}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

// Main Media Control Bar Component
interface MediaControlBarProps {
  connected: boolean;
  onConnect: (connect: boolean, opts?: { token: string; url: string }) => void;
}

export function MediaControlBar({
  connected,
  onConnect,
}: MediaControlBarProps) {
  const [expanded, setExpanded] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectionState = useConnectionState();
  // Connection state effect
  useEffect(() => {
    setIsConnecting(connectionState === ConnectionState.Connecting);
  }, [connectionState]);

  // Connection handlers
  const handleConnect = () => {
    if (!connected) {
      setIsConnecting(true);
      onConnect(true);
    }
  };

  const handleDisconnect = () => {
    if (connected) {
      onConnect(false);
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm text-white z-50 
        transition-all duration-300 shadow-lg border-t border-gray-800 
        ${expanded ? "h-auto min-h-[5rem]" : "h-0"}`}
    >
      <div className="flex justify-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="bg-gray-800 px-4 py-1 rounded-t-md -mt-6 flex items-center gap-1 text-sm"
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {expanded && (
        <div className="max-w-7xl mx-auto p-4 w-full">
          <ConnectionControl
            connected={connected}
            isConnecting={isConnecting}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </div>
      )}
    </div>
  );
}
