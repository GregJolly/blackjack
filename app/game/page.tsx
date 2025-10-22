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



export default function Game() {

  const [deck, setDeck] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [gameState, setGameState] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [dealersTurn, setDealersTurn] = useState(false); 
  const [hitButton, setHitButton] = useState(false);
  const [playerMoney, setPlayerMoney] = useState<number>()



  async function handleStart() {
    
      const { deck, dealerHand, playerHand, playerMoney} = await startGame()
      setDeck(deck);
      setDealerHand(dealerHand); 
      setPlayerHand(playerHand);
      setPlayerMoney(playerMoney)
      setGameState(true);

      const playerScore = handScore(playerHand);
      const dealerScore = handScore(dealerHand)

      if(playerScore == 21)
        {
            console.log("BLACKJACK"); 
            setHitButton(true)
            setResult("BLACKJACK")
        }
      else if(dealerScore == 21)
      {
        dealerHand[1].hidden = false
        setDealersTurn(true)
        setHitButton(true)
        setResult("LOSE")
      }
  } 

  async function handleHit()
  {
    const newDeck: Card[] = [...deck]
    const card = newDeck.pop() 
    
    if(!card)
    {
    return 
    }

    const newHand = [...playerHand , card]
    setDeck(newDeck)
    setPlayerHand(newHand)
    const playerScore = handScore(newHand)   

    if(playerScore > 21)
    {
        //you bust 
        console.log("you bust"); 
        setHitButton(true);
        setResult("BUST")
    }
    else if(playerScore == 21)
    {
        console.log("you win"); 
        setHitButton(true)
        setResult("WIN")
    }

  }

  function handleStand()
  {
    setDealersTurn(true)
    setHitButton(true)
    dealerHand[1].hidden = false; 
    
    while(handScore(dealerHand) < 18 )
        {
            const newCard = deck.pop()
            if(!newCard) break; 
    
            dealerHand.push(newCard)
        }
        
        const dealerScore = handScore(dealerHand)
    
        if(dealerScore > 21)
        {
            setDeck(deck);
            setDealerHand(dealerHand)
            
            setResult("WIN"); 
        }
        else if(dealerScore === 21)
        {
          setDeck(deck);
          setDealerHand(dealerHand)
          
          setResult("LOSE"); 

        }
        else if (dealerScore > handScore(playerHand))
        {
          setDeck(deck);
          setDealerHand(dealerHand)
          
          setResult("LOSE"); 
        }
        else if(dealerScore == handScore(playerHand))
        {
          setDeck(deck)
          setDealerHand(dealerHand)
          setResult("PUSH")
        }
        else
        {
          setDeck(deck);
          setDealerHand(dealerHand)
          
          setResult("WIN"); 
        }
  }

 function handleReplay(){
    setDealerHand([]);
    setPlayerHand([]); 
    setDeck([]);
    setDealersTurn(false);
    setResult("");
    setHitButton(false);
    console.log(dealerHand);
    console.log(playerHand);

    handleStart(); 
 }


  return (
    <div className="min-h-screen max-w-4xl mx-auto flex items-center justify-center">
        {gameState === false ?  <Button onClick={handleStart} >Start Game</Button> : 
        
        (<div className="flex flex-col justify-center space-y-6 items-center p-6 ">
          <div className="w-64 flex justify-between item-center bg-green-950 py-2  px-6 rounded-full text-green-400  font-bold"><span className="text-amber-300"><FontAwesomeIcon icon={faCoins} /></span> <h1 className="">{playerMoney}</h1><span className="opacity-0">pla</span></div>
          <div className="flex flex-col  justify-between items-center"> 
            <DisplayCard hand={dealerHand} />
            <div className={`text-sm flex justify-between space-x-4 bg-green-600/25 tracking-tight font-bold px-6 py-2 w-34 ${ dealersTurn===true ? "text-amber-300/100" : "text-green-200" } rounded-full uppercase`}><p>DEALER</p> {dealersTurn ? (<p className="text-white">{handScore(dealerHand)}</p>):(<div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />)}</div>
          </div>
          <div className="flex justify-center items-center h-[8rem]"> 
            {result ? ( 
              <div className="flex flex-col justify-center items-center gap-2">
              
                <Result result={result} />
                <Button onClick={handleReplay} className="bg-amber-600"><FontAwesomeIcon icon={faRotateLeft} className="w-5 h-5 text-white" />
                </Button>
              
              </div>
          ) : <div className="text-3xl animate-pulse">♠️</div> }
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
