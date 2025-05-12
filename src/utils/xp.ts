export function xpForLevel(level: number): number {
  // Non-linear XP curve: XP required to reach this level
  return Math.round(100 * Math.pow(level, 1.7));
}

export function xpToNextLevel(currentLevel: number): number {
  // XP required to go from currentLevel to currentLevel+1
  return xpForLevel(currentLevel + 1) - xpForLevel(currentLevel);
}

export function getLevelFromXP(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) {
    level++;
  }
  return level;
} 