import { prisma } from "@/app/lib/db";
import { createDeck } from "@/app/lib/deck";
import { handScore } from "@/app/lib/handScore";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { text } from "stream/consumers";

export async function POST(req: Request) {
  try {
    const { bet } = await req.json();
    const id = randomUUID();

    const deck = createDeck();
    const money = 2000 - bet;

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
    let textColor = "" 
    let winMoney: number = 0; 
    let gameOver = false;

    if(playerScore === 21 || dealerScore === 21)
    {
      gameOver = true;
      dealerHand[1].hidden = false;
    }
    if (playerScore === 21) {
      result = "BLACKJACK";
      win = "true";
      message = "BLACKJACK!";
      textColor = "text-green-400";
      winMoney = bet;
      gameOver = true;
    } else if (dealerScore === 21) {
      dealerHand[1].hidden = false;
      result = "LOSE";
      win = "false";
      message = "DEALER WINS!";
      textColor = "text-red-400";
      winMoney = bet;
      gameOver = true;
    }
    else{
      result = "";
      win = "";
      gameOver = false; 
    }

    // ✅ Save to Supabase via Prisma
    const game = await prisma.game.create({
      data: {
        id,
        deck,
        dealerHand,
        playerHand,
        playerMoney: money,
        bet,
        result,
        win,
        gameOver,
      },
    });

    // ✅ Send response
    return NextResponse.json({
      gameId: game.id,
      dealerHand: game.dealerHand,
      playerHand: game.playerHand,
      playerMoney: game.playerMoney,
      betMoney: game.bet,
      result: game.result,
      win: game.win,
      gameOver: game.gameOver,
      message,
      textColor,
      winMoney
    });    
  } catch (err) {
    console.error("❌ Error creating game:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
