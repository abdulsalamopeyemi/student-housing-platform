# Database Schema

This document summarizes the first production database migration.

Migration file:

`supabase/migrations/202610250001_initial_schema.sql`

## Why the schema is relational

The product contains relationships that should be enforced by the database:

- one university has many properties
- one provider can manage many properties
- one property has many room types
- one room type can have many required fees
- students can save many properties
- a property can be saved by many students
- students create inspection requests for properties
- providers receive requests for properties they manage
- admins create verification/audit events

Postgres gives us foreign keys, constraints, transactions, indexes, and Row Level Security for these relationships.

## Core tables

### universities

Public lookup table for supported institutions.

Initial seeded institution:

- Kwara State University (KWASU)
- Malete, Kwara, Nigeria

### profiles

Application profile linked one-to-one to `auth.users`.

Important rule:

New users always start as `student`. A browser must never be able to sign itself up as an admin.

### providers

Represents a landlord, agent, or property manager.

A provider starts `unverified`.

Verification is intentionally separate from the normal profile so we can review provider legitimacy independently.

### properties

The main accommodation/listing record.

Important states:

- publication: draft, pending review, published, rejected, archived
- verification: unverified, pending, verified, rejected

Public users can read only `published` properties.

### room_types

Represents the actual type of room being offered.

Fields include:

- annual rent
- capacity
- available room count
- availability update timestamp

We keep room data separate from the property because one lodge may offer multiple room categories.

### property_fees

Stores rent-related fees separately.

This supports the product promise that mandatory costs should be visible and not hidden in vague text.

### property_images

Stores references to files in Supabase Storage.

Identity/verification evidence must eventually use a private bucket separate from public property photography.

### amenities / property_amenities

Normalized amenity list and the many-to-many relationship between properties and amenities.

### saved_properties

Many-to-many link between signed-in students and properties.

This will replace the current temporary `useState` Save button.

### inspection_requests

Persists student inspection requests.

Current planned status flow:

`requested → confirmed → completed`

or:

`requested → declined/cancelled`

### reports

Student/user reports about suspicious or inaccurate listings.

### verification_events

Admin audit history for provider/property verification actions.

## Security model

Every user-facing table has Row Level Security enabled.

### Anonymous users

Can read:

- universities
- amenities
- published properties
- room/fee/image/amenity information belonging to published properties

Cannot:

- create or edit properties
- save properties
- submit authenticated inspection requests
- view private user data

### Students/authenticated users

Can:

- read their own profile
- save/remove published properties
- read their own saved properties
- create inspection requests for published properties
- read their own inspection requests
- submit reports

### Providers

Can additionally:

- create a provider application/profile for themselves
- read their own provider record
- create draft properties
- manage child room/fee/image/amenity records for properties they own
- read/update inspection requests for properties they manage

### Admins

Can:

- manage listing publication/verification
- manage reports
- manage inspection requests
- write verification audit events
- inspect protected operational records

## Important security rule

Authentication answers:

**Who is the user?**

RLS answers:

**Which rows may that user read or modify?**

The UI is not a security boundary.

Hiding an Admin button does not prevent a malicious request. Database policies must enforce the rule.

## Security-definer functions

The migration uses helper functions in a non-exposed `private` schema for admin/provider checks.

Every security-definer helper:

- sets `search_path = ''`
- schema-qualifies relations
- has execution revoked from roles that do not need it

This follows Supabase guidance for safer security-definer functions.

## What is not implemented yet

The schema intentionally does not yet include:

- payment transactions
- chat/messaging
- reviews/ratings
- university staff accounts
- complex agent commissions
- notification delivery tables

Those features should be added only after the core discovery → inspection workflow is validated.


## Mutation guards

RLS controls which rows a user can reach, but some rows contain sensitive workflow fields that need an additional rule.

### Property review fields

Providers may edit content on properties they own, but they cannot arbitrarily change:

- `provider_id`
- `verification_status`
- `publication_status`
- `published_at`

A database trigger allows only the defined provider transition into review:

`draft/rejected → pending_review`

with:

`unverified/rejected → pending`

Final verification/publication remains an admin responsibility.

### Inspection request identity

A provider can update the workflow status of an inspection request for a property they manage.

A provider cannot rewrite:

- the student user
- the property
- the selected room type
- preferred date
- phone number
- note

This prevents a provider from changing the meaning of a student's original request.


## Atomic property draft creation

The live database exposes `public.create_property_draft(...)` for authenticated providers.

The function is:

- `SECURITY INVOKER`
- executable by `authenticated`
- not executable by `anon`
- protected by the existing table RLS policies

It creates, in one Postgres transaction:

1. a draft property
2. its first room type
3. required fee rows
4. selected property amenities

If one insert fails, the transaction fails instead of leaving a partially created listing.

The provider ID is derived from the authenticated user through the protected provider lookup; it is not trusted from browser input.
