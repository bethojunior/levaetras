"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { requireAdmin, signIn, signOut } from "@/lib/auth";
import { getDatabase, getPost, saveSetting } from "@/lib/store";
import { textFields, type Texts } from "@/lib/content-defaults";
export type ActionState = {
  error?: string;
  success?: string;
  revision?: number;
  user?: string;
};
function errorState(error: unknown): ActionState {
  console.error(
    "CMS mutation failed:",
    error instanceof Error ? error.message : "unknown",
  );
  return {
    error:
      error instanceof Error && !error.message.includes("SQLITE")
        ? error.message
        : "Não foi possível salvar. Verifique os campos e tente novamente.",
  };
}
export async function loginAction(
  _: ActionState,
  data: FormData,
): Promise<ActionState> {
  const user = data.get("user");
  const password = data.get("password");
  if (
    typeof user !== "string" ||
    typeof password !== "string" ||
    !user ||
    !password ||
    user.length > 254 ||
    password.length > 128
  )
    return { error: "Informe seu usuário e senha.", user: typeof user === "string" ? user : "" };
  const error = await signIn(user.trim(), password);
  if (error) return { error, user };
  redirect("/admin");
}
export async function logoutAction() {
  await signOut();
  redirect("/admin/login");
}
export async function saveTextsAction(
  _: ActionState,
  data: FormData,
): Promise<ActionState> {
  await requireAdmin();
  try {
    const texts: Texts = {};
    for (const f of textFields) {
      const raw = data.get(f.id);
      if (typeof raw !== "string") throw new Error(`Campo ausente: ${f.label}.`);
      const value = raw.replace(/\r\n/g, "\n").trim();
      if (value.length > 2000)
        throw new Error(`"${f.label}" deve ter até 2000 caracteres.`);
      const optional = ["instagram", "site_url"].includes(f.id);
      if (!value && !optional) throw new Error(`Preencha "${f.label}".`);
      texts[f.id] = value;
    }
    if (!/^\d{10,15}$/.test(texts.whatsapp))
      throw new Error("WhatsApp: use apenas dígitos com DDI e DDD (10 a 15).");
    for (const id of ["instagram", "site_url", "ios_url", "android_url", "driver_url"]) {
      if (!texts[id]) continue;
      let ok = false;
      try {
        const u = new URL(texts[id]);
        ok = u.protocol === "https:" && !u.username && !u.password;
      } catch {}
      if (!ok) throw new Error(`"${textFields.find((x) => x.id === id)!.label}": use uma URL HTTPS válida.`);
    }
    if (texts.site_url) texts.site_url = new URL(texts.site_url).origin;
    const rev = Number(data.get("revision"));
    if (!Number.isSafeInteger(rev) || rev < 0)
      throw new Error("Versão inválida. Recarregue a página.");
    saveSetting("texts", texts, rev);
    revalidatePath("/", "layout");
    return { success: "Textos publicados no site.", revision: rev + 1 };
  } catch (error) {
    return errorState(error);
  }
}

function field(data: FormData, name: string, max: number, required = true) {
  const raw = data.get(name);
  if (typeof raw !== "string") throw new Error(`Preencha o campo ${name}.`);
  const value = raw.trim();
  if ((required && !value) || value.length > max)
    throw new Error(
      `O campo ${name} deve ter ${required ? "de 1 a" : "até"} ${max} caracteres.`,
    );
  return value;
}
function revisionOf(data: FormData) {
  const rev = Number(data.get("revision"));
  if (!Number.isSafeInteger(rev) || rev < 0)
    throw new Error("Versão inválida. Recarregue a página.");
  return rev;
}
function imageUrl(value: string) {
  if (!value) return "";
  if (/^\/(?!\/)[a-zA-Z0-9/_.,%+\-]+$/.test(value)) return value;
  try {
    const u = new URL(value);
    if (u.protocol === "https:" && !u.username && !u.password) return u.href;
  } catch {}
  throw new Error("A capa deve ser uma URL HTTPS ou um caminho iniciado por /.");
}
function revalidateBlog() {
  revalidatePath("/blog", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/blog");
}
export async function savePostAction(
  _: ActionState,
  data: FormData,
): Promise<ActionState> {
  await requireAdmin();
  let id = "";
  try {
    const existingId = field(data, "id", 64, false);
    id = existingId || randomUUID();
    const existing = existingId ? getPost(existingId) : undefined;
    if (existingId && !existing) throw new Error("Artigo não encontrado.");
    const title = field(data, "title", 160);
    const slug = field(data, "slug", 160);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
      throw new Error("O endereço deve usar letras minúsculas, números e hífens.");
    const excerpt = field(data, "excerpt", 500);
    const body = field(data, "body", 100000);
    const cover = imageUrl(field(data, "cover", 2000, false));
    const coverAlt = field(data, "cover_alt", 250, !!cover);
    const author = field(data, "author", 100);
    const status = field(data, "status", 20);
    if (status !== "draft" && status !== "published")
      throw new Error("Status inválido.");
    const seoTitle = field(data, "seo_title", 120, false);
    const seoDescription = field(data, "seo_description", 320, false);
    const now = new Date().toISOString();
    const publishedAt =
      status === "published"
        ? existing?.published_at || now
        : existing?.published_at || null;
    const db = getDatabase();
    if (db.prepare("SELECT id FROM posts WHERE slug=? AND id<>?").get(slug, id))
      throw new Error("Já existe um artigo com esse endereço. Escolha outro.");
    if (existing) {
      const result = db
        .prepare(
          "UPDATE posts SET slug=?,title=?,excerpt=?,body=?,cover=?,cover_alt=?,author=?,status=?,seo_title=?,seo_description=?,updated_at=?,published_at=?,revision=revision+1 WHERE id=? AND revision=?",
        )
        .run(slug, title, excerpt, body, cover, coverAlt, author, status, seoTitle, seoDescription, now, publishedAt, id, revisionOf(data));
      if (result.changes !== 1)
        throw new Error("Este artigo foi alterado em outra janela. Recarregue antes de salvar.");
    } else
      db.prepare(
        "INSERT INTO posts(id,slug,title,excerpt,body,cover,cover_alt,author,status,seo_title,seo_description,created_at,updated_at,published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      ).run(id, slug, title, excerpt, body, cover, coverAlt, author, status, seoTitle, seoDescription, now, now, publishedAt);
    revalidateBlog();
  } catch (error) {
    return errorState(error);
  }
  redirect(`/admin/blog/${id}?saved=1`);
}
export async function deletePostAction(
  _: ActionState,
  data: FormData,
): Promise<ActionState> {
  await requireAdmin();
  try {
    const id = field(data, "id", 64);
    if (data.get("confirm") !== "EXCLUIR")
      throw new Error("Digite EXCLUIR para confirmar.");
    const result = getDatabase()
      .prepare("DELETE FROM posts WHERE id=? AND revision=?")
      .run(id, revisionOf(data));
    if (result.changes !== 1)
      throw new Error("O artigo mudou ou já foi excluído. Recarregue a página.");
    revalidateBlog();
  } catch (error) {
    return errorState(error);
  }
  redirect("/admin/blog");
}
