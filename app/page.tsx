"use client";
import { Button } from "@/components/ui/button";
import { faCat } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { redirect } from "next/navigation";

export default function Home() {

  return (
    <section className="flex items-center justify-center  h-[90vh]">
      <div className="relative items-center w-full px-5 py-12 mx-auto lg:px-16 max-w-7xl md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-col items-center">
            
             
              <FontAwesomeIcon icon={faCat} className="text-amber-400 text-2xl" />
            
            

            <h1 className="mt-8 text-5xl text-white font-boldtracking-tight lg:text-6xl">
            Think <span className="text-amber-400 font-extrabold">Fast. </span>
            Bet <span className="text-amber-500 font-extrabold">Smart. </span> 
          Win <span className="text-amber-600 tracking-tight font-extrabold">Big. </span>
            </h1>
            <p className="max-w-xl mx-auto mt-8 text-base lg:text-xl font-bold text-green-200">
            Welcome to the Blackjack Table. 
            </p>
          </div>
          <div className="flex justify-center mt-8 space-x-4">
            <Button
              onClick={() => redirect("/dashboard/game")}
              className="px-6 py-6 text-lg font-semibold text-black bg-amber-400 hover:bg-amber-300"
            >
              Play Now
            </Button>

        </div>
      </div>
    </div>
    </section>

  );
}