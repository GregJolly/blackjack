import { prisma } from "@/app/lib/db";
import { games } from "@/app/lib/gameStore";
import { NextResponse } from "next/server";

export  async function POST(req: Request)
{
    try{
    
        const res = await req.json()

        const {gameId} = res; 
        const games = await prisma.game.findUnique({
            where: {id: gameId },
            select:{
                playerMoney: true,
                bet: true,
                win: true
            }
        })

        if (!games) {
            return NextResponse.json(
            { error: "Game not found" },
            { status: 404 }
            );
        }

        let newMoney = games.playerMoney
        const bet = games.bet

        switch (games.win){
            case "true":
                newMoney += bet*2; 
                
                break;
            case "false": 
                break;
            default:
                break;

        }

        await prisma.game.update({
            where: {id: gameId },
            data:{
                playerMoney: newMoney
            }
        })


        return NextResponse.json({
            playerMoney: newMoney
        })
    }catch(error){
    console.error("Error updating money:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}