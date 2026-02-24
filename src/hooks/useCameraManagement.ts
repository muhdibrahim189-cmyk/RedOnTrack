/**
 * Hook for managing camera list and operations
 * Follows Single Responsibility - only handles camera state
 */

import { useState, useCallback } from 'react';
import { CameraFeed } from '../domain';
import { cameraService } from '../services';

interface UseCameraManagementReturn {
  cameras: CameraFeed[];
  moveCameraUp: (index: number) => void;
  moveCameraDown: (index: number) => void;
  setFullscreenIndex: (index: number | null) => void;
  fullscreenIndex: number | null;
  currentFullscreenCamera: CameraFeed | null;
}

export function useCameraManagement(
  initialCameras: CameraFeed[]
): UseCameraManagementReturn {
  const [cameras, setCameras] = useState<CameraFeed[]>(initialCameras);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const handleMoveUp = useCallback((index: number) => {
    setCameras((prev) => cameraService.moveCameraUp(prev, index));
  }, []);

  const handleMoveDown = useCallback((index: number) => {
    setCameras((prev) => cameraService.moveCameraDown(prev, index));
  }, []);

  const currentFullscreenCamera =
    fullscreenIndex !== null ? cameras[fullscreenIndex] : null;

  return {
    cameras,
    moveCameraUp: handleMoveUp,
    moveCameraDown: handleMoveDown,
    setFullscreenIndex,
    fullscreenIndex,
    currentFullscreenCamera,
  };
}
