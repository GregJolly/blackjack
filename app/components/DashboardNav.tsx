"use client"
import { cn } from '@/lib/utils';
import { Gamepad2, Settings, User, Trophy } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export const navItems = [
    {name: "Profile", href: "/dashboard/profile", icon: User},
    {name: "Game", href: "/dashboard/game", icon: Gamepad2},
    {name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },

    {name: "Settings", href: "/dashboard/settings", icon: Settings},
];   

export default function DashboardNav() {
    const pathname = usePathname();
    return (
        <nav className="grid text-green-100  items-start gap-5">
      {navItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <span
            className={cn(
              "group flex items-center font-extrabold rounded-md px-10 py-2 text-sm  hover:bg-green-400/30 ",
              pathname === item.href ? "bg-amber-400 text-amber-950" : "bg-transparent"
            )}
          >
            <item.icon className="mr-2 h-4 w-4 " />
            <span>{item.name}</span>
          </span>
        </Link>
      ))}
    </nav>
    );
}