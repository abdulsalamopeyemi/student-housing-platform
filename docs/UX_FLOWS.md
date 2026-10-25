# UX Flows

## Student discovery

Home → search → results → filters → property details → save or request inspection → authenticate only when necessary → confirmation/status.

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
