"use client"
import { cn } from '@/lib/utils';
import { Gamepad2, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export const navItems = [
    {name: "Games", href: "/dashboard/game", icon: Gamepad2},
    {name: "Profile", href: "/dashboard/profile", icon: User},
    {name: "Settings", href: "/dashboard/settings", icon: Settings},
];

export default function DashboardNav() {
    const pathname = usePathname();
    return (
        <nav className="grid text-amber-400 items-start gap-2">
      {navItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <span
            className={cn(
              "group flex items-center rounded-md px-10 py-2 text-sm font-medium hover:bg-green-800 hover:text-green-400",
              pathname === item.href ? "bg-green-900" : "bg-transparent"
            )}
          >
            <item.icon className="mr-2 h-4 w-4 text-primary" />
            <span>{item.name}</span>
          </span>
        </Link>
      ))}
    </nav>
    );
}