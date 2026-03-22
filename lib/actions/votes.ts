"use server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function toggleVote(postId: number): Promise<void> {
  // 1️⃣ Auth
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // 2️⃣ Get DB user
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!dbUser) throw new Error("User not found");

  // 3️⃣ Check existing vote
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_postId: {
        userId: dbUser.id,
        postId,
      },
    },
  });

  // 4️⃣ Toggle
  if (existingVote) {
    await prisma.vote.delete({
      where: { id: existingVote.id },
    });
  } else {
    await prisma.vote.create({
      data: {
        userId: dbUser.id,
        postId,
      },
    });
  }
  // 5️⃣ Revalidate the feedback page so it shows the updated votes
  revalidatePath("/feedback");
}
