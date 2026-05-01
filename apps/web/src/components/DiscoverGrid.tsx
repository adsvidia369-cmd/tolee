'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function DiscoverGrid({ tolees, isAuthenticated }: { tolees: any[], isAuthenticated: boolean }) {
  const router = useRouter();
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  const handleCardClick = (e: React.MouseEvent, slug: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowSignupPopup(true);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
        {tolees.map((tolee: any) => (
          <Link href={`/t/${tolee.slug}`} key={tolee.id} className="block h-full" onClick={(e) => handleCardClick(e, tolee.slug)}>
            <Card 
              className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group bg-white dark:bg-[#121212] flex flex-col h-full rounded-2xl"
            >
              {/* Banner */}
              <div className="relative h-32 w-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <img 
                  src={tolee.banner} 
                  alt={tolee.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/20">
                  #{tolee.rank}
                </div>
              </div>

              <CardContent className="p-5 flex-grow flex flex-col relative pt-12">
                {/* Avatar Overlay */}
                <div className="absolute -top-10 left-5 border-4 border-white dark:border-[#121212] rounded-xl overflow-hidden shadow-sm bg-white dark:bg-gray-900">
                  <Avatar className="w-16 h-16 rounded-lg">
                    <AvatarImage src={tolee.avatar} alt={tolee.name} className="object-cover" />
                    <AvatarFallback className="rounded-lg">{tolee.name[0]}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {tolee.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                    {tolee.description}
                  </p>
                </div>

                <div className="flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                  <span className="flex items-center gap-1.5">
                    {tolee.members} Members
                  </span>
                  <span className="mx-2">•</span>
                  <span className={tolee.price === 'Free' ? 'text-gray-900 dark:text-white font-bold' : ''}>
                    {tolee.price}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Dialog open={showSignupPopup} onOpenChange={setShowSignupPopup}>
        <DialogContent className="sm:max-w-md border-0 shadow-2xl p-0 overflow-hidden bg-white dark:bg-[#121212]">
          <div className="bg-gradient-to-br from-primary/10 via-background to-background p-6 text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center font-bold text-3xl shadow-lg mx-auto mb-4">
              t
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-extrabold text-center mb-2">Join the Tolee</DialogTitle>
              <DialogDescription className="text-center text-base">
                Sign up to view discussions, join Tolees, and connect with people who share your interests.
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-8 flex flex-col gap-3">
              <Button className="w-full rounded-full h-12 text-lg font-bold" onClick={() => router.push('/auth/signup')}>
                Create an Account
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-primary hover:underline font-bold">
                Log in
              </Link>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
