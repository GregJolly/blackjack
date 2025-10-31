import { prisma } from "@/app/lib/db";
import { createDeck } from "@/app/lib/deck";
import { handScore } from "@/app/lib/handScore";
import { Card } from "@/app/lib/types";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { oldId, bet } = await req.json();
    const user = await currentUser();


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
        winMoney = bet * 2;
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
      result: result,
      gameOver,
      message,
      textColor,
      winMoney,
      win,
    });
  } catch (error) {
    console.error("Error in restart endpoint:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
