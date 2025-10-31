
import { createDeck } from "@/app/lib/deck";
import { handScore } from "@/app/lib/handScore";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/app/lib/db";

export async function POST(req: Request) {
  try {
    const { bet } = await req.json();
    const id = randomUUID();
    const { userId } = await auth();
    
    const playerId = userId; 

    if (!playerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    

    
    const deck = createDeck();
    const newMoney = 2000 - bet;

   

    // 🃏 Deal cards
    const card1 = deck.pop();
    const card2 = deck.pop();
    const card3 = deck.pop();
    const card4 = deck.pop();

    if (!card1 || !card2 || !card3 || !card4) {
      return NextResponse.json({ error: "Could not deal cards" }, { status: 500 });
    }

    const dealerHand = [
      { ...card1, hidden: false },
      { ...card2, hidden: true },
    ];
    const playerHand = [card3, card4];

    const playerScore = handScore(playerHand);
    const dealerScore = handScore(dealerHand);

    let result = "";
    let win = "";
    let message = "";
    let textColor = "";
    let winMoney = 0;
    let gameOver = false;
  

    // 🎯 Win/Lose logic
    if (playerScore === 21 || dealerScore === 21) {
      gameOver = true;
      dealerHand[1].hidden = false;
    }

    if (playerScore === 21) {
      result = "BLACKJACK";
      win = "true";
      message = "BLACKJACK!";
      textColor = "text-green-400";
      winMoney = bet;
      
    } else if (dealerScore === 21) {
      result = "LOSE";
      win = "false";
      message = "DEALER WINS!";
      textColor = "text-red-400";
      winMoney = 0;
    
    }

    // 🎮 Save game
    const game = await prisma.game.create({
      data: {
        id,
        deck,
        dealerHand,
        playerHand,
        playerMoney: newMoney,
        bet,
        result,
        win,
        gameOver,
      },
    });



    // ✅ Return response
    return NextResponse.json({
      gameId: game.id,
      
      dealerHand: game.dealerHand,
      playerHand: game.playerHand,
      playerMoney: newMoney,
      betMoney: bet,
      result,
      win,
      gameOver,
      message,
      textColor,
      winMoney,
    });
  } catch (err) {
    console.error("❌ Error creating game:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
