export default function Result({result} : {result: string})
{
    if (result == "WIN")
    {
        return (
            <div className="text-white font-extrabold text-3xl"> YOU WIN! </div>
        )
    }
    else if (result == "BLACKJACK")
    {
        return (
            <div className="text-white font-extrabold text-3xl"> BLACKJACK! </div>
        )
    }
    else if(result == "LOSE")
    {
        return (
            <div className="text-white font-extrabold text-3xl"> DEALER WINS!</div>
        )
    }
    else if(result == "BUST")
        {
            return (
                <div className="text-white font-extrabold text-3xl"> DEALER WINS!</div>
            )
        }
    else if(result == "PUSH")
        {
            return (
                <div className="text-white font-extrabold text-3xl"> PUSH!</div>
            )
        }
}