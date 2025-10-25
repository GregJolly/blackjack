  export default async function  handleCash(win: string, gameId: string )
  {

      
      const res = await fetch("/api/money", {
          method: "POST",
          headers: {"Content-Type" : "application/json"},
          body: JSON.stringify({
              win, gameId
          })

      })

      const data = await res.json()
      
      return data.playerMoney

  }