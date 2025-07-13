🏪 RateMyStore
RateMyStore is a full-stack web application developed for the FullStack Intern Coding Challenge. It enables users to register, log in, and rate stores (1–5 stars) with role-based dashboards for Normal Users, Store Owners, and System Administrators. The frontend features a modern, minimalistic glassmorphism design with subtle animations, built using React.js and Bootstrap, while the backend uses Express.js and MySQL/PostgreSQL with JWT authentication.
Table of Contents

Features
Tech Stack
User Roles and Functionalities
Form Validations
Installation & Setup
Project Structure
API Endpoints
Database Schema
Contributing
License
Developed By

Features

Authentication: Secure registration and login using JWT, with role-based access (normal_user, store_owner, admin).
Role-Based Dashboards:
Normal User: View, search, and rate stores.
Store Owner: Manage own stores and view ratings.
System Admin: Manage users/stores and view platform metrics via API.


Store Management: Add, delete, and rate stores with sorting and filtering by Name, Email, and Address.
Rating System: Submit and modify store ratings (1–5 stars), with average and user-specific ratings displayed.
UI Design: Glassmorphism style (translucent cards, blur effects), muted color palette, and smooth animations.
Form Validations: Strict rules for Name, Email, Password, and Address fields.
Responsive Design: Built with Bootstrap for cross-device compatibility.

Tech Stack



Layer
Technology



Frontend
React.js, Bootstrap


Backend
Node.js, Express.js


Database
MySQL/PostgreSQL


Authentication
JWT (JSON Web Tokens)


Styling
Bootstrap, Custom CSS (Glassmorphism)


User Roles and Functionalities
System Administrator

Via API (e.g., Postman):
Add new stores, normal users, and admin users.
View total users, stores, and ratings.
List stores (Name, Email, Address, Rating) and users (Name, Email, Address, Role) with filters (Name, Email, Address, Role).
View user details, including ratings for Store Owners.


Log out from the system.

Normal User

Sign up with Name, Email, Address, and Password.
Log in and update password.
View and search stores by Name and Address, with details:
Store Name, Address, Overall Rating, User's Rating.
Options to submit or modify ratings (1–5 stars).


Sort store listings (ascending/descending) by Name, Email, etc.
Log out from the system.

Store Owner

Log in and update password.
Dashboard features:
View own stores with average ratings.
List users who rated their stores.
Add or delete own stores.


Log out from the system.

Form Validations

Name: 20–60 characters.
Address: Max 400 characters.
Password: 8–16 characters, including at least one uppercase letter and one special character.
Email: Standard email format (e.g., user@example.com).

Installation & Setup
Prerequisites

Node.js (v16 or higher)
MySQL/PostgreSQL
Git

Steps

Clone the Repository
git clone https://github.com/your-username/ratemystore.git
cd ratemystore


Backend Setup

Navigate to the backend directory:cd ratemystore-backend


Install dependencies:npm install


Create a .env file in ratemystore-backend:PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ratemystore
JWT_SECRET=your_jwt_secret


Set up the database:
Create a MySQL/PostgreSQL database named ratemystore.
Run the SQL schema from ratemystore-backend/database/schema.sql.


Start the backend:npm run dev




Frontend Setup

Navigate to the frontend directory:cd ../ratemystore-frontend


Install dependencies:npm install


Start the frontend:npm run dev


Open http://localhost:5173 in your browser.


Access the Application

Frontend: http://localhost:5173
Backend API: http://localhost:5000/api



Project Structure
ratemystore/
├── ratemystore-backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── database/
│   │   └── schema.sql
│   ├── .env
│   └── server.js
├── ratemystore-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddStoreForm.jsx
│   │   │   ├── RateModal.jsx
│   │   │   ├── StarRating.jsx
│   │   │   └── StoreCard.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   └── OwnerDashboard.jsx
│   │   ├── App.jsx
│   │   └── vite.config.js
│   ├── public/
│   └── package.json
└── README.md

API Endpoints
Authentication



Method
Endpoint
Headers
Body



POST
/api/auth/register
—
{ name, email, password, role, address }


POST
/api/auth/login
—
{ email, password }


Stores



Method
Endpoint
Headers
Body



GET
/api/stores
Authorization: Bearer <token>
—


GET
/api/stores/owner
Authorization: Bearer <token>
—


POST
/api/stores/add
Authorization: Bearer <token>
{ name, email, city, zip }


DELETE
/api/stores/:id
Authorization: Bearer <token>
—


Ratings



Method
Endpoint
Headers
Body



POST
`/api/ratings起身




POST
/api/ratings/submit
Authorization: Bearer <token>
{ store_id, rating }


POST
/api/ratings/:storeId
Authorization: Bearer <token>
{ rating }


Admin (via Postman)



Method
Endpoint
Headers
Body



POST
/api/admin/users
Authorization: Bearer <token>
{ name, email, password, role, address }


POST
/api/admin/stores
Authorization: Bearer <token>
{ name, email, city, zip, owner_id }


Database Schema
Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 20 AND LENGTH(name) <= 60),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  role ENUM('normal_user', 'store_owner', 'admin') DEFAULT 'normal_user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Stores
CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 20 AND LENGTH(name) <= 60),
  email VARCHAR(255) UNIQUE NOT NULL,
  city VARCHAR(100),
  zip VARCHAR(20),
  owner_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Ratings
CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id),
  user_id INTEGER REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (store_id, user_id)
);

Contributing

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit changes (git commit -m 'Add your feature').
Push to the branch (git push origin feature/your-feature).
Open a pull request.


Pranjal Nehete 
[Portfolio](https://pranjalnehete.vercel.app/)
FullStack Intern Coding Challenge – Roxiler Systems