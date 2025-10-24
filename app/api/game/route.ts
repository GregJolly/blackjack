import { createDeck } from "@/app/lib/deck";
import { games } from "@/app/lib/gameStore";
import { handScore } from "@/app/lib/handScore";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
    

export async function POST(req: Request){

    const {bet} = await req.json(); 

    const id = randomUUID();
    games[id] = {
        id, 
        deck: [],
        dealerHand: [],
        playerHand: [],
        playerMoney: 500-bet,
        result: "",
        gameOver: false
    }

    const deck = createDeck(); 
    const money = 2000 - bet;

    const card1 = deck.pop();
    const card2 = deck.pop();
    const card3 = deck.pop();
    const card4 = deck.pop();

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
            games[id] = {
                id, 
                deck: deck,
                dealerHand: dealerHand,
                playerHand: playerHand,
                playerMoney: money,
                result: "BLACKJACK",
                gameOver: true,
            }
        }
        else if(dealerScore == 21)
        {
            dealerHand[1].hidden = false;
            games[id] = {
                id, 
                deck: deck,
                dealerHand: dealerHand,
                playerHand: playerHand,
                playerMoney: money,
                result: "LOSE",
                gameOver: true,
            }
        }
    }
    

    return NextResponse.json({
        gameId: id,
        playerMoney: games[id].playerMoney
    })

}