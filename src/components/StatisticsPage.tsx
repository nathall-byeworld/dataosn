import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Participant, calculateProblemStats, calculateMedalCutoffs } from '../utils/csvParser';
import { Trophy, Award, Star } from 'lucide-react';

interface StatisticsPageProps {
  participantsByYear: Record<string, Participant[]>;
}

const StatisticsPage: React.FC<StatisticsPageProps> = ({ participantsByYear }) => {
  const { year } = useParams<{ year: string }>();
  
  if (!year || !participantsByYear[year]) {
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
  
  const participants = participantsByYear[year];
  const problemStats = calculateProblemStats(participants);
  const medalCutoffs = calculateMedalCutoffs(participants);
  const problems = ['1A', '1B', '1C', '2A', '2B', '2C'];
  
  const getCutoffMedal = (score: number) => {
    if (score >= medalCutoffs.gold) return 'Gold';
    if (score >= medalCutoffs.silver) return 'Silver';
    if (score >= medalCutoffs.bronze) return 'Bronze';
    return '-';
  };
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link 
          to={`/osn/${year}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to OSN {year} Results
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">OSN {year} Statistics</h1>
      </div>
      
      {/* Medal Cutoffs */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-yellow-600" />
          Medal Cutoffs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🥇</span>
              <h3 className="text-lg font-semibold text-yellow-800">Gold Medal</h3>
            </div>
            <p className="text-3xl font-bold text-yellow-900">{medalCutoffs.gold}+</p>
            <p className="text-sm text-yellow-700">{medalCutoffs.goldCount} recipients</p>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🥈</span>
              <h3 className="text-lg font-semibold text-gray-800">Silver Medal</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{medalCutoffs.silver}+</p>
            <p className="text-sm text-gray-700">{medalCutoffs.silverCount} recipients</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🥉</span>
              <h3 className="text-lg font-semibold text-orange-800">Bronze Medal</h3>
            </div>
            <p className="text-3xl font-bold text-orange-900">{medalCutoffs.bronze}+</p>
            <p className="text-sm text-orange-700">{medalCutoffs.bronzeCount} recipients</p>
          </div>
        </div>
      </div>
      
      {/* Problem Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Award className="h-6 w-6 mr-2 text-blue-600" />
          Problem Analysis
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Problem
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perfect Scores
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Top 10 Cutoff
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Top 25 Cutoff
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Top 40 Cutoff
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {problems.map((problem) => {
                const stats = problemStats[problem];
                return (
                  <tr key={problem} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/problem/${problem}/${year}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
                      >
                        {problem}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-green-600 font-bold text-lg">{stats.perfectScores}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-lg font-semibold">{stats.top10}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-lg font-semibold">{stats.top25}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-lg font-semibold">{stats.top40}</div>
                    </td>
                  </tr>
                );
              })}
              {/* Summary row */}
              <tr className="bg-blue-50 font-semibold">
                <td className="px-6 py-4 whitespace-nowrap text-blue-900">
                  Total
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-blue-900">
                  {problems.reduce((sum, p) => sum + problemStats[p].perfectScores, 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-blue-900">
                  {problems.reduce((sum, p) => sum + problemStats[p].top10, 0)}
                  <div className="text-xs text-gray-600">{getCutoffMedal(problems.reduce((sum, p) => sum + problemStats[p].top10, 0))}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-blue-900">
                  {problems.reduce((sum, p) => sum + problemStats[p].top25, 0)}
                  <div className="text-xs text-gray-600">{getCutoffMedal(problems.reduce((sum, p) => sum + problemStats[p].top25, 0))}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-blue-900">
                  {problems.reduce((sum, p) => sum + problemStats[p].top40, 0)}
                  <div className="text-xs text-gray-600">{getCutoffMedal(problems.reduce((sum, p) => sum + problemStats[p].top40, 0))}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="text-center">
            <p className="hover:bg-gray-50">Click the problem text to see a more detailed analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;