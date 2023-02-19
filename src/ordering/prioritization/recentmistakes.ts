import { CardStatus } from '../../cards/cardstatus'
import { CardOrganizer } from '../cardorganizer'

function newRecentMistakesFirstSorter (): CardOrganizer {
  function recentFailure (cardStatus: CardStatus): number {
    const statusLength = cardStatus.getResults().length
    return ((statusLength > 0 && (cardStatus.getResults().at(-1) === false)) ? 1 : 0)
  }

  return {
    /**
       * Orders the cards by the number of incorrect answers provided for them.
       *
       * @param cards The {@link CardStatus} objects to order.
       * @return The ordered cards.
       */
    reorganize: function (cards: CardStatus[]): CardStatus[] {
      const c = cards.slice()
      c.sort((a, b) => recentFailure(a) > recentFailure(b) ? -1 : (recentFailure(a) < recentFailure(b) ? 1 : 0))
      return c
    }

  }
}

export { newRecentMistakesFirstSorter }
