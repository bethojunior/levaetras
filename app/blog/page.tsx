import Link from "next/link";
import Image from "next/image";
import { getPosts, getTexts } from "@/lib/store";
export function generateMetadata() {
  const { value: t } = getTexts();
  return { title: `${t.blog_title} | Parintins Leva e Traz`, description: t.blog_description };
}
const PER_PAGE = 9;
export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>;
}) {
  const query = await searchParams;
  const q = typeof query.q === "string" ? query.q.slice(0, 200) : "";
  const page = typeof query.page === "string" ? query.page : "1";
  const { value: t } = getTexts();
  const posts = getPosts(true).filter((p) =>
    `${p.title} ${p.excerpt}`.toLowerCase().includes(q.toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(posts.length / PER_PAGE));
  const current = Math.max(1, Math.min(pages, Number.parseInt(page) || 1));
  return (
    <main>
      <section className="blog-hero">
        <div className="wrap">
          <p className="eyebrow eyebrow--w">Blog</p>
          <h1>{t.blog_title}</h1>
          <p>{t.blog_description}</p>
          <form className="blog-search">
            <input name="q" defaultValue={q} placeholder="Buscar no blog…" aria-label="Buscar no blog" />
            <button className="btn btn--yellow btn--sm">Buscar</button>
          </form>
        </div>
      </section>
      <section className="wrap blog-content">
        {posts.length ? (
          <>
            <div className="blog-grid">
              {posts.slice((current - 1) * PER_PAGE, current * PER_PAGE).map((post) => (
                <article className="post-card" key={post.id}>
                  <Link href={`/blog/${post.slug}`} className="post-cover" tabIndex={-1} aria-hidden="true">
                    {post.cover ? (
                      <Image src={post.cover} alt={post.cover_alt} fill sizes="(max-width: 760px) 100vw, 33vw" unoptimized />
                    ) : (
                      <div className="post-cover__ph">Leva &amp; Traz</div>
                    )}
                  </Link>
                  <div className="post-card__copy">
                    <small>
                      {post.author} ·{" "}
                      {new Date(post.published_at!).toLocaleDateString("pt-BR", { timeZone: "America/Manaus" })}
                    </small>
                    <h2>
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p>{post.excerpt}</p>
                    <Link className="text-link" href={`/blog/${post.slug}`}>
                      Ler artigo →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            {pages > 1 && (
              <nav className="blog-pagination" aria-label="Paginação">
                {Array.from({ length: pages }, (_, i) => (
                  <Link
                    key={i}
                    aria-current={i + 1 === current ? "page" : undefined}
                    href={`/blog?${new URLSearchParams({ q, page: String(i + 1) })}`}
                  >
                    {i + 1}
                  </Link>
                ))}
              </nav>
            )}
          </>
        ) : (
          <div className="blog-empty">
            <h2>{q ? "Nenhum artigo encontrado." : "Novidades em breve."}</h2>
            <p>{q ? "Tente outra palavra." : "Ainda não há artigos publicados."}</p>
            {q && (
              <Link className="text-link" href="/blog">
                Limpar busca
              </Link>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
