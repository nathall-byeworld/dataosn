import React from 'react';
import { BookOpen, ExternalLink, MapPin } from 'lucide-react';

const HandbookPage: React.FC = () => {
  const sections = [
    {
      title: "Interactive Problems",
      icon: "🔢",
      problems: [
        {
          name: "Two Pointers Technique",
          link: "#",
          description: "Extend subtask 3, use binary search"
        },
        {
          name: "Binary Search",
          link: "#", 
          description: "Learn to efficiently search sorted arrays and solve optimization problems."
        },
        {
          name: "Stack & Queue Applications",
          link: "#",
          description: "Understand when and how to use stacks and queues effectively."
        },
        {
          name: "Tips",
          link: "#",
          description: "Extend subtasks, use DnC (binary search, divide by 3, etc)"
        }
      ]
    },
    {
      title: "Number Theory & Mathematics",
      icon: "🧮",
      problems: [
        {
          name: "GCD & LCM",
          link: "#",
          description: "Essential number theory concepts for divisibility problems."
        },
        {
          name: "Modular Arithmetic",
          link: "#",
          description: "Handle large numbers and solve modular equations efficiently."
        },
        {
          name: "Prime Numbers & Factorization",
          link: "#",
          description: "Sieve algorithms and prime factorization techniques."
        },
        {
          name: "Combinatorics Basics",
          link: "#",
          description: "Counting principles, permutations, and combinations."
        }
      ]
    },
    {
      title: "Dynamic Programming",
      icon: "💡",
      problems: [
        {
          name: "1D Dynamic Programming",
          link: "#",
          description: "Linear DP patterns like Fibonacci, coin change, and longest increasing subsequence."
        },
        {
          name: "2D Dynamic Programming", 
          link: "#",
          description: "Grid-based DP, edit distance, and knapsack variations."
        },
        {
          name: "Tree DP",
          link: "#",
          description: "Dynamic programming on trees for optimization problems."
        },
        {
          name: "Digit DP",
          link: "#",
          description: "Advanced technique for counting numbers with specific digit properties."
        }
      ]
    },
    {
      title: "Graph Algorithms",
      icon: "🌐",
      problems: [
        {
          name: "Shortest Path Algorithms",
          link: "#",
          description: "Dijkstra, Bellman-Ford, and Floyd-Warshall algorithms."
        },
        {
          name: "Minimum Spanning Tree",
          link: "#",
          description: "Kruskal and Prim's algorithms for MST problems."
        },
        {
          name: "Topological Sorting",
          link: "#",
          description: "Handle dependencies and directed acyclic graphs."
        },
        {
          name: "Strongly Connected Components",
          link: "#",
          description: "Kosaraju and Tarjan's algorithms for SCC."
        }
      ]
    },
    {
      title: "Advanced Topics",
      icon: "🚀",
      problems: [
        {
          name: "Segment Trees",
          link: "#",
          description: "Efficient range queries and updates on arrays."
        },
        {
          name: "Binary Indexed Tree (Fenwick Tree)",
          link: "#",
          description: "Compact data structure for prefix sum operations."
        },
        {
          name: "LCA (Lowest Common Ancestor)",
          link: "#",
          description: "Tree preprocessing for fast ancestor queries."
        },
        {
          name: "String Algorithms",
          link: "#",
          description: "KMP, Z-algorithm, and suffix-based string matching."
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
                  <div 
                    key={problemIndex}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
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
                  </div>
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