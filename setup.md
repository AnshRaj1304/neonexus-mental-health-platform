# NEONEXUS Development Setup Guide

## Quick Setup Instructions

Follow these steps to get the NEONEXUS project running locally on your machine.

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd neonexus-mental-health-platform
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be available at: `http://localhost:3000`

### 3. Backend Setup (Optional for prototype)

```bash
# Navigate to backend directory (from project root)
cd backend

# Install dependencies
npm install

# Copy environment variables template
copy .env.example .env

# Start development server
npm run dev
```

The backend API will be available at: `http://localhost:5000`

### 4. Project Structure Overview

```
neonexus-mental-health-platform/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React Context providers
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript definitions
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── tailwind.config.js  # Tailwind CSS configuration
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── models/         # Data models
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Utility functions
│   ├── package.json        # Backend dependencies
│   ├── tsconfig.json       # TypeScript configuration
│   └── .env.example        # Environment variables template
├── docs/                    # Project documentation
│   └── database-schema.md  # Database design
├── assets/                  # Shared assets
├── README.md               # Main project documentation
└── CONTRIBUTING.md         # Contribution guidelines
```

### 5. Available Scripts

#### Frontend (in `/frontend`)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run linting

#### Backend (in `/backend`)
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run build` - Compile TypeScript
- `npm test` - Run tests

### 6. Design System Colors

The project uses a custom color palette:

- **Neon Blue**: #0ea5e9 (Primary)
- **Neon Lavender**: #a855f7 (Secondary)
- **Neon Mint**: #14b8a6 (Accent)
- **Background**: #faf5ff (Light lavender)

These are configured in `frontend/tailwind.config.js`

### 7. Key Features to Develop

1. **Student Dashboard** - Main interface with mood check-in
2. **AI Chatbot** - Conversational mental health support
3. **Appointment Booking** - Schedule counselor sessions
4. **Resource Hub** - Educational content library
5. **Peer Forum** - Community support features
6. **Admin Dashboard** - Analytics and management

### 8. Development Workflow

1. Create feature branches from `main`
2. Make changes following the coding standards in CONTRIBUTING.md
3. Test your changes locally
4. Commit with descriptive messages
5. Push and create pull requests

### 9. Prototype Goals

This project is currently a **prototype focusing on:**
- Interactive user interface demonstrations
- Mock data and API responses
- Cultural sensitivity in design
- Mobile-first responsive design
- Accessibility compliance

### 10. Next Steps

After setup, you can:
1. Explore the existing code structure
2. Review the database schema in `docs/database-schema.md`
3. Start implementing UI components
4. Add mock data for demonstrations
5. Test the responsive design on different devices

### Troubleshooting

**Common Issues:**

1. **Port 3000 already in use**
   - Stop other React apps or use a different port with `PORT=3001 npm start`

2. **Node modules not found**
   - Delete `node_modules` and `package-lock.json`, then run `npm install`

3. **Tailwind styles not loading**
   - Ensure the Tailwind directives are in `src/index.css`
   - Check that `tailwind.config.js` is properly configured

4. **TypeScript errors**
   - Run `npm run build` to see detailed TypeScript errors
   - Check that all necessary type definitions are installed

### Getting Help

- Check the [CONTRIBUTING.md](CONTRIBUTING.md) for coding guidelines
- Review the [README.md](README.md) for project overview
- Create issues for bugs or feature requests
- Join team discussions for collaborative development

---

**Happy coding! 🚀** Let's build something amazing for student mental health support.