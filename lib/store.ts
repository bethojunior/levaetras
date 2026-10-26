import "server-only";
import { getDatabase } from "./database.mjs";
import { defaultTexts, type Texts } from "./content-defaults";
export { getDatabase };
export function readSetting<T>(
  key: string,
  fallback: T,
): { value: T; revision: number } {
  const row = getDatabase()
    .prepare("SELECT value, revision FROM settings WHERE key=?")
    .get(key) as { value: string; revision: number } | undefined;
  return row
    ? { value: JSON.parse(row.value) as T, revision: row.revision }
    : { value: fallback, revision: 0 };
}
export function saveSetting(key: string, value: unknown, revision: number) {
  const result = getDatabase()
    .prepare(
      `INSERT INTO settings(key,value,revision) VALUES (?,?,1) ON CONFLICT(key) DO UPDATE SET value=excluded.value,revision=settings.revision+1 WHERE settings.revision=?`,
    )
    .run(key, JSON.stringify(value), revision);
  if (result.changes !== 1)
    throw new Error(
      "Este conteúdo foi alterado em outra janela. Recarregue a página antes de salvar novamente.",
    );
}
export function getTexts() {
  const saved = readSetting<Texts>("texts", defaultTexts);
  return {
    revision: saved.revision,
    value: { ...defaultTexts, ...saved.value },
  };
}
export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string;
  cover_alt: string;
  author: string;
  status: "draft" | "published";
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  revision: number;
};
export function getPosts(publishedOnly = false): Post[] {
  return getDatabase()
    .prepare(
      `SELECT * FROM posts ${publishedOnly ? "WHERE status='published'" : ""} ORDER BY COALESCE(published_at,created_at) DESC`,
    )
    .all()
    .map((row) => ({ ...row })) as Post[];
}
export function getPost(id: string): Post | undefined {
  const row = getDatabase()
    .prepare("SELECT * FROM posts WHERE id=?")
    .get(id) as Post | undefined;
  return row ? { ...row } : undefined;
}
export function getPublishedPost(slug: string): Post | undefined {
  const row = getDatabase()
    .prepare("SELECT * FROM posts WHERE slug=? AND status='published'")
    .get(slug) as Post | undefined;
  return row ? { ...row } : undefined;
}
