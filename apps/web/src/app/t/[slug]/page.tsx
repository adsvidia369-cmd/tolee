import { ToleeView } from '@/components/ToleeView';
import { getToleeBySlug } from '@/actions/tolee';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';

export default async function ToleePage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?.id;

  const res = await getToleeBySlug(params.slug);
  
  if (!res.success || !res.tolee) {
    notFound();
  }

  const dbTolee = res.tolee;

  // Evaluate membership
  let membershipStatus = 'none'; // 'none', 'pending', 'approved'
  let role = 'none'; // 'none', 'member', 'moderator', 'admin'
  
  if (currentUserId) {
    if (dbTolee.ownerId === currentUserId) {
      membershipStatus = 'approved';
      role = 'admin';
    } else {
      const member = dbTolee.members.find((m: any) => m.userId === currentUserId);
      if (member) {
        membershipStatus = member.status;
        role = member.role;
      }
    }
  }

  // Format Tolee details
  const tolee = {
    id: dbTolee.id,
    name: dbTolee.name,
    slug: dbTolee.slug,
    description: dbTolee.description || 'Welcome to this group!',
    membersCount: dbTolee.members.length,
    price: dbTolee.price === 0 ? 'Free' : `₹${dbTolee.price}`,
    avatar: dbTolee.avatar || `https://i.pravatar.cc/150?u=${dbTolee.id}`,
    banner: dbTolee.coverImage || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    admin: { name: dbTolee.owner?.username || 'Admin' },
    isPrivate: dbTolee.isPrivate,
    pendingPostApproval: dbTolee.pendingPostApproval,
    rules: dbTolee.rules || '1. Be respectful\n2. No spam or self-promotion\n3. Stay on topic'
  };

  // Format posts
  const posts = dbTolee.posts.map((pt: any) => {
    const post = pt.post;
    const likedByMe = currentUserId ? post.likes.some((like: any) => like.userId === currentUserId) : false;
    return {
      id: post.id,
      author: post.author.username,
      authorAvatar: post.author.avatar || 'https://i.pravatar.cc/150?u=me',
      role: dbTolee.ownerId === post.author.id ? 'Admin' : 'Member', // Simplify role display
      time: new Date(post.createdAt).toLocaleDateString(),
      content: post.caption || '',
      image: post.mediaTypes === 'image' ? post.mediaUrls : null,
      video: post.mediaTypes === 'video' ? post.mediaUrls : null,
      likes: post.likes?.length || 0,
      comments: post.comments?.length || 0,
      isWin: post.postType === 'win',
      likedByMe
    };
  });

  // Mock leaderboard for now
  const leaderboard = [
    { id: 1, name: 'Michael Scott', avatar: 'https://i.pravatar.cc/150?u=51', points: 4250, level: 7 },
    { id: 2, name: 'Dwight S.', avatar: 'https://i.pravatar.cc/150?u=52', points: 3800, level: 6 },
    { id: 3, name: 'Jim Halpert', avatar: 'https://i.pravatar.cc/150?u=53', points: 3100, level: 6 },
  ];

  return (
    <ToleeView 
      toleeData={{ tolee, posts, leaderboard, membershipStatus, role }} 
      currentUserId={currentUserId || null} 
    />
  );
}
