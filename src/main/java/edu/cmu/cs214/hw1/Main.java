/**
 * @author Jie Sun @andrewID: jiesun2
 * HW1-task2: Command-line interface
 */
package edu.cmu.cs214.hw1;

import edu.cmu.cs214.hw1.cli.UI;
import edu.cmu.cs214.hw1.data.CardLoader;
import edu.cmu.cs214.hw1.data.CardStore;
import edu.cmu.cs214.hw1.ordering.CardDeck;
import edu.cmu.cs214.hw1.ordering.CardOrganizer;
import edu.cmu.cs214.hw1.ordering.CombinedCardOrganizer;
import edu.cmu.cs214.hw1.ordering.prioritization.CardShuffler;
import edu.cmu.cs214.hw1.ordering.prioritization.MostMistakesFirstSorter;
import edu.cmu.cs214.hw1.ordering.prioritization.RecentMistakesFirstSorter;
import edu.cmu.cs214.hw1.ordering.repetition.NonRepeatingCardOrganizer;
import edu.cmu.cs214.hw1.ordering.repetition.RepeatingCardOrganizer;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import joptsimple.OptionParser;
import joptsimple.OptionSet;

public final class Main {

    private Main() {
        // Disable instantiating this class.
        throw new UnsupportedOperationException();
    }
/**
 * This program should be runnable using the 'flashcard' keyword.
 * @param args  from the command line: flashcard <cards-file> [options]
 *              use -- as the seperator between each option in the command
 * @throws IOException
 */
    public static void main(String[] args) throws IOException {
        // set up options, extract command line arguments, fill in the relevant objects based on it.
        if (!args[0].equals("flashcard")) {
            throw new UnsupportedOperationException("Invalid command. Use flashcard <cards-file> [options]");
        }
        OptionParser parser = new OptionParser();
        parser.accepts("help").forHelp();
        parser.accepts("order").withOptionalArg()
                .ofType(String.class)
                .defaultsTo("random")
                .describedAs("The type of ordering to use, default \"random\"\n" +
                             "[choices: \"random\", \"worst-first\", \"recent-mistakes-first\"]");
        parser.accepts("repetitions").withOptionalArg()
                .describedAs("The number of times to each card should be answered\n" +
                              "successfully. If not provided, every card is presented once,\n" +
                              "regardless of the correctness of the answer.");
        parser.accepts("invertCards").withOptionalArg()
                .ofType(String.class)
                .defaultsTo("false")
                .describedAs("If set, it flips answer and question for each card. That is, it\n" + 
                              "prompts with the card's answer and asks the user\n" +
                              "to provide the corresponding question. \n" +
                              "Default: false");
        
        OptionSet options = parser.parse(Arrays.copyOfRange(args, 2, args.length));

        if (options.has("help")) {
            parser.printHelpOn( System.out );
            return;
        }
/**
 *  Parse the filePath of the flashcards file out of the command line, and throw an exception if not provided.
 */
        String filePath = args[1];
        File file = new File(filePath);
        if (!(file.exists() && !file.isDirectory())) {
            throw new UnsupportedOperationException("Invalid file path: " + filePath);
        }
        CardStore cards = new CardLoader().loadCardsFromFile(new File(filePath));

        List<CardOrganizer> cardOrganizers = new ArrayList<>();
        if (options.has("order")) {
            if (options.valueOf("order").equals("worst-first")) {
                System.out.println(options.valueOf("order"));
                cardOrganizers.add(new MostMistakesFirstSorter());
            } else if (options.valueOf("order").equals("recent-mistakes-first")) {
                cardOrganizers.add(new RecentMistakesFirstSorter());
            } else if (options.valueOf("order").equals("random")) {
                cardOrganizers.add(new CardShuffler());
            } else {
                throw new IllegalArgumentException(" Invalid options: " + 
                "The type of ordering to use, default \"random\"\n" +
                             "[choices: \"random\", \"worst-first\", \"recent-mistakes-first\"]");
            }
        } else {
            cardOrganizers.add(new CardShuffler());
        }
        
        int repetitionNum;
        if (options.has("repetitions")) {
            if (options.hasArgument("repetitions")) {
                try {
                    repetitionNum = Integer.parseInt((String) options.valueOf("repetitions"));
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException(" Invalid repetition number.");
                }
                if (repetitionNum < 1) {
                    throw new IllegalArgumentException(" Invalid repetition number.");
                } else {
                    cardOrganizers.add(new RepeatingCardOrganizer(repetitionNum));
                }
            } else {
                cardOrganizers.add(new NonRepeatingCardOrganizer());
            }
        } else {
            cardOrganizers.add(new NonRepeatingCardOrganizer());
        }

        boolean invertOrNot;
        if (options.has("invertCards")) {
            if (options.hasArgument("invertCards")) {
                try {
                    invertOrNot = Boolean.parseBoolean((String) options.valueOf("invertCards"));
                } catch (IllegalArgumentException e) {
                    throw new IllegalStateException(" Invalid argument. Should be a boolean. ");
                }
                if (invertOrNot) {
                    cards = cards.invertCards();
                }
            }
        }

        System.out.println(cardOrganizers);
        CombinedCardOrganizer combinedCardOrganizer = new CombinedCardOrganizer(cardOrganizers);
        CardDeck cardDeck = new CardDeck(cards.getAllCards(), combinedCardOrganizer);
        cardDeck.reorganize();
        new UI().studyCards(cardDeck);
    }

}