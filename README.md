# Task Manager App

A full-stack Task Manager application built with React.js, Node.js, Express.js, and MongoDB.  
Users can manage tasks, update profile details, upload profile photos, and track task status from dashboard.

---

## Features

- User Profile Management
- Add New Tasks
- View Recent Tasks
- Pending / Completed / Overdue Task Count
- Country, State, City Dropdown
- Profile Photo Upload
- Responsive Dashboard UI

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router DOM
- React Icons
- Material UI Calendar

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer
- CORS
- Dotenv

---

## Folder Structure

```txt
TMA/
├── Backend/
├── Frontend/
├── README.md
└── .gitignore
```

---

## Installation

### 1. Clone Project

```bash
git clone https://github.com/your-username/task-manager-app.git
cd TMA
```

---

## Backend Setup

```bash
cd Backend
npm install
node server.js
```

Backend will run on:

```txt
http://localhost:8080
```

---

## Frontend Setup

Open a new terminal:

```bash
cd Frontend
npm install
npm run dev
```

Frontend will run on:

```txt
http://localhost:5173
```

---

## Environment Variables

Create a `.env` file inside the `Backend` folder:

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## API Base URL

```txt
http://localhost:8080
```

---

## Author

**Arpit Kumawat**

---

## Future Improvements

- Task Search
- Task Filters
- Dark Mode
- Notifications
- Drag and Drop Tasks
- Role Based Access

---

## License

This project is for learning and portfolio purpose.