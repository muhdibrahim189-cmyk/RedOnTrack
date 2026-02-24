/**
 * Main App Component - Refactored
 * Central routing and configuration
 */

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Login, Dashboard, CameraMonitoring } from './pages';

// TODO: Import remaining pages when refactored
// import AccidentAnalysis from './pages/AccidentAnalysis';
// import RawDataCatalog from './pages/RawDataCatalog';
// import LoginHistory from './pages/LoginHistory';
// import SavedArchive from './pages/SavedArchive';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/monitoring" element={<CameraMonitoring />} />
          {/* TODO: Add remaining route pages */}
          {/* <Route path="/analysis" element={<AccidentAnalysis />} />
          <Route path="/archive" element={<SavedArchive />} />
          <Route path="/catalog" element={<RawDataCatalog />} />
          <Route path="/history" element={<LoginHistory />} /> */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
