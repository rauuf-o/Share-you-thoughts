"use client";

import React, { useTransition } from "react";
import { ThumbsUp, MessageSquare, User } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";
import { STATUS_GROUPS } from "@/app/data/status-data";
import { getCategoryDesign } from "@/app/data/category-data";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { toggleVote } from "@/lib/actions/votes";
import { Post } from "@/lib/validations/types";

interface FeedbackListProps {
  posts: Post[];
  userId: string;
}

const FeedbackList = ({ posts, userId }: FeedbackListProps) => {
  const [isPending, startTransition] = useTransition();

  const handleVote = (postId: number) => {
    if (!userId) {
      toast.error("You must be logged in to vote.");
      return;
    }

    const loadingToast = toast.loading("Voting...");

    startTransition(async () => {
      try {
        await toggleVote(postId); // server action triggers revalidatePath
        toast.success("Vote updated", { id: loadingToast });
      } catch {
        toast.error("Something went wrong", { id: loadingToast });
      }
    });
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const statusGroup =
          STATUS_GROUPS[post.status as keyof typeof STATUS_GROUPS];

        const categoryDesign = getCategoryDesign(post.category);

        const StatusIcon = statusGroup?.icon;
        const CategoryIcon = categoryDesign.icon;

        // ✅ Strongly typed hasVoted
        const hasVoted = post.votes.some((v) => v.userId === Number(userId));

        return (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg leading-tight">
                  {post.title}
                </CardTitle>

                <CardDescription className="flex items-center gap-1.5 mt-1 text-sm">
                  <User className="h-3 w-3" />
                  {post.authorId === Number(userId)
                    ? "You"
                    : post.author?.name || "Unknown"}
                  <span>|</span>
                  <span className="whitespace-nowrap">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {statusGroup && StatusIcon && (
                  <Badge
                    className={`flex items-center gap-1 ${statusGroup.countColor} ${statusGroup.color}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusGroup.title}
                  </Badge>
                )}

                <Badge
                  variant="outline"
                  className={`flex items-center gap-1 text-xs ${categoryDesign.border} ${categoryDesign.text}`}
                >
                  <CategoryIcon className="h-3 w-3" />
                  {post.category}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground mb-3">{post.description}</p>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVote(post.id)}
                  disabled={isPending}
                  className="gap-2"
                >
                  <ThumbsUp
                    className={`h-4 w-4 ${hasVoted ? "text-blue-600" : ""}`}
                  />
                  {post.votes.length > 0 && ` ${post.votes.length}`}
                </Button>

                <div className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  <MessageSquare className="h-4 w-4" />
                  Comment
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FeedbackList;
