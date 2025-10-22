"use server";

import type { Card } from "../lib/types";
import { handScore } from "../lib/handScore";

/**
 * Dealer draws until at least 17, compares with player's score, and returns result.
 */
export async function standAction(
  deck: Card[],
  dealerHand: Card[],
  playerHand: Card[]
): Promise<{
  deck: Card[];
  dealerHand: Card[];
  result: string;
}> {
  const newDeck = [...deck];
  const dealer = [...dealerHand];
  let dealerScore = handScore(dealer);

  // Reveal hidden dealer cards
  dealer.forEach((card) => (card.hidden = false));

  // Dealer must hit until 17 or higher
  while (dealerScore < 17 && newDeck.length > 0) {
    const card = newDeck.pop();
    if (card) dealer.push(card);
    dealerScore = handScore(dealer);
  }

  const playerScore = handScore(playerHand);
  let result = "";

  if (dealerScore > 21) result = "Dealer Busts — You Win!";
  else if (playerScore > dealerScore) result = "You Win!";
  else if (playerScore < dealerScore) result = "Dealer Wins!";
  else result = "Push (Tie)";

  return { deck: newDeck, dealerHand: dealer, result };
}
