# 🚀 Quick Setup Guide for DramaDo

## Prerequisites Check
Before starting, ensure you have:
- [ ] Node.js v18+ (recommended v20+) installed (`node --version`)
- [ ] MongoDB installed and running (`mongod --version`)
- [ ] npm or yarn installed (`npm --version`)

## Step-by-Step Installation

### 1️⃣ Install Backend Dependencies
```bash
cd server
npm install
```

This installs:
- Express, Mongoose, JWT, Passport
- Validation, security, and file upload libraries

### 2️⃣ Configure Backend Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your settings
nano .env  # or use any text editor
```

**Minimum required settings:**
```env
MONGODB_URI=mongodb://localhost:27017/dramado
JWT_SECRET=create-a-random-secret-key-here
```

**Optional (for Google OAuth):**
- Get credentials from Google Cloud Console
- Enable Google+ API
- Add to .env:
  ```env
  GOOGLE_CLIENT_ID=your-client-id
  GOOGLE_CLIENT_SECRET=your-client-secret
  ```

### 3️⃣ Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 4️⃣ Start MongoDB
**Option A - Local MongoDB:**
```bash
mongod
```

**Option B - MongoDB Atlas:**
- Create free cluster at mongodb.com/atlas
- Get connection string
- Update MONGODB_URI in server/.env

### 5️⃣ Run the Application

**Terminal 1 - Start Backend (port 5000):**
```bash
cd server
npm run dev
```

You should see:
```
🎭 ═══════════════════════════════════════════════════
🎭  DRAMADO API - Where Productivity Meets Drama!
🎭 ═══════════════════════════════════════════════════
🚀  Server running in development mode
📡  Listening on port 5000
🌐  API URL: http://localhost:5000
```

**Terminal 2 - Start Frontend (port 5173):**
```bash
cd client
npm run dev
```

You should see:
```
  VITE v5.0.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 6️⃣ Open Application
Navigate to: **http://localhost:5173**

## ✅ First Steps

1. **Register Account**
   - Click "Register here"
   - Fill in name, email, password
   - Click "Register"

2. **Enable Alarms**
   - Click "Enable Dramatic Alarms 🔊" button
   - This allows browser to play alarm sounds

3. **Create First Task**
   - Click "➕ New Task"
   - Fill in task details
   - Set alarm time (e.g., 1 minute from now)
   - Click "Create Task"

4. **Wait for Alarm**
   - When alarm triggers, modal appears
   - Choose: Complete, Snooze, or Ignore
   - Watch your scores change!

## 🔧 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running:
```bash
# Start MongoDB
mongod

# Or on Windows:
net start MongoDB
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill process on that port or change port in .env

### CORS Error
**Solution:** Check that CLIENT_URL in server/.env matches your frontend URL

### Alarm Not Playing
**Solution:** Click "Enable Dramatic Alarms" button before creating tasks

### Google OAuth Not Working
**Solution:** 
1. Verify Google credentials in .env
2. Check callback URL matches Google Console settings
3. Ensure Google+ API is enabled

## 📦 Production Deployment

### Build Frontend
```bash
cd client
npm run build
```

### Serve Static Files
Add to server/src/app.js:
```javascript
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=strong-production-secret
CLIENT_URL=https://your-domain.com
```

## 🎯 Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Google OAuth works (if configured)
- [ ] Create task works
- [ ] Alarm triggers at set time
- [ ] Complete task increases discipline score
- [ ] Snooze task increases chaos score
- [ ] Ignore task increases chaos score
- [ ] Activity timeline shows all actions
- [ ] Mood badge updates based on scores
- [ ] File upload works (custom alarm sounds)

## 📞 Need Help?

- Check server terminal for backend errors
- Check browser console for frontend errors
- Verify all environment variables are set
- Ensure MongoDB is running
- Check that both servers are running

---

**Happy Drama-ing! 🎭**
