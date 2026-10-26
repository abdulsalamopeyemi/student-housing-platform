# Signup confirmation email setup

This repository includes a branded Supabase confirmation email at:

`supabase/templates/confirmation.html`

The application already sends signup confirmation links to `/auth/confirm`, adopts the verified session, and redirects the user to the destination they originally requested. The dedicated `/auth/check-email` page explains the next step and allows a confirmation email to be resent.

## 1. Set the authentication redirect URLs

In the Supabase Dashboard, open **Authentication → URL Configuration**.

For local development, use:

- Site URL: `http://localhost:3000`
- Redirect URL allow list: `http://localhost:3000/**`

When the application is deployed, set the Site URL to the real public application URL and add that domain to the Redirect URL allow list. Keep localhost in the allow list for local development.

A confirmation link opened on a phone cannot reach `localhost:3000` on your laptop. Use the deployed application URL when testing email confirmation on another device.

## 2. Install the branded confirmation template

In Supabase Dashboard, open **Authentication → Email Templates → Confirm signup**.

Set the subject to:

`Confirm your Student Housing account`

Copy the complete HTML from `supabase/templates/confirmation.html` into the template editor and save it.

Keep the Supabase template variable `{{ .ConfirmationURL }}` unchanged. It contains the secure confirmation link and the redirect destination supplied by the application.

## 3. Configure real email delivery for public signups

Supabase's built-in SMTP service is for development/testing. It only sends to authorised team addresses and is heavily rate-limited. It is not suitable for sending confirmation messages to every student or property provider.

To send to arbitrary users:

1. Create an account with an SMTP email provider (for example, Resend, Brevo, Postmark or another SMTP service).
2. Verify a sending domain that you own with that provider.
3. Obtain the SMTP host, port, username and password from that provider.
4. In Supabase Dashboard, open **Project Settings → Authentication → SMTP Settings** (the dashboard label may vary) and enter those SMTP details.
5. Choose a sender name such as `Student Housing` and a sender address on the verified domain, for example `accounts@your-domain.com`.
6. Save the settings and test with an email address that is not part of the Supabase organisation team.

Do not put SMTP credentials in the Next.js frontend, a `NEXT_PUBLIC_` variable, or Git. SMTP credentials belong only in the Supabase Dashboard/provider configuration.

## 4. Expected signup experience

1. User submits the signup form.
2. Supabase creates the account and sends the confirmation email.
3. The app shows `/auth/check-email` with the address used.
4. User selects **Confirm my email** in the message.
5. Supabase verifies the address and redirects to `/auth/confirm`.
6. The app adopts the verified session and sends the user to the correct destination (student account or provider onboarding).
7. If the message does not arrive, the user can request another one from the check-email page.

## 5. Testing checklist

- Test one new email address.
- Confirm the message has the Student Housing branding and the correct confirmation button.
- Click the link on the same computer running the local app.
- Confirm the user is signed in and lands in the intended workspace.
- Test the resend button and verify it uses the same redirect destination.
- Test an address outside the Supabase team after custom SMTP is configured.
