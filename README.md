# RateMyStore

A full-stack MERN + SQL web app for rating and reviewing local stores with secure authentication and real-time feedback.

# 🏬 RateMyStore

A full-stack web application that allows users to browse local stores, rate them, and leave reviews. Built using the MERN stack with a SQL database for robust and scalable data handling.

---

## 🚀 Features

- 🔐 **User Authentication** (JWT-based)
- 🏪 **Store Listings** with basic details
- ⭐ **Submit and view ratings and reviews**
- 📊 **Average rating calculation** per store
- 🗃️ **PostgreSQL** or MySQL database integration
- ⚙️ **Protected routes** and session management
- 🧩 **Modular architecture** (Frontend + Backend separation)

---

## 🛠️ Tech Stack

**Frontend:**

- React.js
- Axios
- React Router DOM
- Formik + Yup (forms and validation)

**Backend:**

- Node.js + Express.js (or NestJS)
- JWT (Authentication)
- Bcrypt.js (Password hashing)
- CORS, dotenv, express.json

**Database:**

- PostgreSQL / MySQL
- Sequelize / Knex.js (optional ORM)

---

## 📁 Project Structure

```
RateMyStore/
├── client/          # React frontend
│   ├── src/
│   └── ...
├── server/          # Express/NestJS backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── ...
└── README.md
```

---

## 🔧 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/RateMyStore.git
cd RateMyStore
```

---

### 2. Setup Frontend

```bash
cd client
npm install
npm start
```

---

### 3. Setup Backend

```bash
cd server
npm install
# Create .env file with DB and JWT config
node index.js
```

---

### 4. Setup Database

1. Use PostgreSQL or MySQL
2. Create tables: `users`, `stores`, `ratings`
3. Add credentials to `.env` file in the backend

---

## 🌐 Environment Variables

**Create a `.env` file in `/server`:**

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_pass
DB_NAME=store_ratings
JWT_SECRET=your_secret_key
```

---

## 🧪 Future Enhancements

- Admin panel for managing stores/reviews
- Pagination and search
- Upload store images
- Mobile responsive UI
- Like/dislike review feedback

---

## 🤝 Contribution

Feel free to fork this repo, raise issues, or submit pull requests.
Built as part of a full-stack practice + interview showcase.

---

## 👨‍💻 Author

**Pranjal Nehete**
A passionate developer working on full-stack technologies.
