export interface Participant {
  rank: number;
  name: string;
  gender: string;
  grade?: string; // optional now
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

  const parseScore = (value: string): number | null => {
    if (!value || value.trim() === "") return null;
    const num = parseInt(value.trim());
    return isNaN(num) ? null : num;
  };

  const participants: Participant[] = [];

  // Loop rows (skip header)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const columns = line.split(",");

    const participant: Participant = {
      rank: idx.rank >= 0 ? parseInt(columns[idx.rank]) || 0 : 0,
      name: idx.name >= 0 ? columns[idx.name] || "" : "",
      gender: idx.gender >= 0 ? columns[idx.gender] || "" : "",
      grade: idx.grade >= 0 ? columns[idx.grade] || "" : undefined, // safe fallback
      school: idx.school >= 0 ? columns[idx.school] || "" : "",
      province: idx.province >= 0 ? columns[idx.province] || "" : "",
      scores: {
        "1A": idx.scores["1A"] >= 0 ? parseScore(columns[idx.scores["1A"]]) : null,
        "1B": idx.scores["1B"] >= 0 ? parseScore(columns[idx.scores["1B"]]) : null,
        "1C": idx.scores["1C"] >= 0 ? parseScore(columns[idx.scores["1C"]]) : null,
        "2A": idx.scores["2A"] >= 0 ? parseScore(columns[idx.scores["2A"]]) : null,
        "2B": idx.scores["2B"] >= 0 ? parseScore(columns[idx.scores["2B"]]) : null,
        "2C": idx.scores["2C"] >= 0 ? parseScore(columns[idx.scores["2C"]]) : null,
      },
      total: idx.total >= 0 ? parseInt(columns[idx.total]) || 0 : 0,
      medal: idx.medal >= 0 ? columns[idx.medal] || "" : "",
    };

    participants.push(participant);
  }

  return participants;
};