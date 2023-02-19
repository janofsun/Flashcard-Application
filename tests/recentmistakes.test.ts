import { newRecentMistakesFirstSorter } from "../src/ordering/prioritization/recentmistakes";
import { CardStatus } from '../src/cards/cardstatus';
import { newFlashCard } from '../src/cards/flashcard';

describe('newRecentMistakesFirstSorter', () => {
  let sorter = newRecentMistakesFirstSorter()

  test('number of results is equal: 0,1,2 => 1,0,2', () => {
    const cards: CardStatus[]  = [
      {
        getCard: () => newFlashCard("I", "ich"),
        getResults: () => [true, false, false, true],
        recordResult: () => void {},
        clearResults: () => void {}
      },
      {
        getCard: () => newFlashCard("Squirrel", "Eichhoernchen"),
        getResults: () => [true, true, true, false],
        recordResult: () => void {},
        clearResults: () => void {}
      },
      {
        getCard: () => newFlashCard("Cat", "Katze"),
        getResults: () => [false, false, false, true],
        recordResult: () => void {},
        clearResults: () => void {}
      }
    ]

    const sortedCards = sorter.reorganize(cards)

    expect(sortedCards[0]).toEqual(cards[1])
    expect(sortedCards[1]).toEqual(cards[0])
    expect(sortedCards[2]).toEqual(cards[2])
  })

  test('number of results is not equal: 0,1,2 => 2,0,1', () => {
    const cards: CardStatus[]  = [
      {
        getCard: () => newFlashCard("I", "ich"),
        getResults: () => [],
        recordResult: () => void {},
        clearResults: () => void {}
      },
      {
        getCard: () => newFlashCard("Squirrel", "Eichhoernchen"),
        getResults: () => [false, true],
        recordResult: () => void {},
        clearResults: () => void {}
      },
      {
        getCard: () => newFlashCard("Cat", "Katze"),
        getResults: () => [true, true, true, false],
        recordResult: () => void {},
        clearResults: () => void {}
      }
    ]

    const sortedCards = sorter.reorganize(cards)

    expect(sortedCards[0]).toEqual(cards[2])
    expect(sortedCards[1]).toEqual(cards[0])
    expect(sortedCards[2]).toEqual(cards[1])
  })

  test('number of failures is empty: return the same order', () => {
    const cards: CardStatus[]  = [
      {
        getCard: () => newFlashCard("I", "ich"),
        getResults: () => [],
        recordResult: () => void {},
        clearResults: () => void {}
      },
      {
        getCard: () => newFlashCard("Squirrel", "Eichhoernchen"),
        getResults: () => [],
        recordResult: () => void {},
        clearResults: () => void {}
      },
    ]

    const sortedCards = sorter.reorganize(cards)

    expect(sortedCards[0]).toEqual(cards[0])
    expect(sortedCards[1]).toEqual(cards[1])
  })
});