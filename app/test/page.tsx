"use client";

import { createDeck } from "@/app/lib/deck";
import type { Card } from "@/app/lib/types";
import { useState } from "react";

export default function Game() {
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);

  function startGame() {
    const newDeck = createDeck();
    const card1 = newDeck.pop();
    const card2 = newDeck.pop();
    const card3 = newDeck.pop();
    const card4 = newDeck.pop();

    if (card1 && card2 && card3 && card4) {
      setDealerHand([card1, card2]);
      setPlayerHand([card3, card4]);
    }
  }

  return (
    <div className="p-6 flex flex-col gap-6">

    </div>
  );
}
