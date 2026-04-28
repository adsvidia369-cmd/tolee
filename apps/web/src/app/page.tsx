import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Globe } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { getTolees } from '@/actions/tolee';

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
            Discover communities
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            or <a href="#" className="text-primary hover:text-primary/80 transition-colors hover:underline font-medium">create your own</a>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          {tolees.map((tolee: any) => (
            <Link href={`/t/${tolee.slug}`} key={tolee.id} className="block h-full">
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
      </main>
    </div>
  );
}
