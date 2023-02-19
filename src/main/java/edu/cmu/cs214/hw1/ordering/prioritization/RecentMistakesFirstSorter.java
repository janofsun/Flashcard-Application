package edu.cmu.cs214.hw1.ordering.prioritization;

import edu.cmu.cs214.hw1.cards.CardStatus;
import edu.cmu.cs214.hw1.ordering.CardOrganizer;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class RecentMistakesFirstSorter implements CardOrganizer {
    /**
     * Orders the cards so that those that were answered incorrectly on the last answer appear first.
     *
     * @param cards The {@link CardStatus} objects to order.
     * @return The ordered cards.
     */
    @Override
    public List<CardStatus> reorganize(List<CardStatus> cards) {
        return cards.stream()
                .sorted(Comparator.comparingInt(this::recentFailures).reversed())
                .collect(Collectors.toList());
    }

    private int recentFailures(CardStatus cardStatus) {
        int statusLength = cardStatus.getResults().size();
        return (statusLength>=1 && !cardStatus.getResults().get(statusLength-1)? 1 : 0);
    }
    
}
