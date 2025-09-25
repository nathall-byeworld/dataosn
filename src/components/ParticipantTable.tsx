import React, { useState, useMemo } from 'react';
import { Participant } from '../utils/csvParser';
import { ArrowUpDown, RotateCcw } from 'lucide-react';

interface ParticipantTableProps {
  participants: Participant[];
  year?: string;
}

const ParticipantTable: React.FC<ParticipantTableProps> = ({ participants, year }) => {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const sortedParticipants = useMemo(() => {
    if (!sortBy) return participants;
    
    return [...participants].sort((a, b) => {
      let aValue: number | null = 0;
      let bValue: number | null = 0;
      
      if (sortBy === 'total') {
        aValue = a.total;
        bValue = b.total;
      } else if (['1A', '1B', '1C', '2A', '2B', '2C'].includes(sortBy)) {
        aValue = a.scores[sortBy as keyof typeof a.scores] || 0;
        bValue = b.scores[sortBy as keyof typeof b.scores] || 0;
      }
      
      // Sort based on current order
      if (sortOrder === 'desc') {
        return (bValue || 0) - (aValue || 0);
      } else {
        return (aValue || 0) - (bValue || 0);
      }
    });
  }, [participants, sortBy, sortOrder]);
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if clicking the same column
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      // New column, start with descending
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  const resetSort = () => {
    setSortBy('total');
    setSortOrder('desc');
  };
  
  const getMedalColor = (medal: string) => {
    switch (medal) {
      case 'Emas':
        return 'bg-yellow-50 border-l-4 border-yellow-400';
      case 'Perak':
        return 'bg-gray-50 border-l-4 border-gray-400';
      case 'Perunggu':
        return 'bg-orange-50 border-l-4 border-orange-400';
      default:
        return 'bg-white';
    }
  };
  
  const getMedalBadge = (medal: string) => {
    switch (medal) {
      case 'Emas':
        return <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">🥇 Gold</span>;
      case 'Perak':
        return <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">🥈 Silver</span>;
      case 'Perunggu':
        return <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">🥉 Bronze</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">OSN {year || '2023'} Results</h2>
        <button
          onClick={resetSort}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Sort</span>
        </button>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                School
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Province
              </th>
              {['1A', '1B', '1C', '2A', '2B', '2C'].map((problem) => (
                <th
                  key={problem}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort(problem)}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>{problem}</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
              ))}
              <th
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('total')}
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>Total</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medal
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedParticipants.map((participant, index) => (
              <tr key={index} className={getMedalColor(participant.medal)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {participant.rank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {participant.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {participant.school}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {participant.province}
                </td>
                {['1A', '1B', '1C', '2A', '2B', '2C'].map((problem) => (
                  <td key={problem} className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium">
                    <span className={participant.scores[problem as keyof typeof participant.scores] === 100 ? 'text-green-600 font-bold' : 'text-gray-700'}>
                      {participant.scores[problem as keyof typeof participant.scores] ?? '-'}
                    </span>
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-900">
                  {participant.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getMedalBadge(participant.medal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticipantTable;