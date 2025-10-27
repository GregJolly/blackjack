  export default async function  handleCash( gameId: string )
  {

      
      const res = await fetch("/api/money", {
          method: "POST",
          headers: {"Content-Type" : "application/json"},
          body: JSON.stringify({
               gameId
          })

      })

      const data = await res.json()
      
      return data.playerMoney

  }