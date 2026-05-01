import { FeedStream } from '@/components/FeedStream';
import { getPosts } from '@/actions/post';
import { prisma } from '@/lib/prisma';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function GlobalFeedPage() {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?.id;

  // Fetch real posts from DB
  let dbPosts: any[] = [];
  try {
    const res = await getPosts();
    if (res.success && res.posts) {
      dbPosts = res.posts.map(post => {
        // Find the first tolee name
        const firstTolee = post.tolees?.[0]?.tolee;
        const likedByMe = currentUserId ? post.likes.some((like: any) => like.userId === currentUserId) : false;
        
        return {
          id: post.id,
          author: post.author.username,
          authorAvatar: post.author.avatar || 'https://i.pravatar.cc/150?u=me',
          toleeName: firstTolee?.name || 'Tolee',
          toleeSlug: firstTolee?.slug || 'group',
          role: firstTolee?.ownerId === post.author.id ? 'Admin' : 'Member',
          time: new Date(post.createdAt).toLocaleDateString(),
          content: post.caption || '',
          image: post.mediaTypes === 'image' ? post.mediaUrls : null,
          video: post.mediaTypes === 'video' ? post.mediaUrls : null,
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0,
          isWin: post.postType === 'win',
          likedByMe,
          commentsList: post.comments || []
        };
      });
    }
  } catch (err) {
    console.error("Failed to load DB posts", err);
  }

  return <FeedStream initialPosts={dbPosts} />;
}
