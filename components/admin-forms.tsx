"use client";
import { useActionState, useState } from "react";
import {
  deletePostAction,
  loginAction,
  savePostAction,
  saveTextsAction,
  type ActionState,
} from "@/app/admin/actions";
import type { Post } from "@/lib/store";
import { groups, textFields, type Texts } from "@/lib/content-defaults";

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    loginAction,
    {},
  );
  return (
    <form action={action} className="admin-form">
      <label>
        Usuário
        <input
          name="user"
          defaultValue={state.user}
          autoComplete="username"
          required
          maxLength={254}
        />
      </label>
      <label>
        Senha
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={128}
        />
      </label>
      {state.error && <p className="msg msg--err" role="alert">{state.error}</p>}
      <button className="abtn" disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

export function TextsForm({
  texts,
  revision,
}: {
  texts: Texts;
  revision: number;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    saveTextsAction,
    {},
  );
  const [active, setActive] = useState(groups[0]);
  const rev = state.revision ?? revision;
  return (
    <form action={action} className="admin-form admin-texts">
      <input type="hidden" name="revision" value={rev} />
      <div className="tabs" role="tablist">
        {groups.map((g) => (
          <button
            type="button"
            key={g}
            role="tab"
            aria-selected={g === active}
            onClick={() => setActive(g)}
          >
            {g}
          </button>
        ))}
      </div>
      {groups.map((g) => (
        <fieldset key={`${g}-${rev}`} hidden={g !== active} className="admin-card">
          <legend>{g}</legend>
          {textFields
            .filter((f) => f.group === g)
            .map((f) => (
              <label key={f.id}>
                {f.label}
                {f.long ? (
                  <textarea
                    name={f.id}
                    defaultValue={texts[f.id]}
                    rows={f.id === "strip" ? 5 : 3}
                    maxLength={2000}
                  />
                ) : (
                  <input name={f.id} defaultValue={texts[f.id]} maxLength={2000} />
                )}
              </label>
            ))}
        </fieldset>
      ))}
      <div className="savebar">
        <div>
          {state.error && <span className="msg msg--err" role="alert">{state.error}</span>}
          {state.success && <span className="msg msg--ok" role="status">{state.success}</span>}
        </div>
        <button className="abtn" disabled={pending}>
          {pending ? "Salvando…" : "Salvar e publicar"}
        </button>
      </div>
    </form>
  );
}

const slugify = (v: string) =>
  v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);

export function PostForm({ post, saved }: { post?: Post; saved?: boolean }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    savePostAction,
    {},
  );
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [touched, setTouched] = useState(!!post);
  return (
    <form action={action} className="admin-form admin-card">
      <input type="hidden" name="id" value={post?.id ?? ""} />
      <input type="hidden" name="revision" value={post?.revision ?? 0} />
      <label>
        Título
        <input
          name="title"
          defaultValue={post?.title}
          required
          maxLength={160}
          onChange={(e) => !touched && setSlug(slugify(e.target.value))}
        />
      </label>
      <label>
        Endereço (/blog/…)
        <input
          name="slug"
          value={slug}
          required
          maxLength={160}
          onChange={(e) => {
            setTouched(true);
            setSlug(e.target.value);
          }}
        />
      </label>
      <label>
        Resumo
        <textarea name="excerpt" defaultValue={post?.excerpt} rows={3} required maxLength={500} />
      </label>
      <label>
        Conteúdo (Markdown: # título, **negrito**, [link](https://…), listas com -)
        <textarea name="body" defaultValue={post?.body} rows={16} required maxLength={100000} />
      </label>
      <div className="row2">
        <label>
          Imagem de capa (URL https ou /caminho)
          <input name="cover" defaultValue={post?.cover} maxLength={2000} />
        </label>
        <label>
          Texto alternativo da capa
          <input name="cover_alt" defaultValue={post?.cover_alt} maxLength={250} />
        </label>
      </div>
      <div className="row2">
        <label>
          Autor
          <input name="author" defaultValue={post?.author ?? "Equipe Leva e Traz"} required maxLength={100} />
        </label>
        <label>
          Status
          <select name="status" defaultValue={post?.status ?? "draft"}>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </label>
      </div>
      <div className="row2">
        <label>
          Título SEO (opcional)
          <input name="seo_title" defaultValue={post?.seo_title} maxLength={120} />
        </label>
        <label>
          Descrição SEO (opcional)
          <input name="seo_description" defaultValue={post?.seo_description} maxLength={320} />
        </label>
      </div>
      <div className="formbar">
        <div>
          {state.error && <span className="msg msg--err" role="alert">{state.error}</span>}
          {saved && !state.error && <span className="msg msg--ok" role="status">Artigo salvo.</span>}
        </div>
        <button className="abtn" disabled={pending}>
          {pending ? "Salvando…" : "Salvar artigo"}
        </button>
      </div>
    </form>
  );
}

export function DeletePostForm({ post }: { post: Post }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(
    deletePostAction,
    {},
  );
  return (
    <form action={action} className="admin-form admin-card danger">
      <input type="hidden" name="id" value={post.id} />
      <input type="hidden" name="revision" value={post.revision} />
      <h2>Excluir artigo</h2>
      <label>
        Digite EXCLUIR para confirmar
        <input name="confirm" autoComplete="off" />
      </label>
      {state.error && <p className="msg msg--err" role="alert">{state.error}</p>}
      <button className="abtn abtn--danger" disabled={pending}>
        Excluir definitivamente
      </button>
    </form>
  );
}
