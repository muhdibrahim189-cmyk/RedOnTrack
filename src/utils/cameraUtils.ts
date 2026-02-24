/**
 * Camera utility functions
 * Pure functions for camera operations
 */

import { CameraFeed } from '../domain';

export const generateMockCatalog = (): any[] => {
  const folders: any[] = [];
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  for (let i = 0; i < 7; i++) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - i);

    const dayName = days[targetDate.getDay()];
    const dateStr = targetDate.toLocaleDateString('en-GB'); // DD/MM/YYYY
    const folderId = `FOLDER-${i + 1}`;

    const files = [
      {
        id: `${folderId}-C1`,
        name: 'Camera 1 (Platform 1)',
        size: '12.4 GB',
        resolution: '4K',
        timestamp: '00:00 - 23:59',
      },
      {
        id: `${folderId}-C2`,
        name: 'Camera 2 (Platform 2)',
        size: '11.8 GB',
        resolution: '4K',
        timestamp: '00:00 - 23:59',
      },
      {
        id: `${folderId}-C3`,
        name: 'Camera 3 (Platform 3)',
        size: '13.1 GB',
        resolution: '4K',
        timestamp: '00:00 - 23:59',
      },
      {
        id: `${folderId}-C4`,
        name: 'Camera 4 (Platform 4)',
        size: '12.9 GB',
        resolution: '4K',
        timestamp: '00:00 - 23:59',
      },
    ];

    folders.push({
      id: folderId,
      date: dateStr,
      day: dayName,
      totalSize: '50.2 GB',
      files,
    });
  }
  return folders;
};

export const getCameraFeedById = (cameras: CameraFeed[], id: string): CameraFeed | undefined => {
  return cameras.find((cam) => cam.id === id);
};
