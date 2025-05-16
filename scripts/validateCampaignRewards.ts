import { allQuests, campaignStory } from '../src/data/campaign';
import { cards } from '../src/data/cards';
import * as fs from 'fs';
import * as path from 'path';

const allCardIds = new Set(cards.map(c => c.id));
const missing: string[] = [];
const allRewarded: string[] = [];

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

const chapterKeys = Object.keys(campaignStory.chapters);
const questIds = new Set(allQuests.map(q => q.id));
const mainQuests = allQuests.filter(q => !q.isSideQuest && !q.isRepeatable);
const fixes: {id: string, field: string, value: string}[] = [];

function norseIntro(quest: any) {
  const chapter = campaignStory.chapters[quest.location as keyof typeof campaignStory.chapters];
  return `As the mists part in ${chapter?.title?.split(':')[0] || quest.location}, a new challenge awaits: ${quest.name}.\n\n${quest.description}`;
}
function norseOutro(quest: any) {
  return `With the trial of '${quest.name}' complete, your legend grows. The Norns weave your fate ever onward.`;
}

for (const quest of mainQuests) {
  if (!chapterKeys.includes(quest.location)) {
    console.warn(`Quest ${quest.id} has unknown location: ${quest.location}`);
  }
  if (quest.requirements?.completedQuests) {
    for (const req of quest.requirements.completedQuests) {
      if (!questIds.has(req)) {
        console.warn(`Quest ${quest.id} requires missing quest: ${req}`);
      }
    }
  }
  if (quest.rewards?.unlocks) {
    for (const unlock of quest.rewards.unlocks) {
      if (!questIds.has(unlock)) {
        console.warn(`Quest ${quest.id} unlocks missing quest: ${unlock}`);
      }
    }
  }
  if (!quest.storyIntro) {
    quest.storyIntro = norseIntro(quest);
    fixes.push({id: quest.id, field: 'storyIntro', value: quest.storyIntro});
  }
  if (!quest.storyOutro) {
    quest.storyOutro = norseOutro(quest);
    fixes.push({id: quest.id, field: 'storyOutro', value: quest.storyOutro});
  }
}

if (fixes.length > 0) {
  const campaignPath = path.resolve(__dirname, '../src/data/campaign.ts');
  let src = fs.readFileSync(campaignPath, 'utf8');
  for (const fix of fixes) {
    const questRegex = new RegExp(`createQuest\\((['\"]${fix.id}['\"].*?\{)`, 's');
    src = src.replace(questRegex, (match) => {
      if (match.includes(fix.field)) return match;
      return match.replace(/\{\s*\}/, `{ ${fix.field}: ` +
        '`' + fix.value.replace(/`/g, '\`') + '`' +
        ' }');
    });
  }
  fs.writeFileSync(campaignPath, src, 'utf8');
  console.log(`Auto-fixed ${fixes.length} missing storyIntro/storyOutro fields in src/data/campaign.ts.`);
} else {
  console.log('No missing storyIntro/storyOutro fields found.');
} 