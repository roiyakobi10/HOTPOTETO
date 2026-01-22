
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<div className="flex items-center justify-center h-screen font-bold text-2xl text-white">404 - לא נמצא</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
