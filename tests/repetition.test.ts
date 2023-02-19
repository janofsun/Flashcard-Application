import { newNonRepeatingCardOrganizer, newRepeatingCardOrganizer } from '../src/ordering/repetition/cardrepeater'
import { FlashCard, newFlashCard } from '../src/cards/flashcard';
import { CardStatus } from '../src/cards/cardstatus';

describe('newNonRepeatingCardOrganizer', () => {
  test('return all cards that have been answered at least once', () => {
    const cardOrganizer = newNonRepeatingCardOrganizer()
    const cards: CardStatus[]  = [
      {
        getCard: () => newFlashCard("Hund", "Dog"),
        getResults: () => [],
        recordResult: () => void {},
        clearResults: () => void {}
      },
      {
        getCard: () => newFlashCard("I", "ich"),
        getResults: () => [false],
        recordResult: () => void {},
        clearResults: () => void {}
      },
      {
        getCard: () => newFlashCard("Cat", "Katze"),
        getResults: () => [true, false, false, true],
        recordResult: () => void {},
        clearResults: () => void {}
      }
    ]
    expect(cards).toHaveLength(3)
    const cardsNonRepetition = cardOrganizer.reorganize(cards)
    expect(cardsNonRepetition).toHaveLength(1)
  })
})

describe('newRepeatingCardOrganizer', () => {
  test('it should return all cards that have been answered correctly at least the number of repetitions', () => {
    const cardOrganizer = newRepeatingCardOrganizer(2)
    const cards: CardStatus[]  = [
      {
        getCard: () => newFlashCard("I", "ich"),
        getResults: () => [true, false, false, false],
        recordResult: () => void {},
        clearResults: () => void {}
      },
      {
        getCard: () => newFlashCard("Cat", "Katze"),
        getResults: () => [true, false, false, true],
        recordResult: () => void {},
        clearResults: () => void {}
      }
    ]
    const expected = [
      {
        getCard: () => newFlashCard("I", "ich"),
        getResults: () => [true, false, false, false],
        recordResult: () => void {},
        clearResults: () => void {}
      }
    ]
    const sortedCards = cardOrganizer.reorganize(cards)
    let res = false
    for (const card of sortedCards) {
      if (card.getCard().equals(expected[0].getCard())) res = true
    }
    expect(res).toBeTruthy()
  })

  test('Throw a RangeError if repetitions is non-positive', () => {
    expect(() => newRepeatingCardOrganizer(0)).toThrow(RangeError)
    expect(() => newRepeatingCardOrganizer(-1)).toThrow(RangeError)
  })
})
