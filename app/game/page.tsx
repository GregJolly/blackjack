"use client";


import { Button } from "@/components/ui/button";

import {  useState, useTransition } from "react";
import { handScore } from "../lib/handScore";
import DisplayCard from "../components/displayCards";
import Result from "../components/Result";
import { Card } from "../lib/types";
import { startGame } from "../lib/controls/start";
import { standAction } from "../lib/standAction";
import HitAction from "../lib/controls/hit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft, faCoins } from "@fortawesome/free-solid-svg-icons";
import handleCash from "../lib/handleCash";



export default function Game() {

  const [deck, setDeck] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [dealersTurn, setDealersTurn] = useState(false); 
  const [hitButton, setHitButton] = useState(false);
  const [playerMoney, setPlayerMoney] = useState<number>(2000);

  async function setMoney (win: string) 
  {
    const money = await handleCash(win, playerMoney); 
    setPlayerMoney(money); 
  }

  async function handleStart(myDeck: Card[]) {
      
    console.log(myDeck.length);
      const res = await fetch("/api/start",
        {
          method: "POST",
          headers: {"Content-type": "application/json"},
          body: JSON.stringify({
            myDeck, dealerHand, playerHand, playerMoney
          })
        }
      )

      const data = await res.json();

      setDeck(data.deck);
      setDealerHand(data.dealerHand); 
      setPlayerHand(data.playerHand);
      setPlayerMoney(data.playerMoney)
      setGameState(data.gameState);
      setHitButton(data.hitButton)
      setResult(data.result)
      setDealersTurn(data.dealersTurn)
      setMoney(data.win)
      
  } 
  
  
  async function handleHit()
  {
    const res = await fetch("/api/hit",{
      method: "POST",
      headers:{"Content-type" : "application/json"},
      body: JSON.stringify({
        deck, 
        playerHand, 
      })
    })

    const data = await res.json()
    setDeck(data.deck)
    setPlayerHand(data.playerHand)
    setHitButton(data.hitButton) 
    setResult(data.result)
    setMoney(data.win)

  }

  async function handleStand()
  {
    
    const res = await fetch("/api/stand", {
      method: "POST",
      headers: {"Content-type" : "application/json"},
      body: JSON.stringify({
        deck, dealerHand, playerHand
      })
    })

    const data = await res.json(); 
    setDeck(data.deck);
    setDealerHand(data.dealerHand);
    setDealersTurn(data.dealersTurn);
    setHitButton(data.hitButton);
    setResult(data.result);
    setMoney(data.win);

  }

function handleReplay(){

    setDealerHand([]);
    setPlayerHand([]); 
    setDealersTurn(false);
    setResult("");
    setHitButton(false);
    handleStart(deck);
   
    
    
  }


  return (
    <div className="min-h-screen max-w-4xl mx-auto flex items-center justify-center">
        {gameState === false ?  <Button onClick={async() => await handleStart(deck)} >Start Game</Button> : 
        
        (<div className="flex flex-col justify-center space-y-6 items-center p-6 ">
          <div className="w-64 flex justify-between item-center bg-green-950 py-2  px-6 rounded-full text-green-400  font-bold"><span className="text-amber-300"><FontAwesomeIcon icon={faCoins} /></span> <h1 className="">{playerMoney}</h1><span className="opacity-0">pla</span></div>
          <div className="flex flex-col  justify-between items-center"> 
            <DisplayCard hand={dealerHand} />
            <div className={`text-sm flex justify-between space-x-4 bg-green-950/40 tracking-tight font-bold px-6 py-2 w-34 ${ dealersTurn===true ? "text-amber-300/100" : "text-green-200" } rounded-full uppercase`}><p>DEALER</p> {dealersTurn ? (<p className="text-white">{handScore(dealerHand)}</p>):(<div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />)}</div>
          </div>
          <div className="flex justify-center items-center h-[8rem]"> 
            {result ? ( 
              <div className="flex flex-col justify-center items-center gap-2">
              
                <Result result={result} />
                
              
              </div>
          ) : <div className="text-3xl animate-pulse">♠️</div> }
          </div>
          <div className="flex flex-col justify-center items-center"> 
              <h1 className={`text-sm flex justify-between space-x-4 bg-green-950/40  tracking-tight font-bold px-6 py-2 w-34 ${ dealersTurn===true ? "text-green-200" : "text-amber-300/100"} rounded-full uppercase`}> <p>YOU</p> <p className="text-white">{handScore(playerHand)}</p></h1>
              <DisplayCard hand={playerHand} />  
          </div>
          
         { result ? (<Button onClick={handleReplay} className="bg-amber-600 py-6 px-8 w-32 uppercase font-bold text-white"><FontAwesomeIcon icon={faRotateLeft} className="w-5 h-5 font-bold  text-white" /> <h1>Play Again</h1>
         </Button> ): (<div className="flex items-center justify-between gap-4 "> 
              <Button onClick={async () => await handleHit()} disabled={hitButton} className="bg-red-600/80 py-6 w-28 text-xl uppercase text-bold text-red-100">Hit</Button>
              <Button onClick={async () => await handleStand()} disabled={hitButton} className="bg-yellow-600/80 py-6 w-28 text-xl uppercase text-bold text-red-100">Stand</Button>
          </div>)}
        </div>)
        }
    </div>
  );

}
