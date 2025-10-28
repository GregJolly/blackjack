import { prisma } from "@/app/lib/db";
import { createDeck } from "@/app/lib/deck";
import { handScore } from "@/app/lib/handScore";
import { Card } from "@/app/lib/types";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { oldId, bet } = await req.json();

    if (!oldId || typeof bet !== "number" || bet <= 0) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // ✅ Fetch previous game securely
    const oldGame = await prisma.game.findUnique({ where: { id: oldId }
    , select: { playerMoney: true, deck: true } });
    if (!oldGame) {
      return NextResponse.json({ error: "Old game not found" }, { status: 404 });
    }

    if (oldGame.playerMoney < bet) {
      return NextResponse.json({ noFunds: true }, { status: 200 });
    }

    const id = randomUUID();

    let deck: Card [] = [];
    
    if(oldGame.deck as Card [] !== null)
    {
        
        if ((oldGame.deck as Card []).length < 15) {
        deck = createDeck();
        } else {
        deck = oldGame.deck as Card [];
        }
    }

   
    const money = oldGame.playerMoney - bet;

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
    let gameOver = false;

    if (playerScore === 21) {
      result = "BLACKJACK";
      win = "true";
      gameOver = true;
    } else if (dealerScore === 21) {
      dealerHand[1].hidden = false;
      result = "LOSE";
      win = "false";
      gameOver = true;
    }

    // ✅ Use a transaction for safety
    const [game] = await prisma.$transaction([
      prisma.game.create({
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
      }),
      prisma.game.delete({
        where: { id: oldId },
      }),
    ]);

    // ✅ Return the new game
    return NextResponse.json({
      gameId: game.id,
      dealerHand,
      playerHand,
      playerMoney: money,
      bet,
      result,
      gameOver,
    });
  } catch (error) {
    console.error("Error in restart endpoint:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
