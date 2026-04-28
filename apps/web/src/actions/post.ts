'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createPost(data: {
  content: string;
  postType: string;
  media?: { type: string; url: string } | null;
  toleeId: string;
}) {
  try {
    // In a real app, authorId would come from session/auth
    // For now we'll find or create a mock user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          username: 'AlexJohnson',
          email: 'alex@example.com',
          name: 'Alex Johnson',
          avatar: 'https://i.pravatar.cc/150?u=me',
        }
      });
    }

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
          ownerId: user.id
        }
      });
    }

    const post = await prisma.post.create({
      data: {
        caption: data.content,
        postType: data.postType,
        mediaUrls: data.media ? data.media.url : null,
        mediaTypes: data.media ? data.media.type : null,
        authorId: user.id,
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
        }
      }
    });
    
    return { success: true, posts };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { success: false, posts: [] };
  }
}
