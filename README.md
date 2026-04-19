NEONEXUS
Digital Mental Health & Psychological Support System
A stigma-free, culturally adapted, AI-driven mental health support platform designed for higher education students in India.

Overview
NEONEXUS offers multilingual AI-powered assistance, standardized mental health screenings, crisis detection, and culturally relevant interventions through a modern web interface.

Student-centric — tailored for the Indian higher education context
AI-powered — HuggingFace transformer models for intelligent chatbot interactions
Multilingual — supports English, Hindi, Urdu, Kashmiri & Dogri
Privacy-first — anonymous booking, confidential sessions, no data sharing
Clinically grounded — integrates PHQ-9, GAD-7, and GHQ-12 screening tools


Tech Stack
LayerTechnologyFrontendReact 19, TypeScript, Tailwind CSSBackendNode.js, Express 5, TypeScriptDatabasePostgreSQL, MongoDB, RedisML ServiceFastAPI, XLM-RoBERTa, MuRIL, OPUS-MTAuthJWT + bcryptDevOpsDocker, Docker Compose

Getting Started
Prerequisites

Node.js v18+
Python 3.10+
Docker (optional)

1. Clone
bashgit clone https://github.com/AnshRaj1304/neonexus-mental-health-platform.git
cd neonexus-mental-health-platform
2. Frontend
bashcd frontend
npm install
npm start
Runs on http://localhost:3000
3. Backend
bashcd backend
cp .env.example .env
npm install
npm run dev
Runs on http://localhost:5000
4. ML Service
bashcd ml-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --port 8000
Runs on http://localhost:8000
5. Docker
bashdocker-compose up --build

Environment Variables
Copy backend/.env.example to backend/.env and fill in your values. Never commit .env files.