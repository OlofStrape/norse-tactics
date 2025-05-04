import { cards } from '../data/cards';

const COLLECTION_KEY = 'cardCollection';

// Get the player's card collection from localStorage
export function getCardCollection(): string[] {
  const data = localStorage.getItem(COLLECTION_KEY);
  if (data) return JSON.parse(data);
  // If not present, initialize with 5 common cards
  const starter = cards.filter(c => c.rarity === 'common').slice(0, 5).map(c => c.id);
  localStorage.setItem(COLLECTION_KEY, JSON.stringify(starter));
  return starter;
}

// Save the player's card collection to localStorage
export function setCardCollection(cardIds: string[]) {
  localStorage.setItem(COLLECTION_KEY, JSON.stringify(cardIds));
}

// Add a card to the collection
export function addCardToCollection(cardId: string) {
  const collection = getCardCollection();
  if (!collection.includes(cardId)) {
    collection.push(cardId);
    setCardCollection(collection);
  }
}

// Check if player owns a card
export function hasCard(cardId: string): boolean {
  return getCardCollection().includes(cardId);
} 