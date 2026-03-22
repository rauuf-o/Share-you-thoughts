// types.ts
export interface User {
  id: number;
  clerkUserId: string;
  name: string | null;
  email: string;
  image: string;
  role: "USER" | "ADMIN";
  createdAt: Date; // or Date if you parse it
}

export interface Vote {
  id: number;
  userId: number;
  postId: number;
  createdAt: Date; // or Date
}

export interface Post {
  id: number;
  title: string;
  description: string | null;
  category: string;
  status: "under_review" | "planned" | "in_progress" | "completed";
  authorId: number;
  author: Pick<User, "id" | "name">; // only id and name needed for display
  votes: Vote[];
  createdAt: Date;
  updatedAt: Date;
}
