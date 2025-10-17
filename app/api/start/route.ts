//Handles Start

import { createDeck } from "@/app/lib/deck";
import { NextResponse } from "next/server";
import type { Card } from "@/app/lib/types";

export async function POST() {
  const newDeck: Card[] = createDeck();
  const card1 = newDeck.pop();
  const card2 = newDeck.pop();
  const card3 = newDeck.pop();
  const card4 = newDeck.pop();

  if (card1 && card2 && card3 && card4) {
    const dealerHand = [
      { ...card1, hidden: false },
      { ...card2, hidden: true },
    ];
    const playerHand = [card3, card4];
    return NextResponse.json({ deck: newDeck, dealerHand, playerHand, gameState: true });
  }

  return NextResponse.json(
    { error: "Could not create deck or assign hands" },
    { status: 500 }
  );
}
