'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Bell, MessageCircle, LogOut, User, Settings, Compass } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  // Don't show the authenticated global header on the Discover/Landing page if it's the unauthenticated view.
  // But since we are showing the sidebar, we'll show the header globally for now.
  
  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center px-4 lg:px-6">
      
      {/* Left: Logo & Search */}
      <div className="flex items-center gap-6 w-1/3">
        <Link href={session?.user ? "/feed" : "/"} className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
            t
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-primary hidden md:block">tolee</span>
        </Link>
        
        <div className="hidden md:flex relative w-full max-w-sm group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search Tolees, users, or posts..." 
            className="w-full pl-9 bg-gray-100 dark:bg-gray-900 border-none rounded-full h-10 focus-visible:ring-1 focus-visible:ring-primary/50"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                window.location.href = `/search?q=${encodeURIComponent(e.currentTarget.value)}`;
              }
            }}
          />
        </div>
      </div>

      {/* Middle: Quick Tabs (Optional, for easy access like FB) */}
      {session?.user && (
        <div className="hidden lg:flex items-center justify-center w-1/3 gap-2">
          <Link href="/feed">
            <Button variant="ghost" className={`w-24 h-12 rounded-xl ${pathname === '/feed' ? 'text-primary bg-primary/5' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900'}`}>
              <Compass className="w-6 h-6" />
            </Button>
          </Link>
          <Link href="/chat">
            <Button variant="ghost" className={`w-24 h-12 rounded-xl relative ${pathname === '/chat' ? 'text-primary bg-primary/5' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900'}`}>
              <MessageCircle className="w-6 h-6" />
              <span className="absolute top-2 right-6 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </Link>
          <Link href="/notifications">
            <Button variant="ghost" className={`w-24 h-12 rounded-xl relative ${pathname === '/notifications' ? 'text-primary bg-primary/5' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900'}`}>
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-6 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-black">3</span>
            </Button>
          </Link>
        </div>
      )}

      {/* Right: User Profile & Actions */}
      <div className="flex items-center justify-end gap-3 w-full lg:w-1/3">
        <Button variant="ghost" size="icon" className="text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 md:hidden">
          <Search className="w-5 h-5" />
        </Button>

        {status === 'loading' ? (
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
        ) : session?.user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none">
              <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary transition-colors cursor-pointer">
                <AvatarImage src={session.user.image || "https://i.pravatar.cc/150?u=me"} alt="User" />
                <AvatarFallback>{session.user.name?.[0] || "ME"}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={
                <Link href="/u/me" className="cursor-pointer flex w-full items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              } />
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/auth/signin">
              <Button variant="ghost" className="px-3 sm:px-4 font-semibold text-sm">Log In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 sm:px-6 text-sm">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>

    </header>
  );
}
