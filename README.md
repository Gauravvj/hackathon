# 💊 Smart Medicine Reminder for Alzheimer's Patients

A full-stack web application that helps Alzheimer's patients take their medicines on time, prevents double dosing, and allows caregivers to monitor medication adherence remotely.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js (Vite) + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (JSON Web Tokens) |
| **AI Service** | Python FastAPI (optional) |

---

## 📁 Project Structure

```
smart-medicine-reminder/
├── backend/
│   └── src/
│       ├── config/         # Database connection
│       ├── controllers/    # Route handlers
│       ├── middleware/      # JWT auth middleware
│       ├── models/         # Mongoose schemas
│       ├── routes/         # Express routes
│       ├── services/       # Reminder cron service
│       └── server.js       # Entry point
├── frontend/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── context/        # React auth context
│       ├── pages/          # Page components
│       ├── services/       # Axios API client
│       └── App.jsx         # Router setup
├── ai-service/             # Optional Python microservice
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** (local or Atlas)
- **Python 3.9+** (optional, for AI service)

### 1. Clone & Setup Backend

```bash
cd smart-medicine-reminder/backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

The backend will start on **http://localhost:5000**.

### 2. Setup Frontend

```bash
cd smart-medicine-reminder/frontend
npm install
npm run dev
```

The frontend will start on **http://localhost:5173** with API proxy to backend.

### 3. (Optional) AI Microservice

```bash
cd smart-medicine-reminder/ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 🔑 Environment Variables

Create a `.env` file in `backend/`:

```env
MONGO_URI=mongodb://localhost:27017/smart-medicine-reminder
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current profile |
| GET | `/api/auth/patients` | List all patients |
| PUT | `/api/auth/link-patient/:id` | Link patient to caregiver |
| POST | `/api/medicines` | Add medicine |
| GET | `/api/medicines/:patientId` | Get patient's medicines |
| PUT | `/api/medicines/:id` | Update medicine |
| DELETE | `/api/medicines/:id` | Delete medicine |
| POST | `/api/logs` | Log medicine intake |
| GET | `/api/logs/:patientId` | Get patient logs |
| GET | `/api/logs/stats/:patientId` | Get adherence stats |
| GET | `/api/alerts/:caregiverId` | Get caregiver alerts |
| PUT | `/api/alerts/:id/read` | Mark alert as read |
| POST | `/api/cognitive` | Save game result |
| GET | `/api/cognitive/:patientId` | Get game results |

---

## ✨ Features

- **🔔 Smart Reminders** — Cron-based medication reminders every minute
- **🚫 Double Dose Prevention** — Blocks duplicate doses within 2-hour windows
- **🎤 Voice Confirmation** — Say "I took my medicine" using Speech Recognition API
- **📷 Camera Verification** — Show pill to camera for simulated AI verification
- **📊 Caregiver Dashboard** — Monitor patients, view adherence stats, get alerts
- **🧠 Cognitive Games** — Pattern Memory and Number Recall mini-games
- **🔐 JWT Authentication** — Secure role-based access (patient/caregiver)

---

## 🧪 Testing the App

1. **Register** a patient account and a caregiver account
2. As **caregiver**: link to the patient via the dashboard
3. As **caregiver**: add medicines on the Schedule page
4. As **patient**: view medicines, confirm via button/voice/camera
5. Check **Medication History** for logs
6. Check **Caregiver Dashboard** for alerts and stats
7. Play **Brain Games** to test cognitive function tracking

---

## 📝 License

This project is for educational purposes. Built as a college project demonstrating full-stack web development with modern technologies.
