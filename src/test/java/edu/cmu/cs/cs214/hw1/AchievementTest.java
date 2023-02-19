package edu.cmu.cs.cs214.hw1;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

import edu.cmu.cs214.hw1.achievement.*;
import edu.cmu.cs214.hw1.cards.*;
import edu.cmu.cs214.hw1.ordering.*;
import edu.cmu.cs214.hw1.ordering.prioritization.CardShuffler;

import java.util.ArrayList;
import java.util.List;

public class AchievementTest {
    private List<FlashCard> cards;
    private List<CardOrganizer> cardOrganizers;
    private List<CardStatus> cardStatus;
    private CardDeck cardDeck;
    private static final long MILLI_PER_SEC = (long) 1000.0;

    @Before
    public void setUp() {
        cards = new ArrayList<>();   
        cardOrganizers = new ArrayList<>();
        cardOrganizers.add(new CardShuffler());
        cardStatus = new ArrayList<>();
        FlashCard card1 = new FlashCard("ich", "I");
        FlashCard card2 = new FlashCard("Art", "Kind");
        cards.add(card1);
        cards.add(card2);
        cardDeck = new CardDeck(cards, new CombinedCardOrganizer(cardOrganizers));
        for (CardStatus cardstatus : cardDeck.getCards()) {
            cardstatus.recordResult(true);
        }
    }
    /**
     * This is achieved by answering all questions correctly in the latest round
     */
    @Test
    public void testCorrectCase() {
        long startTime = System.currentTimeMillis();
        boolean result = AchievementType.CORRECT.isAchieved(startTime, cardDeck);
        assertTrue(result);
    }

    @Test
    public void testIncorrectCase() {
        long startTime = System.currentTimeMillis();
        cardStatus = cardDeck.getCards();
        cardStatus.get(1).recordResult(false);
        boolean result = AchievementType.CORRECT.isAchieved(startTime, cardDeck);
        assertFalse(result);
    }

    @Test
    public void testIncorrectCaseEmpty() {
        cardStatus = cardDeck.getCards();
        if (cardStatus.size() == 0) {
            throw new IllegalArgumentException("The card deck is empty.");
        }
    }
    /**
     * this is achieved when it takes below 5 sec per question on average in the latest round
     */
    @Test
    public void testSpeedCase() {
        long startTime = System.currentTimeMillis();
        boolean result = AchievementType.SPEED.isAchieved(startTime, cardDeck);
        assertTrue(result);
    }

    @Test
    public void testSpeedFailure() {
        long startTime = System.currentTimeMillis();
        try {
            Thread.sleep(10*MILLI_PER_SEC);
        } catch (InterruptedException e) {
            System.out.println("Thread interrupted");
        }
        boolean result = AchievementType.SPEED.isAchieved(startTime, cardDeck);
        assertFalse(result);
    }
    /**
     * this is achieved when a card has been answered more than 5 times
     */
    @Test
    public void testRepeat() {
        long startTime = System.currentTimeMillis();
        cardStatus = cardDeck.getCards();
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(true);
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(false);
        boolean result = AchievementType.REPEAT.isAchieved(startTime, cardDeck);
        assertTrue(result);
    }

    @Test
    public void testRepeatBound() {
        long startTime = System.currentTimeMillis();
        cardStatus = cardDeck.getCards();
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(true);
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(false);
        boolean result = AchievementType.REPEAT.isAchieved(startTime, cardDeck);
        assertFalse(result);
    }
}
