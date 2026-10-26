import type { Metadata } from "next";
import "./admin.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Painel administrativo | Parintins Leva e Traz",
  robots: { index: false, follow: false },
};
export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
