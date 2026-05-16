# AGENTS.md

This project is a Next.js 16 app with App Router, `next-intl`, React Query, Zustand, and a small set of feature-oriented UI layers. Keep changes narrow and follow the existing boundaries.

## Working Rules

- Prefer the existing app structure under [app/](app) and [components/](components); do not flatten or reorganize folders unless the task requires it.
- Use [lib/api/](lib/api) and the `/api-proxy` rewrite path from [next.config.ts](next.config.ts) for backend calls. Do not hardcode direct backend URLs in client code.
- Keep locale-aware work inside [app/[locale]/](app/%5Blocale%5D) and the matching [i18n/](i18n) files for `en` and `vi`.
- Treat [queries/](queries) as query-option factories and [hooks/mutations/](hooks/mutations) as the mutation layer. Invalidate the relevant query keys after mutations.
- Respect sparse ordering in dashboard board flows. The board uses 1000-step spacing and rebalancing rather than index-based order updates.
- Use the shared UI primitives in [components/ui/](components/ui) and existing feature components before introducing new abstractions.

## Validation

- `pnpm lint`
- `pnpm build`

Use `pnpm dev` for local runtime checks when a change affects routing, auth, i18n, or client-side behavior.

## Key Files

- [package.json](package.json) for scripts and package manager conventions.
- [next.config.ts](next.config.ts) for `next-intl`, React Compiler, and API rewrites.
- [components.json](components.json) for shadcn and styling defaults.
- [lib/ordering.ts](lib/ordering.ts) for sparse ordering helpers.
- [i18n/routing.ts](i18n/routing.ts) and [i18n/request.ts](i18n/request.ts) for locale routing.

## Notes For Agents

- Prefer linked docs and source files over repeating implementation details.
- If a task touches board ordering, chat, or query invalidation, check nearby existing patterns before editing.
- Keep edits aligned with the current React Compiler and Next.js conventions already used in the repo.
