import { Card } from "./types";

export function handScore(hand: Card[]): number { 

    if(!hand  || !Array.isArray(hand)){
        return 0;
    } 
    let total = 0; 
    let aces = 0; 

    for(const card of hand)
    {
        const v = card.value;
        if ( v === "A") aces++ ;
        else if(v === "K" || v === "Q" || v=== "J") total+=10; 
        else total+=Number(v)
    }

    while(aces > 0 )
    {
        total+11 <=21 ? total+=11 : total+=1; 
    }

    return total; 
}