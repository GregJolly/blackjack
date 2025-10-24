import { Button } from "@/components/ui/button";
import { useState } from "react";
import { games } from "../lib/gameStore";

export default function SetBet()
{

   const [gameId, setGameId] = useState<string>("")
   const [gameState, setGameState] = useState(false)
   
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
        setGameState (true)
   }

    return (
        <div>
            <div className="flex flex-col space-y-[2rem] justify-center max-w-3xl mx-auto">
                <div className="flex justify-center item-center ">
                   <p className="text-3xl font-bold text-white">SET YOUR BET</p> 
                   
                </div>

                <div className="flex justify-between gap-6 items-center max-w-3xl mx-auto">
                    <Button
                    disabled={100 > games[gameId].playerMoney}
                    onClick={() => {
                        
                        createGame(100)
                        
                    }} className="bg-red-500 rounded-full p-10 w-5 l-5 "><h1 className="text-red-950 text-xl font-extrabold">$100</h1></Button>
                    <Button 
                    disabled={250 > games[gameId].playerMoney}
                    onClick={() => {
                        
                        createGame(250)
                       
                    }} className="bg-yellow-500 rounded-full p-10 w-5 l-5 "><h1 className="text-yellow-950 text-xl font-extrabold">$250</h1></Button>
                    <Button 
                    disabled={500 >  games[gameId].playerMoney}
                    onClick={() => {
                        
                        createGame(500)
                        
                    }} className="bg-blue-500 rounded-full p-10 w-5 l-5 "><h1 className="text-blue-950 text-xl font-extrabold">$500</h1></Button>
                    <Button 
                    disabled={1000 > games[gameId].playerMoney}
                    onClick={() => {
                        
                        createGame(1000)
                    }} className="bg-purple-500 rounded-full p-10 w-5 l-5 "><h1 className="text-red-950 text-xl font-extrabold">$1000</h1></Button>

                </div>
            </div>
        </div>
    )
}