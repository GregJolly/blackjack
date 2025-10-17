    // Handles hit 

    import { createDeck } from "@/app/lib/deck";
    import { games } from "@/app/lib/gameStore";
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
        

        return NextResponse.json({deck: newDeck, playerHand:newHand})
    }