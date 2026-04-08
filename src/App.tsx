import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/Dashboard';
import SchedulingSimulator from './pages/SchedulingSimulator';
import PageReplacementSimulator from './pages/PageReplacementSimulator';
import DeadlockSimulator from './pages/DeadlockSimulator';


const App: React.FC = () => {
  return (
    <Router>
      <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scheduling" element={<SchedulingSimulator />} />
            <Route path="/page-replacement" element={<PageReplacementSimulator />} />
            <Route path="/deadlock" element={<DeadlockSimulator />} />
            {/* Fallback for routes not yet implemented */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
      </Layout>
    </Router>
  );
};

export default App;
