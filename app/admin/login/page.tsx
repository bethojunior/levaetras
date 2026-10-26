import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin-forms";
export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");
  return (
    <main className="admin-login">
      <div className="admin-login__box">
        <Image src="/logo.webp" alt="Parintins Leva e Traz" width={120} height={120} priority />
        <h1>Área administrativa</h1>
        <p>Entre para gerenciar os textos do site.</p>
        <LoginForm />
        <Link href="/" className="admin-back">
          ← Voltar para o site
        </Link>
      </div>
    </main>
  );
}
