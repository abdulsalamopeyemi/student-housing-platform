# UX Flows

## Student discovery

Home → search → Explore results → refine filters → property details → save or request inspection → authenticate only when necessary → confirmation/status.

### Current implemented slice

1. The homepage hero submits search values as URL search parameters.
2. `/explore` reads the search state on the server and loads published properties from Supabase.
3. The result set is filtered by university/location, budget, and room type.
4. If nothing matches, the user gets a useful empty state and a clear way to reset filters.
5. Property details show current listing data and let students save a home, compare it later, or request an inspection.
6. Students can track, reschedule, or cancel eligible inspection requests from their account.
7. The student portal stores profile, saved-home, and inspection activity. A completed inspection
   does not confirm a tenancy or reserve a room; reservation and gateway payment are deferred.

## Account recovery

Login → forgot password → email link → recovery session → choose a new password → return to account.
The recovery callback removes the one-time token fragment from the browser URL before storing the
verified session in HTTP-only cookies.

## Sign in and sign up

Sign in and sign up have separate routes and focused forms. New users choose a student or provider
account type during sign up. That choice is stored as account metadata to resume provider onboarding
if needed; the database role remains the authorization source. Student accounts go to the student
portal, while provider access begins after provider onboarding creates a provider record. Account
actions return validation errors to the matching form and preserve valid intended destinations.
Both pages provide pending feedback, accessible focus states, and reduced-motion-aware loading and
entrance effects.

## Support and policies

Footer → Support → sign in (if needed) → submit a private support request → administrator queue →
reply by email and mark the request in progress/resolved/dismissed. Terms and Privacy pages are
available as clearly labeled drafts pending operator and legal review.

## Provider listing

Provider entry → account → identity/contact verification → property details → photos/facilities/pricing → location → submit for review → admin decision → publish.

## Admin verification

Review queue → inspect provider/property evidence → approve, request changes, or reject → verification state → audit record.

## Admin payout setup

Admin reviews verified property providers → searches by provider or subaccount → filters by account status → configures or updates the Paystack subaccount → receives an in-form pending state and a confirmation message.

## Provider workspace feedback

Providers and assigned agents scan linked workspace counts → jump to inspection requests or properties → submit updates with visible pending feedback. Workspace and payout screens use content-shaped loading skeletons; entry motion and skeleton shimmer are disabled for reduced-motion preferences.

## Anti-bot

Do not put CAPTCHA in front of the entire website.

Use bot protection on abuse-prone actions such as:

- account creation
- repeated enquiry submission
- password recovery
- suspicious traffic patterns

## Required interface states

For asynchronous features, consider:

- loading
- empty
- error
- success
- disabled
- stale/unconfirmed data

## UX principle

Do not force account creation before a student can understand the value of a property. Browsing should remain open; authentication should appear when an action genuinely needs identity or saved state.
