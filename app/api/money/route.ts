import { NextResponse } from "next/server";

export  async function POST(req: Request)
{
    const res = await req.json()

    const {win, playerMoney} = res; 
    
    let newMoney = playerMoney


    switch (win){
        case "true":
            newMoney += 100; 
            break;
        case "false": 
            newMoney -= 100; 
            break;
        default:
            break;

    }


    return NextResponse.json({
        playerMoney: newMoney
    })
  
}