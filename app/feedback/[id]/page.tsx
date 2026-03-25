import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { STATUS_ORDER } from "@/app/data/status-data";
import { updateStatus } from "@/lib/actions/feedback-actions";
import { toggleVote } from "@/lib/actions/votes";
import { PostStatus } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";

type Props = { params: Promise<{ id: string }> }; // Fixed: params is a Promise in Next.js 15+

export default async function PostPage({ params }: Props) {
  const { id: postIdStr } = await params;
  const postId = Number(postIdStr);

  const { userId } = await auth();

  // --- Wrapper actions for forms ---
  async function handleUpdateStatus(formData: FormData) {
    "use server";
    const status = formData.get("status") as PostStatus;
    await updateStatus(postId, status);
    revalidatePath(`/feedback/${postId}`);
  }

  async function handleToggleVote() {
    "use server";
    await toggleVote(postId);
    revalidatePath(`/feedback/${postId}`);
  }

  // Fetch the post with votes
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { votes: true },
  });


  if (!post) return <div>Post not found</div>;

  // Determine current user and vote status
  let dbUserId: number | null = null;
  let userVote = false;
  let isAdmin = false;

  if (userId) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (dbUser) {
      dbUserId = dbUser.id;
      userVote = post.votes.some((v) => v.userId === dbUser.id);
      isAdmin = dbUser.role === "ADMIN";
    }
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p>{post.description}</p>
      <p className="mt-2">Category: {post.category}</p>
      <p>Status: {post.status}</p>
      <p>Votes: {post.votes.length}</p>

      {/* --- Admin Status Update Form --- */}
      {isAdmin && (
        <form action={handleUpdateStatus} className="mt-6">
          <h2 className="text-xl font-semibold">Update Feedback Status</h2>
          <input type="hidden" name="id" value={post.id} />
          <select
            name="status"
            defaultValue={post.status}
            className="mt-2 p-1 border rounded"
          >
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded">
            Update Status
          </button>
        </form>
      )}

      {/* --- Vote Toggle Form --- */}
      {dbUserId && (
        <form action={handleToggleVote} className="mt-6">
          <input type="hidden" name="postId" value={post.id} />
          <button
            className={`px-4 py-2 rounded text-white ${
              userVote ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {userVote ? "Remove Vote" : "Vote"}
          </button>
        </form>
      )}

      {!userId && <p className="mt-4 text-gray-500">Log in to vote.</p>}
      {!isAdmin && (
        <p className="mt-2 text-gray-500">Admin only can update status.</p>
      )}
    </div>
  );
}
