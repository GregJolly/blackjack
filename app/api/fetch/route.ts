// app/api/fetchCards/route.ts
import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { gameId }: { gameId: string } = await req.json();

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: {
        playerHand: true,
        dealerHand: true,
        playerMoney: true,
      },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json({
      playerHand: game.playerHand,
      dealerHand: game.dealerHand,
      money: game.playerMoney,
    });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
