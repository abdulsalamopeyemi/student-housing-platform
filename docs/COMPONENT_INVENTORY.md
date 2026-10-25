# Component Inventory

| Component | Responsibility | Initial page | States |
|---|---|---|---|
| SiteHeader | Brand, desktop navigation, auth actions | Multiple | desktop |
| MobileMenu | Mobile navigation toggle and links | Multiple | open/closed |
| HeroV2 | Primary product promise, search entry, trust cues, provider path | Home | default |
| TrustStrip | Short trust differentiators | Home | default |
| FeaturedProperties | Maps demo property data into cards | Home | default |
| PropertyCard | Comparable property summary and detail link | Home/Explore | available/limited |
| SavePropertyButton | Interactive save toggle | Home/Explore/Details | saved/not saved |
| HowItWorks | Explains the student journey | Home | default |
| TrustAndSafety | Explains trust principles and limitations | Home | default |
| ProviderCTA | Introduces provider value and planned tools | Home | default |
| SiteFooter | Secondary navigation and product context | Multiple | default |
| ExploreContent | Request-dependent Explore results | Explore | filtered/empty |
| ExploreFilters | GET-based location, budget, and room filters | Explore | populated/default |
| InspectionRequestForm | Captures inspection intent | Property details | idle/submitting/success |
| VerificationBadge | Verification state | Multiple | verified/pending/unverified |
| PriceBreakdown | Rent, required fees, total | Property details | normal |
| FacilityList | Amenities/utilities | Property details | available/unavailable/unknown |
| EmptyState | No-data guidance | Multiple | contextual |
| Notice/Toast | Action feedback | Multiple | success/error/info |

## Component rule

A component should represent a reusable UI responsibility, not simply exist to make files smaller.

## Client boundary rule

Keep components server-rendered by default. Add `"use client"` only where browser interaction or React client hooks are actually required.

Current Client Components:

- `SavePropertyButton` — owns the temporary saved/not-saved state.
- `MobileMenu` — owns the mobile navigation open/closed state.
- `InspectionRequestForm` — owns temporary submit/loading/success UI state until the form is connected to a Server Action.

The Explore page keeps the static page shell outside a `Suspense` boundary and streams `ExploreContent`, because `searchParams` is request-time data when Cache Components are enabled.
