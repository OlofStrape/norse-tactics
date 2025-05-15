const { allQuests } = require('../src/data/campaign');
const { cards } = require('../src/data/cards');

const allCardIds = new Set(cards.map(c => c.id));
const missing = [];
const allRewarded = [];

for (const quest of allQuests) {
  if (quest.rewards && quest.rewards.cards) {
    for (const card of quest.rewards.cards) {
      allRewarded.push(card.id);
      if (!allCardIds.has(card.id)) {
        missing.push(card.id);
      }
    }
  }
}

console.log('--- All campaign reward cardIds ---');
console.log(Array.from(new Set(allRewarded)).sort().join(', '));

if (missing.length > 0) {
  console.warn('Missing cardIds in campaign rewards:', missing);
} else {
  console.log('All campaign reward cardIds exist in the card database.');
} 