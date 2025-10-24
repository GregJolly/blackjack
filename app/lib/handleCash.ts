  export default async function  handleCash(win: string, playerMoney: number, bet:number )
  {

      
      const res = await fetch("/api/money", {
          method: "POST",
          headers: {"Content-Type" : "application/json"},
          body: JSON.stringify({
              win, playerMoney, bet
          })

      })

      const data = await res.json()
      
      return data.playerMoney

  }