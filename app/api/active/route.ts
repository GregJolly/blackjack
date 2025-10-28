import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET (){
    try{
        const active = await prisma.game.findFirst({
            where: {gameOver: false},
            orderBy: { createdAt: 'desc' },
        })

        return  NextResponse.json(JSON.stringify({active: active !== null}))
    }
    catch (err)
    {
        return new Response("Internal Server Error", {status: 500})
    }
}
