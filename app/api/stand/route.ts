import { handScore } from "@/app/lib/handScore"
import { NextResponse } from "next/server"


export async function POST(req: Request){

    const {deck, dealerHand, playerHand} = await req.json()

    const newDeck = [...deck]
    const updatedHand = [...dealerHand]
    updatedHand[1].hidden = false
    
    await new Promise(r => setTimeout(r, 200));
    while(handScore(updatedHand) < 18 && handScore(updatedHand) < handScore(playerHand) )
    {
        const newCard = newDeck.pop()
        if(!newCard) break; 

        updatedHand.push(newCard)
    }

    await new Promise(r => setTimeout(r, 650));
    
    const dealerScore = handScore(updatedHand)
    if(dealerScore > 21)
    {
        return NextResponse.json({
            message: "Dealer Bust! You won!", 
            deck: newDeck,
            dealerHand: updatedHand,
            dealersTurn: true,
            hitButton: true, 
            result: "WIN",
            win: "true"
            
        })
    }
    else if(dealerScore === 21)
    {
        return NextResponse.json({
            message: "Dealer's got BlackJack! You lose!",
            deck: newDeck, 
            dealerHand: updatedHand,
            dealersTurn: true,
            result: "LOSE",
            hitButton: true, 
            win: "false", 

        })
    }
    else if (dealerScore > handScore(playerHand))
    {
        return NextResponse.json({
            message: "Dealer Wins! You lose!",
            deck: newDeck, 
            dealerHand: updatedHand,
            dealersTurn: true,
            result: "LOSE",
            hitButton: true,
            win: "false",
        })
    }
    else if(dealerScore == handScore(playerHand))
    {
        return NextResponse.json({
            message: "PUSH!",
            deck: newDeck, 
            dealerHand: updatedHand,
            dealersTurn: true,
            result: "PUSH",
            hitButton: true,
            win: "",
        })
    }
    else
    {
        return NextResponse.json({
            message: "Dealer Lost! You won",
            deck: newDeck,
            dealerHand: updatedHand,
            dealersTurn: true,
            result:  "WIN",
            hitButton: true,
            win: "true", 
        })
    }
}