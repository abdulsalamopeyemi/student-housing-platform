# Component Inventory

| Component | Responsibility | Initial page | States |
|---|---|---|---|
| SiteHeader | Brand, navigation, auth actions | Home | desktop/mobile |
| Hero | Core promise and search entry | Home | default |
| TrustStrip | Trust differentiators | Home | default |
| PropertyCard | Comparable property summary | Home/Explore | available/stale/unavailable/saved |
| FilterBar | Search filters | Explore | open/closed/applied |
| VerificationBadge | Verification state | Multiple | verified/pending/unverified |
| PriceBreakdown | Rent, required fees, total | Property details | normal |
| FacilityList | Amenities/utilities | Property details | available/unavailable/unknown |
| InspectionRequest | Viewing/interest action | Property details | idle/submitting/success/error |
| EmptyState | No-data guidance | Multiple | contextual |
| Notice/Toast | Action feedback | Multiple | success/error/info |

## Component rule

A component should represent a reusable UI responsibility, not simply exist to make files smaller.
