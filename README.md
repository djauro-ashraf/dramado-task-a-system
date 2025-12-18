# DramaDo – Dramatic Task and Alarm Management System

DramaDo is a MERN-stack based web application developed for the **Web Programming Lab (CSE 4540 / CSE 4578)**.  
The system transforms everyday task management into an interactive and dramatic experience by combining task deadlines, alarms, and exaggerated system feedback.

---

## 📌 Project Overview

DramaDo allows users to create and manage tasks with deadlines and optional alarms.  
When an alarm is triggered, the system actively interacts with the user by playing a sound through the device speaker and requiring an immediate response such as completing, snoozing, or ignoring the task.

User behavior is tracked over time and presented in the form of dramatic narratives, productivity moods, and activity logs.

---

## 🎯 Key Features

- User authentication using JWT and OAuth
- Task creation, update, deletion, and completion (CRUD operations)
- Alarm system integrated with tasks
- Device speaker alerts using HTML5 Audio / Web Audio API
- Dramatic feedback based on user actions
- Productivity mood and consequence tracking
- Activity history and narration timeline
- File upload support for task attachments and alarm sounds

---

## 🛠️ Technologies Used

### Frontend
- React.js
- HTML5 & CSS3 (custom UI, no templates)
- React Router
- React Hooks
- HTML5 Audio / Web Audio API

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- OAuth (Google Authentication)
- Middleware for authentication and error handling

### Version Control
- Git & GitHub

---

## 👥 Team Members

- **Wirba Ashraf Djauro** – 220041159  
- **Elhadj Ibrahima Camara** – 220041166  
- **Katin Gaye** – 220041167  

---

## 📂 Project Structure

dramado-task-alarm-system/ │ ├── client/          # React frontend ├── server/          # Express backend │   ├── models/      # Mongoose schemas │   ├── routes/      # API routes │   ├── middleware/  # Authentication & validation │   └── controllers/ # Business logic │ └── README.md

---

## 🚀 How to Run the Project (Development)

1. Clone the repository
```bash
git clone https://github.com/<your-username>/dramado-task-alarm-system.git

2. Install backend dependencies



cd server
npm install

3. Install frontend dependencies



cd ../client
npm install

4. Start the backend server



npm run dev

5. Start the frontend



npm start
---
