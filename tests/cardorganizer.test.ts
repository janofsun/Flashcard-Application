import { FlashCard, newFlashCard } from '../src/cards/flashcard';
import { CardOrganizer, newCombinedCardOrganizer } from '../src/ordering/cardorganizer'
import { newMostMistakesFirstSorter } from '../src/ordering/prioritization/mostmistakes'
import { newRecentMistakesFirstSorter } from '../src/ordering/prioritization/recentmistakes'
import { newNonRepeatingCardOrganizer, newRepeatingCardOrganizer } from '../src/ordering/repetition/cardrepeater'

test('Throw a RangeError if repetitions is non-positive', () => {
    expect(() => newRepeatingCardOrganizer(0)).toThrow(RangeError)
    expect(() => newRepeatingCardOrganizer(-1)).toThrow(RangeError)
})

describe('NonCardOrganizer', () => {
    const cards  = [
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
    test('it should return same cards in shuffled order', () => {
        const cardOrganizer: CardOrganizer[] = []
        const combinedOrganizer = newCombinedCardOrganizer(cardOrganizer)
        const status = combinedOrganizer.reorganize(cards)
        expect(status.length).toEqual(3)
      })
})

describe('newCombinedCardOrganizer - with NonrepetitingSorter', () => {
    const cards  = [
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
    test('it should return cards as NonRepeating sorting, if repetitingSorter and NonrepetitingSorter both show up', () => {
        const cardOrganizer: CardOrganizer[] = [newNonRepeatingCardOrganizer()]
        const combinedOrganizer = newCombinedCardOrganizer(cardOrganizer)
        const status = combinedOrganizer.reorganize(cards)
        expect(status.length).toEqual(1)
      })

    test('it should return cards as NonRepeating sorting, if repetitingSorter and NonrepetitingSorter both show up', () => {
        const cardOrganizer: CardOrganizer[] = [newRepeatingCardOrganizer(2), newNonRepeatingCardOrganizer()]
        const combinedOrganizer = newCombinedCardOrganizer(cardOrganizer)
        const status = combinedOrganizer.reorganize(cards)
        expect(status.length).toEqual(1)
      })

    test('it should return cards as NonRepeating sorting', () => {
      const cardOrganizer: CardOrganizer[] = [newMostMistakesFirstSorter(), newNonRepeatingCardOrganizer()]
      const combinedOrganizer = newCombinedCardOrganizer(cardOrganizer)
      const status = combinedOrganizer.reorganize(cards)
      expect(status.length).toEqual(1)
    })

    test('it should return cards as NonRepeating sorting', () => {
        const cardOrganizer: CardOrganizer[] = [newRecentMistakesFirstSorter(), newNonRepeatingCardOrganizer()]
        const combinedOrganizer = newCombinedCardOrganizer(cardOrganizer)
        const status = combinedOrganizer.reorganize(cards)
        expect(status.length).toEqual(1)
      })
})

describe('newCombinedCardOrganizer - with RepetitingSorter', () => {
    const cards  = [
        {
            getCard: () => newFlashCard("Art", "Kind"),
            getResults: () => [false, true],
            recordResult: () => void {},
            clearResults: () => void {}
        },
        {
            getCard: () => newFlashCard("Hund", "Dog"),
            getResults: () => [true, true],
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
            getResults: () => [false, false, false, true],
            recordResult: () => void {},
            clearResults: () => void {}
        }
    ]
    test('Repeating sorting: 0,1,2,3 =>0,2,3', () => {
        const cardOrganizer: CardOrganizer[] = [newRepeatingCardOrganizer(2)]
        const combinedOrganizer = newCombinedCardOrganizer(cardOrganizer)
        const status = combinedOrganizer.reorganize(cards)
        expect(status.length).toEqual(3)
        expect(status[0]).toEqual(cards[0])
        expect(status[1]).toEqual(cards[2])
        expect(status[2]).toEqual(cards[3])
      })

    test('MosttMistakesFirst && Repeating sorting: 0,1,2,3 =>3,0,2', () => {
        const cardOrganizer: CardOrganizer[] = [newMostMistakesFirstSorter(), newRepeatingCardOrganizer(2)]
        const combinedOrganizer = newCombinedCardOrganizer(cardOrganizer)
        const status = combinedOrganizer.reorganize(cards)
        expect(status.length).toEqual(3)
        expect(status[0]).toEqual(cards[3])
        expect(status[1]).toEqual(cards[0])
        expect(status[2]).toEqual(cards[2])
      })

    test('RecentMistakesFirst && Repeating sorting: 0,1,2,3 =>2,0,3', () => {
        const cardOrganizer: CardOrganizer[] = [newRecentMistakesFirstSorter(), newRepeatingCardOrganizer(2)]
        const combinedOrganizer = newCombinedCardOrganizer(cardOrganizer)
        const status = combinedOrganizer.reorganize(cards)
        expect(status.length).toEqual(3)
        expect(status[0]).toEqual(cards[2])
        expect(status[1]).toEqual(cards[0])
        expect(status[2]).toEqual(cards[3])
    })
  })