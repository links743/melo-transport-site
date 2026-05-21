# Melo Transport Services Website

A full-stack website for Melo Transport Services, Kimbe, West New Britain, PNG.

**Stack:** React 18 · Tailwind CSS · Firebase (Auth + Firestore + Storage) · Vite · Netlify

---

## Features
- Public site: Hero, Services, About, Notices, Contact
- 3-admin login system via Firebase Auth
- Admins can post/edit/delete notices and schedules (with optional images)
- Notices appear live on the public site without a page reload
- WhatsApp enquiry form
- "Book Ticket" button (placeholder — ready to wire up to booking system later)
- Fully mobile responsive

---

## ─── STEP 1 · Set Up Firebase ──────────────────────────────────────────

1. Go to https://console.firebase.google.com and sign in with a Google account.

2. Click **"Add project"** → name it `melo-transport` → click through the setup.

3. Once in the project dashboard, click **"</>  Web"** to add a web app.
   - App nickname: `melo-transport-web`
   - Click **Register app**
   - Copy the `firebaseConfig` values shown — you'll need them in Step 3.

4. In the left sidebar, enable the following services:

   **Authentication:**
   - Build → Authentication → Get started
   - Sign-in method tab → Enable **Email/Password**

   **Firestore Database:**
   - Build → Firestore Database → Create database
   - Choose **Production mode** → select a region close to PNG (e.g. `asia-southeast1`)
   - After creation, go to **Rules** tab and paste:
     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         // Public can read notices
         match /notices/{doc} {
           allow read: if true;
           allow write: if request.auth != null;
         }
         // Bookings — future use
         match /bookings/{doc} {
           allow read: if request.auth != null;
           allow create: if true;
         }
       }
     }
     ```
   - Click **Publish**

   **Storage:**
   - Build → Storage → Get started → Production mode → Done
   - Go to **Rules** tab and paste:
     ```
     rules_version = '2';
     service firebase.storage {
       match /b/{bucket}/o {
         match /{allPaths=**} {
           allow read: if true;
           allow write: if request.auth != null;
         }
       }
     }
     ```
   - Click **Publish**

---

## ─── STEP 2 · Add the 3 Admin Users ───────────────────────────────────

In the Firebase Console:
1. Go to **Build → Authentication → Users tab**
2. Click **"Add user"** for each admin:

   | Email                          | Password (you choose) |
   |--------------------------------|-----------------------|
   | admin1@melotransport.com       | (strong password)     |
   | admin2@melotransport.com       | (strong password)     |
   | admin3@melotransport.com       | (strong password)     |

3. Share each email + password with the relevant admin staff member.
4. Admins log in at: `https://yoursite.com/admin`

> **Tip:** Use real email addresses if you want password-reset to work (Firebase can send reset emails automatically).

---

## ─── STEP 3 · Configure Environment Variables ──────────────────────────

1. In the project root, copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in the Firebase values from Step 1:
   ```
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=melo-transport.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=melo-transport
   VITE_FIREBASE_STORAGE_BUCKET=melo-transport.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

> ⚠️  Never commit `.env` to GitHub. It is already in `.gitignore`.

---

## ─── STEP 4 · Run Locally ──────────────────────────────────────────────

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open http://localhost:5173 in your browser.
Admin portal: http://localhost:5173/admin

---

## ─── STEP 5 · Deploy to Netlify ───────────────────────────────────────

### Option A — Netlify Drop (fastest)

1. Run `npm run build` — this creates a `dist/` folder.
2. Go to https://app.netlify.com/drop
3. Drag the entire `dist/` folder onto the page.
4. Done! You get a free URL like `melo-transport.netlify.app`.

**Important:** After the first drop deploy, you need to add your `.env` values
as Netlify Environment Variables (see below), then redeploy.

### Option B — Connect GitHub (recommended for ongoing updates)

1. Push this project to a GitHub repo (keep `.env` out of it).
2. Go to https://app.netlify.com → "Add new site" → "Import an existing project"
3. Connect your GitHub account → select the repo.
4. Build settings (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy site**.

### Add Environment Variables to Netlify

After deployment:
1. In Netlify: Site → **Site configuration** → **Environment variables**
2. Click **Add a variable** for each one:
   ```
   VITE_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID
   ```
3. Go to **Deploys** → **Trigger deploy** → **Deploy site** to apply the vars.

### Add Your Custom Domain (optional)
- Netlify: Site → **Domain management** → **Add custom domain**
- Enter e.g. `melotransport.com.pg` and follow the DNS instructions.

---

## ─── Adding Real Photos ────────────────────────────────────────────────

The site has placeholder image areas for:
- **Hero banner**: `src/components/Hero.jsx` — look for the comment `HERO BACKGROUND IMAGE`
- **Marine service card**: `src/components/Services.jsx` — look for `REPLACE THIS DIV WITH AN <img>`
- **Notices images**: Uploaded directly by admins via the admin dashboard

To add a photo:
1. Upload it to Firebase Storage or any image host.
2. Copy the public URL.
3. Replace the placeholder div in the component with:
   ```jsx
   <img src="YOUR_URL" alt="MV Kaka Cruz at Kimbe wharf" className="..." />
   ```

---

## ─── Future: Online Booking ───────────────────────────────────────────

The database schema for bookings is already defined in `src/firebase.js`.
The `bookings` Firestore collection and Firestore Security Rules are ready.

To activate online booking:
1. Build a `BookingForm` component (passenger name, phone, route, date, seats).
2. Write to `db/bookings/{id}` on form submission.
3. Build an admin bookings view in `AdminDashboard.jsx`.
4. Enable the "Book Ticket" button in `Hero.jsx` and `Navbar.jsx`.

---

## Project Structure

```
melo-transport/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── netlify.toml          ← SPA routing fix for Netlify
├── .env.example          ← Copy to .env and fill in Firebase values
├── package.json
└── src/
    ├── main.jsx          ← React entry point
    ├── App.jsx           ← Routing + auth state
    ├── index.css         ← Tailwind + global styles
    ├── firebase.js       ← Firebase init + collection names
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Hero.jsx      ← Hero + "Book Ticket" placeholder modal
    │   ├── Services.jsx  ← Marine, Earthmoving, Haulage
    │   ├── About.jsx
    │   ├── Notices.jsx   ← Reads from Firestore in real-time
    │   ├── Contact.jsx   ← WhatsApp CTA + enquiry form
    │   └── Footer.jsx
    └── admin/
        ├── AdminLogin.jsx      ← Email/password login
        ├── AdminDashboard.jsx  ← List + delete notices
        └── PostForm.jsx        ← Create / edit a notice (with image upload)
```
