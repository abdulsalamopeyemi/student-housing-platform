# Product Specification

## Vision

Build a trusted student-accommodation marketplace and management platform that helps students discover legitimate housing near universities, understand total costs, request inspections, and communicate with property providers.

## Working promise

**Find a student home you can trust — with clear prices, real availability, and useful property information.**

## Initial market

- Begin with KWASU / Malete.
- Keep the product architecture ready for more universities and cities later.
- Never imply university endorsement without formal approval.

## Core users

### Students

Need to compare accommodation by price, location, room type, facilities, availability, and trust signals.

### Property providers

Landlords and authorized agents need a clear way to present properties, manage availability, and receive useful enquiries.

### Platform administrators

Need to review listings, manage verification states, handle reports, and keep marketplace information useful.

## MVP scope

- Home page
- Explore/search properties
- Property details
- Inspection/interest request
- Authentication
- Provider onboarding
- List a property
- Provider management
- Admin verification
- Terms and privacy
- Report/support flow

## What the MVP must prove

1. Students are willing to discover and compare accommodation digitally.
2. Clear pricing, facilities, location, and availability improve decision-making.
3. Providers are willing to submit accurate property information and maintain availability.
4. Inspection or interest requests can create a measurable conversion funnel.
5. The platform can create a realistic path toward revenue after user value is proven.

## Build roadmap

### M0 — Foundation
**Status: implemented**

- product docs
- design system
- Next.js/TypeScript project shell
- CI quality checks

### M1 — Homepage
**Status: implemented**

- search entry
- trust messaging
- featured property cards
- responsive/sticky navigation
- provider CTA

### M2 — Explore/search
**Status: implemented with live published-property data**

- location filter
- budget filter
- room-type filter
- URL-based search state
- empty-results state

### M3 — Property details
**Status: implemented with live published-property data**

- dynamic `/properties/[slug]` route
- property overview
- facilities/utilities
- required fee breakdown
- availability timestamp
- trust-status explanation
- Suspense boundary for request-time route data

### M4 — Backend/data foundation
**Status: implemented**

- live Supabase project
- Postgres schema and migrations
- RLS and least-privilege grants
- generated database TypeScript types
- public university lookup from Supabase
- security advisor: zero findings after schema/auth migrations

### M5 — Authentication and provider identity
**Status: implemented foundation**

- email/password sign-up
- email/password sign-in
- password recovery and reset
- HTTP-only session cookies
- protected provider routes
- refresh-token flow for protected routes
- provider onboarding
- automatic student → provider role sync
- provider workspace

### M6 — Real property submission
**Status: implemented foundation**

- authenticated draft property form
- atomic property + first room type creation
- required fee entry
- amenities
- room availability
- provider draft list
- submit property for review
- first room type only; multiple room types remain future work

### M7 — Real marketplace data + inspection requests
**Status: implemented in application code; verify against the deployed database**

- public Explore and property details use published Postgres properties
- inspection requests persist and have student/provider status flows
- student saved homes persist and can be compared
- student portal profile, saved-home, and inspection activity
- tenancy activation and room reservations are not yet implemented

### M8 — Verification and moderation
**Status: implemented foundation; requires workflow testing**

- admin roles
- provider/property review
- publish/reject actions
- reporting
- audit history
- admin operations overview with linked moderation, support, and payout queues

### Supporting pages and requests
**Status: implemented in application code; support migration must be applied**

- Support request form with authenticated submission and admin queue
- Terms and privacy draft pages (not final legal documents)
- Footer links to support, terms, and privacy

### M9 — Production launch

- reservation/payment workflow with gateway-verified room holds
- property photo Storage buckets and policies
- analytics
- performance
- accessibility review
- security review
- monitoring
- deployment
- real pilot with Malete properties

Before public launch, confirm the operator/legal identity, applicable privacy law,
retention/deletion practices, payment/refund terms, email delivery, storage policies,
and production monitoring. The legal pages must be reviewed and finalized first.
