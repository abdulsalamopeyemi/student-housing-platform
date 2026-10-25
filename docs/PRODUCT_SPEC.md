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
- Authentication when required
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
- responsive navigation
- provider CTA

### M2 — Explore/search
**Status: implemented with demo data**

- location filter
- budget filter
- room-type filter
- URL-based search state
- empty-results state

### M3 — Property details
**Status: implemented with demo data**

- dynamic `/properties/[slug]` route
- property overview
- facilities/utilities
- required fee breakdown
- availability timestamp
- trust-status explanation

### M4 — Backend/data foundation
**Next**

- create Supabase project
- define Postgres schema/migrations
- enable RLS and least-privilege grants
- replace demo property reads with database queries

### M5 — Real inspection requests

- server validation
- persist inspection requests
- request status
- provider access to relevant requests
- confirmation/error states

### M6 — Authentication and student accounts

- cookie-based auth
- student profile
- persisted saved homes
- inspection-request history

### M7 — Provider workflow

- provider profile
- list/edit property
- room availability
- image uploads
- enquiry management

### M8 — Verification and moderation

- admin roles
- provider/property review
- reporting
- audit history

### M9 — Production launch

- analytics
- performance
- accessibility review
- security review
- monitoring
- deployment
- real pilot with Malete properties
