import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Participant, calculateProblemStats, calculateMedalCutoffs } from '../utils/csvParser';
import { BarChart3, Trophy, Users } from 'lucide-react';

interface ProblemAnalysisProps {
  participantsByYear: Record<string, Participant[]>;
}

const ProblemAnalysis: React.FC<ProblemAnalysisProps> = ({ participantsByYear }) => {
  const { problemId, year } = useParams<{ problemId: string; year?: string }>();
  const currentYear = year || '2023'; // Default to 2023 for backward compatibility
  
  if (!participantsByYear[currentYear]) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Year not found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  const participants = participantsByYear[currentYear];
  const problemStats = calculateProblemStats(participants);
  const medalCutoffs = calculateMedalCutoffs(participants);
  
  if (!problemId || !problemStats[problemId]) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Problem not found</h1>
          <Link to={`/osn/${currentYear}/statistics`} className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            ← Back to Statistics
          </Link>
        </div>
      </div>
    );
  }
  
  const stats = problemStats[problemId];
  
  // Get unique scores that participants actually achieved
  const participantScores = participants
    .map(p => p.scores[problemId as keyof typeof p.scores])
    .filter(score => score !== null)
    .map(score => score as number);
  
  const uniqueParticipantScores = [...new Set(participantScores)];
  
  // Always include 0 and 100 as reference points
  const allScores = new Set([0, 100, ...uniqueParticipantScores]);
  const sortedScores = Array.from(allScores).sort((a, b) => a - b);
  
  const graphData = sortedScores.map(score => ({
    score,
    participants: stats.suffixCounts[score] || 0
  }));
  
  const getCutoffMedal = (score: number) => {
    if (score >= medalCutoffs.gold) return 'Gold';
    if (score >= medalCutoffs.silver) return 'Silver';
    if (score >= medalCutoffs.bronze) return 'Bronze';
    return 'No Medal';
  };
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link 
          to={`/osn/${currentYear}/statistics`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Statistics
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mt-2">Problem {problemId}</h1>
        <p className="text-gray-600 mt-2">OSN {currentYear} Analysis</p>
      </div>
      
      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center mb-2">
            <Trophy className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-sm font-medium text-green-800">Perfect Scores</h3>
          </div>
          <p className="text-3xl font-bold text-green-900">{stats.perfectScores}</p>
          <p className="text-sm text-green-700">out of {stats.totalParticipants}</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
          <div className="flex items-center mb-2">
            <BarChart3 className="h-6 w-6 text-yellow-600 mr-2" />
            <h3 className="text-sm font-medium text-yellow-800">Top 10 Cutoff</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-900">{stats.top10} pts</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center mb-2">
            <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-sm font-medium text-blue-800">Top 25 Cutoff</h3>
          </div>
          <p className="text-3xl font-bold text-blue-900">{stats.top25} pts</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center mb-2">
            <BarChart3 className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-sm font-medium text-purple-800">Top 40 Cutoff</h3>
          </div>
          <p className="text-3xl font-bold text-purple-900">{stats.top40} pts</p>
        </div>
      </div>
      
      {/* Score Distribution Graph */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Score Distribution - Participants with Score ≥ X
        </h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="score" 
                label={{ value: 'Minimum Score', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                label={{ value: 'Number of Participants', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value} participants`, 'Count']}
                labelFormatter={(score: number) => `Score ≥ ${score}`}
              />
              <Line 
                type="monotone" 
                dataKey="participants" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProblemAnalysis;