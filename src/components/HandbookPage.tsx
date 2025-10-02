import React, { useState } from 'react';
import { BookOpen, ExternalLink, MapPin } from 'lucide-react';

const HandbookPage: React.FC = () => {
  const [revealedSpoilers, setRevealedSpoilers] = useState<Set<string>>(new Set());
  
  const toggleSpoiler = (problemIndex: number, sectionIndex: number) => {
    const spoilerId = `${sectionIndex}-${problemIndex}`;
    const newRevealed = new Set(revealedSpoilers);
    if (newRevealed.has(spoilerId)) {
      newRevealed.delete(spoilerId);
    } else {
      newRevealed.add(spoilerId);
    }
    setRevealedSpoilers(newRevealed);
  };
  
  const sections = [
    {
      title: "Interactive Problems",
      icon: "🔢",
      problems: [
        {
          name: "Weird Chickens",
          link: "https://tlx.toki.id/problems/osn-2015/2C",
          description: "Extend subtask 3, use binary search",
          spoiler: "The key insight is to binary search on the answer. For each candidate answer, simulate the process to check if it's achievable."
        },
        {
          name: "Maybe Guess the Number",
          link: "https://tlx.toki.id/problems/osn-2015/1C", 
          description: "Divide by 3?",
          spoiler: "Use ternary search strategy. Ask about ranges that divide the search space into three parts, then eliminate 2/3 of the possibilities."
        },
        {
          name: "Stack & Queue Applications",
          link: "https://tlx.toki.id/problems/osn-2022/1B",
          description: "Find information (A and B), then find the answer (MST)",
          spoiler: "First, use queries to determine the graph structure. Then apply MST algorithms like Kruskal's or Prim's on the discovered graph."
        },
        {
          name: "How to solve interactive",
          link: "#",
          description: "Use queries to find information first, then use that info to answer the problem",
          spoiler: "General strategy: 1) Analyze what information you need 2) Design queries to gather that info efficiently 3) Use the gathered info to solve the original problem"
        },
        {
          name: "Specific tips",
          link: "#",
          description: "Extend subtasks, use DnC (binary search, divide by 3, etc), can you optimize the num of queries?",
          spoiler: "Always try to extend partial solutions from smaller subtasks. Use divide and conquer techniques. Count your queries carefully and see if you can reduce them."
        }
      ]
    },
    {
      title: "Output Only Problems",
      icon: "🧮",
      problems: [
        {
          name: "National Defence",
          link: "https://tlx.toki.id/problems/ksn-2020/1A",
          description: "Solve each subtask separately (dikuli)",
          spoiler: "For each subtask, analyze the constraints and write a specific solution. Don't try to find one solution for all - optimize for each case separately."
        },
        {
          name: "Tourism in Palembang",
          link: "https://tlx.toki.id/problems/osn-2016/2C",
          description: "Use random (mt19937)",
          spoiler: "Use randomized algorithms like simulated annealing or genetic algorithms. The mt19937 random number generator can help find good solutions through random exploration."
        },
        {
          name: "Monochrome Mosaic",
          link: "https://tlx.toki.id/problems/osn-2024/0C",
          description: "Sometimes you can solve it just like a batch problem",
          spoiler: "Even though it's output-only, you can sometimes write a program that reads the input and produces the output, just like a regular competitive programming problem."
        }
      ]
    }
  ];
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <BookOpen className="h-10 w-10 mr-3 text-blue-600" />
          ByeWorld's Handbook
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          This page is still on progress. Some eductional problems for OSN preparation.
        </p>
      </div>
      
      <div className="space-y-8">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="text-3xl mr-3">{section.icon}</span>
                <span className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {section.title}
                </span>
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.problems.map((problem, problemIndex) => (
                  <a
                    key={problemIndex}
                    href={problem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {problem.name}
                      </h3>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {problem.description}
                    </p>
                    <div className="mt-3">
                      <div
                        className={`text-sm p-2 rounded cursor-pointer transition-all ${
                          revealedSpoilers.has(`${sectionIndex}-${problemIndex}`)
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-gray-800 text-gray-800 select-none hover:bg-gray-700'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSpoiler(problemIndex, sectionIndex);
                        }}
                      >
                        {revealedSpoilers.has(`${sectionIndex}-${problemIndex}`) ? (
                          <>
                            <span className="font-medium text-green-700">💡 Hint: </span>
                            {problem.spoiler}
                          </>
                        ) : (
                          <span className="select-none">Click to reveal hint...</span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          This handbook provides a structured learning path based on successful OSN participants' 
          experiences. Each topic builds upon previous concepts, ensuring solid foundational knowledge.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            📚 Comprehensive Coverage
          </span>
          <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
            🎯 OSN-Focused
          </span>
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            🚀 Progressive Learning
          </span>
        </div>
      </div>
    </div>
  );
};

export default HandbookPage;