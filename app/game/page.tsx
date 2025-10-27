    "use client";

    import { Button } from "@/components/ui/button";
    import { useEffect, useState } from "react";
    import { handScore } from "../lib/handScore";
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import { faRotateLeft,  faCoins, faHand, faPlus } from "@fortawesome/free-solid-svg-icons";
    import handleCash from "../lib/handleCash";
    import { Card } from "../lib/types";

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
    const [win, setWin] = useState<string>("");

    const chips = [
        { name: "100", value: 100, textColor: "text-red-950", bgColor: "bg-red-500", hover: "hover:bg-red-700" },
        { name: "250", value: 250, textColor: "text-yellow-950", bgColor: "bg-yellow-500", hover: "hover:bg-yellow-700" },
        { name: "500", value: 500, textColor: "text-blue-950", bgColor: "bg-blue-500" , hover: "hover:bg-blue-700"},
        { name: "1000", value: 1000, textColor: "text-purple-950", bgColor: "bg-purple-500", hover: "hover:bg-purple-700" },
    ];

    // 🎯 Update displayed scores when cards change
    useEffect(() => {
        setPlayerScore(handScore(playerHand));
        setDealerScore(handScore(dealerHand));
    }, [playerHand, dealerHand]);

    // 💰 Fetch & update money after win/loss
    async function setMoney(win: string) {
        const money = await handleCash(gameId);
        setMyMoney(money);
    }

    // 🎮 Create a new game
    async function createGame(betAmount: number) {
        const res = await fetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bet: betAmount }),
        });

        const data = await res.json();

        setGameId(data.gameId);
        setMyMoney(data.playerMoney);
        setDealerHand(data.dealerHand);
        setPlayerHand(data.playerHand);
        setDealerScore(handScore(data.dealerHand));
        setPlayerScore(handScore(data.playerHand));
        setBet(betAmount);
        setResult(null);
        setGameStarted(true);


        const res2 = await fetch("/api/result", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId }),
        });
    
        const resultData = await res2.json();
        setWinMoney(resultData.bet);
        setMessage(resultData.message);
        setTextColor(resultData.color);
        setWin(resultData.win);
        
    }

    // 🃏 Player hits
    async function handleHit() {
        const res = await fetch("/api/hit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: gameId }),
        });

        const data = await res.json();
        setPlayerHand(data.playerHand);
        setResult(data.result);
        setMoney(data.win);

        const res2 = await fetch("/api/result", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId }),
        });
    
        const resultData = await res2.json();
        setWinMoney(resultData.bet);
        setMessage(resultData.message);
        setTextColor(resultData.color);
        setWin(resultData.win);
    }

    // 🏁 Player stands
    async function handleStand() {
        const res = await fetch("/api/stand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId }),
        });

        const data = await res.json();

        setDealerHand(data.dealerHand);
        setDealersTurn(true);
        setResult(data.result);
        setMoney(data.win);

        // Fetch final message and bet info
        const res2 = await fetch("/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId }),
        });

        const resultData = await res2.json();
        setWinMoney(resultData.bet);
        setMessage(resultData.message);
        setTextColor(resultData.color);
        setWin(resultData.win);
    }

    // 🔁 Replay - start a fresh game
    async function handleReplay() {
        const res = await fetch("/api/restart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldId: gameId, bet, myMoney}),
        });

        const data = await res.json();

        setGameId(data.gameId);
        setDealerHand(data.dealerHand);
        setPlayerHand(data.playerHand);
        setDealerScore(handScore(data.dealerHand));
        setPlayerScore(handScore(data.playerHand));
        setResult(null);
        setDealersTurn(false);
        setResult(null);
        setMessage("");
        setWinMoney(null);
        setTextColor("");
        setWin("");

    }

    return (
        <div className="min-h-screen max-w-4xl mx-auto flex items-center justify-center text-white">
        {!gameStarted ? (
            <div className="flex items-center justify-center flex-col text-center space-y-8">
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
        ) : (
            <div className="flex flex-col justify-center space-y-6 items-center p-6">
            {/* Money */}
            <div className="w-38 flex justify-between items-center bg-green-950 py-2 px-6 rounded-full text-green-400 font-bold">
                <span className="text-amber-300">
                <FontAwesomeIcon icon={faCoins} />
                </span>
                <h1>${myMoney}</h1>
            </div>

            {/* Dealer */}
            <div className="flex flex-col items-center">
                <div className="flex justify-center items-center p-4">
                {dealerHand.map((card, i) => (
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
                className={`text-sm flex justify-between space-x-4 bg-green-950/40 tracking-tight font-bold px-6 py-2 w-34 rounded-full uppercase ${
                    dealersTurn ? "text-amber-300/100" : "text-green-200"
                }`}
                >
                <p>DEALER</p>
                {dealersTurn ? (
                    <p className="text-white">{dealerScore}</p>
                ) : (
                    <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                )}
                </div>
            </div>

            {/* Pot / Result */}
            <div className="flex justify-center items-center h-[8rem]">
                {result ? (
                <div className="flex flex-col justify-center items-center gap-2">
                    <div className="text-white font-extrabold text-3xl">{message}</div>
                    <h1 className={`${textColor} text-2xl font-extrabold`}>
                    {win === "true" ? "+" : win === "false" ? "-" : ""}
                    {win == "true" || win  == "false" ? winMoney : ""}
                    </h1>
                </div>
                ) : (
                <div className="flex justify-between text-amber-950 py-2 bg-amber-500 rounded-full animate-pulse px-6 w-34 font-bold">
                    <p >POT</p> <p>{bet! * 2}</p>
                </div>
                )}
            </div>

            {/* Player */}
            <div className="flex flex-col justify-center items-center">
                <h1
                className={`text-sm flex justify-between space-x-4 bg-green-950/40 tracking-tight font-bold px-6 py-2 w-34 rounded-full uppercase ${
                    dealersTurn ? "text-green-200" : "text-amber-300/100"
                }`}
                >
                <p>YOU</p> <p className="text-white">{playerScore}</p>
                </h1>
                <div className="flex justify-center items-center p-4">
                {playerHand.map((card, i) => (
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
                <Button
                onClick={handleReplay}
                className="flex flex-col p-2 bg-amber-600 hover:scale-110 hover:bg-amber-200/80 w-20 h-20 uppercase font-bold text-white"
                >
                <FontAwesomeIcon icon={faRotateLeft} className="text-4xl flex-1 text-amber-950/70" /> <span className="text-sm text-sm font-extrabold text-yellow-950 ">REPLAY</span>
                </Button>
            ) : (
                <div className="flex items-center justify-between gap-4">
            
                <Button
                    onClick={handleHit}
                    className="  flex flex-col hover:scale-110 hover:bg-red-400 bg-red-600  w-20 h-20 uppercase text-bold text-red-100"
                >
                    <FontAwesomeIcon icon={faPlus} className="text-4xl font-extrabold flex-1 text-red-950" />
                    <h4 className="text-sm font-extrabold text-red-950">HIT</h4>
                    
                </Button>
                <Button
                    onClick={handleStand}
                    className="flex flex-col hover:scale-110 hover:bg-yellow-200/80 bg-yellow-400/80 w-20 h-20 text-xl uppercase text-bold text-red-100"
                >
                     <FontAwesomeIcon icon={faHand} className="text-4xl font font-extrabold flex-1 text-yellow-950/70" />
                    <h4 className="text-sm font-extrabold text-yellow-950">STAND</h4>
                </Button>
                </div>
            )}
            </div>
        )}
        </div>
    );
    }
