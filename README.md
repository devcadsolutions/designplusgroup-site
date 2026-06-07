<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f7ee046a-b26c-4e61-8ecb-6d9420c8e3c8

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Contact Form: Google Sheets + Email

The contact form can use one Google Apps Script Web App to do both:

- append inquiries to a Google Sheet
- send an email notification for each submission

### Files

- Frontend webhook submit: [index.html](./index.html)
- Apps Script template: [google-apps-script/contact-webhook.gs](./google-apps-script/contact-webhook.gs)
- Env var example: [.env.example](./.env.example)

### Setup

1. Create a Google Sheet for inquiries.
2. Open `Extensions > Apps Script` from that sheet, or create a standalone Apps Script project.
3. Paste in the contents of `google-apps-script/contact-webhook.gs`.
4. Update these constants in the script:
   - `SPREADSHEET_ID`
   - `SHEET_NAME`
   - `NOTIFICATION_EMAIL`
5. Deploy the script as a Web App:
   - `Execute as:` `Me`
   - `Who has access:` `Anyone`
6. Copy the Web App URL.
7. In `.env.local`, set:

   `VITE_GOOGLE_SHEETS_WEBHOOK="YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"`

8. Restart the dev server or rebuild the site.

### Notes

- If `VITE_GOOGLE_SHEETS_WEBHOOK` is empty, the form only simulates success locally.
- The form now submits as URL-encoded data, which is simpler and more reliable for Apps Script webhooks.
