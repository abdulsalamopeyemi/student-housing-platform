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
