'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Film, MessageCircle, Menu } from 'lucide-react';
import { useSession } from 'next-auth/react';

export function BottomNav() {
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  if (!isAuthenticated) return null;

  const navItems = [
    { name: 'Feed', href: '/feed', icon: Home },
    { name: 'Discover', href: '/', icon: Compass },
    { name: 'Reels', href: '/reels', icon: Film },
    { name: 'Chats', href: '/chat', icon: MessageCircle, badge: '5' },
    // Replaced Notifications with Menu/Profile for typical mobile nav
    { name: 'Menu', href: '/marketplace', icon: Menu },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[calc(4rem+env(safe-area-inset-bottom))] bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 flex items-center justify-around z-50 lg:hidden pb-[env(safe-area-inset-bottom)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (pathname.startsWith('/t/') && item.name === 'Feed');
        
        return (
          <Link key={item.name} href={item.href} className="relative w-full h-full flex flex-col items-center justify-center">
            <div className={`flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'fill-primary/20' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold border border-white dark:border-black">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium">{item.name}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
