package edu.cmu.cs214.hw1.cards;

public record FlashCard(String question, String answer) {

    /**
     * Checks whether the provided response matches the target. Ignores mismatches in capitalization and any extra leading or trailing whitespace.
     *
     * @param response The user-provided response.
     * @return {@code true} if the target matches the response.
     */
    public boolean checkSuccess(String response) {
        // By default, implement a lenient (whitespace- and case-insensitive) String equality check.
        return this.answer.trim().equalsIgnoreCase(response.trim());
    }


}
