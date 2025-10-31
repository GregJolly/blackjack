    "use client";

    import { Button } from "@/components/ui/button";
    import { Skeleton } from "@/components/ui/skeleton";
    import { useEffect, useState } from "react";
    import { handScore } from "../../lib/handScore";
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import { faRotateLeft,  faCoins, faUser, faHand, faPlus, faSackDollar} from "@fortawesome/free-solid-svg-icons";
    import handleCash from "../../lib/handleCash";
    import { Card } from "../../lib/types";
import { useUser } from "@clerk/nextjs";



    export default function Game() {
    const [gameId, setGameId] = useState<string>("");
    const [gameStarted, setGameStarted] = useState(false);
    const [myMoney, setMyMoney] = useState<number>(2000);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [bet, setBet] = useState<number | null>(null);
    const [playerScore, setPlayerScore] = useState<number>(0);
    const [dealerScore, setDealerScore] = useState<number>(0);
    const [result, setResult] = useState<string | null>(null);
    const [dealersTurn, setDealersTurn] = useState(false);
    const [winMoney, setWinMoney] = useState<number | null>(null);
    const [message, setMessage] = useState<string>("");
    const [textColor, setTextColor] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [win, setWin] = useState<string>("");
    const [isGameLoading, setIsGameLoading] = useState<boolean>(false);
    const [isResultloading, setIsResultLoading] = useState<boolean>(false);
    const [noFunds, setNoFunds] = useState<boolean>(false);
    const [isDealerLoading, setIsDealerLoading] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const chips = [
        { name: "100", value: 100, textColor: "text-red-950", bgColor: "bg-red-500", hover: "hover:bg-red-700" },
        { name: "250", value: 250, textColor: "text-yellow-950", bgColor: "bg-yellow-500", hover: "hover:bg-yellow-700" },
        { name: "500", value: 500, textColor: "text-blue-950", bgColor: "bg-blue-500" , hover: "hover:bg-blue-700"},
        { name: "1000", value: 1000, textColor: "text-purple-950", bgColor: "bg-purple-500", hover: "hover:bg-purple-700" },
    ];

    // 🎯 Update displayed scores when cards change
    useEffect(() => {
        {setPlayerScore(handScore(playerHand));
        setDealerScore(handScore(dealerHand));}
    }, [playerHand, dealerHand]);

    // 💰 Fetch & update money after win/loss
    async function setMoney(win: string) {
        
        try {const money = await handleCash(gameId);
        setMyMoney(money);}
        catch (error) {
            console.error("Error in handleCash function:", error);
            return new Response("Internal Server Error", { status: 500 });  
        }
        finally {   
            
        }
    }


    async function displayResult() {  
        setIsResultLoading(true);
        try {
            const res2 = await fetch("/api/result", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId }),
            });

            const resultData = await res2.json();
            setWinMoney(resultData.bet);
            setMessage(resultData.message);
            setTextColor(resultData.textColor);
            setWin(resultData.win);
            setMyMoney(resultData.playerMoney);
        }
        catch (error) {
            console.error("Error in result endpoint:", error);
            return new Response("Internal Server Error", { status: 500 });  
        }
        finally {
                    setIsResultLoading(false);
            }
      }
    // 🎮 Create a new game
    async function createGame(betAmount: number) {
        setIsGameLoading(true);

        try {

        const res = await fetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bet: betAmount}),
        });

        const data = await res.json();

        setGameId(data.gameId);
        setMyMoney(data.playerMoney);
        setDealerHand(data.dealerHand);
        setPlayerHand(data.playerHand);
        setDealerScore(handScore(data.dealerHand));
        setPlayerScore(handScore(data.playerHand));
        setBet(betAmount);
    
        if (data.gameOver) {
            // reveal dealer cards
            setDealersTurn(true);
            setGameOver(true);
          
            // set the result fields first
            setResult(data.result);
            setMessage(data.message);
            setWinMoney(data.winMoney);
            setTextColor(data.textColor);
            setWin(data.win);
          
            // force React to wait for next render tick (guarantees UI update)
            await new Promise((resolve) => setTimeout(resolve, 50));
          
            // now remove loading spinner
            setIsResultLoading(false);
          }        
        else {

                setResult(null);
                setMessage("");
                setWinMoney(null);
                setTextColor("");
                setWin("");
                setGameOver(false);
            }
        setGameStarted(true);


    } catch (error) {
            console.error("Error in createGame endpoint:", error);
            return new Response("Internal Server Error", { status: 500 });  
        }
        finally {
                    setIsGameLoading(false);
            }
        
    }

    // 🃏 Player hits
    async function handleHit() {
        setIsLoading(true);
       try { const res = await fetch("/api/hit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: gameId }),
        });

        const data = await res.json();
        setPlayerHand(data.playerHand);
        setResult(data.result);
        

        await displayResult();
        }  
        finally {
                    setIsLoading(false);
            }
    }
    
    

    

    // 🏁 Player stands
    async function handleStand() {
        setIsDealerLoading(true);
        try {
        const res = await fetch("/api/stand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId }),
        });

        const data = await res.json();

        setDealerHand(data.dealerHand);
        setDealersTurn(true);
        setResult(data.result);
    } catch (error) { 
            console.error("Error in stand endpoint:", error);
            return new Response("Internal Server Error", { status: 500 });
     }
     finally {
                    setIsDealerLoading(false);
            }
        
        // Fetch final message and bet info
        await displayResult();
   
    }

    // 🔁 Replay - start a fresh game
    async function handleReplay() {
        

        setIsGameLoading(true);
        try {
        const res = await fetch("/api/restart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldId: gameId, bet, myMoney}),
        });

        setGameId("");
        setDealerHand([]);
        setPlayerHand([]);
        setDealerScore(0);
        setPlayerScore(0);
        setResult(null);
        setMessage("");
        setWinMoney(null);
        setTextColor("");
        setWin("");
        

        const data = await res.json();

        if(data.noFunds)
        {
            setNoFunds(true);
            setIsGameLoading(false);
            setGameStarted(false);
            return;
        }

        setMyMoney(data.playerMoney);
        setGameId(data.gameId);
        setDealerHand(data.dealerHand);
        setPlayerHand(data.playerHand);
        setDealerScore(handScore(data.dealerHand));
        setPlayerScore(handScore(data.playerHand));
        setDealersTurn(false);
        if (data.gameOver) {
  // reveal dealer cards
            setDealersTurn(true);
            setGameOver(true);

            // set the result fields first
            setResult(data.result);
            setMessage(data.message);
            setWinMoney(data.winMoney);
            setTextColor(data.textColor);
            setWin(data.win);
           

            // force React to wait for next render tick (guarantees UI update)
            await new Promise((resolve) => setTimeout(resolve, 50));

            // now remove loading spinner
            setIsResultLoading(false);
            console.log(message)
        }
        else {
            setResult(null);
            setMessage("");
            setWinMoney(null);
            setTextColor("");
            setWin("");
            setGameOver(false);
        }

        

        

        setGameStarted(true);
    }
    catch (error) {
            console.error("Error in restart endpoint:", error);
            return new Response("Internal Server Error", { status: 500 });  
        }  
        finally {
                    setIsGameLoading(false);
            }

    }

    // 🎯 Let player change their bet
    function handleSetBet() {
        setGameStarted(false);
        setGameId("");
        setDealerHand([]);
        setPlayerHand([]);
        setDealerScore(0);
        setPlayerScore(0);
        setResult(null);
        setMessage("");
        setWinMoney(null);
        setTextColor("");
        setWin("");
        setGameOver(false);
        setDealersTurn(false);
       
    }
  

    return (
        <div className="flex min-h-[95vh] max-w-7xl justify-center text-white">
        {!gameStarted ? (
            <div className="flex items-center flex-col mt-50 text-center space-y-8">
                {/* Money */}
            <div className="w-38 flex justify-between items-center bg-green-950 py-2 px-6 rounded-full text-green-400 font-bold">
                <span className="text-amber-300">
                <FontAwesomeIcon icon={faCoins} />
                </span>
                <h1>${myMoney}</h1>
            </div>
            <h1 className="text-3xl font-bold">SET YOUR BET</h1>
            <div className="flex justify-center gap-6">
                {chips.map((chip) => (
                <Button
                    key={chip.value}
                    disabled={chip.value > myMoney}
                    onClick={() => createGame(chip.value)}
                    className={`${chip.bgColor} hover:scale-110 duration-200 ${chip.hover} rounded-full p-10 w-5 l-5`}
                >
                    <h1 className={`${chip.textColor} text-xl font-extrabold`}>${chip.name}</h1>
                </Button>
                ))}
            </div>
            </div>
        ) : isGameLoading ? (
            <SkeletonGame />
        ) : (
            <div className="flex flex-col space-y-5 items-center ">
            {/* Money */}
            <div className="w-38 flex justify-between items-center bg-green-950 py-2 px-6 rounded-full text-green-400 font-bold">
                <span className="text-amber-300">
                <FontAwesomeIcon icon={faCoins} />
                </span>
                <h1>${myMoney < 0 ? 0 : myMoney}</h1>
            </div>

            {/* Dealer */}
            <div className="flex flex-col items-center">
                <div className="flex justify-center items-center ml-12 p-4">
                {dealerHand?.map((card, i) => (
                    <img
                    key={i}
                    src={
                        card.hidden
                        ? "https://deckofcardsapi.com/static/img/back.png"
                        : card.imageUrl
                    }
                    
                    alt={card.hidden ? "unknown card" : card.name}
                    className="w-24 -ml-12 "
                    />
                ))}
                </div>
                <div
                className={`text-sm flex justify-center item-center space-x-4 bg-green-950/40 tracking-tight font-bold px-6 py-2 w-[20rem] md:w-2xl rounded-full uppercase ${
                    dealersTurn ? "text-amber-300/100" : "text-green-200"
                }`}
                >
                <div className="flex items-center justify-between w-30">
                <p>DEALER</p>
                {dealersTurn || gameOver ? (
                    <div className="text-white">{ isResultloading ? (
                    <div className="h-3 w-3 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    ) : dealerScore}</div>
                ) : (
                   <FontAwesomeIcon icon={faUser} className="text-white text-xs mt-[4px] animate-pulse" />
                )}
                </div>
                </div>
            </div>

            {/* Pot / Result */}
                  
            <div className="flex justify-center items-center h-[7rem]">
            {isResultloading ? (
  <div className="p-10 h-5 w-5 border-8 border-t-transparent border-white rounded-full animate-spin" />
) : result ? (
  <div className="flex flex-col justify-center items-center gap-2">
    <div className="text-white font-extrabold text-3xl">{message}</div>
    <h1 className={`${textColor} text-2xl font-extrabold`}>
      {win === "true" ? "+" : win === "false" ? "-" : ""}
      {win === "true" || win === "false" ? winMoney : ""}
    </h1>
  </div>
) : (
  <div className="text-amber-950 py-2 bg-amber-500 rounded-full animate-pulse px-6 w-30 h-30 font-bold">
    <div className="flex flex-col mt-5 items-center">
      <p className="text-xs font-medium tracking-widest text-amber-700">POT</p>
      <p className="text-3xl font-extrabold">${bet! * 2}</p>
    </div>
  </div>
)}

            </div>
            {/* Player */}
            <div className="flex flex-col justify-center items-center">
                <h1
                className={`text-sm flex justify-center space-x-4 bg-green-950/40 tracking-tight w-[20rem] md:w-2xl font-bold px-6 py-2 rounded-full uppercase ${
                    dealersTurn ? "text-green-200" : "text-amber-300/100"
                }`}
                >
                <div className="flex items-center justify-between w-30">
                <p>YOU</p> <div className="text-white">{isResultloading ? (
                    <div className="h-3 w-3 border-2 border-t-transparent border-white rounded-full animate-spin" />
                ) : playerScore}
                </div>
                </div>
                </h1>
                <div className="flex justify-center items-center ml-12 p-4">
                {playerHand?.map((card, i) => (
                    <img
                    key={i}
                    src={
                        card.hidden
                        ? "https://deckofcardsapi.com/static/img/back.png"
                        : card.imageUrl
                    }
                    alt={card.hidden ? "unknown card" : card.name}
                    className="w-24 -ml-12"
                    />
                ))}
                </div>
            </div>

            {/* Buttons */}
            {result ? (
                <div className="flex items-center justify-between gap-4">
                    <Button
                onClick={handleSetBet}
                className="flex flex-col  p-2 bg-green-600 hover:scale-110 hover:bg-green-200/80 w-20 h-25 uppercase font-bold text-white"
                >
                <div className="flex-1 ">
                <FontAwesomeIcon icon={faSackDollar} className="text-5xl mt-1 flex-1 text-green-950/70" /> 
                <FontAwesomeIcon icon={faPlus} className="text-xl -ml-3 mb-5 text-green-950/70" /> 
                </div>
                <span className="text-sm  font-extrabold text-yellow-950 ">SET BET</span>
                </Button>
                <Button
                onClick={handleReplay}
                className="flex flex-col  p-2 bg-amber-600 hover:scale-110 hover:bg-amber-200/80 w-20 h-25 uppercase font-bold text-white"
                >
                <FontAwesomeIcon icon={faRotateLeft} className="text-4xl flex-1 text-amber-950/70" /> <span className="text-sm  font-extrabold text-yellow-950 ">REPLAY</span>
                </Button>
                
                </div>
            ) : (
                <div className="flex items-center justify-between gap-4">
            
                <Button
                    onClick={handleHit}
                    disabled={isLoading || isDealerLoading}
                    className="  hover:scale-110 hover:bg-red-400 bg-red-600  w-20 h-25 uppercase text-bold text-red-100"
                >
                    {
                    !isLoading ? (
                       <div className="flex flex-col gap-2"> <FontAwesomeIcon icon={faPlus} className="text-4xl font-extrabold flex-1 text-red-950/70" />
                        <h4 className="text-sm font-extrabold text-red-950">HIT</h4></div>
                    ) : 
                    (
                        <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    )
                    }
                    
                </Button>
                <Button
                    onClick={handleStand}
                    disabled={isLoading || isDealerLoading}
                    className="flex flex-col hover:scale-110  hover:bg-yellow-200/80 bg-yellow-400/80 w-20 h-25 text-xl uppercase text-bold text-red-100"
                >
                    {isDealerLoading ? (                        <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
):( <div className="flex flex-col  gap-2"><FontAwesomeIcon icon={faHand} className="text-4xl font font-extrabold flex-1 text-yellow-950/70" />
                    <h4 className="text-sm font-extrabold mt-1 text-yellow-950">STAND</h4></div>
               )} </Button>
                </div>
            )}
            </div>
        )}
        </div>
    );
}
export function SkeletonGame() {
    return (
      <div className="h-[80vh] w-full flex items-center justify-center text-white overflow-hidden">
        <div className="flex flex-col justify-center items-center bg-green-950/30 rounded-2xl p-10 w-[90%] max-w-4xl h-[80vh] space-y-6 shadow-lg">
          {/* Money bar */}
          <Skeleton className="h-10 w-40 rounded-full bg-green-950/60" />
  
          {/* Central game area (dealer + cards + pot + player combined visually) */}
        
  
         
        </div>
      </div>
    );
  }
  
  