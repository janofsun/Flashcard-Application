package edu.cmu.cs214.hw1.achievement;

import edu.cmu.cs214.hw1.ordering.CardDeck;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class AchievementChecker{
    private long startTime;
    private Set<Achievement> achieved;

    public AchievementChecker() {
        startTime = 0;
        achieved = new HashSet<>();
    }

    /**
     * record the starting time for the current round
     */
    public void beginRound() {
        this.startTime = System.currentTimeMillis();
    }

    /**
     * checks any new achievements after a round
     * @param cardProducer the card deck for this trial
     * @return a list of string representing new achievements for this round
     */
    public List<String> checkNewAchievements(CardDeck cardProducer) {
        List<String> results = new ArrayList<>();
        for (Achievement achievement : AchievementType.values()) {
            if (!achieved.contains(achievement) && achievement.isAchieved(startTime, cardProducer)) {
                results.add(achievement.toString());
                achieved.add(achievement);
            }
        }
        return results;
    }

    /**
     * for test purpose
     * @return return the startTime, in milliseconds
     */
    public long getStartTime() {
        return startTime;
    }
}