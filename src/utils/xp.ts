export function xpForLevel(level: number): number {
  // Total XP required to reach this level
  return 100 * ((level - 1) * level) / 2;
}

export function xpToNextLevel(currentLevel: number): number {
  // XP required to go from currentLevel to currentLevel+1
  return 100 * currentLevel;
}

export function getLevelFromXP(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) {
    level++;
  }
  return level;
} 