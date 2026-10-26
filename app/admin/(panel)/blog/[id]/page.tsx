import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getPost } from "@/lib/store";
import { PostForm, DeletePostForm } from "@/components/admin-forms";
export default async function EditPost({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const post = getPost(id);
  if (!post) notFound();
  const { saved } = await searchParams;
  return (
    <>
      <div className="admin-head">
        <h1>Editar artigo</h1>
      </div>
      <PostForm key={`${post.id}-${post.revision}`} post={post} saved={saved === "1"} />
      <DeletePostForm post={post} />
    </>
  );
}
