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

## Widget options 

### Option 1 – Just the script tag (no settings)

Use this when you simply want the widget to appear and send tickets using the default Zoho Desk connection.

```html
<script src="https://zoho-desk.dev5-1.stg.synup.com/ticket-widget.js" defer></script>
```

- Uses the **default Zoho Desk connection** that is already configured.
- No customer name/email is sent unless you choose one of the next options.
- By default, the modal also shows **Name** and **Email** inputs so users can enter their details.

---

### Option 2 – Add settings in the script URL (query parameters)

This is still copy‑paste friendly: you only change the **URL** of the script tag.

You can send the customer’s name and email like this:

```html
<script
  src="https://zoho-desk.dev5-1.stg.synup.com/ticket-widget.js?customerName=Jane%20Doe&customerEmail=jane@example.com"
  defer
></script>
```

Supported query parameters:

- `customerName` or `customer_name`
- `customerEmail` or `customer_email`
- `hideCustomerFields=true` (hides the Name/Email inputs in the modal)

You can also point the widget to a different API base URL (for advanced setups):

```html
<script
  src="https://zoho-desk.dev5-1.stg.synup.com/ticket-widget.js?apiBaseUrl=https://your-api.example.com"
  defer
></script>
```

You can combine them:

```html
<script
  src="https://zoho-desk.dev5-1.stg.synup.com/ticket-widget.js?apiBaseUrl=https://your-api.example.com&customerName=Jane%20Doe&customerEmail=jane@example.com&hideCustomerFields=true"
  defer
></script>
```

---

### Option 3 – Use JavaScript (React, Vue, Angular, or any app)

1. **Add the script once** in your main HTML (e.g. `public/index.html`):

   ```html
   <script src="https://zoho-desk.dev5-1.stg.synup.com/ticket-widget.js" defer></script>
   ```

2. **Call `TicketWidget.init` from your app** when you're ready (e.g. after login or in your root component):

   ```javascript
   window.TicketWidget.init({
     customer: {
       name: 'User Name',   // from your app
       email: 'user@example.com'
     }
   });
   ```

   Replace `name` and `email` with values from your own user/auth object. You can add `apiBaseUrl` if you use a custom API. Add conditions, `useEffect`, or framework-specific logic as needed.
   
   If you want to hide the Name/Email inputs in the modal UI, pass `hideCustomerFields=true` via the script URL query parameter.

---

