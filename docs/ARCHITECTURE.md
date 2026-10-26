# Application Architecture

This document explains how the Student Housing application evolves into a production application.

## Architecture goal

Keep the system simple enough to understand and operate, while supporting:

- public property discovery
- provider-managed listings
- student accounts and saved homes
- inspection requests
- property verification
- image uploads
- reporting and moderation
- future payments and notifications

## Chosen stack

### Next.js App Router + React

Next.js is the application framework. React builds the UI.

Use:

- Server Components for data-heavy pages that do not need browser state.
- Client Components only for browser interaction such as menus, save buttons, and form feedback.
- Dynamic routes such as `/properties/[slug]`.
- URL search parameters for shareable search/filter state.
- Server Actions for internal form mutations.
- `proxy.ts` for protected-route session refresh.

### TypeScript

TypeScript defines the shape of application data and component props.

The live Supabase project now generates database types into:

`src/types/database.ts`

This makes the application code reflect the actual Postgres schema.

### Tailwind CSS

Tailwind handles UI styling.

Product-level design tokens still live in `globals.css` and are documented in `DESIGN_SYSTEM.md`.

### Supabase Postgres

Postgres is the source of truth for production data.

Why Postgres fits this product:

- properties belong to providers
- properties have room/unit records
- students create inspection requests
- users save many properties
- providers receive many requests
- verification and reports have relationships and history
- transactions and constraints matter

### Supabase Auth

Authentication is handled by Supabase Auth.

Current implementation:

- email/password sign-up
- email/password sign-in
- secure HTTP-only cookies
- refresh tokens on protected routes
- authenticated requests carry the user's access token
- no service-role/secret key is exposed to the browser

The current repo calls Supabase Auth's supported HTTP endpoints directly so the authentication milestone can work without adding an unresolved package dependency to CI. Before production launch, we should evaluate switching the session adapter to `@supabase/ssr`, which is Supabase's recommended Next.js helper package.

### Authorization and Row Level Security

Authentication answers:

**Who is this user?**

RLS answers:

**Which rows may this user access or modify?**

Examples:

- anonymous users may read published properties
- providers may manage only properties they own
- students may read only their own saved properties/inspection requests
- ordinary users may not perform admin verification actions

The UI is not treated as a security boundary.

### Supabase Storage

Planned for:

- public property photos
- private provider verification evidence
- avatars later

Public property media and private identity evidence must use separate access policies.

## High-level flows

### Public property browsing

Browser
→ Next.js Server Component
→ Supabase/Postgres
→ rendered HTML
→ browser

### Account sign-in

Browser form
→ Server Action
→ Supabase Auth
→ access + refresh token
→ HTTP-only cookies
→ protected route

### Protected provider route

Browser request
→ Next.js proxy
→ validate access token
→ refresh when necessary
→ Server Component
→ authenticated PostgREST query
→ RLS
→ provider-owned rows only

### Provider onboarding

Authenticated user
→ create provider row
→ RLS verifies `profile_id = auth.uid()`
→ database trigger promotes profile role to `provider`
→ provider remains `unverified` until review

### Real inspection request (next marketplace milestone)

Browser form
→ Server Action
→ authenticated user
→ server validation
→ Postgres insert
→ RLS ownership checks
→ confirmation UI

## Security principles

1. Never expose private identity documents as public URLs.
2. Never trust a user-supplied role such as `admin`.
3. Validate all server mutations.
4. Keep secret/service-role keys server-only and out of source control.
5. Use RLS and least-privilege grants.
6. Public pages expose only marketplace-safe data.
7. Log meaningful moderation and verification actions.
8. Never display a verified badge before a defined verification process succeeds.
9. Redirect targets from forms must be restricted to local application paths.
10. Provider creation must not grant admin privileges.

## Why not a separate Express backend right now?

A separate API server would add:

- another deployment
- duplicate routing and validation
- another authentication boundary
- more CORS/environment configuration
- more code before the product needs it

Next.js already supports the required server-side application logic.

## Current status

Implemented:

- homepage and photo-led hero
- Explore filters
- property details
- live Supabase project
- production-oriented Postgres schema
- RLS and security checks
- generated database types
- login/signup
- protected provider routes
- provider onboarding
- provider workspace

Next production milestone:

- real draft property creation tied to the authenticated provider
- room types, fees, amenities, availability
- submit-for-review workflow
