'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function createPost(data: {
  content: string;
  postType: string;
  media?: { type: string; url: string } | null;
  toleeId: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { success: false, error: 'Unauthorized' };
    }
    const userId = (session.user as any).id;

    // Ensure the Tolee exists
    let tolee = await prisma.tolee.findUnique({ where: { id: data.toleeId } });
    if (!tolee) {
      tolee = await prisma.tolee.create({
        data: {
          id: data.toleeId,
          name: data.toleeId === 't1' ? 'AI Automation Society' : 
                data.toleeId === 't2' ? 'Sabaka Mangal Ho' : 'That Pickleball Tolee',
          slug: data.toleeId,
          description: 'A mock tolee created automatically',
          isPrivate: false,
          ownerId: userId
        }
      });
    }

    const post = await prisma.post.create({
      data: {
        caption: data.content,
        postType: data.postType,
        mediaUrls: data.media ? data.media.url : null,
        mediaTypes: data.media ? data.media.type : null,
        authorId: userId,
        tolees: {
          create: {
            toleeId: tolee.id
          }
        }
      }
    });

    revalidatePath('/feed');
    return { success: true, post };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error: 'Failed to create post' };
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        tolees: {
          include: {
            tolee: true
          }
        },
        likes: true,
        comments: {
          include: {
            author: true
          }
        }
      }
    });
    
    return { success: true, posts };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { success: false, posts: [] };
  }
}

export async function toggleLike(postId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { success: false, error: 'Unauthorized' };
    }
    const userId = (session.user as any).id;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      });
      return { success: true, liked: false };
    } else {
      await prisma.like.create({
        data: {
          userId,
          postId
        }
      });

      // Create notification for post author
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { author: true }
      });

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (post && user && post.authorId !== userId) {
        await prisma.notification.create({
          data: {
            userId: post.authorId,
            type: 'like',
            message: `${user.username || user.name} liked your post.`,
            link: `/feed` // or specific post URL
          }
        });
      }

      return { success: true, liked: true };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, error: 'Failed to toggle like' };
  }
}

export async function addComment(postId: string, content: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { success: false, error: 'Unauthorized' };
    }
    const userId = (session.user as any).id;

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId
      },
      include: {
        author: true
      }
    });

    // Create notification for post author
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (post && post.authorId !== userId) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          type: 'comment',
          message: `${comment.author.username || comment.author.name} commented on your post: "${content.substring(0, 20)}${content.length > 20 ? '...' : ''}"`,
          link: `/feed`
        }
      });
    }

    return { success: true, comment };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, error: 'Failed to add comment' };
  }
}

export async function getComments(postId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { author: true },
      orderBy: { createdAt: 'asc' }
    });
    return { success: true, comments };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { success: false, error: 'Failed to fetch comments' };
  }
}
