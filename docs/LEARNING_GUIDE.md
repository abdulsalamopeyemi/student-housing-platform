# Learning Guide

This document connects the concepts you are learning to the actual project.

## 1. Components

A React component represents a reusable UI responsibility.

Examples:

- `SiteHeader.tsx`
- `PropertyCard.tsx`
- `HowItWorks.tsx`

Why:

Instead of putting the entire application inside one `page.tsx`, each component owns one clear responsibility.

## 2. Props

Props pass information from a parent component to a child component.

Example:

`PropertyCard` receives a `property` prop.

That means the card UI is reusable for many different properties instead of hard-coding one property.

## 3. State

State represents information that can change while the user interacts with the current browser session.

Examples:

### SavePropertyButton

`isSaved` changes between `false` and `true`.

The component re-renders when the state changes.

### MobileMenu

`isOpen` determines whether the mobile navigation is visible.

Important lesson:

Not every value belongs in React state.

## 4. URL state

Explore filters currently live in the URL.

Example:

`/explore?location=Malete&budget=250000`

Why this is better than putting every filter in `useState`:

- refreshing keeps the filters
- the URL can be shared
- browser navigation works naturally
- the server can read the filter values

## 5. Server Components

Most of the app is server-rendered by default.

Examples:

- homepage sections
- Explore results
- Property details

Why:

These components mainly read data and render HTML. They do not need browser-side React state.

## 6. Client Components

A Client Component begins with:

`"use client"`

Current examples:

- `SavePropertyButton.tsx`
- `MobileMenu.tsx`
- `InspectionRequestForm.tsx`

Why:

They need browser interaction and React hooks.

## 7. Dynamic routes

The property page uses:

`src/app/properties/[slug]/page.tsx`

A URL such as:

`/properties/victory-lodge`

provides the slug `victory-lodge` to the page.

The page then finds the correct property.

Later the slug will be used to query Postgres instead of the temporary array.

## 8. TypeScript interfaces

`StudentProperty` describes the expected shape of property data.

Why:

If a property is missing required data or uses the wrong type, TypeScript can warn us while developing.

When the database is introduced, these data types will become even more important.

## 9. Temporary data vs real data

Current source:

`src/data/featured-properties.ts`

This is temporary demo data.

It exists because we needed to understand:

- what information a property needs
- how cards should compare properties
- what the property-details page needs
- what the future database schema should contain

We are not pretending it is production data.

## 10. Forms

The current inspection form teaches:

- form fields
- submit events
- component state
- loading/success UI states

It does not yet persist data.

Production flow will become:

form
→ server validation
→ database insert
→ notification/status
→ confirmation

## 11. Why we are delaying authentication

Authentication is not useful by itself.

We first needed to know what authenticated users actually need to do.

Now we know:

Student actions:

- save a property
- request inspections
- see request history

Provider actions:

- create properties
- update rooms and availability
- receive inspection requests

Admin actions:

- verify providers/properties
- moderate reports

That makes the eventual auth/authorization design much clearer.

## 12. Why this project is good React practice

You are learning React concepts in situations where they are genuinely required rather than adding hooks artificially.

As the product grows you will encounter:

- component composition
- props
- state
- forms
- controlled inputs
- custom hooks
- context where appropriate
- async UI
- error boundaries
- loading states
- authentication state

At the same time, Next.js teaches when some state and data should live on the server instead of the browser.

## Current mental model

React answers:

**How should this interactive UI behave?**

Next.js answers:

**Where should this code run, how is it routed, and how is data delivered?**

Postgres answers:

**What real data exists and how is it related?**

Auth answers:

**Who is this user?**

Authorization/RLS answers:

**What is this user allowed to access or change?**
