# AgriSmart — 4-Phase Development Roadmap

---

## ✅ Phase 1 — Frontend (COMPLETE)
**Goal:** Full interactive UI with mock data. No backend needed.

### Deliverables
- React app with proper folder structure (components / pages / styles / data)
- Landing page (hero, features, roles, UID explainer, stats)
- Live price ticker
- Farmer Dashboard (overview, add crop, my crops, transport, AI price, weather)
- Wholesaler Dashboard (browse market, orders, demand alerts)
- Mandi Incharge Dashboard (gate entry, daily rates, stock inventory)
- Market Page (filterable crop listings)
- Transport Page (smart vehicle calculator)
- Smart ID (UID) Page with interactive generator
- AI Chatbot (Krishi AI — keyword-based, Phase 1)
- Auth Modal (login / register with role selector)
- Toast notifications

### How to Run
```bash
cd frontend
npm install
npm start
```

---

## 🔄 Phase 2 — Backend Foundation
**Goal:** Real database, real auth, real IDs.

### Tasks
- [ ] Setup MongoDB Atlas (or local) and connect via Mongoose
- [ ] `.env` file: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`
- [ ] Wire `User` model with auto-UID generation (`FRAY0001` logic)
- [ ] Wire `Crop` model and `Transport` model
- [ ] Auth routes: `/api/auth/register` and `/api/auth/login`
- [ ] JWT middleware protecting all private routes
- [ ] Replace mock data in React with `fetch('/api/...')` calls
- [ ] React: store JWT in localStorage, attach to all API headers

### Files Ready (stubs)
- `backend/server.js`
- `backend/models/User.js` ← UID logic already written
- `backend/models/Crop.js`
- `backend/models/Transport.js`
- `backend/middleware/auth.js`
- `backend/routes/auth.js`
- `backend/routes/crops.js`
- `backend/routes/users.js`
- `backend/routes/transport.js`

### Run Backend
```bash
cd backend
npm install
# Create .env file:
# MONGO_URI=mongodb://localhost:27017/agrismart
# JWT_SECRET=your_secret_key
# PORT=5000
npm run dev
```

---

## 🔄 Phase 3 — Marketplace & Orders
**Goal:** Full buyer-seller flow end to end.

### Tasks
- [ ] Crop listing CRUD (farmer creates, buyer sees, wholesaler buys)
- [ ] Order model: `Order.js` with `status: pending → payment → completed`
- [ ] Mandi Incharge: live gate entry pulls from real Transport DB
- [ ] Daily mandi rates stored in MongoDB, fetched on dashboard load
- [ ] Notifications model: demand surge alerts stored and sent to farmers
- [ ] Real-time updates using Socket.io (optional)
- [ ] Payment status tracking (no payment gateway yet — just status flags)

---

## 🔄 Phase 4 — AI Integration + Launch
**Goal:** The "Smart" part — Gemini AI live.

### Tasks
- [ ] Gemini API key setup (`GEMINI_API_KEY` in `.env`)
- [ ] Price Prediction Engine:
  - Pull last 30 days of mandi rates from DB
  - Build prompt: `"Given these Mandi rates for Wheat in Ayodhya: [data], predict next week's price and give a sell/hold recommendation."`
  - Return structured JSON: `{ predictedPrice, trend, recommendation, reasoning }`
- [ ] Weather Integration:
  - Fetch weather via OpenWeatherMap API for farmer's district
  - Feed into Gemini: `"Weather in Ayodhya: [data]. What should the farmer do with their Mustard crop?"`
- [ ] Demand Surge Alerts:
  - Cron job every hour: count buyer searches per crop per district
  - If threshold exceeded → push notification to all farmers in that district
- [ ] Krishi AI chatbot wired to real Gemini API (replace keyword stubs)
- [ ] Final testing, deployment (Vercel frontend + Railway/Render backend)

---

## 🏁 Success Metric (from spec)
> A farmer in Ayodhya (ID: FRAY001) should be able to list 10 Quintals of Rice,
> see an AI-predicted price, and have a truck suggested automatically —
> **all within 2 minutes.**
