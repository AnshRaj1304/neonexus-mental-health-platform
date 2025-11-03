# NEONEXUS Mental Health Platform - API Documentation

## 🚀 Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## 🔐 Authentication

### Headers Required
```javascript
{
  "Authorization": "Bearer <your-jwt-token>",
  "Content-Type": "application/json"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "student@university.edu",
      "role": "student",
      "username": "anita_student"
    },
    "tokens": {
      "accessToken": "jwt-token-here",
      "refreshToken": "refresh-token-here"
    }
  }
}
```

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "username": "new_user",
  "email": "newuser@university.edu",
  "password": "securepassword123",
  "role": "student",
  "institution_id": "UNIV001",
  "full_name": "New User"
}
```

---

## 👥 Peer Forum System

### Get Forum Categories
```http
GET /forum/categories

Response:
{
  "categories": [
    {
      "id": 1,
      "name": "Academic Stress",
      "description": "Discussions about study pressure, exams, and academic challenges",
      "color": "#3B82F6",
      "is_anonymous_only": 1,
      "post_count": 15,
      "last_activity": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Get Posts in Category
```http
GET /forum/categories/1/posts?page=1&limit=20

Response:
{
  "posts": [
    {
      "id": "uuid-here",
      "title": "Struggling with Final Exams",
      "content": "I am feeling overwhelmed...",
      "is_anonymous": true,
      "reply_count": 5,
      "like_count": 12,
      "last_activity": "2024-01-15T14:30:00Z",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### Get Specific Post with Replies
```http
GET /forum/posts/{postId}

Response:
{
  "post": {
    "id": "uuid-here",
    "title": "Post Title",
    "content": "Post content...",
    "is_anonymous": true,
    "like_count": 12,
    "created_at": "2024-01-15T10:00:00Z"
  },
  "replies": [
    {
      "id": "reply-uuid",
      "content": "Reply content...",
      "is_anonymous": true,
      "like_count": 3,
      "created_at": "2024-01-15T11:00:00Z"
    }
  ]
}
```

### Create New Post
```http
POST /forum/categories/1/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Post Title",
  "content": "This is my post content...",
  "anonymous": true
}

Response:
{
  "message": "Post created successfully",
  "postId": "new-post-uuid",
  "crisisAlert": false
}
```

### Create Reply
```http
POST /forum/posts/{postId}/replies
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "This is my reply...",
  "anonymous": true
}
```

### Like/Unlike Content
```http
POST /forum/post/{postId}/like
POST /forum/reply/{replyId}/like
Authorization: Bearer <token>

Response:
{
  "message": "Liked successfully",
  "liked": true
}
```

### Report Content
```http
POST /forum/post/{postId}/report
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "inappropriate_content",
  "description": "This content violates community guidelines"
}
```

---

## 🤖 AI Chatbot System

### Start Conversation
```http
POST /ai-chatbot/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Need help with anxiety"
}

Response:
{
  "conversationId": "conversation-uuid",
  "title": "Need help with anxiety",
  "status": "active"
}
```

### Send Message
```http
POST /ai-chatbot/conversations/{conversationId}/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "I'm feeling very anxious about my upcoming exams"
}

Response:
{
  "response": {
    "content": "I understand that exam anxiety can be really overwhelming...",
    "confidence": 0.85,
    "usedML": true,
    "suggestedActions": ["breathing_exercises", "study_planning"],
    "crisisAlert": false
  },
  "messageId": "message-uuid"
}
```

### Get Conversation History
```http
GET /ai-chatbot/conversations/{conversationId}/messages?limit=50

Response:
{
  "messages": [
    {
      "id": "message-uuid",
      "sender_type": "user",
      "content": "I'm feeling anxious",
      "created_at": "2024-01-15T10:00:00Z"
    },
    {
      "id": "response-uuid", 
      "sender_type": "bot",
      "content": "I understand your anxiety...",
      "created_at": "2024-01-15T10:00:30Z"
    }
  ]
}
```

### Provide Feedback
```http
POST /ai-chatbot/conversations/{conversationId}/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "messageId": "message-uuid",
  "rating": 4,
  "feedback": "This response was helpful"
}
```

---

## 📊 Assessments

### Get Available Assessments
```http
GET /assessments

Response:
{
  "assessments": [
    {
      "id": 1,
      "name": "PHQ-9 Depression Assessment",
      "description": "9-question depression screening tool",
      "category": "depression",
      "estimated_duration": 5,
      "question_count": 9
    }
  ]
}
```

### Start Assessment
```http
POST /assessments/{assessmentId}/start
Authorization: Bearer <token>

Response:
{
  "sessionId": "assessment-session-uuid",
  "questions": [
    {
      "id": 1,
      "question_text": "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
      "question_type": "scale",
      "options": ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    }
  ]
}
```

### Submit Assessment
```http
POST /assessments/sessions/{sessionId}/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "responses": {
    "1": "Several days",
    "2": "More than half the days"
  }
}

Response:
{
  "score": 12,
  "risk_level": "medium",
  "recommendations": ["Consider speaking with a counselor", "Practice self-care activities"],
  "crisisAlert": false
}
```

---

## 📅 Appointments

### Get Available Counselors
```http
GET /appointments/counselors

Response:
{
  "counselors": [
    {
      "id": 2,
      "full_name": "Dr. Priya Mehta",
      "specialization": ["Anxiety", "Depression", "Academic Stress"],
      "rating": 4.8,
      "is_available": true
    }
  ]
}
```

### Book Appointment
```http
POST /appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "counselor_id": 2,
  "appointment_date": "2024-01-20",
  "appointment_time": "14:00",
  "meeting_type": "video",
  "is_anonymous": false,
  "notes": "Need help with exam anxiety"
}

Response:
{
  "appointment": {
    "id": "appointment-uuid",
    "appointment_date": "2024-01-20",
    "appointment_time": "14:00:00",
    "status": "scheduled",
    "meeting_url": "https://meet.example.com/room/uuid"
  }
}
```

### Get User Appointments
```http
GET /appointments/my-appointments
Authorization: Bearer <token>

Response:
{
  "appointments": [
    {
      "id": "appointment-uuid",
      "counselor_name": "Dr. Priya Mehta",
      "appointment_date": "2024-01-20",
      "appointment_time": "14:00:00",
      "status": "scheduled",
      "meeting_type": "video"
    }
  ]
}
```

---

## 🚨 Crisis Detection & Support

### Get Crisis Alerts (Counselors Only)
```http
GET /crisis-detection/alerts
Authorization: Bearer <counselor-token>

Response:
{
  "alerts": [
    {
      "id": "alert-uuid",
      "user_id": 1,
      "alert_type": "self_harm_detection",
      "content_excerpt": "I don't see the point in going on...",
      "risk_level": "high",
      "status": "active",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Update Alert Status
```http
PUT /crisis-detection/alerts/{alertId}
Authorization: Bearer <counselor-token>
Content-Type: application/json

{
  "status": "acknowledged",
  "notes": "Contacted student directly, providing support"
}
```

---

## 📈 Analytics (Admin/Counselor Only)

### Platform Statistics
```http
GET /analytics/platform-stats
Authorization: Bearer <admin-token>

Response:
{
  "users": {
    "total": 1250,
    "active_this_month": 890,
    "new_this_month": 45
  },
  "forum": {
    "total_posts": 2400,
    "posts_this_week": 85,
    "active_categories": 8
  },
  "chatbot": {
    "total_conversations": 5600,
    "crisis_alerts": 12,
    "avg_satisfaction": 4.2
  },
  "appointments": {
    "scheduled": 45,
    "completed_this_month": 120
  }
}
```

### Forum Statistics
```http
GET /forum/stats
Authorization: Bearer <counselor-token>

Response:
{
  "stats": {
    "total_posts": 150,
    "total_replies": 420,
    "posts_this_week": 15,
    "replies_this_week": 45,
    "active_crisis_alerts": 3,
    "pending_reports": 2
  },
  "topCategories": [
    {"name": "Academic Stress", "post_count": 45},
    {"name": "Anxiety & Worry", "post_count": 38}
  ]
}
```

---

## 📚 Resources

### Get Resources
```http
GET /resources?category=anxiety&type=video

Response:
{
  "resources": [
    {
      "id": 1,
      "title": "Managing Exam Anxiety",
      "description": "Practical techniques for reducing exam stress",
      "type": "video",
      "category": "anxiety",
      "url": "https://example.com/video",
      "duration_minutes": 15,
      "rating": 4.5,
      "is_featured": true
    }
  ]
}
```

---

## ⚙️ Health Check

### System Status
```http
GET /health

Response:
{
  "status": "OK",
  "message": "NEONEXUS Backend API is running",
  "timestamp": "2024-01-15T10:00:00Z",
  "version": "1.0.0"
}
```

---

## 🔒 User Roles & Permissions

### Student Role
- ✅ Create forum posts and replies
- ✅ Like and report content  
- ✅ Use AI chatbot
- ✅ Take assessments
- ✅ Book appointments
- ✅ Access resources

### Counselor Role  
- ✅ All student permissions
- ✅ View crisis alerts
- ✅ Access forum statistics
- ✅ Manage appointments
- ✅ View support requests

### Admin Role
- ✅ All counselor permissions
- ✅ Create forum categories
- ✅ Platform analytics
- ✅ User management
- ✅ System configuration

---

## 🚀 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 📝 Sample Test Data

### Test Users
```
Student: student1@university.edu / password123
Counselor: counselor1@university.edu / password123
```

### Sample Forum Categories
1. Academic Stress
2. Anxiety & Worry  
3. Depression Support
4. Relationships

---

## 🔧 Development Notes

### Rate Limiting
- 100 requests per 15 minutes per IP
- Higher limits for authenticated users

### File Uploads
- Maximum file size: 10MB
- Supported formats: jpg, png, pdf, mp4

### Database
- SQLite for development
- PostgreSQL recommended for production

---

**🎯 Ready for Frontend Integration!**

All endpoints are tested and production-ready. Contact the backend team for any questions or additional features needed.