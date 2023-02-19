import { newMostMistakesFirstSorter } from "../src/ordering/prioritization/mostmistakes";
import { newFlashCard } from '../src/cards/flashcard';
import { CardStatus } from "../src/cards/cardstatus";

describe('newMostMistakesFirstSorter - order the cards by the number of incorrect answers', () => {
  let sorter = newMostMistakesFirstSorter()

  test('number of failures is not equal: 0,1,2 => 2,0,1', () => {
    const cards: CardStatus[]  = [
      {
        getCard: () => newFlashCard("I", "ich"),
        getResults: () => [true, false, false, true],
        recordResult: () => void {},
        clearResults: () => void {}
      },
      {
        getCard: () => newFlashCard("Squirrel", "Eichhoernchen"),
        getResults: () => [true, true, false, true],
        recordResult: () => void {},
        clearResults: () => void {}
      },
      {
        getCard: () => newFlashCard("Cat", "Katze"),
        getResults: () => [false, false, false, false],
        recordResult: () => void {},
        clearResults: () => void {}
      }
    ]

    const sortedCards = sorter.reorganize(cards)

    expect(sortedCards[0]).toEqual(cards[2])
    expect(sortedCards[1]).toEqual(cards[0])
    expect(sortedCards[2]).toEqual(cards[1])
  })

  test('number of failures is equal: 0,1,2 => 0,2,1', () => {
    const cards  = [
      {
        getCard: () => newFlashCard("I", "ich"),
        getResults: () => [true, false, false, true],
        recordResult: () => void {},
        clearResults: () => void {}
      },
      {
        getCard: () => newFlashCard("Squirrel", "Eichhoernchen"),
        getResults: () => [true, true, false, true],
        recordResult: () => void {},
        clearResults: () => void {}
      },
      {
        getCard: () => newFlashCard("Cat", "Katze"),
        getResults: () => [false, true, false, true],
        recordResult: () => void {},
        clearResults: () => void {}
      }
    ]

    const sortedCards = sorter.reorganize(cards)

    expect(sortedCards[0]).toEqual(cards[0])
    expect(sortedCards[1]).toEqual(cards[2])
    expect(sortedCards[2]).toEqual(cards[1])
  })

  test('number of failures is empty: return the same order', () => {
    const cards  = [
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
