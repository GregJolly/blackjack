import { NextResponse } from "next/server";

export  async function POST(req: Request)
{
    const res = await req.json()

    const {win, playerMoney, bet} = res; 
    
    let newMoney = playerMoney


    switch (win){
        case "true":
            newMoney += bet*2; 
            break;
        case "false": 
            newMoney -= bet*2; 
            break;
        default:
            break;

    }


    return NextResponse.json({
        playerMoney: newMoney
    })
  
}