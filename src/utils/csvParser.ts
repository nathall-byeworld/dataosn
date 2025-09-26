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

  // Detect column count from header
  const headerCols = lines[0].split(',');
  const hasGrade = headerCols.length === 14;

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const columns = line.split(',');

    const parseScore = (value: string): number | null => {
      if (!value || value.trim() === '') return null;
      const num = parseInt(value.trim());
      return isNaN(num) ? null : num;
    };

    const participant: Participant = {
      rank: parseInt(columns[0]) || 0,
      name: columns[1] || '',
      gender: columns[2] || '',
      grade: hasGrade ? columns[3] || '' : '', // fallback if missing
      school: hasGrade ? columns[4] || '' : columns[3] || '',
      province: hasGrade ? columns[5] || '' : columns[4] || '',
      scores: {
        '1A': parseScore(hasGrade ? columns[6] : columns[5]),
        '1B': parseScore(hasGrade ? columns[7] : columns[6]),
        '1C': parseScore(hasGrade ? columns[8] : columns[7]),
        '2A': parseScore(hasGrade ? columns[9] : columns[8]),
        '2B': parseScore(hasGrade ? columns[10] : columns[9]),
        '2C': parseScore(hasGrade ? columns[11] : columns[10]),
      },
      total: parseInt(hasGrade ? columns[12] : columns[11]) || 0,
      medal: hasGrade ? columns[13] || '' : columns[12] || ''
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
  const goldMedalists = participants.filter(p => p.medal === 'Emas');
  const silverMedalists = participants.filter(p => p.medal === 'Perak');
  const bronzeMedalists = participants.filter(p => p.medal === 'Perunggu');
  
  let goldCutoff = 0; 
  let silverCutoff = 0; 
  let bronzeCutoff = 0; 
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