import { prisma } from "@/app/lib/db"
import { games } from "@/app/lib/gameStore"
import { handScore } from "@/app/lib/handScore"
import { Card } from "@/app/lib/types"
import { NextResponse } from "next/server"


export async function POST(req: Request){
    try {
        const {gameId} = await req.json()
        let result: string;
        let win : string;

        const games = await prisma.game.findUnique({
            where: {id: gameId},
            select:{
                deck: true,
                playerHand: true,
                dealerHand: true,
            }
        })

        if(!games)
        {
            return NextResponse.json({error: "Game not found"},{status: 404})
        }

        const newDeck = [...games.deck as Card[]]
        const updatedHand = [...games.dealerHand as Card[]]
        updatedHand[1].hidden = false
        
        await new Promise(r => setTimeout(r, 200));
        while(handScore(updatedHand) < 18 && handScore(updatedHand) < handScore(games.playerHand as Card[]) )
        {
            const newCard = newDeck.pop()
            if(!newCard) break; 

            updatedHand.push(newCard)
        }

        await new Promise(r => setTimeout(r, 650));
        
        const dealerScore = handScore(updatedHand)
        if(dealerScore > 21)
        {

            result = "WIN"
            win = "true"
            
        }
        else if(dealerScore === 21)
        {

            result = "LOSE"
            win = "false"
        }
        else if (dealerScore > handScore(games.playerHand as Card[]))
        {
        
            result = "LOSE"
            win = "false"
        }
        else if(dealerScore == handScore(games.playerHand as Card[]))
        {
        
            result = "PUSH"
            win = ""
        }
        else
        {
            

            result = "WIN"
            win = "true"

        }

        const updatedGame = await prisma.game.update({
            where: {id: gameId},
            data:{
                deck: newDeck,
                dealerHand: updatedHand,
                result,
                win,
                gameOver: true,
            }
        })
        return NextResponse.json({
            deck: newDeck,
            dealerHand: [...updatedHand],
            dealersTurn: true,
            result,
            win,
        })
    }
    catch (error) {
        return NextResponse.json({error: "Internal Server Error"},{status: 500})
    }
    
}