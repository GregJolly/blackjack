import { prisma } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { gameId } = body || {};

    if (!gameId) {
      return NextResponse.json(
        { error: "Missing gameId in request body" },
        { status: 400 }
      );
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: {
        playerMoney: true,
        bet: true,
        win: true,
        result: true,
        gameOver: true,
      },
    });

    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    if (!game.gameOver ) {
      return NextResponse.json({
        bet: game.bet,
        message: "",          // no message yet
        textColor: "",            // no color yet
        playerMoney: game.playerMoney, // unchanged
        wn: game.win ?? "",
      });
    }

    let newMoney = game.playerMoney;
    const bet = game.bet;
    let message = "";
    let textColor = "";

    switch (game.win) {
      case "true":
        newMoney += bet * 2;
        textColor = "text-green-400";
        if (game.result === "BLACKJACK") {
            message = "BLACKJACK!"
        }
        else {
            message = "YOU WIN!";
        }
        break;

      case "false":
        textColor = "text-red-400";
        if (game.result === "BUST") {  
            message = "YOU BUST!";
            break;
        }
        else
        {
            message = "DEALER WINS!";
        }
        break;

      default:
        message = "PUSH";
        newMoney += bet;
        textColor = "text-yellow-400";
        break;
    }

    // ✅ Update player money safely
    await prisma.game.update({
      where: { id: gameId },
      data: { playerMoney: newMoney },
    });

    return NextResponse.json({
      bet,
      message,
      textColor,
      playerMoney: newMoney,
      win : game.win,
    });

  } catch (error) {
    console.error("Error in /api/result:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
