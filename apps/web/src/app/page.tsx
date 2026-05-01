import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Globe } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { getTolees } from '@/actions/tolee';
import { DiscoverGrid } from '@/components/DiscoverGrid';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const categories = [
  { name: 'All', active: true },
  { name: 'Hobbies', icon: '🎨' },
  { name: 'Music', icon: '🎸' },
  { name: 'Money', icon: '💰' },
  { name: 'Spirituality', icon: '🧘' },
  { name: 'Tech', icon: '💻' },
  { name: 'Health', icon: '🥗' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Self-improvement', icon: '📚' },
];

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session?.user;

  const res = await getTolees();
  const dbTolees = res.success ? res.tolees : [];

  const tolees = dbTolees.map((t: any, index: number) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description || 'No description available',
    members: t.members?.length || 0,
    price: t.price === 0 ? 'Free' : `$${t.price}`,
    rank: index + 1,
    banner: t.coverImage || `https://images.unsplash.com/photo-${1622271810775 + index * 1000}?auto=format&fit=crop&w=800&q=80`,
    avatar: t.avatar || `https://i.pravatar.cc/150?u=${index + 10}`,
  }));

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] font-sans text-gray-900 dark:text-gray-100">
      <main className="container mx-auto px-4 pt-12 pb-24 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-gray-900 dark:text-white">
            Discover Tolees
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            or <Link href="/create-tolee" className="text-primary hover:text-primary/80 transition-colors hover:underline font-medium">create your own</Link>
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-6 duration-500 delay-100">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors w-5 h-5" />
            <Input 
              type="text" 
              placeholder="Search for anything" 
              className="w-full pl-12 pr-4 py-6 text-lg rounded-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10 flex justify-center animate-in fade-in slide-in-from-bottom-8 duration-500 delay-200">
          <ScrollArea className="w-full max-w-4xl whitespace-nowrap">
            <div className="flex w-max space-x-2 p-1 mx-auto">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category.active 
                      ? 'bg-gray-600 text-white dark:bg-white dark:text-black shadow-md' 
                      : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm'
                  }`}
                >
                  {category.icon && <span>{category.icon}</span>}
                  {category.name}
                </button>
              ))}
              <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm transition-all">
                More...
              </button>
              <button className="flex items-center justify-center w-9 h-9 rounded-full bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm transition-all">
                <Globe className="w-4 h-4" />
              </button>
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>

        {/* Tolees Grid */}
        <DiscoverGrid tolees={tolees} isAuthenticated={isAuthenticated} />
      </main>
    </div>
  );
}
