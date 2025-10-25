import { useState } from "react"

export default function Result({ gameId} : {gameId: string})

{
  
    const [winMoney, setWinMoney] = useState(); 
    const [message, setMessage] = useState(""); 
    const [textColor, setTextColor] = useState("");

    async function getBet(){

        const res = await fetch("/api/result", 
            {
                method: "POST",
                headers: {"Content-type" : "application/json"},
                body: JSON.stringify({
                   gameId
                })
            }
        )

        const data = await res.json()
        setWinMoney(data.bet);
        setMessage(data.message);
        setTextColor(data.color)


    }

    return (
            <div className="flex justify-center flex-col items-center">
            <div className="text-white font-extrabold text-3xl"> {message} </div>
            <h1 className={`${textColor} text-2xl font-extrabold`}>+{winMoney}</h1>
            </div>
            )

        
   
}