import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q || '';
  
  // Search Users
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { username: { contains: query } }
      ]
    },
    take: 10
  });

  // Search Tolees
  const tolees = await prisma.tolee.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { description: { contains: query } }
      ]
    },
    take: 10
  });

  // Search Posts
  const posts = await prisma.post.findMany({
    where: {
      caption: { contains: query }
    },
    include: {
      author: true
    },
    take: 10
  });

  return (
    <div className="container mx-auto px-4 lg:px-8 pt-8 pb-24 max-w-4xl min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Search Results for "{query}"</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-primary">Users</h2>
          {users.length === 0 ? <p className="text-gray-500">No users found.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map(user => (
                <Link href={`/u/${user.username}`} key={user.id}>
                  <Card className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
                    <CardContent className="flex items-center p-4 gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar || "https://i.pravatar.cc/150?u=a"} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-bold">{user.name}</div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-primary">Tolees (Groups)</h2>
          {tolees.length === 0 ? <p className="text-gray-500">No Tolees found.</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tolees.map(tolee => (
                <Link href={`/t/${tolee.slug}`} key={tolee.id}>
                  <Card className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer">
                    <CardContent className="flex items-center p-4 gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary">
                        {tolee.name[0]}
                      </div>
                      <div>
                        <div className="font-bold">{tolee.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{tolee.description}</div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-primary">Posts</h2>
          {posts.length === 0 ? <p className="text-gray-500">No posts found.</p> : (
            <div className="space-y-4">
              {posts.map(post => (
                <Card key={post.id}>
                  <CardContent className="p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={post.author.avatar || "https://i.pravatar.cc/150?u=a"} />
                        <AvatarFallback>{post.author.username[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-sm">{post.author.username}</span>
                      <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm">{post.caption}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
