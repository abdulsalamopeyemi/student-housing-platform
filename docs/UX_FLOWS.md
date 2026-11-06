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

Sign in and sign up have separate routes and focused forms. Signup first asks the user to choose
Tenant or Landlord, then collects account details. Those choices map to student or provider account
metadata respectively. Tenant sign-in routes to the student portal; Landlord sign-in resumes
landlord setup until a landlord workspace record exists, then routes to that workspace. Landlord
setup adds a profile to the existing login; it does not create another authentication account.
Agents do not self-register and are managed by the platform team. The database role remains the
authorization source. The account menu identifies the signed-in role with a matching icon and portal
link. Account actions return validation errors to the matching form and preserve valid intended
destinations. Both pages provide pending feedback, accessible focus states, and reduced-motion-aware
loading and entrance effects.

## Support and policies

Footer → Support → sign in (if needed) → submit a private support request → administrator queue →
reply by email and mark the request in progress/resolved/dismissed. Terms and Privacy pages are
available as clearly labeled drafts pending operator and legal review.

## Provider listing

Provider entry → sign in or create a Landlord login → finish the landlord profile on that same login → property details → photos/facilities/pricing → location → submit for review → admin decision → publish. Agents are managed by the platform team, not through public signup. Listing forms are not available to guests; public listing information remains viewable without an account.

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
