'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, 
  Image as ImageIcon, Video, FileText, ChevronRight,
  Trophy, Users, Calendar, BookOpen, Star, ShieldCheck,
  TrendingUp, PlayCircle, MapPin, Globe
} from 'lucide-react';

export default function ToleePage({ params }: { params: { slug: string } }) {
  const [activeTab, setActiveTab] = useState('community');

  // Dummy Data for the Tolee
  const tolee = {
    name: 'AI Automation Society',
    slug: 'ai-automation-society',
    description: 'Learn to get paid for AI solutions, regardless of your background. Join the revolution today.',
    members: '347.4k',
    price: 'Free',
    avatar: 'https://i.pravatar.cc/150?u=12',
    banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    admin: { name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?u=99' },
    levelName: 'AI Explorer'
  };

  const posts = [
    {
      id: 1,
      author: 'Sarah Chen',
      authorAvatar: 'https://i.pravatar.cc/150?u=41',
      role: 'Moderator',
      time: '2 hours ago',
      content: 'Just closed my first $5k/mo client using the exact outreach strategy from Module 3! Unbelievable. Big thanks to the community for the feedback on my proposal. 🚀',
      likes: 145,
      comments: 32,
      isWin: true,
    },
    {
      id: 2,
      author: 'David Kumar',
      authorAvatar: 'https://i.pravatar.cc/150?u=42',
      role: 'Member',
      time: '5 hours ago',
      content: 'Hey everyone, I am struggling with setting up the Make.com webhook for the lead generation flow. Does anyone have a template or a guide they can share?',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      likes: 24,
      comments: 18,
      isWin: false,
    }
  ];

  const leaderboard = [
    { id: 1, name: 'Michael Scott', avatar: 'https://i.pravatar.cc/150?u=51', points: 4250, level: 7 },
    { id: 2, name: 'Dwight S.', avatar: 'https://i.pravatar.cc/150?u=52', points: 3800, level: 6 },
    { id: 3, name: 'Jim Halpert', avatar: 'https://i.pravatar.cc/150?u=53', points: 3100, level: 6 },
    { id: 4, name: 'Pam Beesly', avatar: 'https://i.pravatar.cc/150?u=54', points: 2900, level: 5 },
    { id: 5, name: 'Ryan Howard', avatar: 'https://i.pravatar.cc/150?u=55', points: 1500, level: 3 },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] font-sans text-gray-900 dark:text-gray-100">
      {/* Tolee Banner & Header */}
      <div className="w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="w-full h-48 md:h-64 relative bg-gray-200 dark:bg-gray-900">
          <img src={tolee.banner} alt={tolee.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 pb-6 -mt-16 relative z-10">
            <div className="w-32 h-32 rounded-2xl border-4 border-white dark:border-black overflow-hidden bg-white shadow-lg">
              <img src={tolee.avatar} alt={tolee.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-grow mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                {tolee.name}
              </h1>
              <div className="flex items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary" /> Created by {tolee.admin.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {tolee.members} Members</span>
              </div>
            </div>
            
            <div className="flex gap-3 mb-2 w-full md:w-auto">
              <Button className="w-full md:w-auto font-bold px-8 shadow-md">Invite</Button>
              <Button variant="outline" className="w-10 px-0"><MoreHorizontal className="w-5 h-5" /></Button>
            </div>
          </div>

          {/* Tolee Navigation Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-100 dark:border-gray-800">
            {['community', 'classroom', 'calendar', 'members', 'leaderboard', 'marketplace'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 pt-8 pb-24 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Feed / Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Create Post Card */}
            {activeTab === 'community' && (
              <Card className="border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden bg-white dark:bg-[#121212]">
                <div className="p-4 flex gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="https://i.pravatar.cc/150?u=me" />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <Input 
                      placeholder="Share something with the community..." 
                      className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-base py-6 focus-visible:ring-1 focus-visible:ring-primary/50"
                    />
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary rounded-lg h-9 px-3"><ImageIcon className="w-4 h-4 mr-2" /> Image</Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary rounded-lg h-9 px-3"><Video className="w-4 h-4 mr-2" /> Video</Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary rounded-lg h-9 px-3"><FileText className="w-4 h-4 mr-2" /> Poll</Button>
                      </div>
                      <Button size="sm" className="font-bold px-6 rounded-lg">Post</Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Posts Feed */}
            {activeTab === 'community' && posts.map((post) => (
              <Card key={post.id} className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-[#121212]">
                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.authorAvatar} alt={post.author} />
                      <AvatarFallback>{post.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[15px] cursor-pointer hover:text-primary">{post.author}</span>
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
                    <Button variant="ghost" className="flex-1 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg h-10"><Heart className="w-5 h-5 mr-2" /> Like</Button>
                    <Button variant="ghost" className="flex-1 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg h-10"><MessageCircle className="w-5 h-5 mr-2" /> Comment</Button>
                    <Button variant="ghost" className="flex-1 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg h-10"><Send className="w-5 h-5 mr-2" /> Share</Button>
                  </div>
                </CardFooter>
              </Card>
            ))}

            {/* Placeholder for Classroom */}
            {activeTab === 'classroom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((course) => (
                  <Card key={course} className="overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] group cursor-pointer hover:shadow-md transition-all">
                    <div className="h-40 bg-gray-200 dark:bg-gray-800 relative">
                      <img src={`https://images.unsplash.com/photo-${1550000000000 + course}?auto=format&fit=crop&w=600&q=80`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
                          <PlayCircle className="w-6 h-6 text-white fill-current" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">Module {course}: AI Foundations</h3>
                      <p className="text-sm text-gray-500 mb-3">12 Lessons • 3h 45m</p>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-1">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${course * 25}%` }}></div>
                      </div>
                      <p className="text-xs font-semibold text-right text-gray-500">{course * 25}% Complete</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Placeholder for Marketplace */}
            {activeTab === 'marketplace' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Local Listings</h2>
                  <Button size="sm"><TrendingUp className="w-4 h-4 mr-2" /> List an Item</Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <Card key={item} className="overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] group cursor-pointer hover:shadow-md transition-all">
                      <div className="aspect-square bg-gray-200 dark:bg-gray-800 relative">
                        <img src={`https://images.unsplash.com/photo-${1600000000000 + item}?auto=format&fit=crop&w=400&q=80`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                          ₹{item * 1500}
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">Premium Office Chair</h3>
                        <p className="text-xs text-gray-500 flex items-center mt-1"><MapPin className="w-3 h-3 mr-1" /> Mumbai, MH (2km)</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* About Card */}
            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] shadow-sm">
              <CardHeader className="p-5 pb-2">
                <h3 className="font-bold text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-gray-400" /> About</h3>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  {tolee.description}
                </p>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Admin</p>
                      <p className="text-gray-500">{tolee.admin.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Public Tolee</p>
                      <p className="text-gray-500">Anyone can find and see posts.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard Preview Card */}
            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] shadow-sm">
              <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Leaderboard</h3>
                <span className="text-xs text-primary font-semibold cursor-pointer hover:underline">View all</span>
              </CardHeader>
              <CardContent className="p-5 pt-2">
                <div className="flex flex-col gap-4">
                  {leaderboard.slice(0, 3).map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`font-bold text-sm w-4 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-700' : 'text-gray-500'}`}>
                          {index + 1}
                        </span>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</span>
                          <span className="text-xs text-gray-500">Level {user.level}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{user.points} pts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
