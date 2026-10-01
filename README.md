# Haven - Caring Memory & Assistive Companion

> **A gentle, accessible companion for elderly individuals and patients living with dementia, Alzheimer's, Parkinson's, stroke recovery, and mild cognitive impairment (MCI).**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://haven-arash15.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/arashx1/haven)
[![RevenueCat SDK](https://img.shields.io/badge/RevenueCat%20SDK-Integrated-e11d48?style=for-the-badge)](https://www.revenuecat.com/)
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 🌐 Live Deployment
- **Production URL:** [https://haven-arash15.vercel.app](https://haven-arash15.vercel.app)
- **GitHub Repository:** [https://github.com/arashx1/haven](https://github.com/arashx1/haven)

---

## 💡 Mission & Inspiration
Memory impairment, whether caused by dementia, Alzheimer’s, or stroke, can create severe daily disorientation and stress. Existing reminder apps are cluttered with small text, complex menus, and jarring alerts that trigger anxiety.

**Haven** is built from the ground up with a **calming, dementia-friendly aesthetic**:
- **Zero sensory overwhelm:** Warm cream and honey tones with high-contrast, tactile controls.
- **Multilingual & accessible:** 7 global & regional languages with real-time **A− / A+** font scaling.
- **Dignified independence:** Patients manage their day with gentle encouragement while family caregivers coordinate care in the background.

---

## 👑 RevenueCat SDK Integration (Shipathon 2026)

- **RevenueCat Project ID:** `044658bf`

Haven implements the official **RevenueCat Web SDK (`@revenuecat/purchases-js`)** for cross-platform subscription management, entitlements, and in-app checkout.

### Key Integration Points:
1. **SDK Initialization & User Binding (`src/lib/revenuecat.ts`):**
   ```ts
   import { Purchases } from '@revenuecat/purchases-js';
   Purchases.configure(RC_API_KEY, userId);
   ```
   Binds the authenticated user's session directly to RevenueCat's customer database.

2. **Entitlements Gating (`src/hooks/useSubscription.ts`):**
   - Free users have access to basic daily routines and essential tools.
   - **`haven_plus` Entitlement:** Unlocks all 10 therapeutic mind games, unlimited photo albums, and full caregiver dashboard analytics.
   - **`haven_family` Entitlement:** Unlocks multi-caregiver syncing (up to 5 family members), shared memory albums, and emergency alert dispatch.

3. **In-App Paywall & 30-Day Free Trial (`src/components/PaywallModal.tsx`):**
   - Monthly and Annual billing toggles with real-time savings calculations.
   - Transparent trial messaging: *"Free for 30 days, cancel anytime with zero charge today."*
   - Interactive payment checkout with Credit/Debit card formatting and Apple Pay/Google Pay integration.
   - One-tap **"Auto-Fill Demo Card"** (`4242 •••• 4242`) for hackathon judge evaluation.

4. **New User Free Trial Welcome Modal (`src/components/TrialWelcomeModal.tsx`):**
   - Welcomes new users with an automatic 30-day trial gift upon their first login.
   - Includes automatic expiration logic after 30 days.

---

## 🌟 Core Features

### 1. My Day & Adaptive Care Hub
- **Timeline Reminders:** Morning, Afternoon, and Evening schedules with clear pill illustrations.
- **Disease-Specific Adaptive Care Modules:**
  - **Parkinson's Disease:** Motor timing, medication checkpoints, hydration counter, and 2-minute gentle stretches.
  - **Post-Stroke & Aphasia:** One-tap visual communication board with speech read-aloud via the Web Speech API.
  - **Mild Cognitive Impairment (MCI):** Focus checklists and daily memory anchoring.
  - **Healthy Aging & Senior Living:** Warm affirmations and speed-dial emergency contacts.

### 2. 10 Therapeutic Cognitive & Calming Mini-Games
1. **Picture Matching:** Classic memory exercise with gentle tactile cards.
2. **Familiar Faces Quiz:** Joyful social recognition using uploaded family photos.
3. **Steady Rhythm Tap:** Motor control and tremor-friendly tap rhythm.
4. **Peaceful Bubble Catch:** Hand-eye coordination and calming sensory touch.
5. **Word & Object Connect:** Speech recovery and cognitive association.
6. **Sentence Companion:** Language reconstruction for aphasia recovery.
7. **Daily Item Sorting:** Practical focus and organization skills.
8. **Morning Routine Order:** Daily sequencing and confidence building.
9. **Zen Flower Bloom:** Relaxing interactive art and sensory reward.
10. **Serene Breathing Circle:** Mindful 4-4 pacing for agitation and sundowning reduction.

### 3. Family Memory Album & People Directory
- High-contrast memory milestone cards with voice narration reading stories aloud to patients.
- Contact cards with relationship tags ("Your Daughter") and one-tap emergency calling.

### 4. Caregiver Dashboard & Analytics
- Family members can monitor medicine adherence, view completion rates, upload new family memories, and adjust care conditions remotely.

---

## 🔒 Security & Privacy Architecture

Security and patient dignity are core priorities in Haven's design:

- **Zero Secret Exposure:** Only public client keys are utilized on the front-end (`VITE_SUPABASE_ANON_KEY`, `VITE_REVENUECAT_API_KEY`). All backend database mutations are constrained by **Supabase Row Level Security (RLS)**.
- **Row Level Security (RLS):** Policies ensure patients and caregivers can only query or update records associated with their authenticated `user_id`.
- **Safe Evaluation Environment:** The checkout interface operates with SSL encryption and safe card tokenization. No real financial credentials are captured or stored in demo tracks.
- **Data Protection:** Local storage caching complies with European GDPR and global cookie consent standards via the built-in [CookieBanner](src/components/CookieBanner.tsx).

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 (TypeScript) |
| **Build Tool & Dev Server** | Vite 5 |
| **Styling** | Vanilla CSS Tokens + Tailwind CSS |
| **In-App Purchases & Subscriptions** | RevenueCat Web SDK (`@revenuecat/purchases-js`) |
| **Backend & Cloud Database** | Supabase (PostgreSQL, Auth, RLS) |
| **Hosting & CI/CD** | Vercel |
| **Internationalization (i18n)** | `react-i18next` & `i18next` (7 Languages) |
| **Audio Synthesizer** | Native Web Speech API & Web Audio API |
| **Icons** | Lucide React |

---

## 🚀 Local Development Setup

Follow these steps to run Haven locally from scratch:

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** / **pnpm**
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/arashx1/haven.git
cd haven
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Your `.env` should look like this:
```env
# Supabase Cloud Database & Auth
VITE_SUPABASE_URL=https://ulyddhlseivodhqotmvv.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_ruHGaczwpePZkFoTsL4bxA__nKrDQP_

# RevenueCat Public SDK API Key
VITE_REVENUECAT_API_KEY=test_oGAXUiphlJBxIXxVkUvGDIHYrDQ
```

### 5. Initialize the Database (Supabase)
If setting up your own Supabase project:
1. Open your Supabase project dashboard.
2. Navigate to the **SQL Editor**.
3. Copy and run the queries found in [`supabase/schema.sql`](supabase/schema.sql) to create the tables (`profiles`, `reminders`, `memories`, `people`, `games`) and RLS security triggers.

### 6. Start the Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 7. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 🧪 Hackathon Judge & Evaluation Guide

For quick evaluation, you can test all features on the live deployment:
👉 **[haven-arash15.vercel.app](https://haven-arash15.vercel.app)**

1. **One-Tap Quick Demo:**  
   Click **"Quick Demo"** on the login page to immediately test the authenticated patient and caregiver views with pre-loaded mock memories and medicine routines.
2. **Test RevenueCat Subscriptions:**  
   - Click the **`👑 Upgrade [RevenueCat]`** button in the top navigation bar.
   - Switch between **Monthly** and **Annual** pricing.
   - Click **`Continue to Payment →`**.
   - Use the **`🧪 Auto-Fill Demo Card`** button to insert test credentials (`4242 4242 4242 4242`).
   - Click **`Pay $0.00 Now & Start 30-Day Free Trial`** to experience the authorization and receipt confirmation.
3. **Explore Mind Games & Therapeutic Tools:**  
   Navigate to the **Play** tab and try out picture matching, serene breathing, and speech rehabilitation games.
4. **Test Accessibility Controls:**  
   Use the **A− / A+** font resizer in the header and toggle between English, French, Spanish, Chinese, Hindi, Bengali, or Assamese.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
