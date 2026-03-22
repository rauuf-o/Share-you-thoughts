import React from "react";
import { allPosts } from "@/lib/actions/feedback-actions";
import { Post } from "@/lib/validations/types";
import GradientHeader from "@/components/gradient-header";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Target, Clock, CheckCheck } from "lucide-react";

const STATUS_ORDER = ["under_review", "planned", "in_progress", "completed"];

const STATUS_GROUPS = {
  under_review: {
    title: "Under Review",
    description: "Requests being reviewed",
    icon: Target,
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    color: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-400",
    countColor: "bg-blue-100 dark:bg-blue-900",
  },
  planned: {
    title: "Planned",
    description: "Features planned for future release",
    icon: Target,
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    color: "border-purple-200 dark:border-purple-800",
    textColor: "text-purple-700 dark:text-purple-400",
    countColor: "bg-purple-100 dark:bg-purple-900",
  },
  in_progress: {
    title: "In Progress",
    description: "Currently being built",
    icon: Clock,
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    color: "border-yellow-200 dark:border-yellow-800",
    textColor: "text-yellow-700 dark:text-yellow-400",
    countColor: "bg-yellow-100 dark:bg-yellow-900",
  },
  completed: {
    title: "Completed",
    description: "Successfully shipped",
    icon: CheckCheck,
    bgColor: "bg-green-50 dark:bg-green-950/30",
    color: "border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-400",
    countColor: "bg-green-100 dark:bg-green-900",
  },
};

const page = async () => {
  const { posts } = await allPosts();
  const groupedPosts = {
    under_review: posts.filter((p) => p.status === "under_review"),
    planned: posts.filter((p) => p.status === "planned"),
    in_progress: posts.filter((p) => p.status === "in_progress"),
    completed: posts.filter((p) => p.status === "completed"),
  };
  const totalVotes = posts.reduce((acc, post) => acc + post.votes.length, 0);
  const averageVotes =
    posts.length > 0 ? Math.round(totalVotes / posts.length) : 0;
  function getStatusPercentage(posts: Post[], status: string) {
    const total = posts.length;

    if (total === 0) return 0; // ✅ prevent NaN

    const count = posts.filter((p) => p.status === status).length;

    return Math.round((count / total) * 100);
  }
  const completedPercentage = getStatusPercentage(posts, "completed");
  const inProgressPercentage = getStatusPercentage(posts, "in_progress");
  const plannedPercentage = getStatusPercentage(posts, "planned");
  const underReviewPercentage = getStatusPercentage(posts, "under_review");
  return (
    <div className="space-y-8">
      <GradientHeader
        title="Product RoadMap"
        subtitle="See what we're working on, and what's coming next"
      ></GradientHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Features</p>
                <p className="text-3xl font-bold">{posts.length}</p>
              </div>
              <Target className="h-20 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Votes</p>
                <p className="text-3xl font-bold">{totalVotes}</p>
              </div>
              <BarChart3 className="h-20 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold">
                  {groupedPosts.completed.length}
                </p>
              </div>
              <Target className="h-20 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-6 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Votes</p>
                <p className="text-3xl font-bold">{averageVotes}</p>
              </div>
              <Target className="h-20 w-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>RoadMap Progress</CardTitle>
          <CardDescription>
            Track The Journet From Our Idea To Completion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Completion</span>
              <span className="font-medium ">{completedPercentage}%</span>
            </div>
            <Progress value={completedPercentage} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {inProgressPercentage}%
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {plannedPercentage}%
              </div>
              <div className="text-sm text-muted-foreground">Planned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {completedPercentage}%
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Roadmap Columns */}
      <div className="lg:grid grid-cols-1 lg:grid-cols-4 gap-6">
        {STATUS_ORDER.map((status) => {
          const group = STATUS_GROUPS[status as keyof typeof STATUS_GROUPS];
          const Icon = group.icon;
          const postsInGroup =
            groupedPosts[status as keyof typeof groupedPosts];

          return (
            <div key={status} className="space-y-4">
              <div
                className={`rounded-lg p-4 ${group.bgColor} border ${group.color}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${group.textColor}`} />
                    <h2 className={`text-lg font-semibold ${group.textColor}`}>
                      {group.title}
                    </h2>
                  </div>
                  <Badge variant="secondary" className={group.countColor}>
                    {postsInGroup.length}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {group.description}
                </p>
              </div>
              <div className="space-y-3">
                {postsInGroup.map((post) => (
                  <Card
                    key={post.id}
                    className={`border-l-4 ${group.color} hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer`}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        {post.title}
                      </CardTitle>
                      <CardDescription>
                        {post.author.name} | {post.votes.length} votes
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                        {status === "in_progress" && (
                          <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                            <Clock className="h-3 w-3" />
                            Active
                          </div>
                        )}
                        {status === "completed" && (
                          <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                            <CheckCheck className="h-3 w-3" />
                            Shipped
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {postsInGroup.length === 0 && (
                  <Card className="border-dashed opacity-60">
                    <CardContent className="py-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        No items in this stage
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default page;
