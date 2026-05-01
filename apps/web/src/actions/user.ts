'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function toggleFollow(targetUserId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { success: false, error: 'Unauthorized' };
    }
    const currentUserId = (session.user as any).id;

    if (currentUserId === targetUserId) {
      return { success: false, error: 'Cannot follow yourself' };
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId
        }
      }
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: targetUserId
          }
        }
      });
      revalidatePath(`/u/[username]`, 'page');
      return { success: true, isFollowing: false };
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: targetUserId
        }
      });
      revalidatePath(`/u/[username]`, 'page');
      return { success: true, isFollowing: true };
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    return { success: false, error: 'Failed to toggle follow' };
  }
}

export async function getNotifications() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { success: false, error: 'Unauthorized', notifications: [] };
    }
    const userId = (session.user as any).id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, notifications };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { success: false, error: 'Failed to fetch notifications', notifications: [] };
  }
}

export async function markNotificationsAsRead() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { success: false, error: 'Unauthorized' };
    }
    const userId = (session.user as any).id;

    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });

    revalidatePath('/notifications');
    return { success: true };
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return { success: false, error: 'Failed to mark notifications as read' };
  }
}
