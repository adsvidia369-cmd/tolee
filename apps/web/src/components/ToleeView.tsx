'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, 
  Image as ImageIcon, Video, FileText, ChevronRight,
  Trophy, Users, Calendar, BookOpen, Star, ShieldCheck,
  TrendingUp, PlayCircle, MapPin, Globe, AlertTriangle
} from 'lucide-react';

import { joinTolee } from '@/actions/tolee';
import { useRouter } from 'next/navigation';

export function ToleeView({ toleeData, currentUserId }: { toleeData: any, currentUserId: string | null }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('community');
  const [isJoining, setIsJoining] = useState(false);

  if (!toleeData) {
    return <div className="min-h-screen flex items-center justify-center text-white">Tolee not found</div>;
  }

  const { tolee, posts, leaderboard, membershipStatus, role } = toleeData;

  const handleJoin = async () => {
    if (!currentUserId) {
      router.push('/auth/signin');
      return;
    }
    setIsJoining(true);
    await joinTolee(tolee.id);
    setIsJoining(false);
  };

  const isMember = membershipStatus === 'approved';
  const isPending = membershipStatus === 'pending';
  const isAdmin = role === 'admin';
  const isModerator = role === 'moderator' || isAdmin;

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
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" /> 
                  Created by {tolee.admin?.name || 'Admin'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {tolee.membersCount} Members</span>
              </div>
            </div>
            
            <div className="flex gap-3 mb-2 w-full md:w-auto">
              {isAdmin ? (
                <Button variant="outline" className="w-full md:w-auto font-bold px-8 shadow-md">Manage Tolee</Button>
              ) : isMember ? (
                <Button variant="outline" className="w-full md:w-auto font-bold px-8 shadow-md">Joined</Button>
              ) : isPending ? (
                <Button disabled variant="outline" className="w-full md:w-auto font-bold px-8 shadow-md">Requested</Button>
              ) : (
                <Button 
                  onClick={handleJoin} 
                  disabled={isJoining}
                  className="w-full md:w-auto font-bold px-8 shadow-md"
                >
                  {isJoining ? 'Processing...' : tolee.isPrivate ? 'Request to Join' : 'Join Tolee'}
                </Button>
              )}
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
            {activeTab === 'community' && isMember && (
              <Card className="border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden bg-white dark:bg-[#121212]">
                <div className="p-4 flex gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="https://i.pravatar.cc/150?u=me" />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <Input 
                      placeholder={tolee.pendingPostApproval && !isModerator ? "Write a post for admin approval..." : "Share something with the community..."}
                      className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-base py-6 focus-visible:ring-1 focus-visible:ring-primary/50"
                    />
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary rounded-lg h-9 px-3"><ImageIcon className="w-4 h-4 mr-2" /> Image</Button>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary rounded-lg h-9 px-3"><Video className="w-4 h-4 mr-2" /> Video</Button>
                      </div>
                      <Button size="sm" className="font-bold px-6 rounded-lg">Post</Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {!isMember && tolee.isPrivate ? (
              <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-[#121212] p-10 text-center flex flex-col items-center">
                <ShieldCheck className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                <h2 className="text-xl font-bold mb-2">This is a Private Tolee</h2>
                <p className="text-gray-500 mb-6">You need to be a member to see and participate in the community discussions.</p>
                {isPending ? (
                  <Button disabled variant="outline">Request Pending</Button>
                ) : (
                  <Button onClick={handleJoin} disabled={isJoining}>{isJoining ? 'Requesting...' : 'Request to Join'}</Button>
                )}
              </Card>
            ) : (
              <>
                {/* Posts Feed */}
                {activeTab === 'community' && posts.map((post: any) => (
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
                        <Button variant="ghost" className="flex-1 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg h-10"><Heart className="w-5 h-5 mr-2" /> Like</Button>
                        <Button variant="ghost" className="flex-1 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg h-10"><MessageCircle className="w-5 h-5 mr-2" /> Comment</Button>
                        <Button variant="ghost" className="flex-1 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg h-10"><Send className="w-5 h-5 mr-2" /> Share</Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </>
            )}

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
                      <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">Module {course}: Foundations</h3>
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
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* About Card */}
            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] shadow-sm">
              <CardHeader className="p-5 pb-2">
                <h3 className="font-bold text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-gray-400" /> About this Tolee</h3>
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
                      <p className="text-gray-500">{tolee.admin?.name || 'Admin'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {tolee.isPrivate ? (
                      <AlertTriangle className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Globe className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {tolee.isPrivate ? 'Private Tolee' : 'Public Tolee'}
                      </p>
                      <p className="text-gray-500">
                        {tolee.isPrivate ? 'Only members can see who\'s in the tolee and what they post.' : 'Anyone can see who\'s in the tolee and what they post.'}
                      </p>
                    </div>
                  </div>
                  {tolee.pendingPostApproval && (
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Post Approval On</p>
                        <p className="text-gray-500">Admins/Moderators must approve posts.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Rules Card */}
            {tolee.rules && (
              <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] shadow-sm">
                <CardHeader className="p-5 pb-2">
                  <h3 className="font-bold text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-gray-400" /> Tolee Rules</h3>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <ul className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed list-disc pl-5 space-y-2">
                    {tolee.rules.split('\n').map((rule: string, i: number) => rule.trim() ? (
                      <li key={i}>{rule.trim()}</li>
                    ) : null)}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Leaderboard Preview Card */}
            <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] shadow-sm">
              <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between">
                <h3 className="font-bold text-lg flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Leaderboard</h3>
                <span className="text-xs text-primary font-semibold cursor-pointer hover:underline">View all</span>
              </CardHeader>
              <CardContent className="p-5 pt-2">
                <div className="flex flex-col gap-4">
                  {leaderboard.slice(0, 3).map((user: any, index: number) => (
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
