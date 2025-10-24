import { Card } from "../types";

export async function handleStart(myDeck: Card[],
    dealerHand : Card[], 
    playerHand: Card[],
    playerMoney: number,
    bet: number
  ) {
    
  console.log(myDeck.length);
    const res = await fetch("/api/start",
      {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({
          myDeck, dealerHand, playerHand, playerMoney, bet
        })
      }
    )

    const data = await res.json();

    return data
} 