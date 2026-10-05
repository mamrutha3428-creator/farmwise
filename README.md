# FarmWise — Smarter Farming. Stronger Local Connections.

> "From better crop decisions to local farm discovery."

FarmWise is an AI-powered smart farming platform and direct local farm connection marketplace designed for small and medium-scale smallholder farmers and health-conscious community citizens.

---

## 🌾 The Problem
Smallholder farmers often struggle with:
1. **Uncertain crop planning** without scientific soil-climate matching.
2. **Pest and disease outbreaks** identified too late without accessible laboratory diagnostics.
3. **Language barriers** where technical agricultural advisories are inaccessible in regional native languages.
4. **Middleman exploitation** during harvest, taking high margins while leaving farmers with minimal profits.

## 🚀 The FarmWise Solution
FarmWise covers the complete agricultural journey across three distinct phases:

### 1. Before Farming
- **AI Crop Recommendation Engine**: Ranked crops with suitability scores, soil compatibility, water requirement, duration, and profit modeling.
- **Smart Crop Comparison**: Side-by-side agronomic comparison matrices.
- **Agri-Meteorological Intelligence**: 7-day forecast, evapotranspiration rates, soil moisture indices, and rainfall trends.
- **Crop Growth Calendar**: Phase-by-phase timelines from sowing to post-harvest curing with weather-vulnerability alerts.

### 2. During Farming
- **AI Crop Doctor (Scanner)**: Visual diagnostic tool using Gemini Vision to analyze photo symptoms of insect damage, fungal spots, and chlorosis with bio-control recommendations.
- **Context-Aware Multilingual AI Assistant**: Chatbot remembering farmer's land size, soil type, and location, answering in regional languages with **multilingual voice input**.

### 3. After Harvesting & Local Connection
- **Produce Registry**: Direct farm-gate produce listings (e.g. Groundnuts, Desi Tomatoes, Unpolished Sona Masuri Rice).
- **Citizen Fresh Produce Discovery**: Search, filter by category, sort by distance, approximate prices, and harvest dates.
- **Direct Citizen-Farmer Contact**: Phone calls and pre-composed WhatsApp inquiries. **FarmWise is NOT an e-commerce store with commissions, checkout, or shipping carts** — buyers connect directly with growers!
- **Trust & Moderation**: Reporting mechanism and admin moderation console.

---

## 🌍 Universal Multilingual & Localization Architecture
FarmWise features a centralized internationalization engine supporting all major Indian and international scripts:
- **Indian Languages**: English, తెలుగు (Telugu), हिन्दी (Hindi), தமிழ் (Tamil), ಕನ್ನಡ (Kannada), മലയാളം (Malayalam), मराठी (Marathi), বাংলা (Bengali), ગુજરાતી (Gujarati), ਪੰਜਾਬੀ (Punjabi), ଓଡ଼ିଆ (Odia), অসমীয়া (Assamese), اردو (Urdu).
- **International Languages**: Español (Spanish), Français (French), Deutsch (German), العربية (Arabic - RTL), Português (Portuguese), 中文 (Chinese), 日本語 (Japanese), 한국어 (Korean), Русский (Russian), Bahasa Indonesia.
- **RTL Layout Support**: Full right-to-left layout adaptation (`dir="rtl"`) for Arabic and Urdu.
- **Language Synchronization**: Language preference is saved in the user's Firestore profile and restored automatically on login.

---

## 🔐 Architecture & Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Web Speech Recognition API.
- **Backend & APIs**: Express router with server-side proxy routes for Gemini API.
- **AI Models**: Google GenAI SDK (`@google/genai`) using `gemini-3.8-flash`.
- **Database & Auth**: Google Firebase (Firestore Database + Firebase Authentication via Google Sign-In and local offline fallbacks).
- **Security**: Hardened Firestore Security Rules (`firestore.rules`) with Attribute-Based Access Control (ABAC).

---

## 🧪 Demo Profiles for Instant Evaluation
- **Farmer Demo**: Ravi Kumar (Groundnut & Tomato farmer, Tirupati, 3.5 acres)
- **Citizen Demo**: Priya Sharma (Local buyer searching for fresh pesticide-free produce)
- **Admin Demo**: FarmWise Platform Moderator

---

## 🛠️ Running Locally
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
3. Set your `GEMINI_API_KEY`.
4. Run development server:
   ```bash
   npm run dev
   ```
5. Build and start production full-stack server:
   ```bash
   npm run build
   npm run start
   ```
