/**
 * @author Jie Sun @andrewID: jiesun2
 * HW1-task2: Command-line interface
 */
import { CardStore, loadCards } from './data/store'
import { newCardDeck } from './ordering/cardproducer'
import { CardOrganizer, newCombinedCardOrganizer } from './ordering/cardorganizer'
import { newCardShuffler } from './ordering/prioritization/cardshuffler'
import { newMostMistakesFirstSorter } from './ordering/prioritization/mostmistakes'
import { newRecentMistakesFirstSorter } from './ordering/prioritization/recentmistakes'
import { newNonRepeatingCardOrganizer, newRepeatingCardOrganizer } from './ordering/repetition/cardrepeater'
import { newUI } from './ui'
import yargs from 'yargs'
import { argv } from 'process'
import * as fs from 'fs'

if (argv[2] !== 'flashcard') {
  throw new Error('Invalid command. Use flashcard <cards-file> [options]')
}
// Parse the flashcards filePath out of the command line
const filePath = argv[3]
try {
  fs.accessSync(filePath, fs.constants.F_OK | fs.constants.R_OK)
} catch (err) {
  throw new Error('Invalid filePath. Use flashcard <cards-file> [options]')
}
let cards: CardStore = loadCards(filePath)

/**
 * Use Yargs package for CLI task: https://yargs.js.org/docs/#api-reference
 * This program should be runnable using the 'flashcard' keyword.
 * Node's process.argv() array starts with two extra elements:
 * process.execPath and the path to the JavaScript file being executed
 * Use process.argv.slice(2) in Node
 * Use -- to tell yargs to stop adding values to the array.
 */
const parser = yargs(process.argv.slice(4))
  .strict()
  .usage('$node dist/index.js flashcard <cards-file> [options]')
  .option('help', {
    type: 'boolean',
    describe: 'Show help'
  })
  .option('order', {
    type: 'string',
    describe: 'The type of ordering to use, default "random" [choices: "random", "worst-first", "recent-mistakes-first"]',
    default: 'random'
  })
  .option('repetitions', {
    type: 'number',
    describe: 'The number of times to each card should be answered successfully. If not provided, every card is presented once, regardless of the correctness of the answer.'
  })
  .option('invertCards', {
    type: 'boolean',
    describe: "If set, it flips answer and question for each card. That is, it prompts with the card's answer and asks the user to provide the corresponding question. Default: false",
    default: false
  })
  .parseSync()

/**
 * The --help flag with any other options should just display the help message and exit
 */
console.log(parser)
if (parser.help !== null && parser.help !== undefined && parser.help) {
  yargs.showHelp()
}

const cardOrganizers: CardOrganizer[] = []
if (parser.order !== '') {
  switch (parser.order) {
    case 'worst-first':
      cardOrganizers.push(newMostMistakesFirstSorter())
      break
    case 'recent-mistakes-first':
      cardOrganizers.push(newRecentMistakesFirstSorter())
      break
    case 'random':
      cardOrganizers.push(newCardShuffler())
      break
    default:
      throw new Error('Invalid option: ' + String(parser.order) + ' [choices: "random", "worst-first", "recent-mistakes-first"]')
  }
} else {
  cardOrganizers.push(newCardShuffler())
}
/**
 * if there is no argument following the 'repetitions' option keyword
 * or invalid option (e.g. characters, NaN, etc) is provided,
 * every card is presented once
 */
if (parser.repetitions !== null && parser.repetitions !== undefined && Number.isFinite(parser.repetitions)) {
  if (parser.repetitions > 0 && !isNaN(parser.repetitions)) {
    cardOrganizers.push(newRepeatingCardOrganizer(parser.repetitions))
  } else {
    throw new Error('Invalid repetition number.')
  }
} else {
  cardOrganizers.push(newNonRepeatingCardOrganizer())
}

if (parser.invertCards !== null && parser.invertCards !== undefined && parser.invertCards) {
  cards = cards.invertCards()
}

const combinedCardOrganizer = newCombinedCardOrganizer(cardOrganizers)
const cardDeck = newCardDeck(cards.getAllCards(), combinedCardOrganizer)
newUI().studyCards(cardDeck)
