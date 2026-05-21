# 🏥 Smart Hospital

A full-stack hospital management portal that streamlines appointments, prescriptions, and payments for patients, doctors, and admins.

---

## ✨ Features

### 👤 Patient
- Register and log in via email or phone (OTP via Firebase)
- Book appointments with available doctors
- View and track prescriptions
- Pay for appointments via Razorpay

### 🩺 Doctor
- View scheduled appointments
- Issue and manage prescriptions through the portal

### 🛠️ Admin
- Manage hospital staff (doctors, nurses, etc.)
- Oversee appointments and system activity

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| TypeScript | Type-safe development |
| React.js | UI framework |
| Tailwind CSS | Styling |
| Shadcn/ui | Component library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| PostgreSQL | Relational database |
| Prisma ORM | Database access layer |
| Firebase | Phone OTP authentication |
| Razorpay | Payment gateway |
| Webhooks | Secure payment confirmation |

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL
- Firebase project (for OTP)
- Razorpay account (for payments)

### 1. Clone the repository
```bash
git clone https://github.com/Dyuti01/smart-hospital.git
cd smart-hospital
```

### 2. Set up environment variables

Create a `.env` file in the `/backend` directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/smarthospital
JWT_SECRET=your_jwt_secret

FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_PROJECT_ID=your_project_id

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
WEBHOOK_SECRET=your_webhook_secret
```

### 3. Install dependencies & run backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### 4. Install dependencies & run frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 💳 Payment Flow

Payments are handled securely via **Razorpay**. Rather than confirming payment from the frontend (which is insecure), the backend listens to **Razorpay Webhooks** to verify and confirm transactions server-side.

---

## 🔐 Authentication

- **Email** – JWT-based login
- **Phone** – OTP sent via Firebase, then JWT issued on verification

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
