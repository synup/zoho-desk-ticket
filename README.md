# Zoho Desk Support Widget

An **embeddable support widget** that adds a floating feedback bubble to any website or app. Users click the bubble, fill a form (title, description, images, optional video), and submit a **Zoho Desk** ticket. The widget automatically captures console logs, network activity, JS errors, and environment info and sends them with the ticket.

Works in **any frontend**: React, Vue, Angular, plain HTML, or any framework. One script tag is enough to get started.

---

## What you get

- **Floating bubble** – Fixed bottom-right; opens a modal on click.
- **Ticket form** – Title, description, image/video uploads.
- **Automatic context** – Console logs, network requests, errors, and environment data are bundled and attached to the ticket.
- **Customer mapping** – Optional customer (name/email) so tickets are associated with the right contact in Zoho Desk.
- **Shadow DOM** – Styles are isolated; no conflicts with your app's CSS.

---

## Quick start (widget only)

To drop the widget into **any** page with zero config:

1. **Host the built script**  
   Use the file from this repo: `dist/ticket-widget.js` (build it once with `npm run build` in this repo, then serve it from your CDN or app).

2. **Add one script tag:**

   ```html
   <script src="https://your-domain.com/path/to/ticket-widget.js"></script>
   ```

   That's it. The widget auto-initializes and uses the **default API** (`https://zoho-desk-api.dev5-1.stg.synup.com`) for ticket submission. No customer context is sent unless you pass it (see options below).

---

## Widget options

All options are **optional**. You can use the widget with no config, or pass only what you need.

### 1. Script only (no options)

```html
<script src="./dist/ticket-widget.js"></script>
```

- Uses default API base: `https://zoho-desk-api.dev5-1.stg.synup.com`
- No customer data; backend can use its own fallback contact if configured.

### 2. Override API base URL via query string (HTML-only usage)

For static HTML or when you don't want to write any JS, you can pass options via the script `src` query string:

```html
<script src="./dist/ticket-widget.js?apiBaseUrl=https://your-api.example.com"></script>
```

- The widget reads `apiBaseUrl` from the query string and uses it for all requests.
- Other options (like `customer`) remain unset.

### 3. Pass customer (name + email) via query string

```html
<script src="./dist/ticket-widget.js?customerName=Jane%20Doe&customerEmail=jane@example.com"></script>
```

Supported query parameters:

- `customerName` or `customer_name`
- `customerEmail` or `customer_email`

Either can be omitted; if only email is provided, the server can still map/create the contact.

You can also combine API base + customer:

```html
<script src="./dist/ticket-widget.js?apiBaseUrl=http://localhost:3001&customerName=Faiz%20Test&customerEmail=faiz@test.com"></script>
```

### 4. Override API base URL via `TicketWidget.init`

If your tickets go to a **different backend** (e.g. your own server):

```html
<script src="./dist/ticket-widget.js"></script>
<script>
  TicketWidget.init({
    apiBaseUrl: "https://your-api.example.com"
  });
</script>
```

### 5. Pass customer (name + email) via `TicketWidget.init`

So the ticket is linked to the right contact in Zoho (existing or created by the server):

```html
<script src="./dist/ticket-widget.js"></script>
<script>
  TicketWidget.init({
    customer: {
      name: "Jane Doe",
      email: "jane@example.com"
    }
  });
</script>
```

### 6. Both API base and customer via `TicketWidget.init`

```html
<script src="./dist/ticket-widget.js"></script>
<script>
  TicketWidget.init({
    apiBaseUrl: "http://localhost:3001",
    customer: {
      name: "Faiz Test",
      email: "faiz@test.com"
    }
  });
</script>
```

**Important:**

- Call `TicketWidget.init(...)` in a script that runs **after** the widget script.
- If you both:
  - pass query parameters in the `src` URL, **and**
  - call `TicketWidget.init({ ... })`,
  then `TicketWidget.init({ ... })` takes precedence and overrides the auto-init config derived from the query string.
- If you don't call `init`, the widget still mounts automatically:
  - with options from the script `src` query (if present), otherwise
  - with default settings (default API, no customer).

---

## Option reference

| Option         | Type     | Required | Default | Description |
|----------------|----------|----------|---------|-------------|
| `apiBaseUrl`   | `string` | No       | `https://zoho-desk-api.dev5-1.stg.synup.com` | Base URL of the ticket API (no trailing slash). All requests go to `{apiBaseUrl}/api/zoho/tickets`. Can be passed via query param (`?apiBaseUrl=...`) or `TicketWidget.init({ apiBaseUrl })`. |
| `customer`     | `object` | No       | —       | Customer context sent with the ticket. Backend uses it to find or create a Zoho contact. Only available via `TicketWidget.init({ customer })`. |
| `customer.name`| `string` | No       | —       | Display name (e.g. for new contacts). |
| `customer.email` | `string` | No    | —       | Email; used to look up or create the Zoho contact. |

---

## Using the widget in your project

### Plain HTML / any framework

1. Copy or host `ticket-widget.js` (from `dist/` after building).
2. Add the script tag (and optional `TicketWidget.init({ ... })` as above).
3. Ensure your backend (or the default one) is running and accepts `POST /api/zoho/tickets` (see [Server](#server) below).

### React / Vue / Angular / etc.

Same as above: include the script in your `index.html` or root template. The widget runs in an iframe-like way (Shadow DOM) and does not require your app to be React. You can also load the script dynamically:

```javascript
const script = document.createElement('script');
script.src = 'https://your-cdn.com/ticket-widget.js';
script.onload = () => {
  TicketWidget.init({ apiBaseUrl: 'https://api.example.com', customer: { name: 'User', email: 'user@example.com' } });
};
document.body.appendChild(script);
```

### Build the widget (developers working in this repo)

```bash
npm install
npm run build
```

Output: `dist/ticket-widget.js`. Serve this file from your app or CDN.

---

## Server (Zoho ticket API)

The widget sends tickets to a **backend** that talks to Zoho Desk (OAuth, create ticket, attach files). You can:

- Use the **default** API: `https://zoho-desk-api.dev5-1.stg.synup.com` (no server setup in your project), or  
- Run your **own** server using the code in this repo (see below).

### Run the server (this repo)

**1. Environment**

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and set:

| Variable | Required | Description |
|----------|----------|-------------|
| `ZOHO_REFRESH_TOKEN` | Yes | OAuth refresh token from your Zoho app. |
| `ZOHO_CLIENT_ID`     | Yes | OAuth client ID. |
| `ZOHO_CLIENT_SECRET` | Yes | OAuth client secret. |
| `ZOHO_ORG_ID`        | Yes | Zoho Desk organization ID. |
| `ZOHO_DEPARTMENT_ID` | No  | Department for new tickets (if required). |
| `ZOHO_CONTACT_ID`    | No  | Fallback contact when widget doesn't send a customer or lookup fails. |

**2. Run locally**

```bash
cd server
npm install
npm start
```

Server listens on **port 3001** (or set `PORT`).

**3. Run with Docker (from repo root)**

```bash
docker build -t zoho-server .
docker run -p 3001:3001 --env-file server/.env zoho-server
```

**4. Endpoints**

- `POST /api/zoho/token` – Returns a fresh access token (for debugging).
- `POST /api/zoho/tickets` – Creates a Zoho ticket and attaches files.  
  - **Body:** `multipart/form-data` with `subject`, `description`, optional `customer` (JSON string), and `files`.  
  - **Response:** `{ ticketId, message }`.

More detail: [server/README.md](server/README.md).

---

## Testing the widget locally

1. **Start the server** (if using your own backend):

   ```bash
   cd server && npm install && npm start
   ```

2. **Build the widget** (in repo root):

   ```bash
   npm run build
   ```

3. **Serve the page** that includes the widget. For example, from repo root:

   ```bash
   npm run dev
   ```

   Then open `http://localhost:5173/test.html` (or your own page that includes `ticket-widget.js`).

4. **Optional:** In `test.html` you can call `TicketWidget.init({ apiBaseUrl: "http://localhost:3001", customer: { name: "...", email: "..." } })` to point to your local server and pass a customer.

---

## Project structure

| Path | Purpose |
|------|---------|
| `dist/ticket-widget.js` | Built widget bundle (script to embed). |
| `src/widget.tsx` | Widget entry: mount, auto-init, `TicketWidget.init`. |
| `src/App.tsx` | Minimal shell: just `FeedbackBubble` with config. |
| `src/components/FeedbackBubble.tsx` | Floating bubble + modal. |
| `src/components/TicketModal.tsx` | Form and submit logic. |
| `src/utils/submitTicket.ts` | API call, default `apiBaseUrl`, customer in form. |
| `src/utils/*Logger.ts` | Console, network, error, environment loggers. |
| `server/` | Zoho proxy (Express): token, tickets, contacts, attachments. |
| `test.html` | Local test page for the widget. |

---

## Tech stack

- **Widget:** React 19, TypeScript, Vite (built as a single IIFE script).
- **Server:** Node, Express, multer; Zoho Desk APIs (OAuth, tickets, contacts, attachments).

---

## Summary

- **Zero config:** `<script src="ticket-widget.js"></script>` → widget works with default API.
- **Optional config:** `TicketWidget.init({ apiBaseUrl?, customer? })` → override API and/or pass customer.
- **Default API:** `https://zoho-desk-api.dev5-1.stg.synup.com`.
- **Server:** Optional; run `server/` when you want your own Zoho proxy (see [Server](#server) and [server/README.md](server/README.md)).

Any frontend can embed the script and optionally call `init`; no framework lock-in.
