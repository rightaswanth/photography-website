### STEP 10: Contact & Booking Form (`/contact.html`)

This final step completes the site with an interactive contact and booking form that includes validation, availability checking, and payment simulation.

#### 📅 Availability Check

The date input in the form checks against the `blockedDates` array in `/assets/data/blockedDates.json`.

* **To Test:** Try submitting one of the dates listed in that file (e.g., `2026-06-12`) to see the "Unavailable" message.

#### 📧 Email / Booking Data Handling

The data collected is sent to a placeholder endpoint `BOOKING_API_ENDPOINT = '/api/book'`.

* **Production Implementation (Email Notification):** This endpoint must be implemented server-side to receive the POST request, process the data, and send an email notification to the photographer.
* **Easy Alternatives (No Server Required):**
    * **Formspree:** Replace the `fetch` API call with a direct `POST` to a Formspree endpoint.
    * **Netlify Forms / Vercel Forms:** Use the platform's built-in form handling by setting the `<form>` tag attributes (e.g., `data-netlify="true"`) and removing the custom JavaScript `fetch` handler.

#### 💳 Payment Integration (Stripe Simulation)

The payment flow is designed for future Stripe integration but runs in a sandbox mode for the demo:

* **Demo Behavior:** Since the placeholder variables (`STRIPE_PUBLIC_KEY`, etc.) are not real keys, the form calls `runSandboxCheckout()`, which simulates a successful payment before sending the booking data to the placeholder API.
* **Live Integration:** To enable live payment, you would need to:
    1.  Replace `{{STRIPE_PUBLIC_KEY}}` with your actual Stripe Publishable Key.
    2.  Implement the server-side endpoint (`{{SERVER_CHECKOUT_ENDPOINT}}`) to use the Stripe API, create a **Checkout Session**, and return the session ID to the client.
    3.  Uncomment the `<script src="https://js.stripe.com/v3/"></script>` tag in `/contact.html`.
    4.  Update the JavaScript to use `stripe.redirectToCheckout` with the session ID from your server.