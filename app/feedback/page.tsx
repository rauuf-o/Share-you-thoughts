import React from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { allPosts } from "@/lib/actions/feedback-actions";
import GradientHeader from "@/components/gradient-header";
import { Button } from "@/components/ui/button";
import { Map, PlusIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategoryDesign } from "../data/category-data";
import { prisma } from "@/lib/prisma";
import FeedbackList from "@/components/FeedbackList";
import { Badge } from "@/components/ui/badge";

const MyPostsPage = async () => {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="text-center mt-10">Unauthorized. Please log in.</div>
    );
  }

  const result = await allPosts();
  const posts = result.success && result.posts ? result.posts : [];

  if (!result.success) {
    return <div className="text-center mt-10">{result.error}</div>;
  }

  const categories = await prisma.post.groupBy({
    by: ["category"],
    _count: true,
  });

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-center mt-10 mb-6">My Posts</h1>

      {/* Header */}
      <GradientHeader
        title="Community Feedback"
        subtitle="Explore our community feedback and share your thoughts"
      >
        <div className="flex gap-4 justify-center pt-4">
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <Link href="/feedback/new" className="flex items-center">
              New Feedback
              <PlusIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-gray-100"
          >
            <Link href="/roadmap" className="flex items-center">
              View RoadMap
              <Map className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </GradientHeader>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        {/* SIDEBAR */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Browse feedback by category</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {categories.map((cat) => {
                  const design = getCategoryDesign(cat.category);
                  const Icon = design.icon;

                  return (
                    <div
                      key={cat.category}
                      className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${design.light} ${design.border} border`}
                        >
                          <Icon className={`h-4 w-4 ${design.text}`} />
                        </div>

                        <span className="font-medium text-sm">
                          {cat.category}
                        </span>
                      </div>

                      <Badge className={`${design.light} ${design.text}`}>
                        {cat._count}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* POSTS */}
        <div className="lg:col-span-3">
          <FeedbackList posts={posts || []} userId={userId} />{" "}
        </div>
      </div>
    </div>
  );
};

export default MyPostsPage;
