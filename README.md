<<<<<<< HEAD
# agismart
project
=======
# 🌿 AgriSmart — AI-Powered Digital Mandi System

## Project Structure
```
agrismart/
├── frontend/               ← React app (Phase 1 — ready)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── index.js        ← React entry point
│   │   ├── App.jsx         ← Root component + routing
│   │   ├── data/
│   │   │   └── mockData.js ← All mock/seed data
│   │   ├── styles/
│   │   │   ├── globals.css ← CSS variables, reset, base
│   │   │   └── components.css ← Reusable component styles
│   │   ├── components/     ← Shared UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── PriceTicker.jsx
│   │   │   ├── AIChat.jsx
│   │   │   ├── AuthModal.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── TransportCalc.jsx
│   │   │   └── UIDGenerator.jsx
│   │   └── pages/          ← Full page views
│   │       ├── Landing.jsx
│   │       ├── MarketPage.jsx
│   │       ├── TransportPage.jsx
│   │       ├── UIDPage.jsx
│   │       ├── farmer/
│   │       │   └── FarmerDashboard.jsx
│   │       ├── wholesaler/
│   │       │   └── WholesalerDashboard.jsx
│   │       └── incharge/
│   │           └── InchargeDashboard.jsx
│   └── package.json
│
├── backend/                ← Node.js + Express (Phase 2)
│   ├── server.js           ← Express entry point (stub)
│   ├── routes/             ← API route stubs
│   │   ├── auth.js
│   │   ├── crops.js
│   │   ├── users.js
│   │   └── transport.js
│   ├── models/             ← Mongoose schema stubs
│   │   ├── User.js
│   │   ├── Crop.js
│   │   └── Transport.js
│   ├── middleware/
│   │   └── auth.js         ← JWT middleware stub
│   └── package.json
│
└── docs/
    └── PHASES.md           ← Full 4-phase roadmap
```

## Quick Start (Frontend only — Phase 1)
```bash
cd frontend
npm install
npm start
# Opens on http://localhost:3000
```

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React.js, CSS Variables |
| Backend (Phase 2) | Node.js, Express.js |
| Database (Phase 2) | MongoDB + Mongoose |
| Auth (Phase 2) | JWT |
| AI (Phase 4) | Google Gemini API |
>>>>>>> 947073cd (first commit)
