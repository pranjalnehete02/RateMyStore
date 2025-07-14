# 🏪 RateMyStore

**RateMyStore** is a full-stack web application built for the FullStack Intern Coding Challenge by Roxiler Systems. It allows users to register, log in, and rate stores (1–5 stars) with role-based access and dashboards for:

- 👤 **Normal Users**
- 🧑‍💼 **Store Owners**
- 🛠️ **System Administrators**

The frontend is built using **React.js + TailwindCSS**, and the backend uses **Express.js + MySQL**, with **JWT** authentication.

## 📚 Table of Contents

- [🚀 Features](#-features)
- [🧱 Tech Stack](#-tech-stack)
- [🧑‍💼 User Roles & Functionalities](#-user-roles--functionalities)
- [✅ Form Validations](#-form-validations)
- [⚙️ Installation & Setup](#️-installation--setup)
- [📁 Project Structure](#-project-structure)
- [🔗 API Endpoints](#-api-endpoints)
- [🗄️ Database Schema](#-database-schema)
- [🤝 Contributing](#-contributing)
- [👨‍💻 Developed By](#-developed-by)

## 🚀 Features

- 🔐 **JWT-based Authentication** (Login/Register)
- 🧑‍💼 **Role-Based Dashboards**:
  - Normal User: View & rate stores
  - Store Owner: Manage own stores
  - Admin: Add stores/users (via API/Postman)
- ⭐ **Rating System**: Rate stores from 1–5 stars
- 📊 **View Average & Your Ratings**
- ➕ **Add/Delete Stores** (Store Owner/Admin)
- ✅ **Form Validations** for all fields
- 📱 **Responsive UI** with **TailwindCSS**
- 🔄 **Live Store Updates** after rating or creation

## 🧱 Tech Stack

| Layer    | Technology                   |
| -------- | ---------------------------- |
| Frontend | React.js, TailwindCSS        |
| Backend  | Node.js, Express.js          |
| Database | MySQL                        |
| Auth     | JWT (JSON Web Tokens)        |
| Tools    | Axios, React Router, Postman |

---

## 🧑‍💼 User Roles & Functionalities

### 🔐 System Administrator (via Postman/API)

- Add users and stores
- View platform stats
- Filter/search users and stores
- View ratings per user

### 👤 Normal User

- Register & login
- View store list
- Rate stores (1–5 stars)
- View own rating and average rating

### 🧑‍💼 Store Owner

- Login
- Add/delete their stores
- View average rating of their stores

---

## ✅ Form Validations

| Field    | Validation Rule                                   |
| -------- | ------------------------------------------------- |
| Name     | 20–60 characters                                  |
| Email    | Must be valid email                               |
| Password | 8–16 characters, 1 uppercase, 1 special character |
| Address  | Max 400 characters                                |

## ⚙️ Installation & Setup

### 🛠️ Prerequisites

- Node.js (v16+)
- MySQL
- Git

### 🧩 Clone the Repository

```bash
git clone https://github.com/pranjalnehete02/RateMyStore.git
cd RateMyStore
```

# 📦 RateMyStore Setup Instructions (Full Project in One Script Format)

# 🔙 Backend Setup

```bash
cd ratemystore-backend
npm install
```

# Create .env file

```bash
echo "
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=ratemystore
JWT_SECRET=your_jwt_secret
" > .env
```

- Start MySQL and Create Database

- (Login into MySQL CLI if needed: mysql -u root -p)

```bash
mysql -u your_mysql_user -p -e "CREATE DATABASE ratemystore;"
```

- Import schema manually or using a tool like MySQL Workbench:

- ratemystore-backend/database/schema.sql

- Start Backend Server

```bash
npm run dev
```

# 💻 Frontend Setup

```bash
cd ../ratemystore-frontend
npm install
```

# Start Frontend

```bash
npm run dev
```

- Open Frontend in browser

# http://localhost:5173

# 📁 Project Structure

- Directory tree of the project

```bash
# RateMyStore/
# ├── ratemystore-backend/
# │   ├── controllers/
# │   ├── models/
# │   ├── routes/
# │   ├── middleware/
# │   ├── database/
# │   │   └── schema.sql
# │   ├── .env
# │   └── server.js
# ├── ratemystore-frontend/
# │   ├── src/
# │   │   ├── components/
# │   │   │   ├── AddStoreForm.jsx
# │   │   │   ├── RateModal.jsx
# │   │   │   ├── StarRating.jsx
# │   │   │   └── StoreCard.jsx
# │   │   ├── pages/
# │   │   │   ├── Login.jsx
# │   │   │   ├── Register.jsx
# │   │   │   ├── UserDashboard.jsx
# │   │   │   └── OwnerDashboard.jsx
# │   │   ├── App.jsx
# │   │   └── vite.config.js
# │   ├── public/
# │   └── package.json
# ├── README.md
# └── vercel.json
```

# 🔗 API Endpoints

# 📌 Authentication

- POST /api/auth/register -> { name, email, password, role, address }

- POST /api/auth/login -> { email, password }

- 🏪 Stores

- GET /api/stores -> Get all stores

- GET /api/stores/owner -> Get stores by logged-in store owner

- POST /api/stores/add -> Add a new store

- DELETE /api/stores/:id -> Delete a store

# ⭐ Ratings

- POST /api/ratings/:storeId -> Submit or update a rating

- POST /api/ratings/submit -> Alternate way to submit a rating

- ⚙️ Admin-Only (via Postman)

- POST /api/admin/users -> Add a new user

- POST /api/admin/stores -> Add store with owner_id

# 🗄️ Database Schema

# 📌 users table

```bash
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  role ENUM('normal_user', 'store_owner', 'admin') DEFAULT 'normal_user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

# 📌 stores table

```bash
CREATE TABLE stores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  city VARCHAR(100),
  zip VARCHAR(20),
  owner_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

# 📌 ratings table

```bash
CREATE TABLE ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  store_id INT,
  user_id INT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (store_id, user_id),
  FOREIGN KEY (store_id) REFERENCES stores(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

# Screenshots

# 🤝 Contributing

- 1. Fork the repository

- 2. Create a feature branch

```bash
git checkout -b feature/your-feature
```

- 3. Commit your changes

```bash
git commit -m "Add your feature"
```

- 4. Push the branch

```bash
git push origin feature/your-feature
```

- 5. Open a pull request on GitHub

```bash
git pull
```

# 👨‍💻 Developed By

# Pranjal Nehete https://pranjalnehete.vercel.app/

# FullStack Intern Coding Challenge – Roxiler Systems

# GitHub: https://github.com/pranjalnehete02
