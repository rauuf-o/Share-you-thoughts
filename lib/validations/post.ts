import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z.string().max(1000, "Description too long").optional(),

  category: z.string().min(2, "Category is required"),
});
