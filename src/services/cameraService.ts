/**
 * Camera Service - Handles camera-related operations
 * Follows Single Responsibility Principle (SRP)
 */

import { CameraFeed } from '../domain';

class CameraService {
  /**
   * Get status color for display
   * Follows Open/Closed Principle (OCP) - can be extended for new statuses
   */
  getStatusColor(status: string): string {
    const statusColorMap: Record<string, string> = {
      active: 'bg-red-500',
      warning: 'bg-yellow-500',
      offline: 'bg-zinc-700',
    };

    return statusColorMap[status] || 'bg-zinc-500';
  }

  /**
   * Get status display text
   */
  getStatusText(status: string): string {
    const statusTextMap: Record<string, string> = {
      active: 'ACTIVE',
      warning: 'WARNING',
      offline: 'OFFLINE',
    };

    return statusTextMap[status] || 'UNKNOWN';
  }

  /**
   * Reorder cameras in list
   */
  reorderCameras(cameras: CameraFeed[], fromIndex: number, toIndex: number): CameraFeed[] {
    const newCameras = [...cameras];
    const [movedItem] = newCameras.splice(fromIndex, 1);
    newCameras.splice(toIndex, 0, movedItem);
    return newCameras;
  }

  /**
   * Move camera up
   */
  moveCameraUp(cameras: CameraFeed[], index: number): CameraFeed[] {
    if (index <= 0) return cameras;
    return this.reorderCameras(cameras, index, index - 1);
  }

  /**
   * Move camera down
   */
  moveCameraDown(cameras: CameraFeed[], index: number): CameraFeed[] {
    if (index >= cameras.length - 1) return cameras;
    return this.reorderCameras(cameras, index, index + 1);
  }

  /**
   * Filter cameras by status
   */
  filterCamerasByStatus(cameras: CameraFeed[], status: 'active' | 'warning' | 'offline'): CameraFeed[] {
    return cameras.filter((cam) => cam.status === status);
  }
}

export default new CameraService();
