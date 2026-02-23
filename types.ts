
export interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'warning' | 'offline';
  lastUpdate: string;
}

export interface AccidentReport {
  id: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  location: string;
}

export interface CameraFile {
  id: string;
  name: string;
  size: string;
  resolution: string;
  timestamp: string;
}

export interface DayFolder {
  id: string;
  date: string;
  day: string;
  totalSize: string;
  files: CameraFile[];
}

export interface CatalogItem {
  id: string;
  date: string;
  size: string;
  type: string;
  camera: string;
}

export interface FootageFolder {
  id: string;
  date: string; // DD/MM/YYYY
  day: string;
  time: string;
  platform: string;
  remarks: string;
  cameras: string[];
  saved: boolean;
}

export interface AccidentStat {
  label: string;
  value: number;
}

export interface LoginHistoryEntry {
  no: number;
  name: string;
  id: string;
  position: string;
  loginTime: string;
  signOutTime: string;
}
