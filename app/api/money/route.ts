import { games } from "@/app/lib/gameStore";
import { NextResponse } from "next/server";

export  async function POST(req: Request)
{
    const res = await req.json()

    const {win, gameId} = res; 
    const game = games[gameId]
    let newMoney = game.playerMoney
    const bet = game.bet

    switch (win){
        case "true":
            newMoney += bet*2; 
            game.playerMoney = newMoney; 
            break;
        case "false": 
            newMoney -= bet*2;
            game.playerMoney = newMoney; 
            break;
        default:
            break;

    }


    return NextResponse.json({
        playerMoney: newMoney
    })
  
}