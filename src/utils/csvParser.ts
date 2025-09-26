export interface Participant {
  rank: number;
  name: string;
  gender: string;
  grade: string;
  school: string;
  province: string;
  scores: {
    '1A': number | null;
    '1B': number | null;
    '1C': number | null;
    '2A': number | null;
    '2B': number | null;
    '2C': number | null;
  };
  total: number;
  medal: string;
}

export const parseCSVData = (csvText: string): Participant[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const header = lines[0].split(',').map(h => h.trim().toLowerCase());

  // Find column indexes dynamically
  const colIndex = (name: string) => header.indexOf(name.toLowerCase());

  const idx = {
    rank: colIndex("rank"),
    name: colIndex("name"),
    gender: colIndex("gender"),
    grade: colIndex("grade"), // might be -1 if missing
    school: colIndex("school"),
    province: colIndex("province"),
    scores: {
      "1A": colIndex("1a"),
      "1B": colIndex("1b"),
      "1C": colIndex("1c"),
      "2A": colIndex("2a"),
      "2B": colIndex("2b"),
      "2C": colIndex("2c")
    },
    total: colIndex("total"),
    medal: colIndex("medal"),
  };

export const calculateProblemStats = (participants: Participant[]) => {
  const problems = ['1A', '1B', '1C', '2A', '2B', '2C'] as const;
  const stats: Record<string, any> = {};
  
  problems.forEach(problem => {
    const scores = participants
      .map(p => p.scores[problem])
      .filter(score => score !== null)
      .sort((a, b) => b! - a!);
    
    const perfectScores = scores.filter(score => score === 100).length;
    const top40 = scores[39] || 0;
    const top25 = scores[24] || 0;
    const top10 = scores[9] || 0;
    
    // Calculate suffix array for graph
    const suffixCounts: Record<number, number> = {};
    for (let score = 0; score <= 100; score++) {
      suffixCounts[score] = scores.filter(s => s! >= score).length;
    }
    
    stats[problem] = {
      perfectScores,
      top40,
      top25,
      top10,
      suffixCounts,
      totalParticipants: scores.length
    };
  });
  
  return stats;
};

export const calculateMedalCutoffs = (participants: Participant[]) => {
  const goldMedalists = participants.filter(p => p.medal === 'Emas');
  const silverMedalists = participants.filter(p => p.medal === 'Perak');
  const bronzeMedalists = participants.filter(p => p.medal === 'Perunggu');
  let goldCutoff = 0; let silverCutoff = 0; let bronzeCutoff = 0; 
  if (goldMedalists.length > 0) { goldCutoff = Math.min(...goldMedalists.map(p => p.total)); } 
  if (silverMedalists.length > 0) { silverCutoff = Math.min(...silverMedalists.map(p => p.total)); } 
  if (bronzeMedalists.length > 0) { bronzeCutoff = Math.min(...bronzeMedalists.map(p => p.total)); }
  
  return {
    gold: goldCutoff,
    silver: silverCutoff,
    bronze: bronzeCutoff,
    goldCount: goldMedalists.length,
    silverCount: silverMedalists.length,
    bronzeCount: bronzeMedalists.length
  };
};