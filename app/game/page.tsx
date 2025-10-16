"use client";

import { createDeck } from "@/app/lib/deck";
import type { Card } from "@/app/lib/types";
import { Button } from "@/components/ui/button";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { SeparatorHorizontal } from "lucide-react";
import { useState } from "react";

export default function Game() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState(false); 

  function startGame() {

    setGameState(true); 
    const newDeck = createDeck();
    setDeck(newDeck); 
    const card1 = newDeck.pop();
    const card2 = newDeck.pop();
    const card3 = newDeck.pop();
    const card4 = newDeck.pop();
   
    if (card1 && card2 && card3 && card4 ) {
      setDealerHand([{...card1, hidden: false}, {...card2, hidden: true}]);
      setPlayerHand([card3, card4]);
    }
  }

  
  async function handleHit(){
    const res = await fetch("/api/hit" , {
        method: "POST", 
        headers: {"Content-type" : "application/json"},
        body: JSON.stringify({deck, playerHand})
    })

    const data = await res.json(); 

    setDeck(data.deck)
    setPlayerHand(data.playerHand)
  }

  

  return (
    <div className="min-h-screen max-w-4xl mx-auto flex items-center justify-center">
        {gameState == false ?  <Button onClick={startGame} >Start Game</Button> : 
        
        (<div className="flex flex-col justify-between space-y-6 items-centered p-6 ">
           
            <div className="flex flex-col  justify-between items-center"> 
                <div className="text-sm flex justify-between space-x-4 bg-green-600/25 tracking-tight font-bold px-6 py-2 text-green-200 rounded-full"> <p>DEALER</p> <p className="text-white">21</p></div>
                <div className="flex justify-center items-center p-4">
                    {dealerHand.map((card, i) => (
                        <img key={i} src={card.hidden ?"https://deckofcardsapi.com/static/img/back.png": card.imageUrl} alt={card.hidden ? "unknown card" : card.name} className="w-24 -ml-12  " /> 
                    ))}
                </div>
            </div>
           <div className="flex justify-center items-center">
                   
            </div>
            <div className="flex flex-col justify-between items-center"> 
                <h1 className="text-sm flex justify-between space-x-4 bg-green-600/25 tracking-tight font-bold px-6 py-2 text-green-200 rounded-full uppercase"> <p>YOU            </p> <p className="text-white">21</p></h1>
                <div className="flex justify-between items-center p-4">
                    {playerHand.map((card, i) => (
                        <img  key={i} src={card.imageUrl} alt={card.name} className="w-24 -ml-12" /> 
                    ))}
                </div>
            </div>
            <div> <Button onClick={handleHit} className="bg-red-600/80 p-6 text-xl uppercase text-bold text-red-100">Hit</Button></div>
        </div>
        
    
)
        
        

        }

    </div>
  );
}
6