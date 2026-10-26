import Link from "next/link";
export default function NotFound() {
  return (
    <main className="blog-empty wrap">
      <h1>Artigo não encontrado.</h1>
      <p>Ele pode ter sido removido ou ainda não estar publicado.</p>
      <Link className="text-link" href="/blog">
        Voltar ao blog →
      </Link>
    </main>
  );
}
