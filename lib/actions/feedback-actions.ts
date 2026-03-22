"use server";
import { auth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { createPostSchema } from "@/lib/validations/post";
import { STATUS_ORDER } from "@/app/data/status-data";
import { PostStatus } from "@/generated/prisma/client";

export async function createPost(formData: FormData) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("Not authenticated");

    // Zod validation inside try/catch
    const data = createPostSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
    });

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (!dbUser) throw new Error("User not found");

    const post = await prisma.post.create({
      data: {
        ...data,
        authorId: dbUser.id,
      },
    });

    return post; // optionally return the created post
  } catch (error) {
    // handle Zod errors and other errors differently
    if (error instanceof Error) {
      console.log("Server action error:", error.message);
    }

    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
}
export async function allPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        votes: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, posts };
  } catch (error) {
    console.log("Server action error:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      posts: [],
    };
  }
}

export async function updateStatus(postId: number, status: PostStatus) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }

  await prisma.post.update({
    where: { id: postId },
    data: { status },
  });

  // 🔥 revalidate page
}
export async function userPosts(userId: string) {
  // Directly fetch posts for the given user ID
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!dbUser) throw new Error("User not found");

  const posts = await prisma.post.findMany({
    where: { authorId: dbUser.id },
    include: {
      author: true,
      votes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts;
}
