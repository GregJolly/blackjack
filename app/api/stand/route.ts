import { handScore } from "@/app/lib/handScore"
import { NextResponse } from "next/server"


export async function POST(req: Request){

    const {deck, dealerHand, playerHand, dealersTurn, result} = await req.json()

    let newDeck = [...deck]
    let updatedHand = [...dealerHand]
    updatedHand[1].hidden = false


    while(handScore(updatedHand) < 18 )
    {
        const newCard = newDeck.pop()
        if(!newCard) break; 

        updatedHand.push(newCard)
    }
    
    const dealerScore = handScore(updatedHand)

    if(dealerScore > 21)
    {
        return NextResponse.json({
            message: "Dealer Bust! You won!", 
            deck: newDeck,
            dealerHand: updatedHand,
            dealersTurn: true,
            result: "WIN"
            

        })
    }
    else if(dealerScore === 21)
    {
        return NextResponse.json({
            message: "Dealer's got BlackJack! You lose!",
            deck: newDeck, 
            dealerHand: updatedHand,
            dealersTurn: true,
            result: "LOSE"
        })
    }
    else if (dealerScore > handScore(playerHand))
    {
        return NextResponse.json({
            message: "Dealer Wins! You lose!",
            deck: newDeck, 
            dealerHand: updatedHand,
            dealersTurn: true,
            result: "LOSE"
        })
    }
    else
    {
        return NextResponse.json({
            message: "Dealer Lost! You won",
            deck: newDeck,
            dealerHand: updatedHand,
            dealersTurn: true,
            result:  "WIN"
        })
    }
}