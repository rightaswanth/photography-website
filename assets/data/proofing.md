### STEP 7: Client Proofing Gallery (`/proofing.html`)

This page demonstrates a client proofing interface with **client-side password protection**, favoriting, and simulated batch download.

#### ⚠️ SECURITY WARNING: Password Protection

The password protection implemented in `/js/proofing.js` is for **DEMO PURPOSES ONLY**. **It is NOT secure** as the JavaScript code and the galleries are still publicly accessible to anyone who views the page source.

* **Demo Password:** `{{PROOFING_PASSWORD}}` (Set in `proofing.js`)

#### 🔄 Production Implementation (Replacing the Demo)

To create a secure, production-ready proofing gallery, you must replace the client-side authentication with one of the following methods:

1.  **Recommended (Managed Service):** Use a professional platform like **ShootProof, Pixieset, or Pic-Time**. This involves embedding an iframe or linking directly to the service's gallery URL.
    * *Minimal API Contract:* None needed; you simply link out or embed.

2.  **Advanced (Server-Side Authentication):** Implement server-side logic (e.g., Node.js, PHP, Python) that checks a user database or token before rendering the gallery HTML.
    * *Minimal API Contract Expected:* The frontend would make a POST request to a protected endpoint:
        ```json
        POST /api/gallery/auth
        { "password": "user_input" }
        // Server response on success: HTTP 200 + { "success": true, "token": "..." }
        ```

#### 💾 Download Simulation

The "Download Selected" button in `proofing.js` is a **simulation** due to browser security restrictions:

* **Client-Side Limitation:** JavaScript cannot directly create a ZIP file of external/local resources.
* **Demo Behavior:** It sequentially triggers individual file downloads for the favorited items after a user confirmation, adding a small timeout between downloads to avoid browser warnings.
* **Production Solution:** A production system must send the selected image IDs to a **server-side endpoint** which then zips the files and returns the ZIP file in the HTTP response.
    * *Example Server-Side Endpoint:*
        ```json
        POST /api/gallery/download-zip
        { "galleryId": "smith-wedding-proofs", "imageIds": ["img-001", "img-005", ...]}
        // Server response: HTTP 200 with Content-Type: application/zip
        ```