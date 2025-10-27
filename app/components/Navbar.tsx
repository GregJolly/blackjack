import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export function Navbar() 
{
    return (
        <nav className=" border-b border-green-950 p-6 flex   min-h-[5vh]">
        <div className="container mx-auto max-w-6xl flex  justify-between items-center">
            <Link href="/game" className="text-amber-400 duration-200 hover:scale-110 hover:text-amber-300 hover:text-shadow-amber-300 uppercase hover:transitiiono font-extrabold text-xl">
               BLACKJACK
            </Link>
            <div>
            <FontAwesomeIcon icon={faUser} className="bg-white p-2 rounded-full" />
                    
          
            </div>
        </div>
        </nav>
    );
}