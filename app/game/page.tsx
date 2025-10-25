    "use client"

    import { Button } from "@/components/ui/button";
    import { useState } from "react";
  
    import Game from "../components/Game";

    export default function SetBet()
    {

    const [gameId, setGameId] = useState<string>("")
    const [gameState, setGameState] = useState(false)
    const [playerMoney, setPlayerMoney] = useState<number >(2000)
    const [dealerHand, setDealerHand] = useState()
    const [playerHand, setPlayerHand] = useState()
    const [betMoney, setBetMoney] = useState<number | null > (null)

    const chips = [{
        name: "100",
        value: 100,
        textColor: "text-red-950",
        bgColor: "bg-red-500"
    },
    {
        name:"250",
        value: 250,
        textColor: "text-yellow-950",
        bgColor: "bg-yellow-500"
    },
    {
        name:"500",
        value: 500,
        textColor: "text-blue-950",
        bgColor: "bg-blue-500"
    },
    {
        name:"1000",
        value: 1000,
        textColor: "text-purple-950",
        bgColor: "bg-purple-500"
    }


    ]
    
    async function createGame(bet: number)
    {
            const res = await fetch("/api/game", 
                {
                    method: "POST",
                    headers: {"Content-type" : "application/json"}, 
                    body: JSON.stringify({bet})

                }
            )

            const data = await res.json()

            setGameId(data.gameId)
            setPlayerMoney(data.playerMoney)
            setGameState(true)
    }

    return (
        <div className="min-h-screen max-w-4xl mx-auto flex items-center justify-center">
        <div className="flex flex-col space-y-[2rem] justify-center max-w-3xl mx-auto">
        { gameState == false ? (
            <div>
            <div className="flex justify-center items-center">
                <p className="text-3xl font-bold text-white">SET YOUR BET</p> 
            </div>

            <div className="flex justify-between gap-6 items-center max-w-3xl mx-auto">
                { chips.map((item) => (
                <Button
                    key={item.value}
                    disabled={item.value > playerMoney}
                    onClick={async () => {
                    await createGame(item.value);
                    setBetMoney(item.value);
                    }}
                    className={`${item.bgColor} rounded-full p-10 w-5 l-5`}
                >
                    <h1 className={`${item.textColor} text-xl font-extrabold`}>${item.name}</h1>
                </Button>
                ))}
            </div>
            </div>
        ) : (
            <Game gameId={gameId} playerMoney={playerMoney} betMoney={betMoney} />
        )}
        
        </div>
    </div>
    );    
    }