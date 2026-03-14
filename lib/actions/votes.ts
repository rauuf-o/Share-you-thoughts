// lib/actions/vote-actions.ts
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Server action to toggle a vote for a post
 */
export async function toggleVote(formData: FormData): Promise<void> {
  const postId = formData.get("postId") as string;
  if (!postId) throw new Error("Post Id is required");

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!dbUser) throw new Error("Unauthorized");

  // Use findFirst instead of findUnique because no compound unique
  const existingVote = await prisma.vote.findUnique({
    where: { userId_postId: { userId: dbUser.id, postId: Number(postId) } },
  });

  if (existingVote) {
    await prisma.vote.delete({ where: { id: existingVote.id } });
  } else {
    await prisma.vote.create({
      data: { userId: dbUser.id, postId: Number(postId) },
    });
  }
}
