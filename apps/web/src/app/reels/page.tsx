'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Send, MoreVertical, Music, Volume2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ReelsPage() {
  const [activeReelIndex, setActiveReelIndex] = useState(0);

  const reels = [
    {
      id: 1,
      video: 'https://cdn.pixabay.com/video/2021/08/04/83896-584732159_large.mp4',
      toleeName: 'AI Automation Society',
      toleeSlug: 'ai-automation-society',
      author: 'Alex Johnson',
      authorAvatar: 'https://i.pravatar.cc/150?u=99',
      caption: '3 tools you must know to build an AI agency in 2024. 🚀 Watch till the end! #ai #automation #business',
      likes: '45.2k',
      comments: '1.2k',
      shares: '8.4k',
      audio: 'Original Audio - Alex Johnson',
      isVerified: true
    },
    {
      id: 2,
      video: 'https://cdn.pixabay.com/video/2020/05/11/38600-418859942_large.mp4',
      toleeName: 'That Pickleball Tolee',
      toleeSlug: 'pickleball',
      author: 'Sarah Chen',
      authorAvatar: 'https://i.pravatar.cc/150?u=41',
      caption: 'Perfect your backhand spin with this simple drill 🏓🔥 Practice this 10 mins daily!',
      likes: '12.8k',
      comments: '342',
      shares: '2.1k',
      audio: 'Pickleball Masters - Trending',
      isVerified: false
    }
  ];

  return (
    <div className="h-[calc(100vh-4rem)] bg-black text-white relative overflow-hidden flex justify-center">
      
      {/* Top Header */}
      <header className="absolute top-0 z-50 w-full bg-gradient-to-b from-black/60 to-transparent pt-4 pb-8">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Reels</h1>
        </div>
      </header>

      {/* Reels Container - Snap Scrolling */}
      <div className="w-full max-w-[450px] h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar relative">
        {reels.map((reel, index) => (
          <div key={reel.id} className="w-full h-full snap-start relative bg-gray-900 flex items-center justify-center overflow-hidden">
            
            {/* Video Player */}
            <video 
              src={reel.video} 
              className="w-full h-full object-cover"
              autoPlay={index === activeReelIndex}
              loop
              muted={false}
              playsInline
            />

            {/* Overlay Gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

            {/* Top Right Controls */}
            <div className="absolute top-6 right-4 z-10 flex gap-4 pointer-events-auto">
              <button className="text-white drop-shadow-md"><Volume2 className="w-6 h-6" /></button>
            </div>

            {/* Right Action Bar */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10 pointer-events-auto">
              <div className="flex flex-col items-center gap-1 group cursor-pointer">
                <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition">
                  <Heart className="w-7 h-7 text-white fill-transparent group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
                </div>
                <span className="text-xs font-semibold drop-shadow-md">{reel.likes}</span>
              </div>
              
              <div className="flex flex-col items-center gap-1 group cursor-pointer">
                <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition">
                  <MessageCircle className="w-7 h-7 text-white fill-transparent group-hover:fill-white transition-colors" />
                </div>
                <span className="text-xs font-semibold drop-shadow-md">{reel.comments}</span>
              </div>
              
              <div className="flex flex-col items-center gap-1 group cursor-pointer">
                <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition">
                  <Send className="w-7 h-7 text-white fill-transparent transition-colors -ml-1" />
                </div>
                <span className="text-xs font-semibold drop-shadow-md">{reel.shares}</span>
              </div>

              <div className="flex flex-col items-center gap-1 cursor-pointer">
                <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition">
                  <MoreVertical className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="mt-2 w-10 h-10 rounded-lg bg-gray-800 border-2 border-white overflow-hidden animate-[spin_4s_linear_infinite]">
                <img src={reel.authorAvatar} alt="audio" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="absolute bottom-6 left-4 right-20 z-10 pointer-events-auto">
              
              {/* Tolee Name Tag (Point 4) */}
              <Link href={`/t/${reel.toleeSlug}`}>
                <div className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full mb-3 cursor-pointer transition">
                  <span className="text-xs font-bold text-white tracking-wide">from {reel.toleeName}</span>
                </div>
              </Link>

              {/* Author Info */}
              <div className="flex items-center gap-3 mb-3">
                <Link href={`/u/${reel.author}`}>
                  <div className="relative">
                    <Avatar className="w-10 h-10 border-2 border-white cursor-pointer">
                      <AvatarImage src={reel.authorAvatar} />
                      <AvatarFallback>{reel.author[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <Link href={`/u/${reel.author}`}>
                    <span className="font-bold text-base cursor-pointer hover:underline drop-shadow-md">{reel.author}</span>
                  </Link>
                  {reel.isVerified && <ShieldCheck className="w-4 h-4 text-blue-400 fill-blue-400/20" />}
                  <Button variant="outline" size="sm" className="h-7 px-3 bg-transparent text-white border-white hover:bg-white hover:text-black rounded-full font-bold ml-2">
                    Follow
                  </Button>
                </div>
              </div>

              {/* Caption */}
              <p className="text-sm font-medium text-white mb-3 line-clamp-2 drop-shadow-md leading-relaxed">
                {reel.caption}
              </p>

              {/* Audio */}
              <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                <Music className="w-3.5 h-3.5 animate-pulse" />
                <marquee className="w-48" scrollamount="3">{reel.audio}</marquee>
              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
