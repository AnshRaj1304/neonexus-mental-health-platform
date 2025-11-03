# Frontend Integration Guidelines

## Backend Status: ✅ READY

The NEONEXUS backend is fully operational and ready for frontend integration.

## Server Configuration

- **Backend URL**: `http://localhost:5000`
- **API Base**: `http://localhost:5000/api`
- **CORS Origin**: `http://localhost:3000` (configurable via `FRONTEND_URL` env var)

## Authentication

### JWT Authentication
- **Login**: `POST /api/auth/login`
- **Register**: `POST /api/auth/register`
- **Token**: Include `Authorization: Bearer <token>` header for authenticated endpoints

### User Roles
- `student` - Students seeking mental health support
- `counselor` - Mental health professionals
- `admin` - System administrators
- `peer_volunteer` - Peer support volunteers

## Key API Endpoints

### 🔐 Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### 💭 Forum System
- `GET /api/forum/categories` - Get all forum categories ✅ WORKING
- `GET /api/forum/categories/:id/posts` - Get posts in category
- `GET /api/forum/posts/:id` - Get specific post with replies
- `POST /api/forum/categories/:id/posts` - Create new post (auth required)
- `POST /api/forum/posts/:id/replies` - Reply to post (auth required)
- `POST /api/forum/post/:id/like` - Like/unlike post (auth required)

### 🤖 AI Chatbot
- `POST /api/ai-chatbot/chat` - Send message to AI chatbot
- `GET /api/ai-chatbot/conversations` - Get user's conversations
- `GET /api/ai-chatbot/conversations/:id` - Get specific conversation

### 📅 Appointments
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Book new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### 📊 Assessments
- `GET /api/assessments` - Get available assessments
- `POST /api/assessments/submit` - Submit assessment response
- `GET /api/assessments/results` - Get assessment results

### 🚨 Crisis Detection
- `GET /api/crisis-detection/alerts` - Get crisis alerts (counselor/admin)
- `PUT /api/crisis-detection/alerts/:id` - Update alert status

### 📚 Resources
- `GET /api/resources` - Get mental health resources
- `GET /api/resources/categories` - Get resource categories
- `POST /api/resources/:id/rating` - Rate a resource

## Sample API Responses

### Forum Categories Response
```json
{
  "categories": [
    {
      "id": 1,
      "name": "Academic Stress",
      "description": "Discussions about study pressure, exams, and academic challenges",
      "color": "#3B82F6",
      "is_anonymous_only": 1,
      "post_count": 1,
      "last_activity": "2025-09-14 07:33:55"
    }
  ]
}
```

### Health Check Response
```json
{
  "status": "OK",
  "message": "NEONEXUS Backend API is running",
  "timestamp": "2025-09-14T07:54:26.461Z",
  "version": "1.0.0"
}
```

## Environment Variables

### Backend `.env` Configuration
```env
# Database
DB_PATH=./data/neonexus.sqlite

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:3000

# Security
BCRYPT_ROUNDS=12

# AI/ML Services (optional)
OPENAI_API_KEY=your-openai-api-key
ML_MODEL_PATH=./models/
```

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000` (default React dev server)
- Configurable via `FRONTEND_URL` environment variable

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Array of validation errors if applicable
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Database Features

### Pre-populated Data
- ✅ Forum categories with sample data
- ✅ Database schema fully created (84 tables)
- ✅ Proper indexes for performance
- ✅ Sample data structure prepared

### Key Features
- 🔐 JWT-based authentication with refresh tokens
- 🛡️ Role-based access control
- 🚨 Crisis detection and alerting
- 💬 Anonymous forum posting
- 🤖 ML-enabled chatbot integration
- 📊 Comprehensive analytics
- 🔄 Content moderation system

## Frontend Development Recommendations

### Axios Configuration
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// Add auth token interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

### State Management
Consider using Redux/Zustand for:
- User authentication state
- Forum categories and posts
- Chatbot conversations
- Appointment scheduling

### Error Handling
Implement centralized error handling for:
- Network errors
- Authentication errors (401/403)
- Validation errors (400)
- Server errors (500)

## Testing

### Available Test Endpoints
- `GET /api/health` - Health check (always returns 200)
- `GET /api/forum/categories` - Test forum functionality

### Performance
- Forum categories endpoint: ~50-100ms response time
- Health endpoint: ~5-10ms response time
- Database: SQLite with optimized indexes

## Deployment Notes

For production deployment:
1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure proper CORS origins
4. Consider using PostgreSQL instead of SQLite
5. Implement rate limiting
6. Set up SSL/HTTPS
7. Configure proper logging

---

**Status**: ✅ Backend is fully operational and ready for frontend integration
**Last Updated**: 2025-09-14
**Server**: Running on http://localhost:5000