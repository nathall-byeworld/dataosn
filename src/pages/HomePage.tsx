import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Users, TrendingUp } from 'lucide-react';
import { Participant } from '../utils/csvParser';

interface HomePageProps {
  participantsByYear: Record<string, Participant[]>;
}

const HomePage: React.FC<HomePageProps> = ({ participantsByYear }) => {
  const years = [
    {
      year: '2025',
      status: 'upcoming',
      participants: 'TBD',
      available: false,
      description: 'Results will be available after the competition.'
    },
    {
      year: '2024',
      status: 'completed',
      participants: participantsByYear['2024']?.length || 0,
      available: (participantsByYear['2024']?.length || 0) > 0,
      description: 'Complete results with detailed statistics and analysis.'
    },
    {
      year: '2024',
      status: 'upcoming',
      participants: 'TBD',
      available: false,
      description: 'Results will be available after the competition.'
    },
    {
      year: '2023',
      status: 'completed',
      participants: participantsByYear['2023']?.length || 0,
      available: (participantsByYear['2023']?.length || 0) > 0,
      description: 'Complete results with detailed statistics and analysis.'
    },
    {
      year: '2022',
      status: 'completed',
      participants: participantsByYear['2022']?.length || 0,
      available: (participantsByYear['2022']?.length || 0) > 0,
      description: 'Complete results with detailed statistics and analysis.'
    },
    {
      year: '2021',
      status: 'completed', 
      participants: participantsByYear['2021']?.length || 0,
      available: (participantsByYear['2021']?.length || 0) > 0,
      description: 'Complete results with detailed statistics and analysis.'
    },
    {
      year: '2020',
      status: 'completed', 
      participants: participantsByYear['2020']?.length || 0,
      available: (participantsByYear['2020']?.length || 0) > 0,
      description: 'Complete results with detailed statistics and analysis.'
    }
  ].filter((yearData, index, array) => {
    // Remove duplicate 2024 entries
    return array.findIndex(item => item.year === yearData.year) === index;
  });
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center mb-6">
            <Trophy className="h-16 w-16 text-yellow-500 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900">
              OSN Results Portal
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive results and analysis from Indonesia's National Science Olympiad in Informatics.
            Explore detailed statistics, problem analysis, and participant achievements.
            Made by: ByeWorld
          </p>
        </div>
      </div>
      
      {/* Years Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Competition Years</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse results from different years of the National Science Olympiad in Informatics
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {years.map((yearData) => (
            <div
              key={yearData.year}
              className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                !yearData.available ? 'opacity-75' : ''
              }`}
            >
              <div className="absolute top-4 right-4">
                {yearData.status === 'completed' && yearData.available && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </span>
                )}
                {yearData.status === 'completed' && !yearData.available && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Coming Soon
                  </span>
                )}
                {yearData.status === 'upcoming' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Upcoming
                  </span>
                )}
              </div>
              
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-3xl font-bold text-gray-900">OSN {yearData.year}</h3>
                </div>
                
                <p className="text-gray-600 mb-4">{yearData.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{yearData.participants} participant{yearData.participants !== 1 ? 's' : ''}</span>
                </div>
                
                {yearData.available ? (
                  <Link
                    to={`/osn/${yearData.year}`}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    View Results
                    <Trophy className="h-4 w-4 ml-2" />
                  </Link>
                ) : (
                  <div className="inline-flex items-center px-6 py-3 bg-gray-300 text-gray-500 font-medium rounded-lg cursor-not-allowed">
                    Not Available Yet
                  </div>
                )}
              </div>
              
              {/* Decorative gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;