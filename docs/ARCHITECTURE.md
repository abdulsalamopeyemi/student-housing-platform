# Application Architecture

This document explains how the Student Housing application should evolve from the current prototype into a production application.

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
- Client Components only for interactive browser behavior such as mobile menus, save buttons, and interactive form feedback.
- Dynamic routes such as `/properties/[slug]` for individual property pages.
- URL search parameters for shareable search/filter state.
- Server Actions for internal form mutations when we connect the database.
- Route Handlers for external APIs, webhooks, or integrations that need HTTP endpoints.

### TypeScript

TypeScript defines the shape of application data and component props.

Examples:

- `StudentProperty`
- inspection request data
- provider profiles
- database query results

The goal is to catch invalid assumptions before runtime and make the code easier to understand.

### Tailwind CSS

Tailwind handles UI styling.

We still maintain product-level design tokens in `globals.css` and document them in `DESIGN_SYSTEM.md`.

### Supabase Postgres

Postgres will become the source of truth for real application data.

Why Postgres fits this product:

- properties belong to providers
- properties have room/unit records
- students create inspection requests
- users save many properties
- providers receive many requests
- verification and reports have relationships and history
- transactions and constraints matter

This data is relational, so a relational database is a natural fit.

### Supabase Auth

Use server-side, cookie-based authentication.

Planned user roles:

- student
- provider
- admin

Authentication proves who the user is. Authorization decides what that user is allowed to do.

### Row Level Security (RLS)

Database policies should enforce access rules close to the data.

Examples:

- anyone may read published public property information
- a provider may update only properties they own/manage
- a student may read only their own private inspection requests and saved-property records
- ordinary users cannot perform admin verification actions

Do not rely only on hiding buttons in the UI.

### Supabase Storage

Use object storage for:

- property photos
- provider verification evidence
- avatars later

Public listing photos and private identity evidence must not share the same access policy.

## High-level request flow

### Public property browsing

Browser
→ Next.js Server Component
→ Postgres query
→ rendered HTML
→ browser

This avoids shipping unnecessary client JavaScript for read-only content.

### Interactive browser state

Browser
→ small Client Component
→ React state

Examples:

- mobile menu open/closed
- temporary save-button state
- form feedback

### Real inspection request

Browser form
→ Server Action
→ validate input
→ authenticated/anonymous policy checks
→ Postgres insert
→ revalidate relevant pages
→ confirmation UI

## Planned core tables

### profiles

- id
- user_id
- role
- full_name
- phone
- university_id
- created_at

### universities

- id
- name
- slug
- city
- state
- country

### providers

- id
- profile_id
- provider_type
- verification_status
- created_at

### properties

- id
- provider_id
- university_id
- name
- slug
- description
- area
- latitude / longitude with privacy controls
- verification_status
- publication_status
- created_at
- updated_at

### room_types

- id
- property_id
- name
- annual_rent
- capacity
- available_count
- availability_updated_at

### property_fees

- id
- room_type_id
- label
- amount
- required

### property_images

- id
- property_id
- storage_path
- alt_text
- sort_order

### amenities

- id
- name
- category

### property_amenities

- property_id
- amenity_id

### saved_properties

- student_user_id
- property_id
- created_at

### inspection_requests

- id
- student_user_id
- property_id
- room_type_id
- preferred_date
- contact_phone
- note
- status
- created_at

### reports

- id
- reporter_user_id
- property_id
- reason
- details
- status
- created_at

### verification_events

- id
- property_id / provider_id
- admin_user_id
- action
- notes
- created_at

## Security principles

1. Never expose private identity documents as public URLs.
2. Never trust a user-supplied role such as `admin`.
3. Validate all server mutations.
4. Keep secret keys server-only.
5. Use RLS and least-privilege grants.
6. Public pages should expose only information intended for the marketplace.
7. Log meaningful moderation and verification actions.
8. Do not claim a property is verified until the verification workflow exists.

## Why not a separate Express backend right now?

A separate API server would add:

- another deployment
- duplicate routing and validation
- another authentication boundary
- more CORS and environment configuration
- more code to learn before the product needs it

Next.js already supports server-side application logic.

We can introduce a separate backend later if we genuinely need one for mobile clients, independent public APIs, complex background services, or organizational scaling.

## Payments

Do not build rent payment first.

First validate:

1. students can discover useful properties
2. providers keep listings accurate
3. inspection requests create real matches
4. users trust the information enough to act

Payment adds significant operational, security, refund, fraud, and compliance complexity.

## Current status

Implemented:

- homepage
- search entry
- Explore route and filters
- reusable property cards
- save-button UI state
- responsive mobile menu
- property-details dynamic route
- transparent sample fee breakdown
- inspection-request prototype UI

Next production milestone:

- create Supabase project
- define database migrations
- install Supabase client packages
- configure server/client utilities
- replace demo property data with database reads
- persist inspection requests
