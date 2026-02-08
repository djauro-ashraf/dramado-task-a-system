# 🧪 API Testing Guide

This document provides example API requests you can test with tools like Postman, cURL, or Thunder Client.

## Base URL
```
http://localhost:5000/api
```

## 1. Authentication Endpoints

### Register New User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "🎭 Welcome to DramaDo! Your dramatic journey begins!",
  "data": {
    "user": {
      "_id": "...",
      "email": "john@example.com",
      "name": "John Doe",
      "disciplineScore": 0,
      "chaosScore": 0,
      "mood": "neutral"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

## 2. Task Endpoints

### Create Task
```http
POST /tasks
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Finish project documentation",
  "description": "Complete all README files and API docs",
  "priority": "high",
  "deadline": "2024-12-31T23:59:59.000Z",
  "alarmTime": "2024-12-31T10:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "🎭 Task created! The drama intensifies!",
  "data": {
    "task": {
      "_id": "...",
      "userId": "...",
      "title": "Finish project documentation",
      "description": "Complete all README files and API docs",
      "priority": "high",
      "status": "todo",
      "deadline": "2024-12-31T23:59:59.000Z",
      "alarmTime": "2024-12-31T10:00:00.000Z",
      "createdAt": "2024-12-20T10:00:00.000Z"
    }
  }
}
```

### Get All Tasks
```http
GET /tasks
Authorization: Bearer YOUR_JWT_TOKEN
```

**Optional Query Parameters:**
- `status=todo` - Filter by status (todo, done, overdue)
- `priority=high` - Filter by priority (low, medium, high)

### Get Single Task
```http
GET /tasks/{taskId}
Authorization: Bearer YOUR_JWT_TOKEN
```

### Update Task
```http
PATCH /tasks/{taskId}
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Updated task title",
  "priority": "medium"
}
```

### Delete Task
```http
DELETE /tasks/{taskId}
Authorization: Bearer YOUR_JWT_TOKEN
```

## 3. Alarm Action Endpoints

### Complete Task
```http
POST /tasks/{taskId}/complete
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "🎉 Task completed!",
  "data": {
    "task": {
      "_id": "...",
      "status": "done",
      "completedAt": "2024-12-20T14:30:00.000Z"
    },
    "user": {
      "disciplineScore": 2,
      "chaosScore": 0,
      "mood": "neutral"
    }
  }
}
```

### Snooze Task
```http
POST /tasks/{taskId}/snooze
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "minutes": 15
}
```

**Valid minutes:** 5, 10, 15, 30

**Response:**
```json
{
  "success": true,
  "message": "⏰ Snoozed for 15 minutes. The drama postponed!",
  "data": {
    "task": {
      "_id": "...",
      "snoozedUntil": "2024-12-20T14:45:00.000Z"
    },
    "user": {
      "disciplineScore": 0,
      "chaosScore": 1,
      "mood": "neutral"
    }
  }
}
```

### Ignore Task
```http
POST /tasks/{taskId}/ignore
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "🙈 Task alarm ignored. Chaos reigns!",
  "data": {
    "task": {
      "_id": "...",
      "alarmTime": null
    },
    "user": {
      "disciplineScore": 0,
      "chaosScore": 2,
      "mood": "neutral"
    }
  }
}
```

## 4. Activity Endpoints

### Get Activity Timeline
```http
GET /activity?limit=50
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "_id": "...",
        "userId": "...",
        "taskId": "...",
        "type": "COMPLETED",
        "message": "🎭 MAGNIFICENT! A high-priority task completed ON TIME!",
        "meta": {
          "wasOnTime": true,
          "priority": "high",
          "disciplineGained": 2
        },
        "createdAt": "2024-12-20T14:30:00.000Z"
      }
    ],
    "stats": {
      "totalActivities": 10,
      "tasksCompleted": 5,
      "tasksSnoozed": 2,
      "tasksIgnored": 1,
      "missedDeadlines": 1,
      "tasksCreated": 8
    },
    "count": 10
  }
}
```

## 5. Upload Endpoints

### Upload Custom Alarm Sound
```http
POST /upload/alarm
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: multipart/form-data

alarm: [audio file]
```

**Supported formats:** MP3, WAV, OGG
**Max size:** 5MB

**Response:**
```json
{
  "success": true,
  "message": "🎵 Alarm sound uploaded successfully!",
  "data": {
    "url": "/uploads/alarms/alarm-userId-timestamp-random.mp3",
    "filename": "alarm-userId-timestamp-random.mp3",
    "originalName": "my-alarm.mp3",
    "size": 245678
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Title is required, Password must be at least 6 characters long"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "statusCode": 401,
  "message": "No token provided"
}
```

### 404 Not Found
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Task not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Email already registered"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal Server Error"
}
```

## Testing Workflow

### Complete User Flow Test

1. **Register**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'
```

2. **Save token from response**
```bash
TOKEN="your-jwt-token-here"
```

3. **Create high-priority task**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Important meeting",
    "priority": "high",
    "alarmTime": "2024-12-20T15:00:00.000Z"
  }'
```

4. **Get all tasks**
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

5. **Complete task**
```bash
curl -X POST http://localhost:5000/api/tasks/{taskId}/complete \
  -H "Authorization: Bearer $TOKEN"
```

6. **Check activity**
```bash
curl -X GET http://localhost:5000/api/activity \
  -H "Authorization: Bearer $TOKEN"
```

## Rate Limiting

- **Auth endpoints:** 5 requests per 15 minutes
- **General API:** 100 requests per 15 minutes
- **Uploads:** 10 requests per hour

When rate limited:
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later"
}
```

---

**Happy Testing! 🎭**
