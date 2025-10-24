import { Card } from "./types";

type GameState = {
    id: string, 
    deck: Card[],
    dealerHand: Card[],
    playerHand: Card[], 
    playerMoney: number, 
    result: string
    gameOver: boolean
}

export const games: Record<string, GameState> = {}