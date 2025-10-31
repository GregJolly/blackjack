"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCat} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton } from '@clerk/nextjs';
import { Sign } from 'crypto';
import { Button } from '@/components/ui/button';


export function Navbar() 
{
    return (
        <nav className=" border-b border-green-950/40 py-4  px-4 md:py-4 md:p-6 flex   min-h-[5vh]">
        <div className="container mx-auto md:max-w-6xl lg:max-w-7xl flex  justify-between items-center">
            <Link href="/" className="text-amber-400 duration-200 tracking-tight hover:scale-110 hover:text-amber-300  uppercase hover:transitiiono font-extrabold text-xl">
               <span className='text-white'>meow</span>JACK
            </Link>
            <div className="flex items-center">
          <SignedOut>
            <SignInButton >
              <Button className="bg-amber-400 text-amber-950 hover:text-amber-950 duration-200 tracking-tight hover:scale-110 hover:bg-amber-200 font-bold">
                Login
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="ml-4 bg-amber-950 text-amber-400 py-4 hover:text-amber-400 duration-200 tracking-tight hover:scale-110 hover:bg-amber-800 font-bold">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <SignOutButton>
              <Button className="bg-amber-400 text-amber-950 hover:text-amber-950 duration-200 tracking-tight hover:scale-110 hover:bg-amber-200 font-bold">
                Sign Out
              </Button>
            </SignOutButton>
          </SignedIn>
                

                    
          
            </div>
        </div>
        </nav>
    );
}