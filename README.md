# PODNEX

**Build Bold. Build Together.**  
A brand-led, people-powered ecosystem where creators form Pods to build and launch real-world products collaboratively.

---

## 🚀 What is Podnex?
PODNEX is not a gig platform or a freelancer marketplace.
It's an ecosystem where:
- Creators launch **Pods** around bold ideas
- Contributors join to **build real products**
- Reputation, contributions, and ownership are **tracked and rewarded**
- Revenue is **shared transparently**

From ideation to launch, Pods function like agile teams where every member's work is visible, valued, and verifiable.

---

## 🔧 Tech Stack
**Frontend:** React, SCSS Modules, Framer Motion, Lucide Icons  
**Backend:** Node.js, Express, MongoDB, Mongoose  
**Auth:** JWT (Protected Routes)  
**Payments:** (Planned) Stripe Connect  
**Deployment:** Client-ready for platforms like Vercel or Netlify

---

## 🧠 Core Features
- ✅ **Pod Creation Flow** – Creators launch pods with mission, visuals, and role needs
- ✅ **Contributor Join System** – Apply to roles and build reputation
- ✅ **Dynamic Pricing Page** – Tiered plans per user type (Creator, Contributor, Booster)
- ✅ **Community Section** – Tabs for Pods, Events, and Member Spotlights
- ✅ **Explore & Help Feed** – Find active Pods that need your skills
- ✅ **Protected Dashboard** – Authenticated access with contribution tracking
- ✅ **Animations & Visual Polish** – Framer Motion & SCSS-based interaction design
- 🛠️ **(Planned)**: Smart contracts, backers, real-time collaboration

---

## 📁 Project Structure
```
Podnex/
├── client/              # React Frontend
│   ├── src/pages/       # Page-level views (Community, Pricing, Dashboard...)
│   ├── src/components/  # Reusable components
│   ├── styles/          # Global SCSS + variables
│   └── public/          # Static assets
├── server/              # Node.js + Express Backend
│   ├── routes/          # API Routes (auth, pods, users)
│   ├── controllers/     # Business logic
│   ├── models/          # Mongoose schemas
│   └── config/          # MongoDB connection, env setup
```

---

## 🧪 Getting Started (Local Dev)
1. Clone the repo:
```bash
git clone https://github.com/ptengelmann/Podnex.git
cd Podnex
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

3. Install backend dependencies:
```bash
cd ../server
npm install
```

4. Add your `.env` file in `/server` with:
```
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
```

5. Run backend:
```bash
npm start
```

6. Run frontend:
```bash
cd ../client
npm start
```

---

## 🌍 Join the Ecosystem
Podnex is growing — and we're building this in public.
Whether you're a:
- 🚀 **Creator** with a bold idea
- 🧑‍💻 **Contributor** with skills to offer
- 📣 **Booster** who loves championing real innovation

You're welcome to explore, build, and grow.

Follow development: [https://github.com/ptengelmann/Podnex](https://github.com/ptengelmann/Podnex)

---

## 📌 Roadmap
- [x] Pod Creation & Contributor Flows
- [x] Role-based Pricing Page
- [x] Community Page with Events, Spotlights, and Values
- [ ] Reputation & XP Engine
- [ ] Stripe-based Revenue Splits
- [ ] Public Pod Storefronts
- [ ] Tutorials Page
- [ ] Admin + Analytics Dashboard

---

## 🔒 Security & Best Practices
- `.env` is excluded from GitHub
- No secrets or keys are committed
- Route protection and auth are in place (JWT)

---

## 🙌 Credits
Created by [@ptengelmann](https://github.com/ptengelmann)  
Design, Dev, Strategy: You.

---

## 💬 License
MIT — open source, contribute responsibly. Build boldly.

