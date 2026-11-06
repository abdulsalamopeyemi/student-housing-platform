# Student Housing Platform Documentation

This folder is the project's living source of truth.

Read in this order:

1. `PRODUCT_SPEC.md`
2. `ARCHITECTURE.md`
3. `LEARNING_GUIDE.md`
4. `UX_FLOWS.md`
5. `DESIGN_SYSTEM.md`
6. `CONTENT_LIBRARY.md`
7. `ASSET_REGISTER.md`
8. `COMPONENT_INVENTORY.md`
9. `DECISION_LOG.md`

## Working rule

When UI, copy, assets, architecture, or product behavior changes, update the relevant document during the same work session.

## Current build stage

The project has moved beyond a static landing page.

Implemented flows now include:

- homepage
- property search entry
- Explore filtering
- property cards
- dynamic property details
- transparent fee breakdown
- save-button state
- responsive mobile menu
- inspection-request UI
- password recovery and reset
- support requests and admin support queue
- draft Terms and Privacy pages

The public marketplace and student/provider actions are connected to Supabase. Remaining work is
to apply and verify all migrations, configure and test Storage policies, finalize legal documents
with the operator, and complete production integration testing.
