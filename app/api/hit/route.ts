    // Handles hit 

    import { handScore } from "@/app/lib/handScore";
import { NextResponse } from "next/server";

    export async function POST(req: Request)
    {
        const { deck, playerHand } = await req.json(); 
    

        const newDeck = [...deck]
        const card = newDeck.pop() 

        if(!card)
        {
            return NextResponse.json({error: "deck not found"},{status: 404})
        }

        const newHand = [...playerHand, card]
        
        const playerScore = handScore(newHand)   
        
        if(playerScore > 21) //you bust
        {
            return NextResponse.json({
                deck: newDeck, 
                playerHand:newHand,
                hitButton: true,
                win:"false",
                result: "BUST"
            })

        }
        else if(playerScore == 21) //you get 21
        { 
            return NextResponse.json({
                deck: newDeck, 
                playerHand:newHand,
                hitButton: true,
                win:"true", 
                result: "WIN"
            })
        }

        return NextResponse.json({
            deck: newDeck, 
            playerHand:newHand,
            hitButton: false,
            win: "", 
            result: ""
        })
        
          
    }