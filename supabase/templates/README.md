# Supabase Auth email setup

This repository contains the HTML source for the **Confirm signup** email:

- File: `supabase/templates/confirmation.html`
- Recommended subject: **Confirm your Student Housing account**

## Apply the template to the hosted Supabase project

The HTML file in this repository does not automatically replace the hosted project's email template.

1. Open the Supabase project dashboard.
2. Go to **Authentication → Emails → Templates**.
3. Open **Confirm signup**.
4. Set the subject to `Confirm your Student Housing account`.
5. Replace the message body with the contents of `confirmation.html`.
6. Save the template.
7. Send a test signup to an address you control and check the rendered email on desktop and mobile.

The template uses Supabase's `{{ .ConfirmationURL }}` variable. Keep this variable intact.

## Configure redirect URLs

In **Authentication → URL Configuration**:

- Set **Site URL** to the deployed app origin, for example `https://YOUR-DOMAIN` (do not include `/login`).
- Add the deployed app origin and callback routes to **Redirect URLs**, for example `https://YOUR-DOMAIN/**`. Keep `http://localhost:3000/**` for local desktop development only.

Do not use `localhost` as the production Site URL. A confirmation link opened on a phone cannot reach the developer's computer through `localhost`.

The application constructs confirmation and recovery redirects using `NEXT_PUBLIC_SITE_URL`. For each deployed environment, set it to that deployment's HTTPS origin in the hosting provider's environment settings, such as `https://YOUR-DOMAIN` (not `https://YOUR-DOMAIN/login`). Production sign-up and password recovery fail with a configuration message rather than sending a localhost link if this value is missing or invalid.

The application reads the Supabase project settings using these exact variable names:

- `NEXT_PUBLIC_SUPABASE_URL`: the Project URL from the same Supabase project.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: that project's publishable key.

Set both in the hosting provider's build environment, and make sure they refer to the Supabase project where you configured the Site URL and Redirect URLs. Next.js inlines `NEXT_PUBLIC_` variables during the build, so redeploy after changing them.

## Configure real email delivery before public launch

Supabase's built-in email service is intended for development/testing. Its documented restrictions include sending only to pre-authorized project-team addresses, limited sending volume, and no delivery SLA.

For real users, configure a custom SMTP provider in **Authentication → Emails → SMTP Settings**. Supabase documents compatible providers including Resend, AWS SES, Postmark, SendGrid, ZeptoMail, and Brevo.

Recommended production checklist:

- Verify a domain you control with the email provider.
- Configure the provider's SPF and DKIM DNS records; publish a DMARC policy.
- Use a sender address on that verified domain, such as `no-reply@YOUR-DOMAIN`.
- Add the SMTP host, port, username, and password in Supabase. Never commit SMTP credentials to this repository or expose them as `NEXT_PUBLIC_` variables.
- Keep email confirmations enabled.
- Test delivery to Gmail and at least one other mailbox provider.
- Check the provider's delivery, bounce, and complaint logs.

A successful signup API response means Supabase accepted the signup request; it does not prove that a message reached the recipient's inbox. Even with custom SMTP, inbox placement depends on the sending domain's reputation, DNS authentication, recipient mailbox rules, and the provider.

## Template content guidance

Keep authentication email short and transactional. Avoid promotional taglines, multiple calls to action, large images, and unnecessary user-provided data. Use the same verified sender identity consistently.
