import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCat} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { SignedOut, SignInButton } from '@clerk/nextjs';
import { Sign } from 'crypto';
import { Button } from '@/components/ui/button';


export function Navbar() 
{
    return (
        <nav className=" border-b border-green-950 p-6 flex   min-h-[5vh]">
        <div className="container mx-auto lg:max-w-7xl flex  justify-between items-center">
            <Link href="/" className="text-amber-400 duration-200 tracking-tight hover:scale-110 hover:text-amber-300  uppercase hover:transitiiono font-extrabold text-xl">
               <span className='text-white'>meow</span>JACK
            </Link>
            <div>
            <SignedOut>
                <SignInButton>
                    <Button variant="ghost" className="text-amber-400 hover:text-amber-300 duration-200 tracking-tight hover:scale-110 hover:transition font-bold">Sign In</Button>
                </SignInButton>

                    
            </SignedOut>

                    
          
            </div>
        </div>
        </nav>
    );
}