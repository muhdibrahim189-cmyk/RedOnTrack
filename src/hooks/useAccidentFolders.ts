/**
 * Hook for managing accident/footage related state
 * Follows the Custom Hook pattern for logic separation
 * Single Responsibility - manages only accident state
 */

import { useState, useCallback, useMemo } from 'react';
import { FootageFolder } from '../domain';
import { accidentService, storageService } from '../services';

interface UseAccidentFoldersReturn {
  folders: FootageFolder[];
  updateRemarks: (id: string, remarks: string) => void;
  toggleSave: (id: string) => void;
  getSavedFolders: () => FootageFolder[];
  updateFolders: (folders: FootageFolder[]) => void;
}

export function useAccidentFolders(initialFolders: FootageFolder[]): UseAccidentFoldersReturn {
  const [folders, setFolders] = useState<FootageFolder[]>(() =>
    storageService.getFootageFolders(initialFolders)
  );

  // Persist to localStorage whenever folders change
  const saveFolders = useCallback((newFolders: FootageFolder[]) => {
    storageService.saveFootageFolders(newFolders);
    setFolders(newFolders);
  }, []);

  const updateRemarks = useCallback(
    (id: string, newRemarks: string) => {
      const updated = folders.map((f) =>
        f.id === id ? accidentService.updateFolderRemarks(f, newRemarks) : f
      );
      saveFolders(updated);
    },
    [folders, saveFolders]
  );

  const toggleSave = useCallback(
    (id: string) => {
      const updated = folders.map((f) =>
        f.id === id ? accidentService.toggleFolderSaveStatus(f) : f
      );
      saveFolders(updated);
    },
    [folders, saveFolders]
  );

  const getSavedFolders = useCallback(() => {
    return storageService.getSavedFootageFolders(folders);
  }, [folders]);

  const updateFolders = useCallback(
    (newFolders: FootageFolder[]) => {
      saveFolders(newFolders);
    },
    [saveFolders]
  );

  return {
    folders,
    updateRemarks,
    toggleSave,
    getSavedFolders,
    updateFolders,
  };
}
