import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import OSN2023Page from './pages/OSN2023Page';
import StatisticsPage from './components/StatisticsPage';
import ProblemAnalysis from './components/ProblemAnalysis';
import HandbookPage from './components/HandbookPage';
import { parseCSVData, Participant } from './utils/csvParser';

function App() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  
  useEffect(() => {
    // Load CSV data
    const loadData = async () => {
      try {
        const response = await fetch('/src/data/data_osn2023.csv');
        const csvText = await response.text();
        const parsedData = parseCSVData(csvText);
        setParticipants(parsedData);
      } catch (error) {
        console.error('Error loading CSV data:', error);
      }
    };
    
    loadData();
  }, []);
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/osn/2023" element={<OSN2023Page participants={participants} />} />
          <Route path="/osn/2023/statistics" element={<StatisticsPage participants={participants} />} />
          <Route path="/problem/:problemId" element={<ProblemAnalysis participants={participants} />} />
          <Route path="/handbook" element={<HandbookPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;