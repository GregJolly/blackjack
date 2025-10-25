import { games } from "@/app/lib/gameStore"
import { NextResponse } from "next/server";

export async function POST(req: Request){

    const {gameId} = await req.json()

    const game = games[gameId];
    const winMoney = game.bet * 2
    const winColor = "text-green-400"
    const loseColor = "text-red-500";
    if(game.result == "WIN")
    {
        return NextResponse.json({
            winMoney, 
            message: "YOU WIN!",
            color: winColor
        })

    }
    else if(game.result == "BLACKJACK")
    {
        return NextResponse.json({
            winMoney, 
            message: "BLACKJACK!",
            color: winColor
        })
    }
    else if(game.result == "LOSE")
    {
        return NextResponse.json({
            winMoney, 
            message: "DEALER WINS!",
            color: loseColor
        })
    }
    else if(game.result == "BUST")
    {
        return NextResponse.json({
            winMoney, 
            message: "BUST",
            color: loseColor
        })
    }
    else if(game.result == "PUSH")
    {
        return NextResponse.json({
            winMoney, 
            message: "PUSH",
            color: "text-yellow-400"
        })
    }


}