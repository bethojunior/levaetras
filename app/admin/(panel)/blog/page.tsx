import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getPosts } from "@/lib/store";
export default async function BlogAdmin() {
  await requireAdmin();
  const posts = getPosts();
  return (
    <>
      <div className="admin-head admin-head--row">
        <div>
          <h1>Blog</h1>
          <p>Crie, edite e publique artigos.</p>
        </div>
        <Link className="abtn" href="/admin/blog/novo">
          Novo artigo
        </Link>
      </div>
      <section className="admin-card">
        {posts.length ? (
          <ul className="post-list">
            {posts.map((p) => (
              <li key={p.id}>
                <div>
                  <Link href={`/admin/blog/${p.id}`}>
                    <strong>{p.title}</strong>
                  </Link>
                  <small>
                    {p.author} · /blog/{p.slug} ·{" "}
                    {new Date(p.updated_at).toLocaleDateString("pt-BR", {
                      timeZone: "America/Manaus",
                    })}
                  </small>
                </div>
                <span className={`badge badge--${p.status}`}>
                  {p.status === "published" ? "Publicado" : "Rascunho"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum artigo ainda. Crie o primeiro.</p>
        )}
      </section>
    </>
  );
}
