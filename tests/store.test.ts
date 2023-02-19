import { FlashCard, newFlashCard } from '../src/cards/flashcard';
import { newInMemoryCardStore, CardStore } from '../src/data/store';

describe('InMemoryCardStore', () => {
  let store: CardStore

  beforeEach(() => {
    const initialCards = [newFlashCard('ich', 'I'), newFlashCard('Hund', 'Dog'), newFlashCard('Katze', 'Cat')]
    store = newInMemoryCardStore(initialCards)
  })

  test('getAllCards', () => {
    const cards = store.getAllCards()
    expect(cards).toHaveLength(3)
    expect(cards[0].getQuestion()).toEqual('ich')
    expect(cards[0].getAnswer()).toEqual('I')
    expect(cards[1].getQuestion()).toEqual('Hund')
    expect(cards[1].getAnswer()).toEqual('Dog')
    expect(cards[2].getQuestion()).toEqual('Katze')
    expect(cards[2].getAnswer()).toEqual('Cat')
  })

  test('addCard', () => {
    const card = newFlashCard('Art', 'Kind')
    const result = store.addCard(card)
    expect(result).toBeTruthy()
    const cards = store.getAllCards()
    expect(cards).toHaveLength(4)
    expect(cards[3].getQuestion()).toEqual('Art')
    expect(cards[3].getAnswer()).toEqual('Kind')
  })

  test('addCard duplicates', () => {
    const card = newFlashCard('Hund', 'Dog')
    const result = store.addCard(card)
    expect(result).toBeFalsy()
    const cards = store.getAllCards()
    expect(cards).toHaveLength(3)
    expect(cards[0].getQuestion()).toEqual('ich')
    expect(cards[0].getAnswer()).toEqual('I')
    expect(cards[1].getQuestion()).toEqual('Hund')
    expect(cards[1].getAnswer()).toEqual('Dog')
    expect(cards[2].getQuestion()).toEqual('Katze')
    expect(cards[2].getAnswer()).toEqual('Cat')
  })

  test('removeCard', () => {
    const card = newFlashCard('Art', 'Kind')
    store.addCard(card)
    expect(store.getAllCards()).toHaveLength(4)
    store.removeCard(card)
    expect(store.getAllCards()).toHaveLength(3)
  })

  test('removeCard missing', () => {
    const card = newFlashCard('Art', 'Kind') 
    const cards = store.getAllCards()
    expect(store.removeCard(card)).toBeFalsy()
    const cardsRemoved = store.getAllCards()
    expect(cardsRemoved).toHaveLength(3)
  })

  test('invertCards', () => {
      const newstore = store.invertCards()
      const cards = newstore.getAllCards()
      expect(cards).toHaveLength(3)
      expect(cards[0].getQuestion()).toBe('I')
      expect(cards[0].getAnswer()).toBe('ich')
      expect(cards[1].getQuestion()).toBe('Dog')
      expect(cards[1].getAnswer()).toBe('Hund')
  })
})