import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import OSN2023Page from './pages/OSN2023Page';
import OSNYearPage from './pages/OSNYearPage';
import StatisticsPage from './components/StatisticsPage';
import ProblemAnalysis from './components/ProblemAnalysis';
import HandbookPage from './components/HandbookPage';
import { parseCSVData, Participant } from './utils/csvParser';

function App() {
  const [participantsByYear, setParticipantsByYear] = useState<Record<string, Participant[]>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load CSV data for all years
    const loadData = async () => {
      try {
        const years = ['2020', '2021', '2022', '2023', '2024'];
        const allData: Record<string, Participant[]> = {};
        
        for (const year of years) {
          try {
            const response = await fetch(`/data/data_osn${year}.csv`);
            const csvText = await response.text();
            const parsedData = parseCSVData(csvText);
            allData[year] = parsedData;
          } catch (error) {
            console.error(`Error loading data for ${year}:`, error);
            allData[year] = [];
          }
        }
        
        setParticipantsByYear(allData);
      } catch (error) {
        console.error('Error loading CSV data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading OSN data...</p>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage participantsByYear={participantsByYear} />} />
            <Route path="/osn/2023" element={<OSN2023Page participants={participantsByYear['2023'] || []} />} />
            <Route path="/osn/:year" element={<OSNYearPage participantsByYear={participantsByYear} />} />
            <Route path="/osn/:year/statistics" element={<StatisticsPage participantsByYear={participantsByYear} />} />
            <Route path="/problem/:problemId/:year?" element={<ProblemAnalysis participantsByYear={participantsByYear} />} />
            <Route path="/handbook" element={<HandbookPage />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;