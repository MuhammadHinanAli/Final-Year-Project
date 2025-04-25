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

## 📸 Screenshots

> Include images like:
> - Student Dashboard
> - Course Creation Page
> - Chatbot Interface
> - Payment Workflow

---

## 🛠️ Project Structure

```bash
EduQuest/
├── eduserver/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── educlient/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.js
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
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

---

## 🧠 AI Chatbot Integration

This project uses OpenAI (ChatGPT API) or Google Dialogflow to power an intelligent assistant for students.

- Configure API keys in the backend
- Responses are context-aware and tailored to EduQuest's domain

---

## 📈 Future Enhancements

- Video progress resumption
- Certificate generation upon course completion
- Admin dashboard with analytics
- Notifications and reminders
- PWA (Progressive Web App) support

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss your proposed changes.

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/YourFeatureName

# Commit and push
git commit -m "Add: Your feature description"
git push origin feature/YourFeatureName
```

---

## 📜 License

This project is licensed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

- **Author:** Muhammad Hinan Ali

---

> "Empowering digital education with modern web technologies — one course at a time."
