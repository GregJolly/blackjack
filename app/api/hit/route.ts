    // Handles hit 

    import { prisma } from "@/app/lib/db";
import { games } from "@/app/lib/gameStore";
import { handScore } from "@/app/lib/handScore";
import { Card } from "@/app/lib/types";
import { NextResponse } from "next/server";

    export async function POST(req: Request)
    {
        const { id } : {id: string}= await req.json(); 


        const game = await prisma.game.findUnique({
            where: { id: id},
            select: {
                deck: true,
                playerHand: true,
                dealerHand: true, 
                result: true, 
                win: true, 
                gameOver: true
            }
    });
        
        if (!game) {
            return NextResponse.json(
              { error: "Game not found" },
              { status: 404 }
            );
          }

        
        const newDeck: Card[] = game.deck as Card[];
        const card = newDeck?.pop() 

        if(!card)
        {
            return NextResponse.json({error: "deck not found"},{status: 404})
        }

        const newHand = [...game.playerHand as Card[], card]


        let result : string;
        let win : string;
        let gameOver : boolean; 
        
        const playerScore = handScore(newHand)   
        
        if(playerScore > 21) //you bust
        {
            result = "BUST"
            win = "false"
            gameOver = true
        }
        else if(playerScore == 21) //you get 21
        { 
            
            result = "WIN"
            win = "true"
            gameOver = true
        }
        else //game continues
        {
            result = ""
            win = ""
            gameOver = false
        }

        await prisma.game.update({
            where: {id: id},
            data: {
                deck: newDeck,
                playerHand: newHand,
                result: result,
                win: win,
                gameOver: gameOver
            }
        })
    
        return NextResponse.json({
            playerHand: newHand,
            result: result,
            win: win,
            
        })
        
          
    }