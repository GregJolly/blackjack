"use client";


import { Button } from "@/components/ui/button";

import {  useState } from "react";
import { handScore } from "../lib/handScore";
import { createDeck } from "../lib/deck";
import DisplayCard from "../components/displayCards";
import Result from "../components/Result";
import { Card } from "../lib/types";

export default function Game() {

  const [deck, setDeck] = useState<Card[]>([]); 
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState(false)
  const [startLoading, setStartLoading] = useState(false);
  const [dealersTurn, setDealersTurn] = useState(false);  
  const [hitButton, setHitButton] = useState(false);    
  const [result, setResult] = useState("");
  const [end, setEnd] = useState(false)

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
  

 async function handleStand(){

    setHitButton(true); 

    const res = await fetch("/api/stand", {
        method: "POST",
        headers:{"Content-type" : "application/json"},
        body: JSON.stringify({
            deck, dealerHand, playerHand, dealersTurn, result
        })
    })

    const data = await res.json(); 
    console.log(data.message)
    setDeck(data.deck)
    setDealersTurn(data.dealersTurn);
    setDealerHand(data.dealerHand); 
    setEnd(true); 
    setResult(data.result); 

   
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
        setEnd(true)
        setResult("BUST")
    }
    else if(handScore(data.playerHand) == 21)
    {
        console.log("BLACKJACK"); 
        setEnd(true); 
        setHitButton(true);
        setResult("BLACKJACK"); 
    }
  }
  return (
    <div className="min-h-screen max-w-4xl mx-auto flex items-center justify-center">
        {gameState === false ?  <Button onClick={handleStart} > {startLoading ?<div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" /> : "Start Game"}</Button> : 
        
        (<div className="flex flex-col justify-end space-y-6 items-center p-6 ">
           
          <div className="flex flex-col  justify-between items-center"> 
            <DisplayCard hand={dealerHand} />
            <div className={`text-sm flex justify-between space-x-4 bg-green-600/25 tracking-tight font-bold px-6 py-2 w-34 ${ dealersTurn===true ? "text-amber-300/100" : "text-green-200" } rounded-full uppercase`}><p>DEALER</p> {dealersTurn ? (<p className="text-white">{handScore(dealerHand)}</p>):(<div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />)}</div>
          </div>
          <div className="flex justify-center items-center h-[8rem]"> 
            {result ?  <Result result={result} /> : <div className="text-3xl animate-pulse">♠️</div> }
          </div>
          <div className="flex flex-col justify-center items-center"> 
              <h1 className={`text-sm flex justify-between space-x-4 bg-green-600/25 tracking-tight font-bold px-6 py-2 w-34 ${ dealersTurn===true ? "text-green-200" : "text-amber-300/100"} rounded-full uppercase`}> <p>YOU</p> <p className="text-white">{handScore(playerHand)}</p></h1>
              <DisplayCard hand={playerHand} />  
          </div>
          <div className="flex items-center justify-between gap-4 "> 
              <Button onClick={handleHit} disabled={hitButton} className="bg-red-600/80 py-6 w-28 text-xl uppercase text-bold text-red-100">Hit</Button>
              <Button onClick={handleStand} disabled={hitButton} className="bg-yellow-600/80 py-6 w-28 text-xl uppercase text-bold text-red-100">Stand</Button>
          </div>
        </div>)
        }
    </div>
  );

}
