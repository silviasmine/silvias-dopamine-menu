// Blocked words list
const blockedWords = [
  // profanity
  "fuck",
  "shit",
  "ass",
  "bitch",
  "damn",
  "crap",
  "dick",
  "piss",
  "slut",
  "whore",
  "bastard",
  // violence
  "violence",
  "violent",
  "kill",
  "murder",
  "attack",
  "weapon",
  "gun",
  "bomb",
  "terrorist",
  "terrorism",
  "war",
  "nazi",
  "racist",
  "racism",
  "hate",
  "rape",
  "stab",
  "shoot",
  "massacre",
  "genocide",
  "torture",
  // political
  "political",
  "politic",
  "election",
  "republican",
  "democrat",
  "conservative",
  "liberal",
  "trump",
  "biden",
  "diddy",
  "epstein",
  "government",
  "protest",
  "riot",
  "revolution",
  "manifesto",
  "extremist",
  "propaganda",
  "leftist",
  "rightist",
  "socialist",
  "capitalist",
  "communist",
  "fascist",
];

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z]/g, "");
}

export function isClean(text: string): boolean {
  const normalized = normalize(text);
  return !blockedWords.some((word) => {
    const nWord = normalize(word);
    return normalized.includes(nWord);
  });
}

export function cleanText(text: string): string {
  let result = text;
  blockedWords.forEach((word) => {
    const regex = new RegExp(word, "gi");
    result = result.replace(regex, "***");
  });
  return result;
}