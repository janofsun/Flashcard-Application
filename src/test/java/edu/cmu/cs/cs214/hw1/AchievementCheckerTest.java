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

public class AchievementCheckerTest {
    private List<FlashCard> cards;
    private List<CardOrganizer> cardOrganizers;
    private CardDeck cardDeck;
    private List<String> achieved;
    private List<String> checkNewAchievement;
    private AchievementChecker checker;
    private List<CardStatus> cardStatus;
    private static final long MILLI_PER_SEC = (long) 1000.0;

    @Before
    public void setUp() {
        achieved = new ArrayList<>();
        cards = new ArrayList<>();
        cardOrganizers = new ArrayList<>();
        cardOrganizers.add(new CardShuffler());
        checker = new AchievementChecker();
        FlashCard card1 = new FlashCard("ich", "I");
        FlashCard card2 = new FlashCard("Art", "Kind");
        cards.add(card1);
        cards.add(card2);
        cardDeck = new CardDeck(cards, new CombinedCardOrganizer(cardOrganizers));
        for (CardStatus cardstatus : cardDeck.getCards()) {
            cardstatus.recordResult(true);
        }
        checker.beginRound();
    }

    @Test
    public void testCheckCorrect() {
        achieved.add("All Correct in Last Round");
        achieved.add("Average Elapse Below 5s in Last Round");
        checkNewAchievement = checker.checkNewAchievements(cardDeck);
        boolean result = achieved.equals(checkNewAchievement);
        assertTrue(result);
    }

    @Test
    public void testCheckCorrectFailure() {
        achieved.add("Average Elapse Below 5s in Last Round");
        cardStatus = cardDeck.getCards();
        cardStatus.get(1).recordResult(false);
        checkNewAchievement = checker.checkNewAchievements(cardDeck);
        boolean result = achieved.equals(checkNewAchievement);
        assertTrue(result);
    }

    @Test
    public void testCheckCorrectDuplicate() {
        achieved.add("All Correct in Last Round");
        achieved.add("Average Elapse Below 5s in Last Round");
        checkNewAchievement = checker.checkNewAchievements(cardDeck);
        boolean result = achieved.equals(checkNewAchievement);
        assertTrue(result);
        cardStatus = cardDeck.getCards();
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(true);
        checkNewAchievement = checker.checkNewAchievements(cardDeck);
        boolean resultDuplicate = checkNewAchievement.equals(new ArrayList<>());
        assertTrue(resultDuplicate);
    }

    @Test
    public void testCheckSpeedFailure() {
        achieved.add("All Correct in Last Round");
        achieved.add("Average Elapse Below 5s in Last Round");
        try {
            Thread.sleep(10*MILLI_PER_SEC);
        } catch (InterruptedException e) {
            System.out.println("Thread interrupted");
        }
        checkNewAchievement = checker.checkNewAchievements(cardDeck);
        boolean speed = achieved.equals(checkNewAchievement);
        assertFalse(speed);
    }

    @Test
    public void testRepeat() {
        achieved.add("Average Elapse Below 5s in Last Round");
        achieved.add("Answer Some Card More than 5 Times");
        cardStatus = cardDeck.getCards();
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(true);
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(false);
        checkNewAchievement = checker.checkNewAchievements(cardDeck);
        boolean repeat = achieved.equals(checkNewAchievement);
        assertTrue(repeat);
    }

    @Test
    public void testRepeatSpeedFailure() {
        achieved.add("Answer Some Card More than 5 Times");
        cardStatus = cardDeck.getCards();
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(true);
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(false);
        try {
            Thread.sleep(10*MILLI_PER_SEC);
        } catch (InterruptedException e) {
            System.out.println("Thread interrupted");
        }
        checkNewAchievement = checker.checkNewAchievements(cardDeck);
        boolean repeat = achieved.equals(checkNewAchievement);
        assertTrue(repeat);
    }

    @Test
    public void testAll() {
        achieved.add("All Correct in Last Round");
        achieved.add("Average Elapse Below 5s in Last Round");
        achieved.add("Answer Some Card More than 5 Times");
        cardStatus = cardDeck.getCards();
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(true);
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(true);
        checkNewAchievement = checker.checkNewAchievements(cardDeck);
        boolean repeat = achieved.equals(checkNewAchievement);
        assertTrue(repeat);
    }

    @Test
    public void testRepeatBound() {
        achieved.add("Average Elapse Below 5s in Last Round");
        cardStatus = cardDeck.getCards();
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(true);
        cardStatus.get(1).recordResult(false);
        cardStatus.get(1).recordResult(false);
        checkNewAchievement = checker.checkNewAchievements(cardDeck);
        boolean repeat = achieved.equals(checkNewAchievement);
        assertTrue(repeat);
    }

    @Test
    public void testStartTime() {
        long currTime = System.currentTimeMillis();
        long startTime = checker.getStartTime();
        boolean time = currTime==startTime;
        assertTrue(time);
    }

    @Test
    public void testNull() {
        cardStatus = cardDeck.getCards();
        cardStatus.get(0).recordResult(false);
        cardStatus.get(1).recordResult(false);
        try {
            Thread.sleep(10*MILLI_PER_SEC);
        } catch (InterruptedException e) {
            System.out.println("Thread interrupted");
        }
        checkNewAchievement = checker.checkNewAchievements(cardDeck);     
        boolean result = achieved.equals(checkNewAchievement);   
        assertTrue(result);
    }

}
