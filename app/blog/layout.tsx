import Link from "next/link";
import Image from "next/image";
import { getTexts } from "@/lib/store";
import { waLink } from "@/lib/links";
import "./blog.css";
export const dynamic = "force-dynamic";
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = getTexts().value;
  return (
    <>
      <header className="blog-header">
        <div className="wrap">
          <Link href="/" className="brand" aria-label="Parintins Leva e Traz">
            <Image src="/logo.webp" alt="" width={44} height={44} priority />
            <span>
              Leva <b>&amp;</b> Traz
            </span>
          </Link>
          <nav aria-label="Navegação do blog">
            <Link href="/">Início</Link>
            <Link href="/blog">Blog</Link>
            <a className="btn btn--yellow btn--sm" href={waLink(t.whatsapp, t.wa_message)} target="_blank" rel="noopener">
              {t.nav_cta}
            </a>
          </nav>
        </div>
      </header>
      {children}
      <footer className="blog-footer">
        <div className="wrap">
          <p>{t.footer_line}</p>
          <Link href="/">← Voltar ao site</Link>
        </div>
      </footer>
    </>
  );
}
