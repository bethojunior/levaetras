import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { getPublishedPost, getTexts } from "@/lib/store";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPublishedPost(slug);
  if (!post) return { title: "Artigo não encontrado", robots: { index: false } };
  const site = getTexts().value.site_url;
  return {
    title: `${post.seo_title || post.title} | Parintins Leva e Traz`,
    description: post.seo_description || post.excerpt,
    ...(site ? { alternates: { canonical: `${site}/blog/${post.slug}` } } : {}),
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt,
      type: "article" as const,
      ...(post.cover && post.cover.startsWith("https://") ? { images: [post.cover] } : {}),
    },
  };
}
export default async function Article({ params }: Props) {
  const { slug } = await params;
  const post = getPublishedPost(slug);
  if (!post) notFound();
  return (
    <main className="article wrap">
      <Link className="article-back" href="/blog">
        ← Todos os artigos
      </Link>
      <article>
        <header>
          <h1>{post.title}</h1>
          <p className="article-excerpt">{post.excerpt}</p>
          <div className="article-by">
            <span>{post.author}</span>
            <span>
              {new Date(post.published_at!).toLocaleDateString("pt-BR", { timeZone: "America/Manaus" })}
            </span>
            <span>{Math.max(1, Math.ceil(post.body.split(/\s+/).length / 200))} min de leitura</span>
          </div>
        </header>
        {post.cover && (
          <div className="article-cover">
            <Image src={post.cover} alt={post.cover_alt} fill sizes="(max-width: 760px) 100vw, 860px" unoptimized priority />
          </div>
        )}
        <div className="prose">
          <Markdown skipHtml>{post.body}</Markdown>
        </div>
      </article>
    </main>
  );
}
