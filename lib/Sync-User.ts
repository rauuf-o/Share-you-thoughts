import { currentUser } from "@clerk/nextjs/server";
import { th } from "date-fns/locale";
import React from "react";
import { prisma } from "./prisma";
export async function SyncUser() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      throw new Error("User does not have an email address");
    }
    let dbUser = await prisma.user.findUnique({
      where: {
        clerkUserId: clerkUser.id,
      },
    });
    if (dbUser) {
      dbUser = await prisma.user.update({
        where: {
          id: dbUser.id,
        },
        data: {
          clerkUserId: clerkUser.id,
          email: email,
          name: clerkUser.fullName || clerkUser.username,
          image: clerkUser.imageUrl,
        },
      });
    } else {
      const userCount = await prisma.user.count();
      const isFirstUser = userCount === 0;
      dbUser = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email: email,
          name: clerkUser.fullName || clerkUser.username,
          image: clerkUser.imageUrl,
          role: isFirstUser ? "ADMIN" : "USER",
        },
      });
      console.log("Created new user:", dbUser);
    }
    return dbUser;
  } catch (error) {
    console.log(error);
    return null;
  }
}
