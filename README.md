<p align="center">
  <img src="https://img.shields.io/badge/NEONEXUS-Mental%20Health%20Platform-blueviolet?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0xMiAyMWE5IDkgMCAxIDAgMC0xOCA5IDkgMCAwIDAgMCAxOHoiLz48cGF0aCBkPSJNMTIgN3Y1bDMgMyIvPjwvc3ZnPg==" alt="NEONEXUS Badge"/>
</p>

<h1 align="center">🧠 NEONEXUS</h1>
<h3 align="center">Digital Mental Health & Psychological Support System</h3>

<p align="center">
  A stigma-free, culturally adapted, AI-driven mental health support platform<br/>
  designed for higher education students in India.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-Express%205-339933?style=flat-square&logo=nodedotjs" alt="Node.js"/>
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi" alt="FastAPI"/>
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python" alt="Python"/>
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker" alt="Docker"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
</p>

---

##  Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [ML Service](#-ml-service)
- [API Endpoints](#-api-endpoints)
- [Multilingual Support](#-multilingual-support)
- [Contributing](#-contributing)
- [License](#-license)

---

##  Overview

**NEONEXUS** is a comprehensive digital mental health platform that addresses the unique challenges faced by Indian college students. It offers **multilingual AI-powered assistance**, **standardized mental health screenings**, **crisis detection**, and **culturally relevant interventions** through a modern, accessible web interface.

### Why NEONEXUS?

- **Student-centric** — tailored for the Indian higher education context
-  **AI-powered** — HuggingFace transformer models for intelligent chatbot interactions
-  **Multilingual** — supports English, Hindi, Urdu, Kashmiri & Dogri
- **Privacy-first** — anonymous booking, confidential sessions, no data sharing
-  **Clinically grounded** — integrates PHQ-9, GAD-7, and GHQ-12 screening tools

---

## Key Features

| Feature | Description |
|---|---|
| **Student Dashboard** | Mood check-ins, journaling, quick actions, and personalized insights |
| **AI Chatbot** | 24/7 conversational support with crisis detection and multilingual NLP |
| **Mental Health Screening** | PHQ-9, GAD-7, GHQ-12 standardized assessments with scoring |
| **Appointment Booking** | Private scheduling with campus counselors, anonymous booking option |
| **Resource Hub** | Curated videos, guided audio, PDFs — filtered by language & topic |
| **Peer Support Forum** | Moderated discussion boards with anonymous participation |
| **Counselor Dashboard** | Session management, calendar, anonymized student trend access |
| **Admin Dashboard** | Analytics, well-being trends, utilization reports, data exports |
| **Crisis Detection** | Real-time multilingual keyword detection with automatic helpline routing |
| **Voice Input** | Speech-to-text input for the chatbot interface |

---

##  Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| React Router DOM v7 | Routing |
| Recharts | Data visualization |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| TypeScript | Type safety |
| Sequelize (PostgreSQL/SQLite) | Relational data (users, appointments) |
| Mongoose (MongoDB) | Document data (chat sessions, forum posts) |
| Redis (ioredis) | Session caching & rate limiting |
| JWT + bcrypt | Authentication |
| Zod | Request validation |
| Google GenAI | AI chatbot responses |

### ML Service
| Technology | Purpose |
|---|---|
| FastAPI + Uvicorn | ML microservice |
| XLM-RoBERTa | Zero-shot classification (English) |
| MuRIL | Zero-shot classification (Hindi & Urdu) |
| OPUS-MT | Translation (Kashmiri & Dogri via pivot) |
| scikit-learn | Model evaluation |
| PyTorch | Inference runtime |

### DevOps
| Technology | Purpose |
|---|---|
| Docker + Docker Compose | Containerization |
| Jest + Supertest | Backend testing |
| React Testing Library | Frontend testing |

---

##  Architecture

```
┌─────────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│                  │     │                     │     │                  │
│   React Frontend │────▶│  Node.js / Express  │────▶│  ML Service      │
│   (Port 3000)    │     │  Backend (Port 5000) │     │  FastAPI (:8000) │
│                  │     │                     │     │                  │
└─────────────────┘     └────────┬────────────┘     └──────────────────┘
                                 │                    XLM-RoBERTa
                                 │                    MuRIL
                      ┌──────────┼──────────┐         OPUS-MT
                      │          │          │
                 ┌────▼───┐ ┌───▼────┐ ┌───▼───┐
                 │PostgreSQL│ │MongoDB │ │ Redis │
                 │/SQLite  │ │        │ │       │
                 └─────────┘ └────────┘ └───────┘
```

---

##  Project Structure

```
neonexus-mental-health-platform/
│
├── frontend/                    # React TypeScript application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/             # Reusable UI components
│   │   │   ├── assessments/    # PHQ-9, GAD-7, GHQ-12 components
│   │   │   ├── auth/           # Authentication components
│   │   │   ├── charts/         # Data visualization components
│   │   │   └── community/      # Forum & peer support components
│   │   ├── pages/              # Route pages
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── ChatBot.tsx
│   │   │   ├── Appointments.tsx
│   │   │   ├── Resources.tsx
│   │   │   ├── MentalHealthScreening.tsx
│   │   │   ├── CounselorDashboard.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── ...
│   │   ├── contexts/           # React Context (Auth, etc.)
│   │   ├── hooks/              # Custom hooks
│   │   ├── services/           # API client layer
│   │   └── types/              # TypeScript type definitions
│   └── public/                 # Static assets
│
├── backend/                     # Node.js Express API
│   ├── src/
│   │   ├── routes/             # API route handlers
│   │   │   ├── auth.ts
│   │   │   ├── ai-chatbot.ts
│   │   │   ├── appointments.ts
│   │   │   ├── assessments.ts
│   │   │   ├── crisis-detection.ts
│   │   │   ├── resources.ts
│   │   │   ├── analytics.ts
│   │   │   └── ...
│   │   ├── controllers/        # Business logic
│   │   ├── middleware/         # Auth, rate-limiting, etc.
│   │   └── utils/              # Database, helpers
│   ├── tests/                  # Jest test suites
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── ml-service/                  # Python FastAPI ML microservice
│   ├── main.py                 # FastAPI app entry point
│   ├── models/                 # Model loading & management
│   ├── routers/                # /classify, /translate, /crisis
│   ├── services/               # NLP business logic
│   ├── evaluation/             # Model evaluation suite
│   │   ├── run_eval.py
│   │   ├── evaluators/
│   │   └── data/
│   ├── requirements.txt
│   └── Dockerfile
│
├── docs/                        # Project documentation
├── assets/                      # Shared assets
└── README.md
```

---

##  Getting Started

### Prerequisites

- **Node.js** v18+
- **Python** 3.10+
- **npm**
- **Git**
- **Docker** (optional, for containerized setup)

### 1. Clone the Repository

```bash
git clone https://github.com/AnshRaj1304/neonexus-mental-health-platform.git
cd neonexus-mental-health-platform
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### 3. Backend Setup

```bash
cd backend
npm install

# Create your .env file (see Environment Variables section below)
npm run dev
# Runs on http://localhost:5000
```

### 4. ML Service Setup

```bash
cd ml-service
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
# Runs on http://localhost:8000
```

### 5. Docker Setup (All Services)

```bash
cd backend
docker-compose up --build
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neonexus
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# MongoDB
MONGODB_URI=mongodb://localhost:27017/neonexus

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Google GenAI (Chatbot)
GOOGLE_AI_API_KEY=your_google_ai_key

# ML Service
ML_SERVICE_URL=http://localhost:8000

# CORS
CORS_ORIGINS=http://localhost:3000
```

> **Note**: Never commit `.env` files. They are excluded via `.gitignore`.

---

## ML Service

The ML microservice provides NLP capabilities via three HuggingFace transformer models:

| Model | Task | Languages |
|---|---|---|
| **XLM-RoBERTa** | Zero-shot intent classification | English (+ fallback) |
| **MuRIL** | Zero-shot intent classification | Hindi, Urdu |
| **OPUS-MT** | Translation via pivot languages | Kashmiri, Dogri |

### Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/ml/classify` | Classify user intent from text |
| `POST` | `/ml/translate` | Translate text between languages |
| `POST` | `/ml/crisis/detect` | Detect crisis signals in text |
| `GET` | `/ml/health` | Service health & model status |

### Model Evaluation

```bash
cd ml-service
python -m evaluation.run_eval
```

Generates metrics (accuracy, precision, recall, F1, BLEU, chrF) and visual reports (confusion matrices, bar charts) in `evaluation/results/`.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login & get JWT token |

### Chatbot
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chatbot/message` | Send message to AI chatbot |
| `GET` | `/api/chatbot/sessions` | Get chat session history |

### Appointments
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/appointments` | List appointments |
| `POST` | `/api/appointments` | Book an appointment |
| `PUT` | `/api/appointments/:id` | Update appointment |

### Assessments
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/assessments/submit` | Submit screening (PHQ-9, GAD-7, GHQ-12) |
| `GET` | `/api/assessments/history` | Get assessment history |

### Resources
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/resources` | List resources (with filters) |
| `GET` | `/api/resources/:id` | Get resource details |

### Crisis Detection
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/crisis/detect` | Detect crisis keywords in text |
| `GET` | `/api/crisis/helplines` | Get emergency helpline numbers |

---

## 🌐 Multilingual Support

| Language | Script | Classification | Translation |
|---|---|---|---|
| English | Latin | XLM-RoBERTa | — |
| Hindi | देवनागरी | MuRIL | — |
| Urdu | نستعلیق | MuRIL | — |
| Kashmiri | कॉशुर / کٲشُر | — | OPUS-MT (via pivot) |
| Dogri | डोगरी | — | OPUS-MT (via pivot) |

---

##  Roadmap

- [ ] Real-time counselor chat (WebSocket)
- [ ] Mobile app (React Native)
- [ ] Integration with institutional LMS
- [ ] Advanced analytics with trend prediction
- [ ] Telehealth video integration
- [ ] Gamification for mental wellness habits

---

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---
## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

##  Team

- **Project Type**: Academic / Research Prototype
- **Target Audience**: Higher Education Students in India
- **Focus**: Mental Health Accessibility & Cultural Adaptation

---

<p align="center">
  <strong>NEONEXUS</strong> — Bridging the gap between students and mental health support<br/>through technology, culture, and compassion. 💜
</p>