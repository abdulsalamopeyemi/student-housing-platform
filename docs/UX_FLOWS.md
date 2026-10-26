# UX Flows

## Student discovery

Home → search → Explore results → refine filters → property details → save or request inspection → authenticate only when necessary → confirmation/status.

### Current implemented slice

1. The homepage hero submits `location` and `budget` as URL search parameters.
2. `/explore` reads those values on the server.
3. The result set is filtered by location, budget, and room type.
4. If nothing matches, the user gets a useful empty state and a clear way to reset filters.
5. Property details and inspection requests are the next discovery steps to build.

## Provider listing

Provider entry → account → identity/contact verification → property details → photos/facilities/pricing → location → submit for review → admin decision → publish.

## Admin verification

Review queue → inspect provider/property evidence → approve, request changes, or reject → verification state → audit record.

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
