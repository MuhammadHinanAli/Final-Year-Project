# 🎓 EduQuest LMS

EduQuest is a full-featured Learning Management System (LMS) web application designed for students and lecturers to manage, explore, and participate in educational content. Built using the **MERN stack** (MongoDB, Express, React, Node.js), EduQuest supports course creation, enrollment, media uploads, user authentication, and even features an AI chatbot prototype.

## 🚀 Features

### 🔐 Authentication
- Secure JWT-based user login & registration
- Role-based access for Students and Lecturers
- Password hashing with bcrypt.js

### 👨‍🏫 Lecturer Panel
- Create, update, and delete courses
- Upload media (images, PDFs, videos) via Cloudinary
- Manage enrolled students

### 👩‍🎓 Student View
- Browse and explore available courses
- Enroll in courses and view personal progress
- Access "My Courses" dashboard

### 🤖 AI Chatbot (Prototype)
- Conversational bot for student help
- Third-party AI integration (basic functionality)

### 💳 Payment System
- PayPal integration for premium course access (sandbox mode)
- Planned for production-ready setup

---

## 🛠️ Tech Stack

| Layer        | Technology                                           |
|--------------|------------------------------------------------------|
| Frontend     | React.js, Vite, Tailwind CSS, Radix UI, React Router |
| Backend      | Node.js, Express.js, JWT, bcrypt.js, Multer          |
| Database     | MongoDB (Mongoose)                                   |
| Media Upload | Cloudinary                                           |
| Payment API  | PayPal REST SDK                                      |
| Dev Tools    | Nodemon, ESLint, Vite                                |

---

## 📂 Project Structure

```bash
eduquest/
├── educlient/              # React frontend
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── ...
├── eduserver/              # Express backend
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
└── README.md

