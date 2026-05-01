import { ReelsStream } from '@/components/ReelsStream';
import { getPosts } from '@/actions/post';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function ReelsPage() {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?.id;

  // Fetch real posts from DB
  let dbReels: any[] = [];
  try {
    const res = await getPosts();
    if (res.success && res.posts) {
      dbReels = res.posts
        .filter(post => post.mediaTypes === 'video' && post.mediaUrls)
        .map(post => {
          const firstTolee = post.tolees?.[0]?.tolee;
          const likedByMe = currentUserId ? post.likes.some((like: any) => like.userId === currentUserId) : false;
          
          return {
            id: post.id,
            video: post.mediaUrls,
            author: post.author.username,
            authorAvatar: post.author.avatar || 'https://i.pravatar.cc/150?u=me',
            toleeName: firstTolee?.name || 'Tolee',
            toleeSlug: firstTolee?.slug || 'group',
            role: firstTolee?.ownerId === post.author.id ? 'Admin' : 'Member',
            caption: post.caption || '',
            likes: post.likes?.length || 0,
            comments: post.comments?.length || 0,
            shares: '0',
            audio: 'Original Audio',
            isVerified: false,
            likedByMe
          };
        });
    }
  } catch (err) {
    console.error("Failed to load DB reels", err);
  }

  // If no database reels, fall back to some mock data just to show UI
  if (dbReels.length === 0) {
    dbReels = [
      {
        id: 1,
        video: 'https://cdn.pixabay.com/video/2021/08/04/83896-584732159_large.mp4',
        toleeName: 'AI Automation Society',
        toleeSlug: 'ai-automation-society',
        author: 'Alex Johnson',
        authorAvatar: 'https://i.pravatar.cc/150?u=99',
        caption: '3 tools you must know to build an AI agency in 2024. 🚀 Watch till the end! #ai #automation #business',
        likes: '45.2k',
        comments: '1.2k',
        shares: '8.4k',
        audio: 'Original Audio - Alex Johnson',
        isVerified: true
      },
      {
        id: 2,
        video: 'https://cdn.pixabay.com/video/2020/05/11/38600-418859942_large.mp4',
        toleeName: 'That Pickleball Tolee',
        toleeSlug: 'pickleball',
        author: 'Sarah Chen',
        authorAvatar: 'https://i.pravatar.cc/150?u=41',
        caption: 'Perfect your backhand spin with this simple drill 🏓🔥 Practice this 10 mins daily!',
        likes: '12.8k',
        comments: '342',
        shares: '2.1k',
        audio: 'Pickleball Masters - Trending',
        isVerified: false
      }
    ];
  }

  return <ReelsStream initialReels={dbReels} />;
}
