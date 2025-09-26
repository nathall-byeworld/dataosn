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
  const participants: Participant[] = [];
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const columns = line.split(',');
    
    // Handle the case where some entries might have commas in school names
    const parseScore = (value: string): number | null => {
      if (!value || value.trim() === '') return null;
      const num = parseInt(value.trim());
      return isNaN(num) ? null : num;
    };
    
    const participant: Participant = {
      rank: parseInt(columns[0]) || 0,
      name: columns[1] || '',
      gender: columns[2] || '',
      grade: columns[3] || '',
      school: columns[4] || '',
      province: columns[5] || '',
      scores: {
        '1A': parseScore(columns[6]),
        '1B': parseScore(columns[7]),
        '1C': parseScore(columns[8]),
        '2A': parseScore(columns[9]),
        '2B': parseScore(columns[10]),
        '2C': parseScore(columns[11])
      },
      total: parseInt(columns[12]) || 0,
      medal: columns[13] || ''
    };
    
    participants.push(participant);
  }
  
  return participants;
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
  // Filter participants by medal type
  const goldMedalists = participants.filter(p => p.medal === 'Emas');
  const silverMedalists = participants.filter(p => p.medal === 'Perak');
  const bronzeMedalists = participants.filter(p => p.medal === 'Perunggu');
  
  // Calculate actual cutoffs based on the lowest score in each medal category
  let goldCutoff = 0;
  let silverCutoff = 0;
  let bronzeCutoff = 0;
  
  if (goldMedalists.length > 0) {
    goldCutoff = Math.min(...goldMedalists.map(p => p.total));
  }
  
  if (silverMedalists.length > 0) {
    silverCutoff = Math.min(...silverMedalists.map(p => p.total));
  }
  
  if (bronzeMedalists.length > 0) {
    bronzeCutoff = Math.min(...bronzeMedalists.map(p => p.total));
  }
  
  return {
    gold: goldCutoff,
    silver: silverCutoff,
    bronze: bronzeCutoff,
    goldCount: goldMedalists.length,
    silverCount: silverMedalists.length,
    bronzeCount: bronzeMedalists.length
  };
};