export interface Participant {
  rank: number;
  name: string;
  gender: string;
  grade?: string; // Optional since not all years have this
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
  
  if (lines.length < 2) return participants;
  
  // Get header to determine format
  const header = lines[0].toLowerCase();
  const hasGradeColumn = header.includes('kls');
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Split by comma but handle quoted fields
    const columns = line.split(',').map(col => col.trim());
    
    if (columns.length < 10) continue; // Skip malformed rows
    
    const parseScore = (value: string): number | null => {
      if (!value || value.trim() === '' || value.trim() === '-') return null;
      const num = parseInt(value.trim());
      return isNaN(num) ? null : num;
    };
    
    let colIndex = 0;
    
    const participant: Participant = {
      rank: parseInt(columns[colIndex++]) || 0,
      name: columns[colIndex++] || '',
      gender: columns[colIndex++] || '',
      grade: hasGradeColumn ? columns[colIndex++] : undefined,
      school: columns[colIndex++] || '',
      province: columns[colIndex++] || '',
      scores: {
        '1A': parseScore(columns[colIndex++]),
        '1B': parseScore(columns[colIndex++]),
        '1C': parseScore(columns[colIndex++]),
        '2A': parseScore(columns[colIndex++]),
        '2B': parseScore(columns[colIndex++]),
        '2C': parseScore(columns[colIndex++])
      },
      total: parseInt(columns[colIndex++]) || 0,
      medal: columns[colIndex] || ''
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
  
  // Find actual cutoffs from the data
  const goldScores = goldMedalists.map(p => p.total).sort((a, b) => b - a);
  const silverScores = silverMedalists.map(p => p.total).sort((a, b) => b - a);
  const bronzeScores = bronzeMedalists.map(p => p.total).sort((a, b) => b - a);
  
  const goldCutoff = goldScores.length > 0 ? Math.min(...goldScores) : 0;
  const silverCutoff = silverScores.length > 0 ? Math.min(...silverScores) : 0;
  const bronzeCutoff = bronzeScores.length > 0 ? Math.min(...bronzeScores) : 0;
  
  return {
    gold: goldCutoff,
    silver: silverCutoff,
    bronze: bronzeCutoff,
    goldCount: goldMedalists.length,
    silverCount: silverMedalists.length,
    bronzeCount: bronzeMedalists.length
  };
};