# VLI Static Enquiry Worker

This Worker receives validated enquiry submissions from the GitHub Pages site at `https://velocity-lab.com`.

## Required encrypted secrets

Configure these values in **Cloudflare Worker → Settings → Variables and Secrets**. Do not commit them.

| Name | Value |
| --- | --- |
| `TURNSTILE_SECRET` | The secret for the **VLI Static Enquiry Forms** Turnstile widget. |
| `RESEND_API_KEY` | A Resend API key created after `velocity-lab.com` is verified. |
| `NOTIFICATION_EMAIL` | The inbox that should receive alerts, for example `info@velocity-lab.com`. |
| `RESEND_FROM` | A verified sender, for example `VLI Enquiries <enquiries@velocity-lab.com>`. |

## Deployment contract

The Worker must bind D1 as `ENQUIRIES_DB`, deploy the source in `src/index.js`, and receive a custom domain at `api.velocity-lab.com`. The public form posts only to `https://api.velocity-lab.com/enquiries`.
