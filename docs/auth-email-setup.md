# Signup confirmation email setup

This repository includes a branded Supabase confirmation email at:

`supabase/templates/confirmation.html`

The application already sends signup confirmation links to `/auth/confirm`, adopts the verified session, and redirects the user to the destination they originally requested. The dedicated `/auth/check-email` page explains the next step and allows a confirmation email to be resent.

## 1. Set the authentication redirect URLs

In the Supabase Dashboard, open **Authentication → URL Configuration**.

Set **Site URL** to the origin where the app is actually running:

- Local development: `http://localhost:3000`
- Deployed app: the public deployed origin, for example `https://your-app.example.com`

Then add every origin that may open an email link to the **Redirect URLs** allow
list:

- `http://localhost:3000/**`
- `http://127.0.0.1:3000/**`
- `https://your-app.example.com/**`

> **Important:** Supabase ignores a `redirect_to` value that is not in this
> allow list and silently falls back to the **Site URL**. That is why a
> confirmation email sent from a deployed app can open on
> `http://localhost:3000` instead of the deployed `/auth/confirm` page, and why
> the account is confirmed but the visitor never sees the verification step.
> A quick way to verify the setting is to request
> `/auth/v1/verify?token=bogus&type=signup&redirect_to=<your-app>/auth/confirm`
> and inspect the `Location` header: it should point at your app, not
> `localhost`.

Also set `NEXT_PUBLIC_SITE_URL` in the deployment environment to the same public
origin. The app uses it to build confirmation and recovery links; when it is
missing, the app falls back to the request origin, which may not be
allow-listed.

Then open **Authentication → Sign In / Providers → Email** and make sure
**Confirm email** is enabled. The application does not create an authenticated
session during signup and accepts a login session only when Supabase reports a
confirmed email address. If confirmation is disabled, Supabase may mark new
addresses as confirmed automatically, bypassing the verification email. The
signup flow now refuses to create an account in that state and displays a setup
error instead.

For local development, use:

- Site URL: `http://localhost:3000`
- Redirect URL allow list: `http://localhost:3000/**` and
  `http://127.0.0.1:3000/**`

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
4. In Supabase Dashboard, open **Authentication → SMTP Settings** (or the Authentication settings page) and enter those SMTP details.
5. Choose a sender name such as `Student Housing` and a sender address on the verified domain, for example `accounts@your-domain.com`.
6. Save the settings, configure the provider's SPF/DKIM records for your sending domain, and test with an email address that is not part of the Supabase organisation team.

Do not put SMTP credentials in the Next.js frontend, a `NEXT_PUBLIC_` variable, or Git. SMTP credentials belong only in the Supabase Dashboard/provider configuration.

## 4. Expected signup experience

1. User submits the signup form.
2. Supabase creates the account and sends the confirmation email. The app does
   not store any session returned during signup.
3. The app shows `/auth/check-email` with the address used and blocks sign-in
   until Supabase confirms the email.
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

## 6. Configure password recovery

The login page links to `/auth/forgot-password`. Supabase sends a recovery email
back to `/auth/recover`, where the application adopts the verified recovery
session and lets the user choose a new password.

In Supabase Dashboard, open **Authentication → URL Configuration** and make
sure the local and deployed app URLs are allowed:

- `http://localhost:3000/**`
- `https://your-public-domain.example/**`

In **Authentication → Email Templates → Reset Password**, keep the Supabase
confirmation link variable intact. Use the same verified SMTP sender configured
for signup emails.

Test with an account you control:

1. Select **Forgot your password?** from sign in and request a reset.
2. Open the link in the same browser where the app is running.
3. Confirm the reset page opens, the password can be changed, and the new
   password works at sign in.
4. Reopen the same link and confirm an expired or used link cannot reset the
   password again.

Never paste recovery URLs or tokens into support messages or source control.

## 7. Troubleshooting the signup link

**The email opens `http://localhost:3000` even though the app is deployed.**

The deployed origin is not in Supabase's Redirect URL allow list, so Supabase
replaced the requested `/auth/confirm` destination with the project Site URL.
Update **Authentication → URL Configuration** as described in section 1, then
send a fresh confirmation email. Existing links keep the old destination.

**The email link confirms the account, but the visitor lands on the homepage
and never sees a verification page.**

The link fell back to the app root. The app now forwards auth hashes from any
page to `/auth/confirm` (or `/auth/recover` for password resets), so the session
is adopted and the visitor is routed to onboarding. The allow-list fix above is
still required for links opened on another device.

**A newly created account can sign in without opening the email.**

Check **Authentication → Sign In / Providers → Email → Confirm email**. If it is
off, Supabase auto-confirms new accounts. The signup action now checks the
project auth settings and refuses to create accounts while auto-confirmation is
on, showing a setup error instead.

**The confirmation link says it expired.**

Links are single-use and time-limited. Open `/auth/check-email`, enter the same
address, and request a new confirmation email. Do not create the account again.
