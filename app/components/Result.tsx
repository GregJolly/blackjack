import { useState } from "react"

export default function Result({result} : {result: string})

{
  

    if (result == "WIN")
    {

        return (
            <div className="flex justify-center flex-col items-center">
            <div className="text-white font-extrabold text-3xl"> YOU WIN! </div>
            <h1 className="text-green-400 text-2xl font-extrabold">+100</h1>
            </div>
        )
    }
    else if (result == "BLACKJACK")
    {
        return (
            <div className="flex justify-center flex-col items-center">
            <div className="text-white font-extrabold text-3xl"> BLACKJACK </div>
            <h1 className="text-green-400 text-2xl font-extrabold">+100</h1>
            </div>
        )
        
    }
    else if(result == "LOSE")
    {
        return (
            <div className="flex justify-center flex-col items-center">
            <div className="text-white font-extrabold text-3xl"> DEALER WINS! </div>
            <h1 className="text-red-500 text-2xl font-extrabold">-100</h1>
            </div>
        )
        
    }
    else if(result == "BUST")
        {
            return (
                <div className="flex justify-center flex-col items-center">
                <div className="text-white font-extrabold text-3xl"> BUST </div>
                <h1 className="text-red-500 text-2xl font-extrabold">-100</h1>
                </div>
            )
        }
    else if(result == "PUSH")
        {
            return (
                <div className="text-white font-extrabold text-3xl"> PUSH</div>
            )
        }
}