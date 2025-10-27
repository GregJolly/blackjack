// app/api/fetchCards/route.ts
import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { gameId }: { gameId: string } = await req.json();

    const games= await prisma.game.findUnique({
      where: { id: gameId },
      select: {
        playerHand: true,
        dealerHand: true,
        playerMoney: true,
      },
    });

    if (!games) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json({
      playerHand: games.playerHand,
      dealerHand: games.dealerHand,
      money: games.playerMoney,
    });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
