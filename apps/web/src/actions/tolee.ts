'use server';

import { prisma } from '@/lib/prisma';

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
