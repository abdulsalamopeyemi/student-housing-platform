# Learning Guide

This document connects the concepts you are learning to the actual project.

## Components and props

React components own reusable UI responsibilities.

Examples:

- `SiteHeader.tsx`
- `PropertyCard.tsx`
- `ProviderOnboardingContent.tsx`

Props pass data into reusable components instead of hard-coding one result.

## State

React state is for browser interaction that changes during the current session.

Examples:

- `SavePropertyButton` → saved/not saved
- `MobileMenu` → open/closed
- `InspectionRequestForm` → idle/submitting/success

Not every changing value belongs in `useState`.

## URL state

Explore filters live in the URL.

Example:

`/explore?location=Malete&budget=250000`

Benefits:

- refresh preserves filters
- links are shareable
- browser navigation works
- the server can render from the URL

## Server Components

Most read-only application UI is server-rendered.

Examples:

- Explore results
- property details
- provider onboarding status
- provider workspace

They can read server-only data without shipping all data-access logic to the browser.

## Suspense and request-time data

With Cache Components enabled, request values such as:

- `searchParams`
- dynamic `params`
- authenticated cookies

must be isolated appropriately.

We use `Suspense` boundaries around request-dependent content so static shells remain fast.

## Server Actions

Server Actions handle trusted server-side form mutations.

Current examples:

- login
- signup
- provider creation
- sign out

The browser submits a normal form, but sensitive Supabase calls and cookie writes happen on the server.

## Authentication vs authorization

Authentication:

**Who are you?**

Current flow:

email/password
→ Supabase Auth
→ access token + refresh token
→ HTTP-only cookies

Authorization:

**What are you allowed to do?**

Current flow:

authenticated request
→ access token
→ Postgres
→ RLS
→ allowed rows only

A signed-in user is not automatically an admin.

## Provider onboarding

A normal account starts as a student profile.

When that authenticated user creates a valid provider row:

- RLS checks that the provider belongs to the current user
- a database trigger promotes the profile role to `provider`
- verification remains `unverified`

This separates **provider identity** from **provider verification**.

## Generated database types

`src/types/database.ts` is generated from the live Supabase schema.

This means TypeScript can understand actual table shapes such as:

- `providers`
- `properties`
- `inspection_requests`

This is stronger than manually guessing what the database looks like.

## Temporary property data vs real backend data

Property cards/details still use the temporary demo array.

The backend is real, but the first real property has not been created yet.

The next milestone replaces this gap through the provider workflow:

provider account
→ property draft
→ room/pricing data
→ review
→ published property
→ Explore

## Current mental model

React answers:

**How should this interactive UI behave?**

Next.js answers:

**Where should this code run, how is it routed, and how is data delivered?**

Postgres answers:

**What real data exists and how is it related?**

Supabase Auth answers:

**Who is this user?**

RLS answers:

**Which database rows is this user allowed to access or change?**
