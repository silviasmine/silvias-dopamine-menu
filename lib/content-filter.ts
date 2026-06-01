import Filter from "bad-words";

const filter = new Filter();

// Add custom words to block (violent, political, harmful content)
const additionalBlockedWords = [
  "violence",
  "violent",
  "kill",
  "diddy",
  "epstein",
  "murder",
  "attack",
  "rape",
  "gang",
  "communism",
  "sociaism",
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
  "political",
  "politic",
  "election",
  "vote",
  "party",
  "republican",
  "democrat",
  "conservative",
  "liberal",
  "trump",
  "biden",
  "government",
  "protest",
  "riot",
  "revolution",
  "manifesto",
  "extremist",
  "propaganda",
];

filter.addWords(...additionalBlockedWords);

export function isClean(text: string): boolean {
  return !filter.isProfane(text);
}

export function cleanText(text: string): string {
  return filter.clean(text);
}