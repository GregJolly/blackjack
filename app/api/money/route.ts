import { NextResponse } from "next/server";

export  async function POST(req: Request)
{
    const res = await req.json()

    const {win, playerMoney} = res; 
    
    let newMoney = playerMoney

    if(win == true)
    {
        newMoney += 100; 
    }
    else 
    {
        newMoney -= 100; 
        
    }

    return NextResponse.json({
        playerMoney: newMoney
    })
  
}