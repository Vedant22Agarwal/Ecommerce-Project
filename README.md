# 🛍️ Forever - MERN E-Commerce Website

A full-stack **MERN E-Commerce application** with dedicated **User** and **Admin** panels.

Users can browse products, search and filter products, manage their cart, authenticate using email/password or Google, reset passwords using OTP verification, select delivery locations using an interactive map, place orders, make secure payments, and submit product reviews.

Admins can manage products, orders, and customer reviews through a dedicated admin dashboard.

---

# 🚀 Live Demo

### 👤 User Website

https://ecommerce-project-utwk-eight.vercel.app/

### 🛠️ Admin Panel

https://ecommerce-project-glkt.vercel.app/

### 🌐 Backend API

https://ecommerce-project-eight-pink.vercel.app/

---

# ✨ Features

## 👤 User Features

### 🔐 Authentication

- User Registration
- Email & Password Login
- Google OAuth Login
- JWT Authentication
- Access Token & Refresh Token
- Protected User Routes
- Secure HTTP-only Authentication Cookies

### 🔑 Forgot Password

- Forgot Password
- OTP Generation
- OTP Email Delivery
- OTP Verification
- OTP Expiration
- Secure Password Reset
- Reset Token Verification
- Password Hashing with bcrypt

### 🛍️ Shopping

- Browse Products
- Search Products
- Filter Products
- Product Details
- Product Image Gallery
- Product Size Selection
- Add Products to Cart
- Update Cart
- Remove Products from Cart
- Persistent Cart Data

### 📍 Location & Delivery

- Detect Current User Location
- Interactive Leaflet Map
- Select Delivery Location from Map
- Reverse Geocoding
- Forward Geocoding
- Address → Map Synchronization
- Map → Address Synchronization
- Save User Location
- Restore Saved Location
- Restore Saved Address
- Latitude & Longitude Storage
- Structured Delivery Address

### 📦 Orders

- Place Orders
- Cash on Delivery
- Stripe Payments
- Razorpay Payments
- Payment Verification
- Order History
- Order Status
- Protected Order Routes

### ⭐ Product Reviews

- View Product Reviews
- Submit Product Reviews
- Submit Product Ratings
- Average Rating Calculation
- Total Review Count
- Reviewer Information
- Admin Review Moderation

### 📱 User Interface

- Responsive Design
- Mobile Friendly
- Toast Notifications
- Responsive Checkout
- Interactive Product Pages
- Interactive Delivery Map

---

# 🛠️ Admin Features

## 🔐 Admin Authentication

- Secure Admin Login
- JWT Authentication
- Protected Admin Routes

## 📦 Product Management

- Add Products
- Upload Product Images
- View All Products
- Delete Products
- Manage Product Information
- Manage Product Categories
- Manage Product Sizes
- Manage Product Prices

## 📋 Order Management

- View Customer Orders
- View Order Details
- Update Order Status
- Manage Customer Orders

## ⭐ Review Management

- View Customer Reviews
- View Review Details
- Delete Customer Reviews
- Moderate Product Reviews

## 📊 Admin Dashboard

- Product Management
- Order Management
- Review Management
- Responsive Admin Interface

---

# ⭐ Review System

The application includes a complete product review and rating system.

### User Side

- Anyone can view product reviews.
- Logged-in users can submit ratings and reviews.
- Product ratings are displayed on product pages.

### Admin Side

- Admins can view all customer reviews.
- Admins can delete inappropriate reviews.
- Admins can moderate customer feedback.

### Review Statistics

The system calculates:

- Average Product Rating
- Total Review Count
- Reviewer Details
- Product Review List

---

# 📊 MongoDB Aggregation

The review system uses the **MongoDB Aggregation Pipeline** to efficiently retrieve review statistics and related user information.

Aggregation stages used include:

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

These operations are used to calculate:

- Average Product Rating
- Total Review Count
- Reviewer Information
- Product Review List

---

# 📍 Location & Delivery System

The application includes an interactive delivery location system using browser geolocation, Leaflet, OpenStreetMap, and Nominatim.

## Location Features

- Detect user's current location
- Display current location on an interactive map
- Click on the map to select a delivery location
- Reverse geocoding
- Forward geocoding
- Address automatically updates after selecting a map location
- Map automatically moves when the address is changed
- Save delivery location to MongoDB
- Restore saved location during checkout
- Restore saved address fields during checkout

---

## 🔄 Location Flow

```text
                    User
                     │
                     ▼
          ┌─────────────────────┐
          │ Current Location    │
          │ or Address Input    │
          └──────────┬──────────┘
                     │
                     ▼
              Geolocation /
               Geocoding
                     │
                     ▼
          ┌─────────────────────┐
          │    Latitude +       │
          │    Longitude        │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │   Leaflet Map       │
          │       📍            │
          └──────────┬──────────┘
                     │
                     ↕
          Address Synchronization
                     │
                     ▼
          ┌─────────────────────┐
          │ Street              │
          │ City                │
          │ State               │
          │ ZIP Code            │
          │ Country             │
          └──────────┬──────────┘
                     │
                     ▼
                 MongoDB
```

---

# 📌 Stored Location Structure

The user's location is stored in MongoDB using a structured address format.

```json
{
  "location": {
    "latitude": 23.819225584910775,
    "longitude": 86.43627680738926,
    "address": {
      "street": "Street / House Number",
      "city": "Dhanbad",
      "state": "Jharkhand",
      "zipcode": "826001",
      "country": "India"
    }
  }
}
```

This allows the application to access individual address fields directly without parsing a single formatted address string.

---

# 🔐 Authentication Architecture

The application supports both traditional email/password authentication and Google OAuth.

## Email & Password Authentication

```text
User
 │
 ▼
Email + Password
 │
 ▼
Backend
 │
 ▼
Validate Credentials
 │
 ▼
Generate JWT
 │
 ▼
Access Token + Refresh Token
 │
 ▼
Authenticated User
```

## Google OAuth Authentication

```text
User
 │
 ▼
Google Login
 │
 ▼
Google Credential
 │
 ▼
Backend
 │
 ▼
Verify Google Token
 │
 ▼
Find Existing User
 │
 ├── Existing User
 │
 └── New User
       │
       ▼
    Create User
       │
       ▼
Generate JWT Tokens
       │
       ▼
Authenticated User
```

---

# 🔑 Forgot Password Flow

The application implements an OTP-based password reset system.

```text
Forgot Password
       │
       ▼
Enter Email
       │
       ▼
Generate OTP
       │
       ▼
Send OTP through Email
       │
       ▼
Enter OTP
       │
       ▼
Verify OTP
       │
       ▼
Generate Reset Token
       │
       ▼
Enter New Password
       │
       ▼
Reset Password
```

### Security

- OTP expiration
- OTP verification
- Reset token verification
- Password hashing
- Protected reset flow
- Email validation

---

# 💳 Payment System

The application supports multiple payment methods.

## 💵 Cash on Delivery

```text
Checkout
   │
   ▼
Cash on Delivery
   │
   ▼
Place Order
   │
   ▼
Order Created
```

## 💳 Stripe

```text
Checkout
   │
   ▼
Stripe
   │
   ▼
Create Checkout Session
   │
   ▼
Stripe Payment
   │
   ▼
Payment Verification
   │
   ▼
Order Confirmation
```

## 💳 Razorpay

```text
Checkout
   │
   ▼
Razorpay
   │
   ▼
Create Razorpay Order
   │
   ▼
Payment
   │
   ▼
Backend Verification
   │
   ▼
Order Confirmation
```

---

# 🏗️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router
- React Toastify
- Leaflet
- React Leaflet
- Google OAuth

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Google OAuth
- Nodemailer
- Cloudinary
- Multer
- Stripe
- Razorpay

## Database

- MongoDB
- Mongoose ODM
- MongoDB Aggregation Pipeline

## External APIs & Services

- Google OAuth
- OpenStreetMap
- Nominatim Geocoding API
- Stripe
- Razorpay
- Cloudinary
- Nodemailer

---

# 📂 Project Structure

```text
Ecommerce-Project
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── admin
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── utils
│   ├── db
│   └── package.json
│
├── .gitignore
│
└── README.md
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/Vedant22Agarwal/Ecommerce-Project.git

cd Ecommerce-Project
```

## 🔧 Backend Setup

```bash
cd backend
npm install
npm run dev
```

## 🌐 Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

## 🛠️ Admin Panel Setup

Open another terminal:

```bash
cd admin
npm install
npm run dev
```

---

# 🔑 Environment Variables

Create the required `.env` files for the backend, frontend, and admin applications.

## Backend Environment Variables

```env
MONGODB_URI=
DB_NAME=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

GOOGLE_CLIENT_ID=

SMTP_USER=
SMTP_PASSWORD=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

STRIPE_SECRET_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

FRONTEND_URL=
ADMIN_URL=
```

## Frontend Environment Variables

```env
VITE_BACKEND_URL=
VITE_GOOGLE_CLIENT_ID=
VITE_RAZORPAY_KEY_ID=
```

> ⚠️ Never commit `.env` files or private API keys to GitHub.

---

# 🔐 Admin Credentials

For local development:

```text
Email    : admin@forever.com
Password : 12345678
```

> ⚠️ Replace these credentials with your own secure credentials before making the repository public.

---

# 🌍 Deployment

The application is deployed using **Vercel**.

| Application | URL |
|---|---|
| 👤 User Website | https://ecommerce-project-utwk-eight.vercel.app/ |
| 🛠️ Admin Panel | https://ecommerce-project-glkt.vercel.app/ |
| 🌐 Backend API | https://ecommerce-project-eight-pink.vercel.app/ |

---

# 🔒 Security

The project implements multiple security mechanisms:

- JWT Authentication
- Protected API Routes
- Password Hashing with bcrypt
- Google Token Verification
- OTP Expiration
- Reset Token Verification
- HTTP-only Authentication Cookies
- Environment Variables for Secrets
- Admin Route Protection
- User Route Protection
- Input Validation
- Email Validation
- Protected Location API
- Protected Order API

---

# 🧩 API Modules

## 👤 User API

```text
/api/user
```

Handles:

- Registration
- Login
- Google Login
- Forgot Password
- OTP Verification
- Password Reset
- Location Management
- User Authentication

## 📦 Product API

```text
/api/product
```

Handles:

- Product Creation
- Product Retrieval
- Product Deletion
- Product Management

## 🛒 Cart API

```text
/api/cart
```

Handles:

- Add to Cart
- Update Cart
- Retrieve Cart
- Remove Cart Items

## 📋 Order API

```text
/api/order
```

Handles:

- Order Creation
- Stripe Payment
- Razorpay Payment
- Payment Verification
- Order Retrieval
- Order Status Management

## ⭐ Review API

Handles:

- Add Review
- Get Product Reviews
- Review Statistics
- Admin Review Management

---

# 📍 Location API

The location API is protected using JWT authentication.

## Save Location

```http
PUT /api/user/location
```

Example request:

```json
{
  "latitude": 23.819225584910775,
  "longitude": 86.43627680738926,
  "address": {
    "street": "Street / House Number",
    "city": "Dhanbad",
    "state": "Jharkhand",
    "zipcode": "826001",
    "country": "India"
  }
}
```

## Get Saved Location

```http
GET /api/user/location
```

The endpoint returns the authenticated user's saved coordinates and structured delivery address.

---

# 📸 Screenshots

Add screenshots of the following pages to showcase the application.

## 👤 User Website

- Home Page
- Collection Page
- Product Details Page
- Cart
- Login
- Google Login
- Forgot Password
- OTP Verification
- Password Reset
- Checkout
- Delivery Location Map
- Orders
- Product Reviews

## 🛠️ Admin Panel

- Admin Login
- Admin Dashboard
- Product Management
- Add Product
- Order Management
- Order Details
- Review Management

---

# 🚀 Future Improvements

Potential future improvements include:

- Wishlist
- User Profile Page
- Multiple Saved Addresses
- Address Selection
- Order Tracking
- Product Recommendations
- Coupon System
- Inventory Management
- Email Order Confirmation
- Push Notifications
- Advanced Admin Analytics
- Product Pagination
- Improved Search
- Delivery Tracking
- Order Invoice Generation
- User Account Management

---

# 📚 Learning Highlights

This project helped implement and understand:

- MERN Stack Development
- REST API Design
- React.js
- Vite
- Tailwind CSS
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- OAuth Authentication
- Google OAuth Integration
- Password Hashing
- OTP-Based Authentication
- Password Reset Architecture
- MongoDB Schema Design
- MongoDB Aggregation
- Payment Gateway Integration
- Stripe Integration
- Razorpay Integration
- Cloudinary Image Upload
- Multer
- Geolocation APIs
- Browser Geolocation
- Reverse Geocoding
- Forward Geocoding
- Leaflet Maps
- React Leaflet
- Protected Routes
- Admin Authentication
- REST API Development
- Deployment using Vercel

---

# 🧑‍💻 Author

## Vedant Agarwal

GitHub:

https://github.com/Vedant22Agarwal

---

# 📄 License

This project is developed for **learning, educational, and portfolio purposes**.
