'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Film, MessageCircle, Bell, PlusCircle, Settings, ShieldCheck, Hash, Store } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

export function Sidebar() {
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const mainNav = isAuthenticated ? [
    { name: 'Feed', href: '/feed', icon: Home },
    { name: 'Discover', href: '/', icon: Compass },
    { name: 'Reels', href: '/reels', icon: Film },
    { name: 'Chats', href: '/chat', icon: MessageCircle, badge: '5' },
    { name: 'Notifications', href: '/notifications', icon: Bell, badge: '12' },
    { name: 'Marketplace', href: '/marketplace', icon: Store },
  ] : [
    { name: 'Discover', href: '/', icon: Compass },
  ];

  const yourTolees = [
    { name: 'AI Automation Society', href: '/t/ai-automation-society', avatar: 'https://i.pravatar.cc/150?u=12', isManaged: true },
    { name: 'That Pickleball Tolee', href: '/t/pickleball', avatar: 'https://i.pravatar.cc/150?u=11', isManaged: false },
    { name: 'Tolee Builders', href: '/t/builders', avatar: 'https://i.pravatar.cc/150?u=15', isManaged: true },
    { name: 'Modern Calligraphy', href: '/t/calligraphy', avatar: 'https://i.pravatar.cc/150?u=13', isManaged: false },
    { name: 'Zero To Founder', href: '/t/founder', avatar: 'https://i.pravatar.cc/150?u=18', isManaged: false },
  ];

  const managedTolees = yourTolees.filter(t => t.isManaged);
  const joinedTolees = yourTolees.filter(t => !t.isManaged);

  return (
    <aside className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] border-r border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur-md overflow-hidden hidden lg:flex flex-col z-40">
      <ScrollArea className="flex-1 py-6 px-4">
        
        {/* Main Nav */}
        <div className="space-y-1 mb-8">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname.startsWith('/t/') && item.name === 'Feed');
            
            return (
              <Link key={item.name} href={item.href}>
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start rounded-xl h-12 text-[15px] font-semibold transition-all ${
                    isActive 
                      ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-primary' : 'text-gray-400'}`} />
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Tolees You Manage */}
        {isAuthenticated && (
          <div className="mb-6">
            <div className="flex items-center justify-between px-3 mb-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tolees You Manage</h3>
              <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full text-gray-400 hover:text-primary"><PlusCircle className="w-4 h-4" /></Button>
            </div>
            <div className="space-y-1">
              {managedTolees.map((tolee) => (
                <Link key={tolee.name} href={tolee.href}>
                  <Button variant="ghost" className="w-full justify-start rounded-xl h-11 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 overflow-hidden">
                    <div className="relative w-7 h-7 mr-3 rounded-md overflow-hidden flex-shrink-0">
                      <img src={tolee.avatar} alt={tolee.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 border border-black/10 rounded-md"></div>
                    </div>
                    <span className="truncate">{tolee.name}</span>
                    <ShieldCheck className="w-3.5 h-3.5 ml-auto text-primary flex-shrink-0 opacity-70" />
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Your Tolees */}
        {isAuthenticated && (
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Your Tolees</h3>
            <div className="space-y-1">
              {joinedTolees.map((tolee) => (
                <Link key={tolee.name} href={tolee.href}>
                  <Button variant="ghost" className="w-full justify-start rounded-xl h-11 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 overflow-hidden">
                    <div className="relative w-7 h-7 mr-3 rounded-md overflow-hidden flex-shrink-0">
                      <img src={tolee.avatar} alt={tolee.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 border border-black/10 rounded-md"></div>
                    </div>
                    <span className="truncate">{tolee.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}

      </ScrollArea>
      
      {/* Settings / Bottom Footer */}
      {isAuthenticated && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Button variant="ghost" className="w-full justify-start rounded-xl h-11 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900">
            <Settings className="w-5 h-5 mr-3" />
            Settings & Privacy
          </Button>
        </div>
      )}
    </aside>
  );
}
