

````
# 🚗 Driving Test Management System

A **full-stack web application** for managing driving test appointments, users, and roles.  
Built with **Node.js, Express, and MongoDB**, it provides authentication, role-based access, and a responsive frontend UI for driving schools and learners.

---

## ✨ Features
- 👤 **User Authentication** – Secure signup & login with encryption.  
- 🔑 **Role-Based Access** – Different dashboards for **Admin**, **Examiner**, and **User**.  
- 📅 **Appointment Management** – Book, update, and cancel driving test slots.  
- 📊 **Admin Panel** – Manage users, appointments, and examiners.  
- 📱 **Responsive Frontend** – Built with HTML, CSS, Bootstrap, and JavaScript.  

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** Custom middleware with encryption  
- **Frontend:** HTML5, CSS3, Bootstrap, JavaScript  
- **Version Control:** Git & GitHub  

---

## 📂 Project Structure
```bash
├── connection.js             # MongoDB connection
├── encryption.js             # Password encryption
├── index.js                  # Server entry point
│
├── controller/
│   └── userController.js     # User-related business logic
│
├── middleware/
│   ├── authentication.js     # Auth middleware
│   └── role-based/           # Role-based access control
│       ├── admin.js
│       └── examiner.js
│
├── models/
│   ├── Appointment.js        # Appointment schema
│   ├── userModel.js          # User schema
│   └── enums/                # Enums for roles & test types
│
├── public/                   # Frontend static assets
│   ├── css/                  # Styles (Bootstrap, custom)
│   ├── img/                  # Images
│   ├── js/                   # Frontend scripts
│   └── driving-school-website-template.jpg
│
├── package.json              # Dependencies
└── README.md                 # Documentation
````

---

## ⚙️ Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure Environment

Create a `.env` file in the root with:

```env
MONGO_URI=your-mongodb-uri
PORT=5000
JWT_SECRET=your-secret-key
```

### 4️⃣ Run the server

```bash
npm start
```

The app will run on: `http://localhost:5000`

---

```
