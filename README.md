# Student Housing Platform

A student accommodation marketplace designed to help students discover and compare housing, understand listing details and costs, and request property inspections. The first market focus is KWASU / Malete, with the product structured to support other universities over time.

## What’s in the app

- Search and browse published properties, with location, budget, and room-type filters.
- View property details, facilities, fees, availability updates, and trust information.
- Create an account, save properties, request inspections, and manage eligible requests.
- Onboard property providers, submit listings, and manage property information.
- Review providers, listings, reports, support requests, and payout setup in the private admin workspace.
- Read the FAQ, support information, and draft privacy and terms pages.

Property verification and approval indicate that a listing has gone through the platform’s review workflow; they are not a guarantee of a property’s condition or continuing availability.

## Technology

- Next.js App Router, React, and TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, Row Level Security, and Storage
- Paystack checkout integration
- ESLint and GitHub Actions for code-quality checks

## Run locally

### Requirements

- Node.js 20 or later
- npm
- Access to the Supabase project used by the app

### Install and start

```bash
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

On macOS or Linux, use `cp .env.example .env.local` instead of `Copy-Item`.

Fill in the values needed for your setup in `.env.local`. Keep this file local: environment files are ignored by Git and must not be committed.

### Environment variables

| Variable                               | Purpose                                                                                                                               |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL. Use the same project that contains the app’s database and authentication configuration.                         |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key used by the app’s public requests. It is intended for use alongside appropriate Row Level Security policies. |
| `NEXT_PUBLIC_SITE_URL`                 | App origin used to construct authentication confirmation and recovery links. For local development, use `http://localhost:3000`.      |
| `ADMIN_LOGIN_EMAIL`                    | Server-side email for the separate platform admin sign-in.                                                                            |
| `ADMIN_LOGIN_PASSWORD`                 | Server-side password for the separate platform admin sign-in. Use a unique, strong password.                                          |
| `SUPABASE_SECRET_KEY`                  | Server-only Supabase secret key for privileged admin data operations. Never expose it in browser code or use a `NEXT_PUBLIC_` prefix. |
| `PAYSTACK_SECRET_KEY`                  | Server-only Paystack key for payment operations.                                                                                      |

Set public Supabase variables to the project’s actual values rather than relying on any built-in development fallback. Admin sign-in and privileged admin data access require the admin credentials and Supabase secret key. Payment operations require Paystack configuration.

After changing environment variables, restart the development server. For hosted deployments, configure them in the hosting provider’s environment settings and redeploy. Never paste secrets into issues, chats, screenshots, or source control.

## Supabase setup

The database schema and security policies are defined in the SQL migrations under [`supabase/migrations`](./supabase/migrations). Apply the migrations to the same Supabase project configured in `.env.local`, in filename order, and confirm they complete successfully. You can apply them through the Supabase CLI or the project’s SQL Editor.

The migration set includes the marketplace schema, property and provider workflows, support requests, storage configuration, and account updates. The support-request table is created by `202611040001_add_support_requests.sql`; the admin review dashboard expects that table to exist.

For signup confirmation and password recovery:

1. Configure the Supabase Auth Site URL and allowed redirect URLs for your local or deployed app.
2. Set `NEXT_PUBLIC_SITE_URL` to that app origin.
3. Configure an SMTP provider in Supabase before relying on confirmation email delivery to real users.
4. See [`supabase/templates/README.md`](./supabase/templates/README.md) for email-template and sender setup.

## Useful routes

| Route                  | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `/`                    | Marketplace homepage                                 |
| `/explore`             | Search and filter published properties               |
| `/properties/[slug]`   | Property details                                     |
| `/signup` and `/login` | Student and provider account access                  |
| `/account`             | Student account and saved homes                      |
| `/list-property`       | Provider workspace and property management           |
| `/admin/sign-in`       | Private platform admin sign-in                       |
| `/admin/reviews`       | Provider, listing, report, and support review queues |
| `/admin/payments`      | Provider payout setup                                |
| `/faq` and `/support`  | Common questions and support                         |

The admin login is separate from regular student and provider accounts. Do not expose admin credentials or the Supabase secret key to users.

## Development checks

```bash
npm run lint
npm run build
```

GitHub Actions also runs dependency installation, lint, and a production build on pushes and pull requests to `main` and `feature/**`.

## Project documentation

The [`docs`](./docs) directory contains the product specification, architecture, database schema, design system, UX flows, and implementation notes. Start with [`docs/README.md`](./docs/README.md).

## Deployment

Deployments are managed through the hosting provider connected to this repository. Configure the required environment variables for the target branch in the hosting provider, and make sure its production or branch-deployment settings match the branch you intend to publish. A GitHub push alone does not guarantee that a specific branch is deployed to the production domain; verify the deploy status and URL in the hosting provider.

Before enabling public signups or payments, verify the database migrations, access policies, email delivery, payment configuration, and production environment settings.
