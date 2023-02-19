package edu.cmu.cs214.hw1.achievement;

import edu.cmu.cs214.hw1.ordering.CardDeck;

public interface Achievement {
    /**
     * Check if the achievement is accomplished.
     * @param startTime the start time of the current round, in milliseconds.
     * @param cardProducer the card deck for this trial.
     * @return true if achieved, else false
     */
    boolean isAchieved(long startTime, CardDeck cardProducer);
}