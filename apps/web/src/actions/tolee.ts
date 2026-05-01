'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getTolees() {
  try {
    const tolees = await prisma.tolee.findMany({
      include: {
        members: true,
      }
    });
    return { success: true, tolees };
  } catch (error) {
    console.error("Error fetching tolees:", error);
    return { success: false, tolees: [] };
  }
}

export async function getToleeBySlug(slug: string) {
  try {
    const tolee = await prisma.tolee.findUnique({
      where: { slug },
      include: {
        owner: true,
        members: {
          include: { user: true }
        },
        posts: {
          include: {
            post: {
              include: {
                author: true,
                likes: true,
                comments: true
              }
            }
          },
          orderBy: {
            post: {
              createdAt: 'desc'
            }
          }
        }
      }
    });
    return { success: true, tolee };
  } catch (error) {
    console.error("Error fetching tolee by slug:", error);
    return { success: false, tolee: null };
  }
}

export async function joinTolee(toleeId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { success: false, error: 'Unauthorized' };
    }
    const userId = (session.user as any).id;

    const tolee = await prisma.tolee.findUnique({
      where: { id: toleeId }
    });

    if (!tolee) {
      return { success: false, error: 'Tolee not found' };
    }

    const existingMember = await prisma.toleeMember.findUnique({
      where: {
        userId_toleeId: {
          userId,
          toleeId
        }
      }
    });

    if (existingMember) {
      return { success: false, error: 'Already requested or joined' };
    }

    // Facebook Group Logic: Private group -> pending, Public -> approved
    const status = tolee.isPrivate ? 'pending' : 'approved';

    await prisma.toleeMember.create({
      data: {
        userId,
        toleeId,
        status,
        role: 'member'
      }
    });

    // Create notification for Tolee owner
    if (tolee.ownerId && tolee.ownerId !== userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        await prisma.notification.create({
          data: {
            userId: tolee.ownerId,
            type: 'follow', // reusing the follow icon
            message: status === 'pending' 
              ? `${user.username || user.name} requested to join ${tolee.name}.`
              : `${user.username || user.name} joined ${tolee.name}.`,
            link: `/t/${tolee.slug}`
          }
        });
      }
    }

    revalidatePath(`/t/${tolee.slug}`);
    return { success: true, status };
  } catch (error) {
    console.error("Error joining tolee:", error);
    return { success: false, error: 'Failed to join tolee' };
  }
}

export async function createTolee(data: { 
  name: string, 
  isPrivate: boolean, 
  description?: string,
  category?: string,
  location?: string,
  membershipQuestions?: string,
  rules?: string,
  welcomeMessage?: string,
  pendingPostApproval?: boolean,
  coverImage?: string,
  avatar?: string
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { success: false, error: 'Unauthorized' };
    }
    const userId = (session.user as any).id;

    // Generate a simple slug
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    const tolee = await prisma.tolee.create({
      data: {
        name: data.name,
        slug,
        description: data.description || `Welcome to ${data.name}!`,
        isPrivate: data.isPrivate,
        category: data.category,
        location: data.location,
        membershipQuestions: data.membershipQuestions,
        rules: data.rules,
        welcomeMessage: data.welcomeMessage,
        pendingPostApproval: data.pendingPostApproval || false,
        coverImage: data.coverImage,
        avatar: data.avatar,
        ownerId: userId,
        members: {
          create: {
            userId,
            status: 'approved',
            role: 'admin'
          }
        }
      }
    });

    revalidatePath('/discover');
    revalidatePath('/feed');
    
    return { success: true, tolee };
  } catch (error) {
    console.error("Error creating tolee:", error);
    return { success: false, error: 'Failed to create tolee' };
  }
}
