import { createDeck } from "@/app/lib/deck";
import { NextResponse } from "next/server";

export async function POST(req: Request)
{
    const {deck , playerHand} = await req.json(); 

    const newDeck = [...deck]
    const card = newDeck.pop() 


    if(!card)
    {
        const reshuffledDeck = createDeck(); 
        return NextResponse.json({deck:newDeck, playerHand})
    }

    const newHand = [...playerHand, card]

    return NextResponse.json({deck:newDeck, playerHand:newHand})
}