import { prisma } from "../lib/prisma";

async function main() {
  console.log("Seeding database...");

  // Clean up existing data
  await prisma.vote.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        clerkUserId: "user_2tW6z...",
        email: "alice@example.com",
        name: "Alice Johnson",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
        role: "ADMIN",
      },
    }),
    prisma.user.create({
      data: {
        clerkUserId: "user_2tW7x...",
        email: "bob@example.com",
        name: "Bob Smith",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        clerkUserId: "user_2tW8y...",
        email: "charlie@example.com",
        name: "Charlie Brown",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        clerkUserId: "user_2tW9z...",
        email: "david@example.com",
        name: "David Wilson",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        role: "USER",
      },
    }),
    prisma.user.create({
      data: {
        clerkUserId: "user_2tW0a...",
        email: "eve@example.com",
        name: "Eve Green",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eve",
        role: "USER",
      },
    }),
  ]);

  console.log(`Created ${users.length} users.`);

  // Create Posts
  const categories = ["Feature", "UI", "UX", "Bug"];
  const statuses = ["under_review", "planned", "in_progress", "completed"];

  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: "Add Dark Mode",
        description: "It would be great if the app had a dark mode option.",
        category: "UI",
        status: "completed",
        authorId: users[0].id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Improve Search",
        description: "The search functionality is a bit slow and often shows irrelevant results.",
        category: "UX",
        status: "in_progress",
        authorId: users[1].id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Bug: Cannot Change Profile Picture",
        description: "When I try to upload a new profile picture, I get an error message.",
        category: "Bug",
        status: "under_review",
        authorId: users[2].id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Export to CSV",
        description: "Provide an option to export feedback data to CSV for analysis.",
        category: "Feature",
        status: "planned",
        authorId: users[3].id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Responsive Design for Mobile",
        description: "The app looks a bit weird on small screens. Needs improvement.",
        category: "UI",
        status: "under_review",
        authorId: users[4].id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Notification System",
        description: "Get notified when someone upvotes your post or its status changes.",
        category: "Feature",
        status: "planned",
        authorId: users[0].id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Refactor API Layer",
        description: "Cleanup the API routes and use more consistent naming conventions.",
        category: "Feature",
        status: "in_progress",
        authorId: users[1].id,
      },
    }),
    prisma.post.create({
      data: {
        title: "Better Error Handling",
        description: "Users should see clearer error messages when something goes wrong.",
        category: "UX",
        status: "planned",
        authorId: users[2].id,
      },
    }),
  ]);

  console.log(`Created ${posts.length} posts.`);

  // Create Votes
  const votes = [];
  for (const post of posts) {
    // Randomly assign 0-5 votes per post
    const voteCount = Math.floor(Math.random() * 5);
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
    const selectedUsers = shuffledUsers.slice(0, voteCount);

    for (const user of selectedUsers) {
      votes.push(
        prisma.vote.create({
          data: {
            userId: user.id,
            postId: post.id,
          },
        })
      );
    }
  }

  await Promise.all(votes);
  console.log(`Created ${votes.length} votes.`);

  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
