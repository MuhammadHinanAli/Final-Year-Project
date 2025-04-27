# 🎓 EduQuest - Full-Stack Learning Management System (LMS)

EduQuest is a comprehensive MERN stack-based Learning Management System designed to bridge the gap between students and educators in modern e-learning environments. With robust user roles, course management, secure payments, and AI-powered chatbot support, EduQuest empowers both instructors and learners with a seamless online learning experience.

---

## 🚀 Features

### 🧑‍🏫 Lecturer Panel
- Course creation, editing, and deletion
- Upload course materials (videos, docs, etc.)
- Set course price, category, difficulty, and language
- Track student enrollment

### 🧑‍🎓 Student Panel
- Explore, purchase, and enroll in courses
- Track course progress
- View "My Courses" dashboard
- Access downloadable materials
- Chatbot assistant for instant support

### 💻 Tech Stack
- **Frontend**: React.js, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js, JWT, Bcrypt, Multer
- **Database**: MongoDB (Mongoose ODM)
- **Media Storage**: Cloudinary
- **Payments**: PayPal SDK
- **AI Chatbot**: OpenAI / Dialogflow Integration

---

## 📸 Screencast
https://youtu.be/iDyuk3JpTNM

---

## 🛠️ Project Structure

```bash
EduQuest/
├── educlient/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
├── eduserver/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── public/
├── .env
├── package.json
└── README.md
```

---

## 🧪 How to Run Locally

### 🔧 Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- PayPal Developer Account (for sandbox keys)
- OpenAI or Dialogflow API key (for chatbot)
- Cloudinary Account (for file uploads)

### ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/MuhammadHinanAli/Final-Year-Project
cd eduquest

# Setup backend
cd eduserver
npm install
cp .env.example .env
# Edit the .env file with your Mongo URI, JWT Secret, Cloudinary & PayPal keys

# Start backend server
npm run dev

# Setup frontend
cd ../educlient
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the `/backend` folder:

```env
PORT = 5000
CLIENT_URL = http://localhost:5173
MONGO_URI = //ADD YOUR DETAILS
CLOUDINARY_CLOUD_NAME = //ADD YOUR DETAILS
CLOUDINARY_API_KEY = //ADD YOUR DETAILS
CLOUDINARY_API_SECRET = //ADD YOUR DETAILS
PAYPAL_CLIENT_ID = //ADD YOUR DETAILS
PAYPAL_SECRET_ID = //ADD YOUR DETAILS
```

---

## 🧠 AI Chatbot Integration

This project uses GEMINI AI API to power an intelligent assistant for students.

- Configure API keys in the FRONTEND
- Responses are context-aware and tailored to EduQuest's domain

---

## 📈 Future Enhancements

- Video progress resumption
- Certificate generation upon course completion
- Admin dashboard with analytics
- Notifications and reminders
- PWA (Progressive Web App) support

---

## 📧 Contact

- **Author:** Muhammad Hinan Ali

---

> "Empowering digital education with modern web technologies — one course at a time."
