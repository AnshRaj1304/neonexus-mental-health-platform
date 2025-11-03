# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

NEONEXUS is a React TypeScript frontend for a digital mental health and psychological support system designed for higher education students in India. This is the frontend portion of a full-stack application focused on culturally sensitive, accessible mental health support.

**Key Characteristics:**
- Cultural sensitivity for Indian student population
- Multi-language support (English, Hindi, Urdu, Kashmiri, Dogri)
- Mental health focus with privacy-first approach
- Mobile-first responsive design
- Accessibility compliance (WCAG 2.1 AA)

## Development Commands

### Common Development Tasks

```powershell
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage (after implementing coverage)
npm test -- --coverage

# Run specific test file
npm test -- --testNamePattern="ComponentName"

# Build and serve production build locally (for testing)
npm run build
npx serve -s build
```

### Full Stack Development

```powershell
# Start frontend (from frontend directory)
npm start

# Start backend (from ../backend directory)
cd ../backend
npm run dev

# Install dependencies for both frontend and backend
npm install
cd ../backend && npm install && cd ../frontend
```

### Linting and Formatting (when implemented)

```powershell
# Lint code (when ESLint is configured)
npm run lint

# Fix linting issues (when configured)
npm run lint -- --fix

# Format code (when Prettier is configured)
npx prettier --write src/
```

## Architecture Overview

### Frontend Architecture

**Tech Stack:**
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom NEONEXUS color palette
- **Icons**: Lucide React
- **Routing**: React Router DOM (v7.8.2)
- **State Management**: React state (useState, context) - no external state library
- **Build Tool**: Create React App (react-scripts)

**Key Design Principles:**
- Component-based architecture with reusable UI components
- Type-safe development with comprehensive TypeScript definitions
- Mobile-first responsive design
- Cultural sensitivity in UI/UX
- Privacy-first mental health data handling

### Project Structure

```
frontend/
├── src/
│   ├── components/ui/          # Reusable UI components
│   │   ├── Button.tsx         # Primary button component
│   │   ├── Card.tsx           # Container component
│   │   ├── Input.tsx          # Form input component
│   │   ├── MoodSelector.tsx   # Mental health mood selection
│   │   ├── Navigation.tsx     # Main navigation
│   │   └── index.ts           # Component exports
│   ├── pages/                  # Page-level components
│   │   ├── Login.tsx          # Authentication page
│   │   ├── StudentDashboard.tsx # Main student interface
│   │   ├── ChatBot.tsx        # AI chatbot interface
│   │   ├── Appointments.tsx   # Counselor booking
│   │   └── Resources.tsx      # Educational resources
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts           # Comprehensive type definitions
│   ├── App.tsx                # Main application component
│   └── index.tsx              # Application entry point
├── public/                     # Static assets
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── postcss.config.js          # PostCSS configuration
```

### State Management

**Current Approach:**
- Local React state with `useState`
- No external state management library (Redux, Zustand, etc.)
- Props passing for component communication
- Mock data and simulated API calls

**Key State:**
- `currentUser`: User authentication and profile data
- `currentPage`: Simple client-side routing
- Component-level state for forms and UI interactions

### Routing System

**Custom Implementation:**
- Simple state-based routing in App.tsx
- No React Router implementation yet (despite dependency)
- Conditional rendering based on `currentPage` state

**Route Structure:**
- `login` - Authentication page
- `dashboard` - Student main dashboard
- `chat` - AI chatbot interface
- `appointments` - Counselor booking system
- `resources` - Educational content library
- `forum` - Peer support (placeholder)

### Component System

**UI Components (`src/components/ui/`):**
- **Button**: Variant-based button system (primary, secondary, outline, ghost, danger)
- **Card**: Container component with padding options
- **Input**: Form input with label and error handling
- **MoodSelector**: Mental health mood selection interface
- **Navigation**: Main navigation with role-based menu items

**Component Props Pattern:**
- Interface-based props with TypeScript
- Optional props with default values
- Consistent naming conventions
- Event handler props (onNavigate, onLogout, etc.)

### Styling System

**Tailwind CSS Configuration:**
- Custom NEONEXUS color palette:
  - `neon-blue`: Primary color (#0ea5e9)
  - `neon-lavender`: Secondary color (#a855f7)  
  - `neon-mint`: Accent color (#14b8a6)
- Custom font family: Inter and Poppins
- Mobile-first responsive design approach

**Design Guidelines:**
- Light lavender background (#faf5ff) for calming effect
- Soft pastel color scheme for mental health sensitivity
- Consistent spacing and typography
- Subtle animations and micro-interactions

### Backend Integration

**Current State:**
- Mock data and simulated API calls
- No real backend integration in prototype

**Backend Structure** (for context):
- Express.js API with TypeScript
- RESTful endpoints for auth, users, chatbot, appointments, resources, forum, analytics
- PostgreSQL database schema designed for mental health data
- Security-first approach with encrypted sensitive data

**API Endpoints** (when implemented):
```
/api/auth/*         - Authentication and registration
/api/users/*        - User profile management  
/api/chatbot/*      - AI chatbot conversations
/api/appointments/* - Counselor session booking
/api/resources/*    - Educational content library
/api/forum/*        - Peer support community
/api/analytics/*    - Admin dashboard data
```

### Mental Health Features

**Key Mental Health Components:**
1. **Mood Check-in**: Daily mood tracking with 1-5 scale and notes
2. **Mental Health Assessments**: PHQ-9, GAD-7 screening questionnaires
3. **Crisis Detection**: AI-powered crisis detection in chatbot
4. **Anonymous Mode**: Privacy protection for sensitive interactions
5. **Cultural Adaptation**: Multi-language support and culturally relevant content

**Data Privacy:**
- Anonymous mode for sensitive features
- Encrypted storage for mental health data
- GDPR/HIPAA compliance considerations
- Role-based access control

### User Roles and Permissions

**User Types:**
- **Student**: Primary users, access to all mental health features
- **Counselor**: Professional counselors, appointment management
- **Admin**: Institution administrators, analytics dashboard
- **Peer Volunteer**: Student volunteers providing peer support

**Role-based Features:**
- Different dashboard layouts per role
- Conditional feature access
- Role-specific navigation menus

## Development Guidelines

### TypeScript Usage

**Comprehensive Type Definitions:**
- All types defined in `src/types/index.ts`
- Strict TypeScript configuration
- Interface-based component props
- Enum types for status values
- Generic types for API responses

**Key Type Categories:**
- User and authentication types
- Mental health assessment types
- Appointment and counseling types
- Chatbot conversation types
- Resource and forum types
- UI component prop types

### Component Development

**Best Practices:**
- Use functional components with hooks
- Define proper TypeScript interfaces for props
- Follow the established naming conventions
- Use Tailwind CSS classes for styling
- Handle loading and error states
- Implement accessibility features

**Component Template:**
```typescript
interface ComponentNameProps {
  // Define props with proper types
}

const ComponentName: React.FC<ComponentNameProps> = ({
  // Destructure props
}) => {
  // Component logic
  
  return (
    // JSX with proper TypeScript
  );
};

export default ComponentName;
```

### Mental Health Considerations

**Development Guidelines:**
- Use non-stigmatizing language
- Implement crisis detection and response
- Provide clear privacy controls
- Support anonymous interactions
- Include cultural sensitivity in design
- Implement accessibility features
- Handle sensitive data securely

### Testing Approach

**Current State:**
- Basic Create React App test setup
- Testing Library configured (@testing-library/react)
- Jest test runner

**Testing Strategy** (to implement):
- Component unit tests
- Integration tests for user flows
- Accessibility testing
- Mental health feature testing with mock data

## Cultural and Accessibility Notes

### Multi-language Support

**Planned Languages:**
- English (primary)
- Hindi (हिन्दी)
- Urdu (اردو)
- Kashmiri (कॉशुर/کٲشُر)
- Dogri (डोगरी)

**Implementation:**
- Translation objects in type definitions
- Language preference in user profiles
- Right-to-left (RTL) support for Urdu

### Cultural Sensitivity

**Design Considerations:**
- Culturally appropriate colors and symbols
- Inclusive language and terminology
- Diverse representation in imagery
- Respect for cultural values and privacy concerns
- Adapted mental health approaches for Indian students

### Accessibility

**WCAG 2.1 AA Compliance:**
- Semantic HTML elements
- Proper ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility
- Focus management

## Deployment and Production

**Build Process:**
```powershell
# Production build
npm run build

# The build folder contains optimized production files
# Deploy the build folder contents to your hosting platform
```

**Environment Configuration:**
- Create React App environment variable support
- Use `.env` files for configuration
- Different configurations for development/production

**Production Considerations:**
- HTTPS required for mental health data
- Content Security Policy headers
- Data encryption at rest and in transit
- Regular security audits
- Performance monitoring

## Related Documentation

- **Main Project README**: `../README.md` - Comprehensive project overview
- **Contributing Guide**: `../CONTRIBUTING.md` - Development workflow and standards  
- **Database Schema**: `../docs/database-schema.md` - Backend database design
- **Setup Guide**: `../setup.md` - Quick development setup instructions

## Future Development Areas

**Immediate Priorities:**
1. Real backend API integration
2. Proper React Router implementation
3. Enhanced state management
4. Comprehensive testing suite
5. Accessibility improvements

**Advanced Features:**
1. PWA implementation for offline access
2. Real-time chat with counselors
3. Advanced AI chatbot integration
4. Mobile app development
5. Performance optimization