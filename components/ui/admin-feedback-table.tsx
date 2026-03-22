"use client";

import React, { useState } from "react";
import { Post } from "@/lib/validations/types";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Edit, Save, ThumbsUp, User, X } from "lucide-react";
import { Button } from "./button";
import { toast } from "sonner";
import { PostStatus } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "./table";

import { STATUS_GROUPS, STATUS_ORDER } from "@/app/data/status-data";
import { Badge } from "./badge";
import { getCategoryDesign } from "@/app/data/category-data";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { updateStatus } from "@/lib/actions/feedback-actions";

const AdminFeedbackTable = ({ posts }: { posts: Post[] }) => {
  const router = useRouter(); // ✅ added

  const [editingPost, setEditingPost] = useState<number | null>(null);

  // ✅ FIXED TYPES (string -> PostStatus)
  const [postStatus, setPostStatus] = useState<Record<number, PostStatus>>(
    Object.fromEntries(posts.map((p) => [p.id, p.status])),
  );

  const [originalStatus, setOriginalStatus] = useState<
    Record<number, PostStatus>
  >({});

  const handleStatusChange = (postId: number, newStatus: string) => {
    setPostStatus((prev) => ({
      ...prev,
      [postId]: newStatus as PostStatus, // ✅ cast
    }));
  };

  const startEditing = (postId: number) => {
    setOriginalStatus((prev) => ({
      ...prev,
      [postId]: postStatus[postId],
    }));
    setEditingPost(postId);
  };

  // ✅ FIXED cancel logic
  const cancelEditing = (postId: number) => {
    if (originalStatus[postId]) {
      setPostStatus((prev) => ({
        ...prev,
        [postId]: originalStatus[postId],
      }));
    }
    setEditingPost(null);
  };

  const saveStatus = async (postId: number) => {
    const loadingToast = toast.loading("Saving status...");

    try {
      await updateStatus(postId, postStatus[postId]);

      router.refresh(); // ✅ now works

      toast.success("Status updated", { id: loadingToast });
      setEditingPost(null); // ✅ exit edit mode
    } catch {
      toast.error("Failed", { id: loadingToast });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Feedback</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {posts.map((post) => {
              const isEditing = editingPost === post.id;
              const currentStatus = postStatus[post.id];

              const categoryDesign = getCategoryDesign(post.category);
              const CategoryIcon = categoryDesign.icon;

              const getStatusIcon = (status: PostStatus) => {
                const statusGroup = STATUS_GROUPS[status];
                if (!statusGroup) return null;
                const Icon = statusGroup.icon;
                return <Icon className="h-3 w-3 mr-1" />;
              };

              return (
                <TableRow key={post.id} className="h-[70px]">
                  <TableCell className="font-medium truncate">
                    {post.title}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${categoryDesign.border} ${categoryDesign.text}`}
                    >
                      <CategoryIcon className="h-3 w-3 mr-1" />
                      {post.category}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      {post.votes.length}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      {post.author.name}
                    </div>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    {isEditing ? (
                      <Select
                        value={currentStatus}
                        onValueChange={(value) =>
                          handleStatusChange(post.id, value)
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {STATUS_ORDER.map((status) => {
                            const statusGroup = STATUS_GROUPS[status];
                            const Icon = statusGroup.icon;

                            return (
                              <SelectItem key={status} value={status}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  {statusGroup.title}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className="flex items-center gap-2">
                        {getStatusIcon(currentStatus)}
                        {STATUS_GROUPS[currentStatus]?.title}
                      </Badge>
                    )}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => saveStatus(post.id)}
                          className="gap-1 h-8"
                        >
                          <Save className="h-3 w-3" />
                          Save
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelEditing(post.id)}
                          className="h-8"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEditing(post.id)}
                        className="gap-1 h-8"
                      >
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminFeedbackTable;
