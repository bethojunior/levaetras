import { requireAdmin } from "@/lib/auth";
import { PostForm } from "@/components/admin-forms";
export default async function NewPost() {
  await requireAdmin();
  return (
    <>
      <div className="admin-head">
        <h1>Novo artigo</h1>
      </div>
      <PostForm />
    </>
  );
}
