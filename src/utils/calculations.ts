export function calculateWPM(correctChars: number, timeElapsedSeconds: number): number {
  if (timeElapsedSeconds === 0) return 0;
  // Standard word length is 5 characters
  const words = correctChars / 5;
  const minutes = timeElapsedSeconds / 60;
  return Math.round(words / minutes);
}

export function calculateAccuracy(correctChars: number, totalCharsTyped: number): number {
  if (totalCharsTyped === 0) return 100;
  return Math.round((correctChars / totalCharsTyped) * 100);
}

export function calculateScore(wpm: number, accuracy: number, maxCombo: number): number {
  const baseScore = wpm * 10;
  const accuracyMultiplier = accuracy / 100;
  const comboBonus = maxCombo * 5;
  return Math.round((baseScore * accuracyMultiplier) + comboBonus);
}
