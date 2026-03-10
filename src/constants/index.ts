/**
 * Constants and data for the application
 * Organized by domain for clarity
 */

import { FootageFolder, AccidentStat, CameraFeed } from '../domain';

// ============ Camera Constants ============
export const INITIAL_CAMERA_FEEDS: CameraFeed[] = [
  { 
    id: '1', 
    name: 'Platform 1', 
    location: 'TERMINAL NORTH', 
    status: 'active', 
    lastUpdate: 'NOW',
    videoUrl: 'https://www.youtube.com/embed/ODX_KLJ-WuQ?si=DChd6K3K3v5F5Vok&start=1&autoplay=1&mute=1&controls=0&loop=1&playlist=ODX_KLJ-WuQ'
  },
  { 
    id: '2', 
    name: 'Platform 2', 
    location: 'TERMINAL SOUTH', 
    status: 'active', 
    lastUpdate: 'NOW',
    videoUrl: 'https://www.youtube.com/embed/USnAw4e1tyE?si=h_4SXyPy5kt3UA-y&start=1&autoplay=1&mute=1&controls=0&loop=1&playlist=USnAw4e1tyE'
  },
  { 
    id: '3', 
    name: 'Platform 3', 
    location: 'WEST WING', 
    status: 'active', 
    lastUpdate: 'NOW',
    videoUrl: 'https://www.youtube.com/embed/67CK7EeLIaA?si=7waqhUiuhXd7tnzE&start=1&autoplay=1&mute=1&controls=0&loop=1&playlist=67CK7EeLIaA'
  },
  { 
    id: '4', 
    name: 'Platform 4', 
    location: 'EAST CROSSING', 
    status: 'active', 
    lastUpdate: 'NOW',
    videoUrl: 'https://www.youtube.com/embed/wLeSf-T1-tQ?si=1xdOkVP_uSUDxSqH&start=1&autoplay=1&mute=1&controls=0&loop=1&playlist=wLeSf-T1-tQ'
  },
];

export const MAIN_FEED: CameraFeed = {
  id: '1',
  name: 'Platform 1 (MAIN)',
  location: 'TERMINAL NORTH',
  status: 'active',
  lastUpdate: 'NOW',
  videoUrl: 'https://www.youtube.com/embed/ODX_KLJ-WuQ?si=DChd6K3K3v5F5Vok&start=1&autoplay=1&mute=1&controls=0&loop=1&playlist=ODX_KLJ-WuQ'
};

// ============ Accident/Footage Constants ============
export const INITIAL_MOCK_FOLDERS: FootageFolder[] = [
  {
    id: 'F-001',
    date: '22/05/2024',
    day: 'Wednesday',
    time: '14:30',
    platform: 'Platform 2',
    remarks: 'Passenger slip near escalator. Medical team responded in 2 mins.',
    cameras: ['CAM-02', 'CAM-05'],
    saved: true,
  },
  {
    id: 'F-002',
    date: '19/05/2024',
    day: 'Sunday',
    time: '02:45',
    platform: 'Platform 4',
    remarks: 'Unauthorized track access. Trespasser fled toward North Exit.',
    cameras: ['CAM-04', 'CAM-08', 'CAM-09'],
    saved: false,
  },
  {
    id: 'F-003',
    date: '15/05/2024',
    day: 'Wednesday',
    time: '08:15',
    platform: 'Platform 1',
    remarks: 'Heavy congestion leading to minor collision between commuters.',
    cameras: ['CAM-01'],
    saved: true,
  },
  {
    id: 'F-004',
    date: '10/05/2024',
    day: 'Friday',
    time: '18:50',
    platform: 'Platform 3',
    remarks: 'Luggage left unattended for 20 mins. Bomb squad cleared.',
    cameras: ['CAM-03', 'CAM-07'],
    saved: false,
  },
  {
    id: 'F-005',
    date: '24/05/2024',
    day: 'Friday',
    time: '19:20',
    platform: 'Platform 2',
    remarks: 'Drunk passenger near platform edge. Escorted by security.',
    cameras: ['CAM-02'],
    saved: false,
  },
  {
    id: 'F-006',
    date: '20/05/2024',
    day: 'Monday',
    time: '07:45',
    platform: 'Platform 1',
    remarks: 'Technical fault on platform doors reported.',
    cameras: ['CAM-01', 'CAM-02'],
    saved: true,
  },
];

// ============ Analytics Constants ============
export const MONTHLY_DAY_STATS: AccidentStat[] = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 8 },
  { label: 'Wed', value: 22 },
  { label: 'Thu', value: 14 },
  { label: 'Fri', value: 28 },
  { label: 'Sat', value: 32 },
  { label: 'Sun', value: 10 },
];

export const MONTHLY_TIME_STATS: AccidentStat[] = [
  { label: '06-12', value: 45 },
  { label: '12-18', value: 62 },
  { label: '18-00', value: 88 },
  { label: '00-06', value: 15 },
];

// ============ UI Constants ============
import logo from '../assets/logo.png';

export const BRANDING = {
  logoUrl: logo,
  name: 'RedOnTrack',
  accentColor: 'red-600',
  tagline: 'Next-Gen Railway Intelligence',
};

export const SCROLL_CONFIG = {
  START_TOP: 32,
  END_TOP: 32,
  SCROLL_RANGE: 300,
};
