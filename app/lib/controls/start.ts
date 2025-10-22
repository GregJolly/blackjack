"use server";
import { createDeck } from "../deck";
import type { Card } from "../types";

export async function startGame() {
  const deck = createDeck();
  const card1 = deck.pop();
  const card2 = deck.pop();
  const card3 = deck.pop();
  const card4 = deck.pop();

  if (!card1 || !card2 || !card3 || !card4) throw new Error("Deck error");

  const dealerHand: Card[] = [
    { ...card1, hidden: false },
    { ...card2, hidden: true },
  ];
  const playerHand: Card[] = [card3, card4];

  return { deck, dealerHand, playerHand };
}
