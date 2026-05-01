'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Send, MoreVertical, Music, Volume2, VolumeX, ShieldCheck, Plus } from 'lucide-react';
import Link from 'next/link';

import { CreatePostModal } from '@/components/CreatePostModal';
import { createPost, toggleLike, addComment } from '@/actions/post';

export function ReelsStream({ initialReels }: { initialReels: any[] }) {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [reels, setReels] = useState(initialReels);
  const [isMuted, setIsMuted] = useState(false);

  const handleNewPost = async (postData: any) => {
    // We only care about videos here, but the CreatePostModal handles media types.
    // Let's create the post.
    const result = await createPost({
      content: postData.content,
      postType: postData.postType,
      media: postData.media,
      toleeId: postData.toleeSlug === 'ai-automation-society' ? 't1' :
               postData.toleeSlug === 'sabaka-mangal-ho' ? 't2' : 't3'
    });

    if (result.success && result.post && result.post.mediaTypes === 'video') {
      const newLocalReel = {
        id: result.post.id,
        video: result.post.mediaUrls,
        toleeName: postData.toleeName,
        toleeSlug: postData.toleeSlug,
        author: 'Alex Johnson',
        authorAvatar: 'https://i.pravatar.cc/150?u=me',
        caption: result.post.caption,
        likes: '0',
        comments: '0',
        shares: '0',
        audio: 'Original Audio',
        isVerified: false
      };
      setReels([newLocalReel, ...reels]);
    }
  };

  const handleLike = async (id: string, index: number) => {
    // Optimistic UI update
    const newReels = [...reels];
    const reel = newReels[index];
    const isCurrentlyLiked = reel.likedByMe;
    
    // Parse likes count to number, modify, back to string if it was string
    let currentLikes = parseInt(String(reel.likes).replace(/k/i, '000').replace(/m/i, '000000')) || 0;
    
    if (isCurrentlyLiked) {
      reel.likedByMe = false;
      reel.likes = (currentLikes - 1).toString();
    } else {
      reel.likedByMe = true;
      reel.likes = (currentLikes + 1).toString();
    }
    setReels(newReels);

    const result = await toggleLike(id.toString());
    if (!result.success) {
      // Revert on failure
      const revertedReels = [...reels];
      revertedReels[index].likedByMe = isCurrentlyLiked;
      revertedReels[index].likes = currentLikes.toString();
      setReels(revertedReels);
    }
  };

  const handleComment = async (id: string, index: number) => {
    const commentText = window.prompt("Add a comment:");
    if (!commentText || commentText.trim() === '') return;

    // Optimistic UI
    const newReels = [...reels];
    const reel = newReels[index];
    let currentComments = parseInt(String(reel.comments).replace(/k/i, '000')) || 0;
    reel.comments = (currentComments + 1).toString();
    setReels(newReels);

    const result = await addComment(id.toString(), commentText);
    if (!result.success) {
      // Revert
      const revertedReels = [...reels];
      revertedReels[index].comments = currentComments.toString();
      setReels(revertedReels);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-black text-white relative overflow-hidden flex justify-center">
      
      {/* Top Header */}
      <header className="absolute top-0 z-50 w-full bg-gradient-to-b from-black/60 to-transparent pt-4 pb-8 pointer-events-none">
        <div className="container mx-auto px-4 flex items-center justify-between pointer-events-auto">
          <h1 className="text-xl font-bold tracking-tight">Reels</h1>
          <CreatePostModal onPost={handleNewPost} videoOnly={true}>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full h-10 w-10 border border-white/30 backdrop-blur-md">
              <Plus className="w-6 h-6" />
            </Button>
          </CreatePostModal>
        </div>
      </header>

      {/* Reels Container - Snap Scrolling */}
      {reels.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-gray-400 mb-4">No reels found. Be the first to upload one!</p>
          <CreatePostModal onPost={handleNewPost} videoOnly={true}>
             <Button variant="outline" className="text-black bg-white hover:bg-gray-200 font-bold rounded-full border-none">
               Upload Video
             </Button>
          </CreatePostModal>
        </div>
      ) : (
        <div className="w-full max-w-[450px] h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar relative">
          {reels.map((reel, index) => (
            <div key={reel.id} className="w-full h-full snap-start relative bg-gray-900 flex items-center justify-center overflow-hidden">
              
              {/* Video Player */}
              <video 
                src={reel.video} 
                className="w-full h-full object-cover"
                autoPlay={index === activeReelIndex}
                loop
                muted={isMuted}
                playsInline
              />

              {/* Overlay Gradient for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

              {/* Top Right Controls */}
              <div className="absolute top-16 right-4 z-10 flex gap-4 pointer-events-auto">
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className="text-white drop-shadow-md bg-black/30 hover:bg-black/50 p-2 rounded-full backdrop-blur-md transition-colors"
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
              </div>

              {/* Right Action Bar */}
              <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-10 pointer-events-auto">
                <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => handleLike(reel.id, index)}>
                  <div className="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black/60 transition">
                    <Heart className={`w-7 h-7 transition-colors ${reel.likedByMe ? 'fill-red-500 text-red-500' : 'text-white fill-transparent group-hover:fill-red-500 group-hover:text-red-500'}`} />
                  </div>
                  <span className="text-xs font-semibold drop-shadow-md">{reel.likes}</span>
                </div>
                
                <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => handleComment(reel.id, index)}>
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
      )}
    </div>
  );
}
