import { newCardDeck, CardDeck } from '../src/ordering/cardproducer'
import { FlashCard, newFlashCard } from '../src/cards/flashcard';
import { CardOrganizer, newCombinedCardOrganizer } from '../src/ordering/cardorganizer'
import { newMostMistakesFirstSorter } from '../src/ordering/prioritization/mostmistakes'
import { newRecentMistakesFirstSorter } from '../src/ordering/prioritization/recentmistakes'
import { newNonRepeatingCardOrganizer, newRepeatingCardOrganizer } from '../src/ordering/repetition/cardrepeater'
import { CardStatus, newCardStatus } from '../src/cards/cardstatus';

describe('Initialize a CardDeck to represent a set of cards in a specific order', () => {
    let initialCards: FlashCard[]

    beforeEach(() => {
      const card1 = newFlashCard('ich', 'I')
      const card2 = newFlashCard('Katze', 'Cat')
      const card3 = newFlashCard('Hund', 'Dog')
      initialCards = ([card1, card2, card3])
    })

    test('NonRepetingSorter: Two flashcards need to go', () => {
      const cardDeck = newCardDeck(initialCards, newNonRepeatingCardOrganizer())
      const status1 = cardDeck.getCards()[0]
      status1.recordResult(true)
      cardDeck.reorganize()
      expect(cardDeck.getCards().length).toEqual(2)
    })

    test('RepetingSorter(2)', () => {
        const cardOrganizer: CardOrganizer = newRepeatingCardOrganizer(2)
        const cardDeck = newCardDeck(initialCards, cardOrganizer)
        const status = cardDeck.getCards()
        status[0].recordResult(true)
        status[0].recordResult(true)
        status[1].recordResult(true)
        status[1].recordResult(false)
        cardDeck.reorganize()
        expect(cardDeck.getCards().length).toEqual(2)
      })

    test('CountCards:', () => {
      const cardDeck = newCardDeck(initialCards, newNonRepeatingCardOrganizer())
      expect(cardDeck.getCards().length).toEqual(3)
      const status1 = cardDeck.getCards()[0]
      status1.recordResult(true)
      cardDeck.reorganize()
      expect(cardDeck.countCards()).toEqual(2)
    })

    test('isComplete: True', () => {
      const cardDeckNull = newCardDeck([], newNonRepeatingCardOrganizer())
      cardDeckNull.reorganize()
      expect(cardDeckNull.isComplete()).toStrictEqual(true)
      const cardDeck = newCardDeck(initialCards, newNonRepeatingCardOrganizer())
      const status = cardDeck.getCards()
      status[0].recordResult(true)
      status[1].recordResult(false)
      status[2].recordResult(false)
      cardDeck.reorganize()
      expect(cardDeck.isComplete()).toStrictEqual(true)
    })

    test('isComplete: False', () => {
      const cardDeck = newCardDeck(initialCards, newNonRepeatingCardOrganizer())
      const status1 = cardDeck.getCards()[0]
      status1.recordResult(true)
      cardDeck.reorganize()
      expect(cardDeck.isComplete()).toStrictEqual(false)
    })
})