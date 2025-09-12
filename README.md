# NEONEXUS – Digital Mental Health & Psychological Support System

## 🌟 Overview

NEONEXUS is a stigma-free, culturally adapted, AI-driven mental health support platform specifically designed for higher education students in India. This prototype focuses on providing accessible, confidential, and culturally sensitive mental health resources through a modern web interface.

## 🎯 Objective

Create a comprehensive digital mental health platform that addresses the unique challenges faced by Indian college students, offering multilingual support, AI-powered assistance, and culturally relevant interventions.

## ✨ Core Features

### 1. Student Login & Dashboard
- Secure authentication with username, email, and institution ID
- Interactive mood check-in with emoji scale/slider
- Integrated PHQ-9 and GAD-7 mental health screening questionnaires
- Personalized dashboard with quick access to all features

### 2. AI Chatbot (First-Aid Support)
- 24/7 conversational interface for stress, anxiety, and burnout support
- Intelligent coping strategy recommendations
- Crisis detection with automatic helpline/counselor connection options
- Multilingual support: English, Hindi, Urdu, Kashmiri, and Dogri

### 3. Confidential Booking System
- Private appointment scheduling with campus counselors
- Integrated calendar with automated reminders
- Anonymous booking option for enhanced privacy
- Real-time availability tracking

### 4. Psychoeducational Resource Hub
- Curated library of videos, guided audio sessions, and educational PDFs
- Content categorized by: Stress Relief, Sleep Hygiene, Academic Pressure, etc.
- Advanced filtering by language and topic
- Progress tracking and recommendations

### 5. Peer Support Forum
- Moderated discussion boards for student interaction
- Verified peer volunteer profiles and support
- Interactive features: post, reply, upvote system
- Anonymous participation options

### 6. Admin Dashboard
- Comprehensive analytics with anonymized data
- Student well-being trend visualization
- Counselor booking and utilization reports
- Institution-specific customization options

## 🚀 User Flows

### Student Journey
Login → Dashboard → Mood Check-in → Chatbot Interaction → Book Session OR Access Resources → Forum Engagement

### Counselor Journey
Login → View Scheduled Sessions → Calendar Management → Access Anonymized Student Trends

### Admin Journey
Login → Analytics Dashboard → Monitor Well-being Trends → Generate and Download Reports

## 🎨 Design Guidelines

### UI Style
- **Aesthetic**: Calming, minimal, student-friendly interface
- **Approach**: Mobile-first, fully responsive design
- **Accessibility**: WCAG 2.1 AA compliant

### Color Palette
- **Primary**: Soft pastels - Blue (#0ea5e9), Lavender (#a855f7), Mint (#14b8a6)
- **Background**: Light lavender (#faf5ff) for calming effect
- **Accent**: Complementary soft tones for highlights

### Typography
- **Primary**: Inter (headings and UI elements)
- **Secondary**: Poppins (body text)
- **Style**: Clean, readable sans-serif fonts

### Visual Elements
- Culturally relevant, non-stigmatizing illustrations
- Consistent iconography using Lucide React
- Subtle animations and micro-interactions

## 🏗️ Technical Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom color palette
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **State Management**: React Context API + useReducer

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: JWT with bcrypt
- **API**: RESTful with OpenAPI documentation

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest + React Testing Library

## 📁 Project Structure

```
neonexus-mental-health-platform/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React Context providers
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript type definitions
│   └── public/             # Static assets
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Express middleware
│   │   ├── controllers/    # Business logic
│   │   └── utils/          # Utility functions
│   └── tests/              # Backend tests
├── docs/                    # Project documentation
├── assets/                  # Shared assets and resources
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd neonexus-mental-health-platform
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Setup Backend** (when implemented)
   ```bash
   cd backend
   npm install
   npm run dev
   ```

### Development Commands

#### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint

#### Backend (when implemented)
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run migrate` - Run database migrations

## 🎯 Prototype Goals

The current prototype demonstrates:

1. **Interactive User Flows**
   - Chatbot conversation simulation
   - Appointment booking process
   - Resource browsing experience
   - Forum interaction mockups
   - Admin analytics visualization

2. **UX Focus Areas**
   - Intuitive navigation and user experience
   - Cultural sensitivity in design and content
   - Accessibility and inclusivity
   - Mobile-responsive interface

3. **Technical Demonstration**
   - Modern React architecture
   - Component reusability
   - Type safety with TypeScript
   - Responsive design implementation

## 🌐 Multilingual Support

Currently planning support for:
- **English** (Primary)
- **Hindi** (हिन्दी)
- **Urdu** (اردو)
- **Kashmiri** (कॉशुर/کٲشُر)
- **Dogri** (डोगरी)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Project Type**: Academic/Research Prototype
- **Target Audience**: Higher Education Students in India
- **Focus**: Mental Health Accessibility and Cultural Adaptation

## 🔮 Future Enhancements

- AI/ML integration for personalized recommendations
- Real-time chat with counselors
- Integration with institutional systems
- Mobile app development
- Advanced analytics and reporting
- Telehealth integration

---

**NEONEXUS** - Bridging the gap between students and mental health support through technology, culture, and compassion.