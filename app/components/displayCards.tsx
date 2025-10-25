import { useEffect, useState } from "react";
import { Card } from "../lib/types";

export default function DisplayCard({
  gameId,
  win,
  change
}: {
  gameId: string;
  win: string;
  change: boolean;
}) {
  const [hand, setHand] = useState<Card[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId }),
        });

        const data = await res.json();
        if (data.error) {
          console.error(data.error);
          return;
        }

        setHand(win === "dealer" ? data.dealerHand : data.playerHand);
      } catch (err) {
        console.error("Error fetching cards:", err);
      }
    }

    fetchData();
  }, [gameId, win, change]);

  return (
    <div className="flex justify-center items-center p-4">
      {hand?.map((card, i) => (
        <img
          key={i}
          src={
            card.hidden
              ? "https://deckofcardsapi.com/static/img/back.png"
              : card.imageUrl
          }
          alt={card.hidden ? "unknown card" : card.name}
          className="w-24 -ml-12"
        />
      ))}
    </div>
  );
}
