# Component Inventory

| Component | Responsibility | Initial page | States |
|---|---|---|---|
| SiteHeader | Brand, desktop navigation, auth actions | Home | desktop |
| MobileMenu | Mobile navigation toggle and links | Home | open/closed |
| Hero | Core promise and search entry | Home | default |
| TrustStrip | Short trust differentiators | Home | default |
| FeaturedProperties | Maps demo property data into cards | Home | default |
| PropertyCard | Comparable property summary | Home/Explore | available/limited |
| SavePropertyButton | Interactive save toggle | Home/Explore | saved/not saved |
| HowItWorks | Explains the student journey | Home | default |
| TrustAndSafety | Explains trust principles and limitations | Home | default |
| ProviderCTA | Introduces provider value and planned tools | Home | default |
| SiteFooter | Secondary navigation and product context | Home | default |
| FilterBar | Search filters | Explore | open/closed/applied |
| VerificationBadge | Verification state | Multiple | verified/pending/unverified |
| PriceBreakdown | Rent, required fees, total | Property details | normal |
| FacilityList | Amenities/utilities | Property details | available/unavailable/unknown |
| InspectionRequest | Viewing/interest action | Property details | idle/submitting/success/error |
| EmptyState | No-data guidance | Multiple | contextual |
| Notice/Toast | Action feedback | Multiple | success/error/info |

## Component rule

A component should represent a reusable UI responsibility, not simply exist to make files smaller.

## Client boundary rule

Keep components server-rendered by default. Add `"use client"` only where browser interaction or React client hooks are actually required.

Current Client Components:

- `SavePropertyButton` — owns the temporary saved/not-saved state.
- `MobileMenu` — owns the mobile navigation open/closed state.

The rest of the homepage remains server-rendered.
