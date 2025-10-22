//Handles Start

import { createDeck } from "@/app/lib/deck";
import { NextResponse } from "next/server";
import type { Card } from "@/app/lib/types";
import { handScore } from "@/app/lib/handScore";

export async function POST(req: Request) {
  const { myDeck } = await req.json(); 

  

  let newDeck: Card [] = []

  if(myDeck == null || myDeck.length < 15)
  {
    newDeck = createDeck(); 
  }
  else{
    newDeck = [...myDeck]
  }

  console.log(myDeck);

  console.log(newDeck.length)
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

    const playerScore = handScore(playerHand);
    const dealerScore = handScore(dealerHand)

    if(playerScore == 21)
      {
        return NextResponse.json({
            deck: newDeck, 
            dealerHand, 
            playerHand, 
            gameState:true,
            playerMoney: 2000,
            hitButton: true, 
            result: "BLACKJACK",
            win:"true",
            dealersTurn: false
          })
      }
    else if(dealerScore == 21)
    {
      dealerHand[1].hidden = false
      return NextResponse.json({
        deck: newDeck, 
        dealerHand, 
        playerHand, 
        gameState:true,
        playerMoney: 2000,
        hitButton: true, 
        result: "LOSE",
        win:"false",
        dealersTurn: true
      })
    }

    return NextResponse.json({
      deck: newDeck, 
      dealerHand, 
      playerHand, 
      gameState:true,
      playerMoney: 2000,
      hitButton: false,
      result: "",
      win:"", 
      dealersTurn: false
    })
  }

  return NextResponse.json(
    { error: "Could not create deck or assign hands" },
    { status: 500 }
  );
}
