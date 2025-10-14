# Robin Reverie: Fine Art Photography & Film Website

This repository contains the complete static file structure for a professional, high-end photography and videography business, "Robin Reverie." The design prioritizes a clean, elegant, and editorial aesthetic, built for performance and accessibility.

---

## Project Summary

This project comprises **11 complete HTML pages**, a dedicated `/css` directory, and a `/js` directory containing logic for interactive elements, accessibility improvements, and form handling.

**Key Features Implemented:**

1.  **Editorial Design:** High-impact hero sections, elegant typography (Inter & Playfair Display), and responsive, minimalist layouts.
2.  **Navigation & Structure:** Complete site structure including Home, Portfolio (with filtering), Films, About, Services, Blog, Contact, and supporting legal pages.
3.  **Image Optimization:** Use of `<picture>` and responsive `srcset` for performance (CSS in Step 4).
4.  **Accessibility (A11y):** ARIA roles, semantic HTML5, keyboard navigation support (especially on the FAQ accordion).
5.  **Interactive Blog:** Client-side filtering and search functionality on `/blog.html`.
6.  **Client Proofing Demo:** Password-protected gallery simulation with favoriting (using `localStorage`) and a warning about client-side security limitations.
7.  **Booking Form:** Detailed contact form with client-side validation, simulated availability check, and a payment/booking sandbox flow for future integration.

---

## How to Run the Project Locally

Since this is a collection of static HTML, CSS, and JavaScript files, you need a local web server to run it correctly (especially for file paths and AJAX calls like loading blocked dates).

1.  **Save all generated files** into a single project directory.
2.  **Recommended Method (Node.js required):**
    ```bash
    npx serve
    ```
    (This will typically start the server at `http://localhost:3000`)
3.  **Alternative Method (Python required):**
    ```bash
    python -m http.server 8000
    ```
    (Access the site at `http://localhost:8000`)

---

## Customization and Placeholder Replacement

To customize the site for a real business, replace the following placeholders across the files:

| Placeholder | Location | Replacement Needed |
| :--- | :--- | :--- |
| `Robin Reverie` | Across all files | Your business name. |
| **All Image Paths** | `/index.html`, `/portfolio.html`, etc. | Replace placeholder images (`/assets/img/`) with your high-quality, optimized JPEGs/WebPs. |
| `{{PROOFING_PASSWORD}}` | `/js/proofing.js` | The actual demo password you want to use. |
| `[REPLACE_WITH_CONTACT_EMAIL]` | `/privacy.html`, `/terms.html` | Your business contact email address. |

---

## Integration Guides for Production

### 1. Client Proofing Replacement

The client-side password logic in `/js/proofing.js` is **NOT secure** and should be replaced immediately for production use.

* **Option A: Managed Platform (Recommended)**
    * **Action:** Delete `/proofing.html`, `/css/proofing.css`, and `/js/proofing.js`.
    * **Implementation:** Replace the link in your navigation/footer that points to `/proofing.html` with the secure URL provided by your service (e.g., `https://client.pixieset.com/your-gallery`).

* **Option B: Server-Side Authentication**
    * **Action:** Implement a server route (`/proofing.html`) that checks a user's session or token *before* rendering the gallery HTML.
    * **Required Change:** The server must handle the password verification instead of the client-side JavaScript check.

### 2. Form Submission and Email Notifications

The form in `/contact.html` uses a placeholder endpoint: `POST /api/book`.

* **Server Implementation:** Create a server route that listens for POST requests to `/api/book`, processes the JSON data (e.g., saves to a database, sends an email via SendGrid/AWS SES), and returns a `HTTP 200` status.
* **No-Server Alternative (Formspree/Netlify):**
    1.  Change the `<form>` tag in `/contact.html` to:
        ```html
        <form id="booking-form" action="YOUR_FORM_ENDPOINT" method="POST">
        ```
    2.  Bypass the custom JavaScript handler in `/js/contact.js` by removing the `form.addEventListener('submit', ...)` block and letting the browser handle the submission directly.

### 3. Payment Integration (Stripe/PayPal/Razorpay)

The files are set up for a simulated payment using the `runSandboxCheckout` function in `/js/contact.js`.

* **Requirement:** Any real payment must be handled by a **secure server endpoint** to prevent front-end manipulation of prices.
* **Live Stripe Integration Flow:**
    1.  **Server:** Implement a secure route (`/api/create-checkout-session`) that receives the basic booking data, calculates the retainer amount, and calls the Stripe API to create a **Checkout Session**.
    2.  **Client (`/js/contact.js`):** Modify `redirectToStripeCheckout` to:
        * `POST` booking data to your server.
        * Receive the `sessionId` from your server response.
        * Use the Stripe.js library (`Stripe(pk_key).redirectToCheckout({ sessionId: ... })`) to securely redirect the user to the Stripe hosted payment page.

---

## Accessibility Notes & Known Limitations

| Area | Status | Limitation/Note |
| :--- | :--- | :--- |
| **Color Contrast** | High | Colors adhere to AA standards for text readability. |
| **Images** | High | All decorative and informative images include descriptive `alt` text. |
| **Navigation** | High | Full keyboard navigation and semantic `<nav>` and `<ul>` elements are used. |
| **FAQ Accordion** | High | Implements ARIA roles (`tablist`, `tab`, `tabpanel`) and keyboard navigation (Arrow keys, Home/End). |
| **Form Validation**| Medium | Client-side validation is accessible with `aria-describedby` and visible error messages, but server-side validation is still required. |
| **Proofing Auth** | Low | **Client-side password is NOT secure.** Do not use in production. |

---

## File Manifest

| Path | Description |
| :--- | :--- |
| **Root Files** | |
| `/index.html` | Homepage |
| `/about.html` | About Page |
| `/services.html` | Services/Pricing Page |
| `/portfolio.html` | Portfolio Gallery with Category Filtering |
| `/films.html` | Video/Film Showcase Page |
| `/blog.html` | Blog Listing Page with Search & Filter |
| `/post-fine-art-photography-explained.html` | Example Single Blog Post (with SEO/JSON-LD) |
| `/proofing.html` | Client Proofing Demo Page |
| `/contact.html` | Booking Inquiry Form |
| `/faq.html` | FAQ Page with Accessible Accordion |
| `/privacy.html` | Privacy Policy Template |
| `/terms.html` | Terms & Conditions Template |
| `/thanks.html` | Booking Confirmation/Summary Page |
| `/README.md` | This file |
| `/FINAL_CHECKLIST.txt` | Final testing file |
| **Assets & Data** | |
| `/assets/data/blockedDates.json` | Sample dates for availability check |
| `/assets/img/*` | Placeholder images for all sections (portfolio, blog, etc.) |
| **CSS Files** | |
| `/css/styles.css` | Global styles, typography, variables, responsive resets |
| `/css/portfolio.css` | Specific styles for Portfolio filtering/grid |
| `/css/proofing.css` | Specific styles for Proofing gallery/login |
| `/css/blog.css` | Specific styles for Blog listing/post |
| `/css/contact.css` | Specific styles for Contact form layout/validation |
| `/css/faq.css` | Specific styles for Accordion component |
| **JavaScript Files** | |
| `/js/main.js` | Global scripts (menu toggle, footer year update, scroll effects) |
| `/js/portfolio.js` | Portfolio filtering logic |
| `/js/proofing.js` | Proofing authentication, favoriting, and download simulation |
| `/js/blog.js` | Blog list search and filter logic |
| `/js/contact.js` | Form validation, availability check, and booking sandbox flow |
| `/js/faq.js` | Accessible accordion logic (ARIA & keyboard) |