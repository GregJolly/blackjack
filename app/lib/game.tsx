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
      <button
        onClick={startGame}
        className="px-4 py-2 bg-green-600 text-white rounded-md"
      >
        Start Game
      </button>

      <div>
        <h2 className="font-bold text-xl mb-2">Dealer</h2>
        <div className="flex gap-2">
          {dealerHand.map((card, i) => (
            <img key={i} src={card.imageUrl} alt={card.name} className="w-16" />
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-bold text-xl mb-2">Player</h2>
        <div className="flex gap-2">
          {playerHand.map((card, i) => (
            <img key={i} src={card.imageUrl} alt={card.name} className="w-16" />
          ))}
        </div>
      </div>
    </div>
  );
}
