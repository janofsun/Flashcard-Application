package edu.cmu.cs214.hw1.achievement;

import edu.cmu.cs214.hw1.cards.CardStatus;
import edu.cmu.cs214.hw1.ordering.CardDeck;

import java.util.List;

public enum AchievementType implements Achievement {
    /**
     * This is achieved by answering all questions correctly in the latest round
     */
    CORRECT("All Correct in Last Round") {
        public boolean isAchieved(long startTime, CardDeck cardProducer) {
            for (CardStatus cardStatus : cardProducer.getCards()) {
                List<Boolean> results = cardStatus.getResults();
                if (!Boolean.TRUE.equals(results.get(results.size() - 1))) {
                    return false;
                }
            }
            return true;
        }
    },
    /**
     * this is achieved when it takes below 5 sec per question on average in the latest round
     */
    SPEED("Average Elapse Below 5s in Last Round") {
        public boolean isAchieved(long startTime, CardDeck cardProducer) {
            long endTime = System.currentTimeMillis();
            double durationSec = (endTime - startTime) / MILLI_PER_SEC;
            double avgSec = durationSec / cardProducer.countCards();
            return avgSec < AVG_TIME_BOUND;
        }
    },
    /**
     * this is achieved when a card has been answered more than 5 times
     */
    REPEAT("Answer Some Card More than 5 Times") {
        public boolean isAchieved(long startTime, CardDeck cardProducer) {
            for (CardStatus cardStatus : cardProducer.getCards()) {
                if (cardStatus.getResults().size() > CARD_TIMES_BOUND) {
                    return true;
                }
            }
            return false;
        }
    };
    private final String title;
    private static final double MILLI_PER_SEC = 1000.0;
    private static final int AVG_TIME_BOUND = 5;
    private static final int CARD_TIMES_BOUND = 5;

    AchievementType(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return title;
    }
}