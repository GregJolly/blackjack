"use client";

import type { Card } from "@/app/lib/types";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import { handScore } from "../lib/handScore";
import { createDeck } from "../lib/deck";
import { create } from "domain";

export default function Game() {

  const [deck, setDeck] = useState<Card[]>([]); 
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState(false)
  const [startLoading, setStartLoading] = useState(false);
  const [dealersTurn, setDealersTurn] = useState(false);  
  const [hitButton, setHitButton] = useState(false);    

  async function handleStart() {
    try {
      setStartLoading(true);
      const res = await fetch("/api/start", { method: "POST" });
      const data = await res.json();
  
      setDeck(data.deck);
      setDealerHand(data.dealerHand);
      setPlayerHand(data.playerHand);
      setGameState(true);
    } catch (err) {
      console.error("Error starting game:", err);
    } finally {
      setStartLoading(false);
    }
  }
  

 function handleStand(){
    setHitButton(true); 
    setDealersTurn(true); 
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
  
    if(handScore(data.playerHand) > 21)
    {
        //you bust 
        console.log("you bust"); 
        setHitButton(true); 

    }
    else if (dealersTurn)
    {
        if(handScore(dealerHand) > handScore(data.playerHand))
        {
            console.log("You lose to the dealer"); 
            setHitButton(true); 
        }
        else if(handScore(dealerHand) > 21)
        {
            console.log("Dealer has Bust, you win")
            setHitButton(true); 
          
        }
        else 
        {
            
            console.log("You win against the dealer")
            setHitButton(true); 
        }
    }
    else if(handScore(data.playerHand) == 21)
    {
        console.log("BLACKJACK")
        setHitButton(true);
    }
    
  
  }
  return (
    <div className="min-h-screen max-w-4xl mx-auto flex items-center justify-center">
        {gameState === false ?  <Button onClick={handleStart} > {startLoading ?<div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" /> : "Start Game"}</Button> : 
        
        (<div className="flex flex-col justify-between space-y-6 items-centered p-6 ">
           
            <div className="flex flex-col  justify-between items-center"> 
                <div className="text-sm flex justify-between space-x-4 bg-green-600/25 tracking-tight font-bold px-6 py-2 text-green-200 rounded-full"> <p>DEALER</p> {dealersTurn ? (<p className="text-white">{handScore(dealerHand)}</p>):(<div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />)}</div>
                <div className="flex justify-center items-center p-4">
                    {dealerHand?.map((card, i) => (
                        <img key={i} src={card.hidden ?"https://deckofcardsapi.com/static/img/back.png": card.imageUrl} alt={card.hidden ? "unknown card" : card.name} className="w-24 -ml-12  " /> 
                    ))}
                </div>
            </div>
            <div className="flex flex-col justify-center items-center"> 
                <h1 className="text-sm flex justify-between space-x-4 bg-green-600/25 tracking-tight font-bold px-6 py-2 text-green-200 rounded-full uppercase"> <p>YOU            </p> <p className="text-white">{handScore(playerHand)}</p></h1>
                <div className="flex justify-between items-center p-4">
                    {playerHand?.map((card, i) => (
                        <img  key={i} src={card.imageUrl} alt={card.name} className="w-24 -ml-12" /> 
                    ))}
                </div>
            </div>
            <div className="flex items-center justify-between gap-4 "> 
                <Button onClick={handleHit} disabled={hitButton} className="bg-red-600/80 py-6 w-28 text-xl uppercase text-bold text-red-100">Hit</Button>
                <Button onClick={handleStand} disabled={hitButton} className="bg-yellow-600/80 py-6 w-28 text-xl uppercase text-bold text-red-100">Stand</Button>

            </div>
        </div>
        
    
)
        
        

        }

    </div>
  );
}
6