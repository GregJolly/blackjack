import { Card } from "../lib/types";

export default function DisplayCard({hand}: { hand: Card []}){


     return (
        <div className="flex justify-center items-center p-4">
                    {hand?.map((card, i) => (
                        <img key={i} src={card.hidden ?"https://deckofcardsapi.com/static/img/back.png": card.imageUrl} alt={card.hidden ? "unknown card" : card.name} className="w-24 -ml-12  " /> 
                    ))}
                </div>
     )

}