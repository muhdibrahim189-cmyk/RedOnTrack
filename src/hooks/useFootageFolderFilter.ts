/**
 * Hook for filtering accident folders based on analytics dimensions
 * Single Responsibility - only handles filtering logic
 */

import { useMemo } from 'react';
import { FootageFolder } from '../domain';
import { accidentService } from '../services';

interface UseFootageFolderFilterReturn {
  filteredFolders: FootageFolder[];
}

export function useFootageFolderFilter(
  folders: FootageFolder[],
  selectedFilter: string | null,
  dimension: 'day' | 'time'
): UseFootageFolderFilterReturn {
  const filteredFolders = useMemo(() => {
    if (!selectedFilter) return folders;

    return folders.filter((folder) => {
      if (dimension === 'day') {
        return accidentService.filterFoldersByDay(folder, selectedFilter);
      } else {
        return accidentService.filterFoldersByTimeSlot(folder, selectedFilter);
      }
    });
  }, [selectedFilter, folders, dimension]);

  return { filteredFolders };
}
