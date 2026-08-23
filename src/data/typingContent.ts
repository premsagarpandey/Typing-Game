export const quotes = [
  "The only way to do great work is to love what you do.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Believe you can and you're halfway there.",
  "In the middle of every difficulty lies opportunity.",
  "Life is what happens when you're busy making other plans.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Experience is the name everyone gives to their mistakes.",
  "Make it work, make it right, make it fast.",
  "Programming isn't about what you know; it's about what you can figure out."
];

export const words = [
  "ability", "able", "about", "above", "accept", "according", "account", "across", "act", "action",
  "activity", "actually", "add", "address", "administration", "admit", "adult", "affect", "after", "again",
  "against", "age", "agency", "agent", "ago", "agree", "agreement", "ahead", "air", "all",
  "allow", "almost", "alone", "along", "already", "also", "although", "always", "American", "among",
  "amount", "analysis", "and", "animal", "another", "answer", "any", "anyone", "anything", "appear",
  "apply", "approach", "area", "argue", "arm", "around", "arrive", "art", "article", "artist"
];

export function getRandomText(mode: 'quotes' | 'words', count: number = 20): string {
  if (mode === 'quotes') {
    return quotes[Math.floor(Math.random() * quotes.length)];
  } else {
    const selectedWords = [];
    for (let i = 0; i < count; i++) {
      selectedWords.push(words[Math.floor(Math.random() * words.length)]);
    }
    return selectedWords.join(' ');
  }
}
