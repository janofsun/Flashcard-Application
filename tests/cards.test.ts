import { CardStatus, newCardStatus } from '../src/cards/cardstatus';
import { FlashCard, newFlashCard } from '../src/cards/flashcard';

describe('newFlashCard - Create a new flashcard with a title and a definition', () => {
  const question = 'you'
  const answer = 'me'
  const flashCard = newFlashCard(question, answer)
  const otherCard1 = newFlashCard('she', 'he')
  const otherCard2 = newFlashCard('you', 'me')

  test('Q&A', () => {
    expect(flashCard.getQuestion()).toBe(question)
    expect(flashCard.getAnswer()).toBe(answer)
  })

  test('checkSuccess should return true', () => {
    // Ignores mismatches in capitalization and any extra leading or trailing whitespace
    expect(flashCard.checkSuccess(' ME ')).toBeTruthy()
    expect(flashCard.checkSuccess(' M E ')).toBeFalsy()
  })

  test('checkFailure should return false', () => {
    // Mismatched because of the wrong user response
    expect(flashCard.checkSuccess('Cat')).toBeFalsy()    
  })

  test('equals to other flashcard', () => {
    expect(flashCard.equals(otherCard2)).toBeTruthy()
  })

  test('not equals to other flashcard', () => {
    expect(flashCard.equals(otherCard1)).toBeFalsy()
  })
})

describe('newCardStatus - Create a new CardStatus instance', () => {
  test('getCard() returns the associated flashcard', () => {
    const flashcard = newFlashCard('ich', 'I');
    const cardStatus = newCardStatus(flashcard);
    expect(cardStatus.getCard()).toEqual(flashcard);
  })

  test('getResults() returns an empty array', () => {
    const flashcard = newFlashCard('Katze', 'Cat');
    const cardStatus = newCardStatus(flashcard);
    expect(cardStatus.getResults()).toEqual([]);
  });

  test('getResults() returns recent results', () => {
    const flashcard = newFlashCard('Katze', 'Cat');
    const cardStatus = newCardStatus(flashcard);
    cardStatus.recordResult(true);
    cardStatus.recordResult(false);
    cardStatus.recordResult(true);
    expect(cardStatus.getResults()).toEqual([true, false, true]);
  });

  test('recordResult() adds a new result to the results array', () => {
    const flashcard = newFlashCard('Hund', 'Dog');
    const cardStatus = newCardStatus(flashcard);
    cardStatus.recordResult(true);
    expect(cardStatus.getResults().length).toEqual(1)
    cardStatus.recordResult(false);
    expect(cardStatus.getResults().length).toEqual(2)
  });

  test('clearResults() resets the results array', () => {
    const flashcard = newFlashCard('Art', 'Kind');
    const cardStatus = newCardStatus(flashcard);
    cardStatus.recordResult(true);
    expect(cardStatus.getResults().length).toEqual(1)
    cardStatus.clearResults();
    expect(cardStatus.getResults()).toEqual([]);
  });
})