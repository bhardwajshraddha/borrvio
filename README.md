# Borrvio — Peer-to-Peer Rental Marketplace

> **"Rent Anything, From Anyone, Near You"**

Borrvio is a full-stack web application that enables individuals to list their personal items for short-term rent and allows others to browse, book, and rent those items — cameras, bicycles, laptops, dresses, and more.

---

## 🔗 Live Demo

## 🌐 [Live Website](https://borrvio.vercel.app/)

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

---

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

## 👩‍💻 Author

**Shraddha Bhardwaj**

- LinkedIn: [linkedin.com/in/shraddhabhardwaj](https://www.linkedin.com/in/shraddhabhardwaj/)
- GitHub: [github.com/bhardwajshraddha](https://github.com/bhardwajshraddha)

---

## 📄 License

This project is for educational purposes — MCA Final Year Project.
