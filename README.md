# Borrvio — Peer-to-Peer Rental Marketplace

> **"Rent Anything, From Anyone, Near You"**

Borrvio is a full-stack web application that enables individuals to list their personal items for short-term rent and allows others to browse, book, and rent those items — cameras, bicycles, laptops, dresses, and more.

---

## 🔗 Live Demo

🌐 Frontend: https://borrvio.vercel.app

⚙️ Backend API: https://borrvio.onrender.com

💻 GitHub Repository: https://github.com/bhardwajshraddha/borrvio

## 🚀 Features

- **JWT Authentication** — Secure login/register with role-based access control
- **Dual Role System** — Same account can act as Owner and Renter
- **Item Listing** — Upload items with multiple images via Cloudinary
- **Booking Lifecycle** — Requested → Accepted → Active → Completed → Cancelled
- **Date Conflict Detection** — Prevents double bookings automatically
- **Razorpay Payment** — Rental fee and security deposit in test mode
- **Trust Score System** — Dynamic score based on ratings, cancellations, damage history
- **Damage Proof Upload** — Before/after photos for dispute resolution
- **PDF Rental Agreement** — Auto-generated on booking confirmation with unique ID
- **Dual Rating System** — Both owner and renter rate each other post-completion
- **Wishlist + Notifications** — Email alerts when item becomes available
- **Image Lightbox** — Swipe/drag navigation without external libraries
- **Google Maps Embed** — Pickup location on item detail page
- **WhatsApp + Call** — Direct contact with owner
- **Owner Dashboard** — Earnings, active rentals, item management
- **Renter Dashboard** — Booking history, payment status, wishlist
- **Delete/Deactivate Items** — Owner can manage listings anytime

---

## 🛠️ Tech Stack

| Part             | Technology                           |
| ---------------- | ------------------------------------ |
| Frontend         | React.js + Tailwind CSS              |
| Backend          | Node.js + Express.js                 |
| Database         | MongoDB + Mongoose                   |
| Authentication   | JWT (JSON Web Tokens)                |
| Payment          | Razorpay (Test Mode)                 |
| Image Upload     | Cloudinary                           |
| PDF Generation   | pdfkit                               |
| Email            | Nodemailer + Gmail SMTP              |
| Deployment       | Vercel (Frontend) + Render (Backend) |
| Database Hosting | MongoDB Atlas                        |

---
## 🏗️ Project Architecture

![Architecture](assets/diagrams/architecture.png)

## 📁 Project Structure

```
borrvio/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Browse.js
│   │   │   ├── ItemDetail.js
│   │   │   ├── AddItem.js
│   │   │   ├── OwnerDashboard.js
│   │   │   ├── RenterDashboard.js
│   │   │   ├── BookingDetail.js
│   │   │   └── Profile.js
│   │   └── App.js
│   └── package.json
│
└── server/                 # Node.js Backend
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── index.js
    └── package.json
```
## 🗄️ Database Design

![ER Diagram](assets/diagrams/er-diagram.png)
---
## 🔗 API Endpoints

Base URL: `https://borrvio.onrender.com/api`

---

### 🔐 Authentication
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/auth/profile` | Get user profile | ✅ |
| PUT | `/auth/profile` | Update user profile | ✅ |

---

### 📦 Items
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/items` | Get all available items | ❌ |
| GET | `/items/:id` | Get single item by ID | ❌ |
| POST | `/items` | Add new item listing | ✅ |
| PUT | `/items/:id` | Update item details | ✅ |
| DELETE | `/items/:id` | Delete item | ✅ |
| PATCH | `/items/:id/toggle` | Toggle item availability | ✅ |

---

### 📅 Bookings
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/bookings` | Create booking request | ✅ |
| PUT | `/bookings/:id` | Update booking status | ✅ |
| GET | `/bookings/my` | Get renter's bookings | ✅ |
| GET | `/bookings/owner` | Get owner's bookings | ✅ |

---

### 💳 Payments
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/payment/create-order` | Create Razorpay order | ✅ |
| POST | `/payment/verify` | Verify payment signature | ✅ |

---

### ⭐ Ratings
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/ratings` | Submit rating | ✅ |
| GET | `/ratings/:userId` | Get user ratings | ❌ |

---

### 📄 Agreements
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/agreements/:bookingId` | Generate PDF agreement | ✅ |
| GET | `/agreements/:bookingId` | Get agreement by booking | ✅ |

---

### 📊 Dashboard
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/dashboard/owner` | Get owner dashboard stats | ✅ |
| GET | `/dashboard/renter` | Get renter dashboard stats | ✅ |

---

### 🖼️ Upload
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/upload` | Upload images to Cloudinary | ✅ |

---

### ❤️ Wishlist
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/wishlist` | Add item to wishlist | ✅ |
| GET | `/wishlist` | Get my wishlist | ✅ |
| DELETE | `/wishlist/:itemId` | Remove from wishlist | ✅ |

---

### 📌 Example Request

**Register User:**
```bash
POST https://borrvio.onrender.com/api/auth/register
Content-Type: application/json

{
  "name": "Shraddha Bhardwaj",
  "email": "shraddha@gmail.com",
  "password": "123456",
  "phone": "9876543210",
  "city": "Pune",
  "area": "Kothrud"
}
```

**Response:**
```json
{
  "_id": "64f...",
  "name": "Shraddha Bhardwaj",
  "email": "shraddha@gmail.com",
  "city": "Pune",
  "trustScore": 100,
  "token": "eyJhbGci..."
}
```

---

### 🔑 Authentication Header
All protected routes require JWT token in the request header:
```
Authorization: Bearer <your_token>
```
## ⚙️ Installation & Setup

### Prerequisites

- Node.js v22+
- MongoDB (local or Atlas)
- Cloudinary account
- Razorpay account (test mode)

### Clone the repository

```bash
git clone https://github.com/bhardwajshraddha/borrvio.git
cd borrvio
```

### Backend Setup

```bash
cd server
npm install
```

Create `.env` file in `server` folder:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm start
```

---

## 🗄️ Database Collections

| Collection | Description                    |
| ---------- | ------------------------------ |
| Users      | Auth, trust score, ratings     |
| Items      | Listings, images, availability |
| Bookings   | Lifecycle, payment, damage     |
| Ratings    | Dual rating system             |
| Agreements | PDF rental agreements          |
| Wishlist   | Saved items + notifications    |

---

## 📸 Screenshots

> Add screenshots of your website here

---
## ☁️ Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| Media Storage | Cloudinary |

Frontend:
https://borrvio.vercel.app

Backend:
https://borrvio.onrender.com

## 🚧 Challenges Faced

- MongoDB Atlas DNS resolution issues
- Razorpay payment verification
- Cloudinary image upload integration
- Date conflict detection logic
- JWT authentication and authorization
- PDF rental agreement generation

  ## 🔮 Future Enhancements

- AI-based item recommendation system
- Mobile application (React Native)
- Real-time chat using Socket.io
- Push notifications
- GPS-based item discovery
- KYC verification
- Advanced analytics dashboard

## 👩‍💻 Author

**Shraddha Bhardwaj**

- LinkedIn: [linkedin.com/in/shraddhabhardwaj](https://www.linkedin.com/in/shraddhabhardwaj/)
- GitHub: [github.com/bhardwajshraddha](https://github.com/bhardwajshraddha)

---

## 📄 License

This project is for educational purposes — MCA Final Year Project.
