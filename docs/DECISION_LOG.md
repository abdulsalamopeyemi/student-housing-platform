# Decision Log

Record meaningful product and architecture decisions here.

## DEC-001 — Framework

**Decision:** Use Next.js with React and TypeScript for the new independent application.

**Why:** The product needs React component development plus routing, metadata/SEO, server capabilities, and a scalable application structure.

**Trade-off:** It introduces more concepts than a plain React application, so React fundamentals must still be learned deliberately.

## DEC-002 — Documentation-first UI

**Decision:** Maintain product, UX, content, asset, component, and design documentation inside `/docs`.

**Why:** This prevents random UI decisions, lost copy, unknown image sources, and generated code that nobody understands later.

## DEC-003 — CAPTCHA

**Decision:** Do not block the entire application with a “not a robot” gate.

**Why:** It adds unnecessary friction to discovery. Apply anti-bot controls to sensitive or abuse-prone actions instead.

## DEC-004 — Initial market

**Decision:** Build and validate around KWASU / Malete first while keeping data models capable of supporting additional universities.

**Why:** A focused market provides clearer user feedback and operational learning than attempting a Nigeria-wide launch immediately.

## DEC-005 — Hero imagery

**Decision:** Start the homepage with a designed property preview rather than an undocumented stock photo.

**Why:** We can establish the layout immediately while avoiding unclear image ownership. A real/generated hero asset will only be added after it is registered in `ASSET_REGISTER.md`.

## DEC-006 — Client state boundary

**Decision:** Keep the property card and property data server-rendered; make only the save interaction a Client Component.

**Why:** State belongs where the UI changes from browser interaction. This avoids turning entire sections into client-side JavaScript just because one button uses `useState`.

**Current limitation:** The save state is temporary and resets after a page refresh. Persistence will be added later when we introduce local persistence or authenticated user accounts.


## DEC-007 — Homepage trust language

**Decision:** Explain trust as better information and defined verification processes rather than promising that the platform eliminates all accommodation risk.

**Why:** Strong safety promises would be misleading before the platform has real operational verification, dispute, and support processes.

## DEC-008 — Mobile navigation state

**Decision:** Keep the main header server-rendered and isolate the open/closed mobile navigation state inside a small `MobileMenu` Client Component.

**Why:** Responsive navigation needs browser interaction, but the rest of the header does not need client-side JavaScript.


## DEC-009 — Explore filters in the URL

**Decision:** Use URL search parameters for the first Explore filters instead of storing the filters only in React memory.

**Why:** A URL such as `/explore?location=Malete&budget=250000` can be refreshed, bookmarked, shared, and rendered on the server. The homepage search can also feed directly into the Explore page.

**Trade-off:** The current prototype submits filters through a standard GET form instead of providing instant filtering while the user types. We can add richer client interaction later if testing shows it is valuable.


## DEC-010 — Redesigned homepage hero

**Decision:** Replace the original prototype hero in the rendered homepage with a new `HeroV2` while leaving the old `Hero.tsx` file untouched.

**Why:** The original hero proved the page structure but did not yet create a strong first impression. `HeroV2` gives the product a clearer student-first message, stronger visual hierarchy, a search-first CTA, provider entry point, and trust cues without relying on an undocumented stock image.

**Trade-off:** The right side is still a designed product preview rather than final property photography. Real hero imagery will be added only after its source and rights are documented.

## DEC-011 — Stream request-time Explore state

**Decision:** Access `searchParams` inside `ExploreContent`, which is wrapped by React `Suspense`, instead of awaiting `searchParams` at the top level of the Explore page.

**Why:** With Next.js Cache Components enabled, URL search parameters are request-time data. Keeping them behind a Suspense boundary preserves a prerendered page shell and avoids a blocking-route error.

## DEC-012 — Prerender current demo property slugs

**Decision:** Use `generateStaticParams()` for the current demo property slugs.

**Why:** The three prototype property routes are known in advance, so they can be prerendered cleanly while Cache Components are enabled. When properties move to Postgres, this strategy will be reviewed for real marketplace scale.
