# 🛍️ Forever - MERN E-Commerce Website

A full-stack **MERN E-Commerce** application with dedicated **User** and **Admin** panels. Users can browse products, manage carts, place orders, make secure payments, and write product reviews, while admins can efficiently manage products, orders, and customer reviews through a modern dashboard.

---

# 🚀 Live Demo

### 🌐 Backend API

https://ecommerce-project-eight-pink.vercel.app/

### 👤 User Website

https://ecommerce-project-utwk-eight.vercel.app/

### 🛠️ Admin Panel

https://ecommerce-project-glkt.vercel.app/

---

# ✨ Features

## 👤 User Features

- JWT Authentication
- User Registration & Login
- Browse Products
- Search Products
- Filter Products
- Product Details Page
- Product Image Gallery
- Size Selection
- Add to Cart
- Cart Management
- Place Orders
- Razorpay Payment Integration
- Stripe Payment Integration
- Cash on Delivery (COD)
- Order History
- Product Reviews & Ratings
- Responsive Design

---

## 🛠️ Admin Features

- Secure Admin Authentication
- Add Products
- View All Products
- Delete Products
- View Customer Orders
- Update Order Status
- View Customer Reviews
- Delete Customer Reviews
- Responsive Admin Dashboard

---

# ⭐ Review System

- Anyone can view product reviews.
- Logged-in users can submit ratings and reviews.
- Product ratings are calculated using MongoDB Aggregation Pipeline.
- Admins can view and moderate customer reviews.

---

# 📊 MongoDB Aggregation

The review system uses MongoDB Aggregation Pipeline to efficiently fetch review statistics and user information.

Aggregation stages used:

- `$match`
- `$lookup`
- `$facet`
- `$group`
- `$project`
- `$sort`
- `$addFields`
- `$first`
- `$round`
- `$ifNull`

These are used to calculate:

- Average Product Rating
- Total Review Count
- Reviewer Details
- Product Review List

using a **single optimized database query**.

---

# 🏗️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- React Toastify

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Cloudinary
- Multer
- Stripe
- Razorpay

---

# 📂 Project Structure

```text
Ecommerce-Project
│
├── frontend
│
├── admin
│
└── backend
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/Vedant22Agarwal/Ecommerce-Project.git

cd Ecommerce-Project
```

---

## 2. Start Backend

```bash
cd backend

npm install

npm run dev
```

---

## 3. Start Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## 4. Start Admin Panel

```bash
cd admin

npm install

npm run dev
```

---

# 🔑 Admin Credentials

```text
Email    : admin@forever.com

Password : 12345678
```

> Replace these credentials with your own before making the repository public.

---

# 🌍 Deployment

| Application | URL |
|-------------|-----|
| User Website | https://ecommerce-project-utwk-eight.vercel.app/ |
| Admin Panel | https://ecommerce-project-glkt.vercel.app/ |
| Backend API | https://ecommerce-project-eight-pink.vercel.app/ |

---

# 📸 Screenshots

Add screenshots of the following pages:

- Home Page
- Product Details Page
- Cart
- Orders
- Product Reviews
- Admin Dashboard
- Product Management
- Order Management
- Review Management

---

# 👨‍💻 Author

**Vedant Agarwal**

GitHub:

https://github.com/Vedant22Agarwal

---

# 📄 License

This project is developed for learning, educational, and portfolio purposes.