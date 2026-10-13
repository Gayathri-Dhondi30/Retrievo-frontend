# Retrievo — Smart AI Lost & Found System (Frontend)

Modern, full-stack Lost & Found web client built for university campuses, colleges, office parks, and public facilities.

![Retrievo Preview](https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Highlights

- **Aesthetics & Theme**: Brown & Cream palette with smooth Framer Motion micro-animations and responsive Tailwind styling.
- **Lost & Found Reporting**: Multi-step reporting forms with instant image previews, category selection, and location taggers.
- **Smart Directory & Search**: Real-time filters for Lost vs Found, keyword searches, category tags, date filters, and status badges.
- **Photo Display**: Contextual fallbacks ensuring every reported item has realistic visual presentation.
- **Secure Authentication**: JWT token management with protected user and administrator routes.
- **Private Messaging**: In-app finder-to-owner messaging system.
- **Claim Workflow**: Interactive claim submission and status tracker.

---

## 🛠 Tech Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **HTTP Client**: Axios with automatic JWT Authorization header interceptors
- **Routing**: React Router DOM v7

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ and npm installed

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The frontend will run at:
👉 **http://localhost:3000**

All `/api/**` and `/uploads/**` requests are automatically proxied to the Spring Boot backend at `http://localhost:8085`.

### 4. Build for Production
```bash
npm run build
```
Generates optimized static bundle in the `dist` directory.

---

## 🌐 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `/api` | Base URL for Spring Boot backend REST endpoints |

---

## 📦 Deployment

### Deploy to Vercel / Netlify
1. Connect repository: `https://github.com/Gayathri-Dhondi30/Retrievo-frontend.git`
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Set `VITE_API_BASE_URL` to your production backend URL (e.g. `https://your-backend.onrender.com/api`)
