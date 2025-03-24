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
} from "lucide-react";
import { Track } from "livekit-client";
import {
  useMediaDeviceSelect,
  useTrackToggle,
} from "@livekit/components-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MediaControlBarProps {
  connected: boolean;
  onConnect: (connect: boolean, opts?: { token: string; url: string }) => void;
}

export function MediaControlBar({
  connected,
  onConnect,
}: MediaControlBarProps) {
  const [expanded, setExpanded] = useState(true);

  const micDeviceSelector = useMediaDeviceSelect({ kind: "audioinput" });
  const [selectedMicDeviceId, setSelectedMicDeviceId] = useState<string>("");
  const { enabled: micEnabled, toggle: toggleMic } = useTrackToggle({
    source: Track.Source.Microphone,
  });
  const handleMicrophoneChange = async (deviceId: string) => {
    micDeviceSelector.setActiveMediaDevice(deviceId);
  };
  useEffect(() => {
    micDeviceSelector.devices.forEach((device) => {
      if (device.deviceId === micDeviceSelector.activeDeviceId) {
        setSelectedMicDeviceId(device.deviceId);
      }
    });
  }, [micDeviceSelector.devices, micDeviceSelector.activeDeviceId]);

  const cameraDeviceSelector = useMediaDeviceSelect({ kind: "videoinput" });
  const [selectedCameraDeviceId, setSelectedCameraDeviceId] =
    useState<string>("");
  const { enabled: cameraEnabled, toggle: toggleCamera } = useTrackToggle({
    source: Track.Source.Camera,
  });
  const handleCameraChange = async (deviceId: string) => {
    cameraDeviceSelector.setActiveMediaDevice(deviceId);
  };
  useEffect(() => {
    cameraDeviceSelector.devices.forEach((device) => {
      if (device.deviceId === cameraDeviceSelector.activeDeviceId) {
        setSelectedCameraDeviceId(device.deviceId);
      }
    });
  }, [cameraDeviceSelector.devices, cameraDeviceSelector.activeDeviceId]);

  const { enabled: screenShareEnabled, toggle: toggleScreenShare } =
    useTrackToggle({
      source: Track.Source.ScreenShare,
    });

  const microphoneDevices = micDeviceSelector.devices;
  const cameraDevices = cameraDeviceSelector.devices;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm text-white z-50 transition-all duration-300 shadow-lg border-t border-gray-800 ${
        expanded ? "h-20" : "h-0"
      }`}
    >
      <div className="flex justify-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="bg-gray-800 px-4 py-1 rounded-t-md -mt-6 flex items-center gap-1 text-sm"
        >
          {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          {/* {expanded ? "Hide controls" : "Show controls"} */}
        </button>
      </div>

      {expanded && (
        <div className="max-w-7xl mx-auto p-4">
          {!connected ? (
            <div className="flex justify-center">
              <Button
                variant={"default"}
                onClick={() => onConnect(!connected)}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-2"
              >
                Connect
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* Camera Control */}
              <div className="flex items-center gap-3">
                <Button
                  variant={cameraEnabled ? "outline" : "ghost"}
                  size="icon"
                  onClick={() => toggleCamera()}
                  className={`rounded-full ${
                    cameraEnabled
                      ? "text-black"
                      : "text-gray-400 bg-gray-800/50"
                  }`}
                >
                  {cameraEnabled ? (
                    <Camera size={20} />
                  ) : (
                    <CameraOff size={20} />
                  )}
                </Button>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {cameraEnabled ? "Camera On" : "Camera Off"}
                  </span>
                  {cameraDevices.length > 0 && (
                    <Select
                      value={selectedCameraDeviceId}
                      onValueChange={handleCameraChange}
                      disabled={!cameraEnabled}
                    >
                      <SelectTrigger className="h-7 w-[180px] text-xs bg-gray-800/50 border-gray-700">
                        <SelectValue placeholder="Select camera" />
                      </SelectTrigger>
                      <SelectContent>
                        {cameraDevices.map((device) => (
                          <SelectItem
                            key={device.deviceId}
                            value={device.deviceId}
                          >
                            {device.label ||
                              `Camera ${cameraDevices.indexOf(device) + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Microphone Control */}
              <div className="flex items-center gap-3">
                <Button
                  variant={micEnabled ? "outline" : "ghost"}
                  size="icon"
                  onClick={() => toggleMic()}
                  className={`rounded-full ${
                    micEnabled ? "text-black" : "text-gray-400 bg-gray-800/50"
                  }`}
                >
                  {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                </Button>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {micEnabled ? "Mic On" : "Mic Off"}
                  </span>

                  {microphoneDevices.length > 0 && (
                    <Select
                      value={selectedMicDeviceId}
                      onValueChange={handleMicrophoneChange}
                      disabled={!micEnabled}
                    >
                      <SelectTrigger className="h-7 w-[180px] text-xs bg-gray-800/50 border-gray-700">
                        <SelectValue placeholder="Select microphone" />
                      </SelectTrigger>

                      <SelectContent>
                        {microphoneDevices.map((device) => (
                          <SelectItem
                            key={device.deviceId}
                            value={device.deviceId}
                          >
                            {device.label ||
                              `Microphone ${
                                microphoneDevices.indexOf(device) + 1
                              }`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {/* Screen Share Control */}
              <div className="flex items-center gap-3">
                <Button
                  variant={screenShareEnabled ? "outline" : "ghost"}
                  size="icon"
                  onClick={() => toggleScreenShare()}
                  className={`rounded-full ${
                    screenShareEnabled
                      ? "text-black"
                      : "text-gray-400 bg-gray-800/50"
                  }`}
                >
                  {screenShareEnabled ? (
                    <Monitor size={20} />
                  ) : (
                    <MonitorOff size={20} />
                  )}
                </Button>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {screenShareEnabled ? `Sharing screen` : "Screen Share Off"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
