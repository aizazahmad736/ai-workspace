# AI Workspace - SaaS Dashboard Portfolio Project

AI Workspace is a premium full-stack SaaS Dashboard designed to showcase React, Express, and database integrations. It includes modern charts, an interactive Kanban sprints board, subscription metrics, role management, and 5 interactive AI diagnostic tools.
<img width="473" height="250" alt="Screenshot 2026-07-16 001258" src="https://github.com/user-attachments/assets/e183dc5e-e4ad-401b-82a7-c08732dedc27" />


<img width="949" height="446" alt="Screenshot 2026-07-16 001113" src="https://github.com/user-attachments/assets/e91ae53e-371b-4d3c-8305-566728cc7711" />

<img width="959" height="413" alt="Screenshot 2026-07-16 001135" src="https://github.com/user-attachments/assets/0da2e830-a383-4c79-8194-6bd227270b5a" />

<img width="953" height="437" alt="Screenshot 2026-07-16 001148" src="https://github.com/user-attachments/assets/1ea8f89e-2597-4b4e-96eb-8e18977a7160" />

## Key Features:

1. **Authentication**: Form validation, secure sign-ups, and session management using JSON Web Tokens (JWT) & bcrypt.
2. **Dual-Mode Database Fallback**: 
   - Uses remote **MongoDB Atlas** or local MongoDB if `MONGODB_URI` environment variable is defined.
   - Automatically falls back to a zero-config local JSON database (`server/data/db.json`) if MongoDB is unavailable.
3. **Interactive AI Playground**:
   - **Resume Reviewer**: Paste resume text to review ATS suitability and role target scores.
   - **Interview Simulator**: Interactive chat simulating a recruiter conversation.
   - **Code Explainer**: Breakdown of programming statements.
   - **Text Summarizer**: Bulletpoint summarization of long documentation pages.
   - **Email Generator**: Draft formal or casual outreach emails.
4. **Kanban Board**: Drag/move tasks between Todo, In Progress, Review, and Done columns.
5. **Analytics**: Rich graphs visualizing MRR, user signups, active subscriptions, and AI usage metrics using Recharts.
6. **Stripe-Style Billing**: Upgrade tiers (Free, Pro, Enterprise) to extend monthly AI limits.
7. **Visual Settings**: Dark and Light theme layout toggle.

---

## Folder Structure

```text
client/
│   ├── src/
│   │   ├── context/     # AuthContext & ThemeContext
│   │   ├── layouts/     # Dashboard & Auth layouts
│   │   ├── pages/       # Dashboard, Analytics, AIAssistant, Kanban, Billing, Team, Settings
│   │   ├── services/    # Axios API endpoints config
│   │   └── App.jsx      # Navigation routing
│
server/
    ├── config/          # Hybrid Database config
    ├── controllers/     # Authentication, AI, Analytics, Projects logic
    ├── models/          # Schemas / Fallback model helpers
    └── server.js        # Express middleware setup
```

---

## Local Development Guide

### Prerequisite
Ensure you have **Node.js** (v18+) installed.

### 1. Launch the Backend API Server
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Verify dependencies are installed, then run the startup script:
   ```bash
   npm run dev
   ```
   *The server runs on http://localhost:5000. It will automatically load the JSON database fallback.*

### 2. Launch the React Client App
1. Open a new terminal tab/session.
2. Navigate to the `client` directory:
   ```bash
   cd client
   ```
3. Run the Vite development server::
   ```bash
   npm run dev
   ```
4. Click the link shown in the output terminal (usually http://localhost:5173) to open the application in your browser.
