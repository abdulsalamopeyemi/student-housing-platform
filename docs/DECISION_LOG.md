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


## DEC-013 — Photo-led hero structure

**Decision:** Rework `HeroV2` into a full-width photographic hero with a dark overlay, left-aligned content, primary/secondary CTAs, search controls, and a trust row at the bottom.

**Why:** The desired direction is closer to a hospitality/property landing page: the accommodation image should establish emotion and context immediately, while the text and search sit on top of it. This better matches the reference direction without copying its exact content or branding.

**Prototype asset:** A free-to-use Unsplash image is used temporarily. Before production, replace it with a locally stored, optimized image that better represents the real KWASU/Malete accommodation market.


## DEC-014 — Server-side auth cookies

**Decision:** Store access and refresh tokens in HTTP-only, SameSite=Lax cookies written by server actions rather than localStorage.

**Why:** Authentication tokens should not be directly readable by ordinary browser JavaScript. Protected routes validate or refresh the session in `proxy.ts`.

## DEC-015 — Auth HTTP adapter before SDK dependency

**Decision:** The first authentication milestone uses Supabase Auth's supported HTTP endpoints directly instead of introducing `@supabase/ssr` while the automated environment cannot resolve new npm packages reliably.

**Why:** This keeps `npm ci` and the existing lockfile stable while still using Supabase Auth, secure cookies, refresh tokens, and RLS-backed authenticated requests.

**Trade-off:** Supabase recommends `@supabase/ssr` for Next.js SSR integrations. Before production launch, revisit this adapter and migrate to the maintained SSR helper if dependency installation is available.

## DEC-016 — Provider role promotion is database-controlled

**Decision:** Creating a valid provider row automatically promotes a profile from `student` to `provider` through a protected database trigger.

**Why:** The browser must not be able to submit arbitrary role values. Provider ownership is proven through authenticated RLS, while `admin` remains controlled separately.

## DEC-017 — Provider onboarding does not equal verification

**Decision:** A provider profile starts as `unverified`.

**Why:** Being able to create a provider account only proves authenticated account ownership. Verification requires a separate operational review before trust badges or public verification claims are allowed.


## DEC-018 — Atomic property draft RPC

**Decision:** Create the initial property, first room type, fees, and amenities through one security-invoker Postgres function.

**Why:** A multi-table listing should not be left half-created if one step fails. A single database transaction keeps the draft internally consistent.

**Security:** The function derives the provider from the authenticated identity, runs as the caller, remains subject to RLS, and is not executable by anonymous users.

## DEC-019 — Draft before review

**Decision:** New provider properties always begin as `draft` and `unverified`.

**Why:** Saving property information is not the same as platform approval. Providers explicitly submit a completed draft for review, which moves it to `pending_review` / `pending`; final publication remains an admin action.
