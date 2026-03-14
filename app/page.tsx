import GradientHeader from "@/components/gradient-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Map,
  MessageSquare,
  Users,
  Zap,
  BarChart4,
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-12 ">
      {" "}
      <GradientHeader
        title="Welcome to Your Opinion Matters"
        subtitle="Share your thoughts and help us improve"
      >
        <div className="flex gap-4 justify-center pt-4 ">
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            <Link href="/feedback/new" className="flex items-center">
              Submit Feedback <ArrowRight className="ml-2 h-4 w-4 " />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-white text-black hover:bg-gray-100"
          >
            <Link href="/roadmap" className="flex items-center">
              View RoadMap <Map className="ml-2 h-4 w-4 " />
            </Link>
          </Button>
        </div>
      </GradientHeader>
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 "> How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-primary mb-2"></MessageSquare>
              <CardTitle>Submit Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Share your thoughts and suggestions with us.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <BarChart4 className="h-8 w-8 text-primary mb-2"></BarChart4>
              <CardTitle>Vota & Prioritize </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Upvote your favorite ideas and help us decide what matters and
                whats not.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2"></Users>
              <CardTitle>Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                See how your feedback is being implemented and track the
                progress of your ideas.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2"></Zap>
              <CardTitle>See Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Experience the impact of your feedback in Real Life.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="text-center ">
        <div className="inline-grid grid-cols-3 gap-8 ">
          <div>
            <div className="text-3xl font-bold">1,234+</div>
            <div className="text-muted-foreground">Suggestions</div>
          </div>
          <div>
            <div className="text-3xl font-bold">8,901+</div>
            <div className="text-muted-foreground">Votes Cast</div>
          </div>
          <div>
            <div className="text-3xl font-bold">254+</div>
            <div className="text-muted-foreground">Features Shipped</div>
          </div>
        </div>
      </section>
    </div>
  );
}
