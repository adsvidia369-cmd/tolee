'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Send, MoreHorizontal, Image as ImageIcon, Video, Trophy, Compass } from 'lucide-react';
import Link from 'next/link';

import { CreatePostModal } from '@/components/CreatePostModal';
import { createPost } from '@/actions/post';

export function FeedStream({ initialPosts }: { initialPosts: any[] }) {
  const hasJoinedTolees = true;
  const [feedPosts, setFeedPosts] = useState(initialPosts);
  const [isPosting, setIsPosting] = useState(false);

  const handleLike = (id: string) => {
    setFeedPosts(posts => 
      posts.map(post => 
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleNewPost = async (postData: any) => {
    setIsPosting(true);
    const result = await createPost({
      content: postData.content,
      postType: postData.postType,
      media: postData.media,
      toleeId: postData.toleeSlug === 'ai-automation-society' ? 't1' :
               postData.toleeSlug === 'sabaka-mangal-ho' ? 't2' : 't3'
    });

    if (result.success && result.post) {
      // Create a temporary local post to show immediately
      const newLocalPost = {
        id: result.post.id,
        author: 'Alex Johnson',
        authorAvatar: 'https://i.pravatar.cc/150?u=me',
        toleeName: postData.toleeName,
        toleeSlug: postData.toleeSlug,
        role: 'Member',
        time: 'Just now',
        content: result.post.caption,
        image: result.post.mediaTypes === 'image' ? result.post.mediaUrls : null,
        video: result.post.mediaTypes === 'video' ? result.post.mediaUrls : null,
        likes: 0,
        comments: 0,
        isWin: result.post.postType === 'win',
      };
      setFeedPosts([newLocalPost, ...feedPosts]);
    }
    setIsPosting(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] font-sans text-gray-900 dark:text-gray-100">
      
      {/* Mobile Header (Sidebar is hidden on mobile) */}
      <header className="lg:hidden sticky top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm h-16 flex items-center px-4">
        <h1 className="text-xl font-bold tracking-tight text-primary">Your Feed</h1>
      </header>

      <main className="container mx-auto px-4 lg:px-8 pt-8 pb-24 max-w-3xl">
        
        {!hasJoinedTolees ? (
          /* Empty State - If user hasn't joined any Tolees */
          <div className="flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm px-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Compass className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Your Feed is Empty</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Posts from the Tolees you join will appear here. Discover communities that match your interests to start building your feed.
            </p>
            <Link href="/">
              <Button className="px-8 py-6 text-base font-bold rounded-full shadow-md">
                Discover Tolees
              </Button>
            </Link>
          </div>
        ) : (
          /* Active Feed State */
          <div className="space-y-6">
            
            {/* Create Post Card connected to Modal */}
            <Card className="border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden bg-white dark:bg-[#121212] opacity-100 transition-opacity" style={{ opacity: isPosting ? 0.7 : 1 }}>
              <div className="p-4 flex gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://i.pravatar.cc/150?u=me" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <CreatePostModal onPost={handleNewPost}>
                    <div className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-base py-3 px-4 text-left text-gray-500 cursor-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      {isPosting ? 'Posting to Database...' : 'Share something with your Tolees...'}
                    </div>
                  </CreatePostModal>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex gap-1">
                      <CreatePostModal onPost={handleNewPost}>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary rounded-lg h-9 px-3" disabled={isPosting}><ImageIcon className="w-4 h-4 mr-2" /> Image</Button>
                      </CreatePostModal>
                      <CreatePostModal onPost={handleNewPost}>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary rounded-lg h-9 px-3" disabled={isPosting}><Video className="w-4 h-4 mr-2" /> Video</Button>
                      </CreatePostModal>
                    </div>
                    <CreatePostModal onPost={handleNewPost}>
                      <Button size="sm" className="font-bold px-6 rounded-lg" disabled={isPosting}>Post</Button>
                    </CreatePostModal>
                  </div>
                </div>
              </div>
            </Card>

            {/* Global Feed Stream */}
            {feedPosts.map((post) => (
              <Card key={post.id} className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-[#121212]">
                
                <div className="px-4 pt-3 pb-1 border-b border-gray-50 dark:border-gray-800/50 flex items-center justify-between bg-gray-50/50 dark:bg-[#1a1a1a]">
                  <Link href={`/t/${post.toleeSlug}`}>
                    <span className="text-xs font-bold text-primary hover:underline cursor-pointer uppercase tracking-wider flex items-center gap-1.5">
                      {post.toleeName}
                    </span>
                  </Link>
                  <span className="text-[10px] text-gray-400 font-medium">From Database</span>
                </div>

                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Link href={`/u/${post.author}`}>
                      <Avatar className="w-10 h-10 cursor-pointer">
                        <AvatarImage src={post.authorAvatar} alt={post.author} />
                        <AvatarFallback>{post.author[0]}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Link href={`/u/${post.author}`}>
                          <span className="font-bold text-[15px] cursor-pointer hover:text-primary">{post.author}</span>
                        </Link>
                        {post.role === 'Moderator' && <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 text-[10px] px-1.5 py-0">MOD</Badge>}
                        {post.role === 'Admin' && <Badge variant="secondary" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 text-[10px] px-1.5 py-0">ADMIN</Badge>}
                      </div>
                      <span className="text-xs text-gray-500">{post.time}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500"><MoreHorizontal className="w-5 h-5" /></Button>
                </CardHeader>
                
                <CardContent className="p-4 pt-1">
                  {post.isWin && (
                    <div className="mb-3 inline-flex items-center gap-1.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      <Trophy className="w-3.5 h-3.5" /> 
                      Community Win
                    </div>
                  )}
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  
                  {post.image && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                      <img src={post.image} alt="Post content" className="w-full max-h-[500px] object-cover" />
                    </div>
                  )}
                  {post.video && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                      <video src={post.video} className="w-full max-h-[500px] object-cover" controls />
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                  <div className="flex justify-between items-center w-full text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center border border-white dark:border-[#121212] z-10"><Heart className="w-3 h-3 text-white fill-current" /></div>
                      </div>
                      <span className="ml-1">{post.likes}</span>
                    </div>
                    <span>{post.comments} comments</span>
                  </div>
                  
                  <div className="flex gap-1 w-full border-t border-gray-100 dark:border-gray-800 pt-2">
                    <Button onClick={() => handleLike(post.id)} variant="ghost" className="flex-1 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg h-10 hover:bg-gray-100 dark:hover:bg-gray-900 active:bg-red-50 dark:active:bg-red-950 active:text-red-500 transition-colors">
                      <Heart className="w-5 h-5 mr-2" /> Like
                    </Button>
                    <Button variant="ghost" className="flex-1 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg h-10 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                      <MessageCircle className="w-5 h-5 mr-2" /> Comment
                    </Button>
                    <Button variant="ghost" className="flex-1 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg h-10 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                      <Send className="w-5 h-5 mr-2" /> Share
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
