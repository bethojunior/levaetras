import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "@/app/admin/actions";
export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  return (
    <div className="admin-shell">
      <header className="admin-top">
        <Link href="/admin" className="admin-brand">
          <Image src="/logo.webp" alt="" width={36} height={36} />
          <span>Painel · Leva &amp; Traz</span>
        </Link>
        <nav className="admin-nav" aria-label="Painel">
          <Link href="/admin">Textos</Link>
          <Link href="/admin/blog">Blog</Link>
        </nav>
        <div className="admin-top__r">
          <Link href="/" target="_blank">
            Ver site ↗
          </Link>
          <span className="admin-user">{admin.username}</span>
          <form action={logoutAction}>
            <button className="abtn abtn--ghost">Sair</button>
          </form>
        </div>
      </header>
      <main className="admin-main">{children}</main>
    </div>
  );
}
