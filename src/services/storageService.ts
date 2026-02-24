/**
 * Storage Service - Handles all localStorage operations
 * Follows Single Responsibility Principle (SRP)
 * Provides abstraction over localStorage API
 */

import { FootageFolder } from '../domain';

class StorageService {
  private readonly STORAGE_KEYS = {
    FOOTAGE_FOLDERS: 'footage_folders',
    USER_SESSION: 'user_session',
    CAMERA_LAYOUT: 'camera_layout',
  };

  /**
   * Save footage folders to localStorage
   */
  saveFootageFolders(folders: FootageFolder[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.FOOTAGE_FOLDERS, JSON.stringify(folders));
    } catch (error) {
      console.error('Failed to save footage folders:', error);
    }
  }

  /**
   * Retrieve footage folders from localStorage
   */
  getFootageFolders(defaultFolders: FootageFolder[]): FootageFolder[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEYS.FOOTAGE_FOLDERS);
      return stored ? JSON.parse(stored) : defaultFolders;
    } catch (error) {
      console.error('Failed to retrieve footage folders:', error);
      return defaultFolders;
    }
  }

  /**
   * Get only saved footage folders
   */
  getSavedFootageFolders(allFolders: FootageFolder[]): FootageFolder[] {
    return allFolders.filter((f) => f.saved);
  }

  /**
   * Delete a specific footage folder
   */
  deleteFottageFolderByKey(key: string, folders: FootageFolder[]): FootageFolder[] {
    const updated = folders.filter((f) => f.id !== key);
    this.saveFootageFolders(updated);
    return updated;
  }

  /**
   * Clear all storage
   */
  clearAll(): void {
    try {
      Object.values(this.STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
}

export default new StorageService();
