import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, Link as LinkIcon, Calendar, Trophy, Star, ShieldCheck, Mail, Edit3, Settings } from 'lucide-react';

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { FollowButton } from '@/components/FollowButton';
import { EditProfileModal } from '@/components/EditProfileModal';
import { ProfileHeaderCard } from '@/components/ProfileHeaderCard';

export default async function UserProfile({ params }: { params: { username: string } }) {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?.id;

  let user;
  
  if (params.username === 'me') {
    if (!currentUserId) return notFound();
    user = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: {
        followers: true,
        following: true,
        posts: true,
        ownedTolees: true,
        tolees: {
          include: { tolee: true }
        }
      }
    });
  } else {
    user = await prisma.user.findUnique({
      where: { username: params.username },
      include: {
        followers: true,
        following: true,
        posts: true,
        ownedTolees: true,
        tolees: {
          include: { tolee: true }
        }
      }
    });
  }

  if (!user) {
    return notFound();
  }

  const isFollowing = currentUserId 
    ? user.followers.some(f => f.followerId === currentUserId)
    : false;

  const isMe = currentUserId === user.id;

  const myTolees = user.tolees.map((t: any) => ({
    id: t.tolee.id,
    name: t.tolee.name,
    role: t.role,
    avatar: t.tolee.avatar || "https://i.pravatar.cc/150?u=" + t.tolee.id,
    slug: t.tolee.slug
  }));

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] font-sans text-gray-900 dark:text-gray-100">
      <main className="container mx-auto px-4 pt-10 pb-24 max-w-4xl">
        {/* Profile Header Card */}
        <ProfileHeaderCard 
          user={user} 
          isMe={isMe} 
          currentUserId={currentUserId} 
          isFollowing={isFollowing} 
        />

        {/* User Content Tabs */}
        <Tabs defaultValue="tolees" className="w-full">
          <TabsList className="w-full flex bg-transparent border-b border-gray-200 dark:border-gray-800 rounded-none h-auto p-0 mb-8 space-x-8">
            <TabsTrigger value="tolees" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-base font-bold text-gray-500 data-[state=active]:text-primary transition-all uppercase tracking-wider">Tolees</TabsTrigger>
            <TabsTrigger value="posts" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-base font-bold text-gray-500 data-[state=active]:text-primary transition-all uppercase tracking-wider">Recent Posts</TabsTrigger>
            <TabsTrigger value="marketplace" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 py-4 text-base font-bold text-gray-500 data-[state=active]:text-primary transition-all uppercase tracking-wider">Listings</TabsTrigger>
          </TabsList>

          <TabsContent value="tolees" className="outline-none">
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
              <p className="text-gray-500 max-w-sm">Alex hasn't posted anything in public Tolees recently.</p>
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
