import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { allPosts } from "@/lib/actions/feedback-actions";
import GradientHeader from "@/components/gradient-header";
import AdminFeedbackTable from "@/components/ui/admin-feedback-table";
export default async function AdminPage() {
  const { userId } = await auth();

  // ❌ Not logged in
  if (!userId) {
    return <div className="p-10 text-center">Unauthorized</div>;
  }

  // ✅ Get user from DB
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  // ❌ Not admin
  if (!dbUser || dbUser.role !== "ADMIN") {
    return <div className="p-10 text-center">Admin access required</div>;
  }
  const { posts } = await allPosts();
  // ✅ Authorized
  return (
    <div className="container mx-auto">
      <GradientHeader
        title="Admin Dashboard"
        subtitle="Manage Feedbacks and Update Status"
      >
        Admin Dashboard
      </GradientHeader>
      <AdminFeedbackTable posts={posts} />
    </div>
  );
}
