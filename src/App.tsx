/**
 * Main App Component - Refactored
 * Central routing and configuration
 */

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { 
  Login, 
  Dashboard, 
  CameraMonitoring, 
  AccidentAnalysis, 
  RawDataCatalog, 
  LoginHistory, 
  SavedArchive 
} from './pages';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/monitoring" element={<CameraMonitoring />} />
          <Route path="/analysis" element={<AccidentAnalysis />} />
          <Route path="/archive" element={<SavedArchive />} />
          <Route path="/catalog" element={<RawDataCatalog />} />
          <Route path="/history" element={<LoginHistory />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
