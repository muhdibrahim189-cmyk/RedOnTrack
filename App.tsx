
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AccidentAnalysis from './pages/AccidentAnalysis';
import RawDataCatalog from './pages/RawDataCatalog';
import LoginHistory from './pages/LoginHistory';
import CameraMonitoring from './pages/CameraMonitoring';
import SavedArchive from './pages/SavedArchive';

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
