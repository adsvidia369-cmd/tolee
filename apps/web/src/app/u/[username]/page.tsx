'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, Link as LinkIcon, Calendar, Trophy, Star, ShieldCheck, Mail, Edit3, Settings } from 'lucide-react';

export default function UserProfile({ params }: { params: { username: string } }) {
  const user = {
    name: 'Alex Johnson',
    username: params.username || 'alex_j',
    bio: 'Founder at AI Automation Society | Tech Enthusiast | Helping people build scalable businesses.',
    location: 'San Francisco, CA',
    website: 'alexjohnson.com',
    joinedDate: 'Joined March 2023',
    avatar: 'https://i.pravatar.cc/150?u=99',
    level: 7,
    points: 12450,
    trustScore: 98,
    isVerified: true
  };

  const myTolees = [
    { id: 1, name: 'AI Automation Society', role: 'Admin', members: '347k', avatar: 'https://i.pravatar.cc/150?u=12' },
    { id: 2, name: 'Tolee Builders', role: 'Member', members: '193k', avatar: 'https://i.pravatar.cc/150?u=15' },
    { id: 3, name: 'Zero To Founder', role: 'Moderator', members: '2.6k', avatar: 'https://i.pravatar.cc/150?u=18' }
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] font-sans text-gray-900 dark:text-gray-100">
      <main className="container mx-auto px-4 pt-10 pb-24 max-w-4xl">
        {/* Profile Header Card */}
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-[#121212] overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-primary/80 to-accent/80 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          
          <CardContent className="px-6 sm:px-8 pb-8 relative">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end -mt-16 sm:-mt-20 mb-6">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-[#121212] overflow-hidden shadow-xl bg-white relative">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-grow text-center sm:text-left mb-2">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{user.name}</h1>
                  {user.isVerified && <ShieldCheck className="w-6 h-6 text-primary fill-primary/10" />}
                </div>
                <p className="text-lg text-gray-500 font-medium mb-3">@{user.username}</p>
                
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {user.location}</span>
                  <span className="flex items-center gap-1.5"><LinkIcon className="w-4 h-4" /> <a href="#" className="text-primary hover:underline">{user.website}</a></span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {user.joinedDate}</span>
                </div>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <Button className="w-full sm:w-auto font-bold px-8 rounded-full shadow-md">Follow</Button>
                <Button variant="outline" className="w-12 px-0 rounded-full"><Mail className="w-5 h-5" /></Button>
              </div>
            </div>

            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto sm:mx-0 text-center sm:text-left">
              {user.bio}
            </p>

            {/* Gamification Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{user.level}</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Level</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                <Star className="w-8 h-8 text-primary mb-2" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{(user.points / 1000).toFixed(1)}k</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Points</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                <ShieldCheck className="w-8 h-8 text-green-500 mb-2" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{user.trustScore}%</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trust Score</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                <Edit3 className="w-8 h-8 text-purple-500 mb-2" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">142</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Posts</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Content Tabs */}
        <Tabs defaultValue="communities" className="w-full">
          <TabsList className="w-full flex bg-transparent border-b border-gray-200 dark:border-gray-800 rounded-none h-auto p-0 mb-8 space-x-8">
            <TabsTrigger value="communities" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-base font-bold text-gray-500 data-[state=active]:text-primary transition-all uppercase tracking-wider">Communities</TabsTrigger>
            <TabsTrigger value="posts" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-base font-bold text-gray-500 data-[state=active]:text-primary transition-all uppercase tracking-wider">Recent Posts</TabsTrigger>
            <TabsTrigger value="marketplace" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-base font-bold text-gray-500 data-[state=active]:text-primary transition-all uppercase tracking-wider">Listings</TabsTrigger>
          </TabsList>

          <TabsContent value="communities" className="outline-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {myTolees.map(t => (
                <Card key={t.id} className="border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-5 flex items-center gap-4">
                    <Avatar className="w-14 h-14 rounded-lg">
                      <AvatarImage src={t.avatar} />
                      <AvatarFallback className="rounded-lg">{t.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-[15px] line-clamp-1">{t.name}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${t.role === 'Admin' ? 'border-red-200 text-red-500' : t.role === 'Moderator' ? 'border-primary/30 text-primary' : ''}`}>{t.role}</Badge>
                        • {t.members}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="posts" className="outline-none">
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl border-dashed">
              <Edit3 className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No recent posts</h3>
              <p className="text-gray-500 max-w-sm">Alex hasn't posted anything in public communities recently.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="marketplace" className="outline-none">
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-2xl border-dashed">
              <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No active listings</h3>
              <p className="text-gray-500 max-w-sm">Alex currently has no items listed in the local marketplace.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
