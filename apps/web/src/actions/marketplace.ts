'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getListings() {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        }
      }
    });
    return { success: true, listings };
  } catch (error) {
    console.error("Error fetching listings:", error);
    return { success: false, listings: [] };
  }
}

export async function createListing(data: {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  locationText: string;
  images: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { success: false, error: 'Unauthorized' };
    }
    const userId = (session.user as any).id;

    const listing = await prisma.listing.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        condition: data.condition,
        locationText: data.locationText,
        images: data.images,
        sellerId: userId,
        status: 'active'
      }
    });

    revalidatePath('/marketplace');
    return { success: true, listing };
  } catch (error) {
    console.error("Error creating listing:", error);
    return { success: false, error: 'Failed to create listing' };
  }
}
