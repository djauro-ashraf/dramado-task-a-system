# 🎭 DramaDo - Productivity, Dramatically!

A MERN stack web application that transforms task management into a dramatic, interactive experience with alarm-triggered consequences and mood-based feedback.

## Team Members
- Wirba Ashraf Djauro - ID: 220041159
- Elhadj Ibrahima Camara - ID: 220041166
- Katin Gaye - ID: 220041167

## 📋 Features


### Core Features
- ✅ **User Authentication** - JWT-based login/register + Google OAuth

- After Google login, the server redirects to `/auth/callback?token=...` where the client stores the token and loads the user profile.
- 📝 **Task Management** - Create, update, delete tasks with priorities and deadlines
- ⏰ **Dramatic Alarm System** - Browser-based alarms that force user interaction
- 🎭 **Mood Tracking** - Dynamic mood system based on user behavior
- 📊 **Activity Timeline** - Dramatic narration of all user actions
- 🎵 **Custom Alarms** - Upload custom alarm sounds
- 🎯 **Consequence System** - Discipline and chaos scores

### Mood States
- ⭐ **HEROIC** - Discipline ≥ 20, Chaos < 10
- 🎯 **FOCUSED** - Discipline ≥ 10
- 😐 **NEUTRAL** - Balanced state
- 😰 **STRUGGLING** - Chaos ≥ 8, Discipline < 8
- 🌪️ **CHAOTIC** - Chaos ≥ 15

### Score System
- Complete on time: +2 discipline
- Complete late: +1 discipline
- Snooze alarm: +1 chaos
- Ignore alarm: +2 chaos
- Miss deadline: +3 chaos

## 🛠️ Tech Stack

### Frontend
- React 18 with Hooks
- React Router for navigation
- Axios for API calls
- Vite for build tooling
- Web Audio API for alarms

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Passport.js for Google OAuth
- Multer for file uploads
- Helmet + CORS for security

## 📁 Project Structure

```
DramaDo/
├── client/                 # React frontend
│   ├── src/
│   │   ├── app/           # Router & axios config
│   │   ├── auth/          # Auth context & routes
│   │   ├── features/      # Task, activity, mood
│   │   ├── pages/         # Login, Register, Dashboard
│   │   ├── ui/            # Reusable components
│   │   └── styles/        # CSS
│   └── package.json
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── config/        # DB, env, passport
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Auth, validation, errors
│   │   └── validators/    # Joi schemas
│   └── package.json
│
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd DramaDo
```

### 2. Setup Backend
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your MongoDB URI and JWT secret
```

### 3. Setup Frontend
```bash
cd ../client
npm install
```

### 4. Configure Environment Variables

Edit `server/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dramado
JWT_SECRET=your-secret-key-here
CLIENT_URL=http://localhost:5173

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### 5. Run Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Visit: http://localhost:5173

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/google/callback` - OAuth callback

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get single task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Alarm Actions
- `POST /api/tasks/:id/complete` - Complete task
- `POST /api/tasks/:id/snooze` - Snooze alarm (5/10/15/30 min)
- `POST /api/tasks/:id/ignore` - Ignore alarm

### Activity
- `GET /api/activity` - Get activity timeline

### Upload
- `POST /api/upload/alarm` - Upload custom alarm sound

## 🎮 How to Use

1. **Register/Login** - Create account or use Google OAuth
2. **Enable Alarms** - Click "Enable Dramatic Alarms" button
3. **Create Tasks** - Add tasks with deadlines and alarm times
4. **Respond to Alarms** - When alarm triggers:
   - ✅ Complete - Mark task as done
   - ⏰ Snooze - Delay for 5/10/15/30 minutes
   - 🙈 Ignore - Dismiss alarm (increases chaos!)
5. **Track Progress** - View your mood and activity timeline

## 🎨 Unique Features

### Dramatic Messaging
Every action generates theatrical feedback:
- "MAGNIFICENT! A high-priority task completed ON TIME!"
- "REALLY?! Another snooze? This is becoming a tragedy!"
- "IGNORED A HIGH-PRIORITY ALARM?! The plot spirals into chaos!"

### Forced Interaction
Unlike regular to-do apps, DramaDo's alarms DEMAND a response. You must choose: complete, snooze, or face the chaos consequences!

### Mood System
Your behavior shapes your identity:
- Consistent completion → Heroic status
- Frequent snoozing → Chaotic spiral
- Mixed behavior → Struggling protagonist

## 🧪 Testing

### Test User Flow
1. Register new account
2. Create high-priority task with alarm in 1 minute
3. Wait for alarm to trigger
4. Try each response (complete/snooze/ignore)
5. Check mood badge and activity timeline
6. View score changes

### Test Google OAuth
1. Configure Google OAuth credentials
2. Click "Login with Google"
3. Authorize application
4. Verify redirect and login

## 📝 Course Requirements Met

✅ MERN Stack (MongoDB, Express, React, Node.js)
✅ User Authentication (JWT + OAuth)
✅ Protected Routes & Middleware
✅ RESTful API Design
✅ Layered Architecture (MVC + Services)
✅ Input Validation (Joi)
✅ Error Handling
✅ File Uploads (Multer)
✅ Frontend State Management
✅ Responsive Design
✅ Creative Theme Implementation

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on auth endpoints
- Helmet for HTTP headers
- CORS configuration
- Input validation
- User data scoping (users only see their data)

## 🐛 Known Limitations

- Alarms only work when application is open
- Browser may block audio without user interaction
- File uploads limited to 5MB
- Google OAuth requires setup

## 📚 Future Enhancements

- Push notifications for alarms
- Mobile app version
- Task sharing/collaboration
- Calendar integration
- Advanced statistics dashboard
- Gamification badges
- Social features

## 👥 Contributors

This project was developed as part of a Web Programming course at AIU.

## 📄 License

MIT License - See LICENSE file for details

---

**🎭 DramaDo - Because productivity doesn't have to be boring!**
