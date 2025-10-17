import { Card } from "./types";

type GameState = {
    id: string, 
    deck: Card[],
    dealerHand: Card[],
    playerHand: Card[], 
    gameOver: boolean
}

export const games: Record<string, GameState> = {}