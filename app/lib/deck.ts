import { Card } from "./types";

export function createDeck(): Card[]{
    const suits = ['Hearts',  'Spades', 'Clubs', 'Diamonds'];
    const values = ['A','2','3','4', '5','6', '7', '8', '9', '10', 'K','J','Q']
    const deck: Card[] = [];

    for(const suit of suits){
        for(const value of values)
        {
            const name = `${getCardName(value)} of ${capitalize(suit)}}`
            const imageUrl =`https://deckofcardsapi.com/static/img/${getImageCode(value, suit)}.png`
            deck.push({suit, value, name, imageUrl})
        }

    }
            
    return deck.sort(()=>Math.random()- 0.5); 
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
function getCardName(value: string ){ 
    if(value === 'A') return "Ace"
    if(value === 'K') return "King"
    if(value === 'Q') return "Queen"
    if(value === 'j') return "Jack"
    return value; 
}

function getImageCode(value: string, suit: string )
{
    const suitLetter = suit[0].toUpperCase()
    return `${value === '10' ? '0' : value}${suitLetter}`
}