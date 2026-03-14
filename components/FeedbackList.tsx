"use client";

import React, { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import { Badge } from "./ui/badge";
import { STATUS_GROUPS } from "@/app/data/status-data";
import { getCategoryDesign } from "@/app/data/category-data";

const FeedbackList = ({
  initialPosts,
  userId,
}: {
  initialPosts: any[];
  userId: string | null;
}) => {
  const [posts] = useState(initialPosts);

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const statusGroup =
          STATUS_GROUPS[post.status as keyof typeof STATUS_GROUPS];

        const categoryDesign = getCategoryDesign(post.category);

        const StatusIcon = statusGroup?.icon;
        const CategoryIcon = categoryDesign.icon;

        return (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              {/* LEFT */}
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg leading-tight">
                  {post.title}
                </CardTitle>

                <CardDescription className="flex items-center gap-1.5 mt-1 text-sm">
                  <User className="h-3 w-3" />

                  {post.authorId === userId
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

              {/* RIGHT */}
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
          </Card>
        );
      })}
    </div>
  );
};

export default FeedbackList;
