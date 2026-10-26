# Parintins Leva e Traz

Site de mobilidade urbana em Next.js com painel `/admin` (SQLite) para editar todos os textos.
Infra no mesmo padrão do speed-site: Docker standalone, compose, CI/CD no GHCR e deploy em VM (`docs/DEPLOY-VM.md`).

## Desenvolvimento

```bash
cp .env.example .env.local   # defina ADMIN_USER e ADMIN_PASSWORD (12+ caracteres)
npm install
npm run dev                  # http://localhost:3000  ·  painel em /admin
```

- Login do painel: `ADMIN_USER` / `ADMIN_PASSWORD` do `.env`.
- Textos, contato (WhatsApp), links do app e do cadastro de motorista, e o blog (`/admin/blog`) ficam no SQLite (`DATABASE_PATH`); sem edição, valem os padrões de `lib/content-defaults.ts`.
- Backup: `npm run db:backup`.
- Produção: `docker compose up -d --build` (precisa de `.env` com `ADMIN_USER`/`ADMIN_PASSWORD` e `COOKIE_SECURE=true` sob HTTPS).
