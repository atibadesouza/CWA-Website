# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cooking With Atiba — a recipe website clone of cookingwithatiba.com. Built with Next.js 16 (App Router), Prisma 6 with SQLite, NextAuth.js (beta) for credentials-based auth, and Tailwind CSS 4.

## Commands

- **Dev server:** `npm run dev` (runs on port 3000)
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Seed database:** `node prisma/seed-db.cjs` (uses better-sqlite3 directly; the Prisma-based seed scripts in seed.ts/seed.mjs have ESM compatibility issues on Windows)
- **Prisma generate:** `npx prisma generate` (after schema changes)
- **Prisma migrate:** `npx prisma db push` (push schema to SQLite)

## Architecture

### Route Groups

The app uses Next.js route groups to apply different layouts:

- `src/app/(site)/` — Public-facing pages with Header + Footer layout. Contains: homepage, `/browse-recipes`, `/recipe/[slug]`, `/contact`, `/login`
- `src/app/admin/` — Authenticated admin area with sidebar layout. Protected by server-side `auth()` check in layout.tsx that redirects to `/login`. Contains: dashboard, recipe CRUD (`/admin/recipes`, `/admin/recipes/new`, `/admin/recipes/[id]`), messages

### API Routes

- `src/app/api/auth/[...nextauth]/` — NextAuth handler
- `src/app/api/recipes/` — POST to create recipe (auth required)
- `src/app/api/recipes/[id]/` — PUT to update, DELETE to remove (auth required)
- `src/app/api/contact/` — POST to submit contact form (public)

### Key Libs

- `src/lib/prisma.ts` — Singleton PrismaClient instance (imports from `@prisma/client`)
- `src/lib/auth.ts` — NextAuth config with credentials provider, JWT sessions, custom `/login` page

### Database

SQLite via Prisma 6. The `.env` `DATABASE_URL` uses an **absolute Windows path** to `prisma/dev.db` because relative paths resolve inconsistently during Next.js builds on Windows.

**Important schema note:** `Recipe.ingredients`, `Recipe.instructions`, and `Recipe.nutrition` are stored as JSON strings (not relations). Parse with `JSON.parse()` when reading; stringify with `JSON.stringify()` when writing. Ingredients and instructions are `string[]`; nutrition is `Record<string, string> | null`.

Categories use a many-to-many join table (`RecipeCategory`) and support parent-child hierarchy via `Category.parentId`.

### Design System

- Brand colors: orange `#f89223`, teal `#16a780`, dark `#28292b`, light-gray `#f5f5f5`
- Fonts: Playfair Display (headings via `font-heading`), Lato (body via `font-body`)
- Button classes: `.btn-orange`, `.btn-teal` defined in `globals.css`
- Tailwind color tokens: `text-orange`, `bg-teal`, `bg-light-gray`, `text-foreground` available via `@theme inline` block

### Client vs Server Components

Server components are the default. Client components (`"use client"`) are used only for:
- `Header.tsx` — session-aware nav with mobile menu toggle
- `RecipeForm.tsx` — recipe create/edit form with dynamic ingredient/instruction fields
- `DeleteRecipeButton.tsx` — confirmation dialog before API delete
- `PrintButton.tsx` — `window.print()` wrapper
- `ContactPage` — form state management
- `LoginPage` — auth form with `signIn()` call

### Prisma Version Constraint

This project uses **Prisma 6** (not 7). Prisma 7 requires driver adapters for all databases including SQLite, which adds complexity. Do not upgrade without migrating to a driver adapter setup.
