# Implementation changelog

This log records the student and admin portal improvements in the order they
were implemented and committed.

## 1. Student portal foundation

- Added authenticated student profile editing for name, phone number, and
  university; email remains read-only.
- Added server-side validation and a database policy that limits profile
  updates to the signed-in user. A trigger protects profile identity and role,
  and the database grant is limited to the editable columns.
- Updated the portal to focus on profile details, saved homes, and inspection
  activity. Payment checkout and payment history are not presented in this
  portal flow.
- Clarified that an inspection is not a confirmed tenancy or room reservation.
- Added a more descriptive loading state and updated the student dashboard
  data query and product documentation.

The profile migration has not been applied to a Supabase database. The
reservation and gateway-payment workflows remain deferred.

## 2. Admin operations workspace

- Reframed the review queue as the admin operations home and added linked queue
  summaries for provider verification, property review, reports, and support.
- Added shared navigation between review queues and payout setup, including
  direct links to each moderation lane.
- Added pending-state feedback to moderation and support actions, accessible
  loading feedback for the admin review page, and separate error alerts for
  rejected or stale review actions.
- Clarified that provider payout setup does not mean student checkout or room
  reservations are available.
- Updated the product roadmap to reflect the admin workspace foundation.

Payout configuration remains separate from reservation checkout. No payment
gateway or reservation behavior was implemented in this work.

## Validation

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- `git diff --check`

The full test suite remains deferred.
