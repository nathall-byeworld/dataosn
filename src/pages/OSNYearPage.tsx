import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ParticipantTable from '../components/ParticipantTable';
import { Participant } from '../utils/csvParser';
import { BarChart3, Trophy } from 'lucide-react';

interface OSNYearPageProps {
  participantsByYear: Record<string, Participant[]>;
}

const OSNYearPage: React.FC<OSNYearPageProps> = ({ participantsByYear }) => {
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
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center">
              <Trophy className="h-10 w-10 mr-3 text-yellow-600" />
              OSN {year} - Informatics
            </h1>
            <p className="text-gray-600 mt-2">
              National Science Olympiad in Informatics - Complete Results and Rankings
            </p>
          </div>
          
          <Link
            to={`/osn/${year}/statistics`}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <BarChart3 className="h-5 w-5" />
            <span>View Statistics</span>
          </Link>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-900">
              {participants.filter(p => p.medal === 'Emas').length}
            </div>
            <div className="text-sm text-yellow-700">🥇 Gold Medals</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {participants.filter(p => p.medal === 'Perak').length}
            </div>
            <div className="text-sm text-gray-700">🥈 Silver Medals</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-900">
              {participants.filter(p => p.medal === 'Perunggu').length}
            </div>
            <div className="text-sm text-orange-700">🥉 Bronze Medals</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900">
              {participants.length}
            </div>
            <div className="text-sm text-blue-700">👥 Total Participants</div>
          </div>
        </div>
      </div>
      
      {/* Results Table */}
      <ParticipantTable participants={participants} />
      
      <div className="mt-8 text-center">
        <Link
          to={`/osn/${year}/statistics`}
          className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-colors"
        >
          <BarChart3 className="h-5 w-5" />
          <span>Explore Detailed Statistics & Analysis</span>
        </Link>
      </div>
    </div>
  );
};

export default OSNYearPage;