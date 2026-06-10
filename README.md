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
## Database Schema
```mermaid
erDiagram
    User {
        String userId PK
        String firstName
        String lastName
        String gender
        String email UK
        String password
        String dateOfBirth
        String city
        String state
        String pin
        String phone UK
        String userType
        String avatarUrl
    }

    Patient {
        String id PK
        String patientId FK
        String emergencyContact
        String bloodType
        String allergies
        String chronicConditions
    }

    Doctor {
        String doctorId PK
        String department
        String title
        Float rating
        Int reviewCount
        String experience
        Int bookingFee
        String about
        String registrationNumber
        String certifications
        String specializations
        String languages
        String status
    }

    Education {
        String id PK
        String degree
        String university
        String year
        String doctorId FK
    }

    Availability {
        String id PK
        String doctorId FK
    }

    TimeSlot {
        String id PK
        String start
        String end
        String availabilityId FK
        String mondayAvailabilityId FK
        String tuesdayAvailabilityId FK
        String wednesdayAvailabilityId FK
        String thursdayAvailabilityId FK
        String fridayAvailabilityId FK
        String saturdayAvailabilityId FK
        String sundayAvailabilityId FK
    }

    Report {
        String reportId PK
        String patientId FK
        String doctorId FK
        String patientReportUrl
    }

    Appointment {
        String appointmentId PK
        String patientPersonName
        String patientPersonPhone
        String patientPersonEmail
        DateTime bookedDateTime
        DateTime appointmentDateTime
        String patientId FK
        String doctorId FK
        String timeSlotId FK
        Boolean visited
        String location
        Int duration
        String reasonForVisit
        String notes
        String status
        String followUp
    }

    Vitals {
        String id PK
        String bloodPressure
        Int heartRate
        Float temperature
        Int oxygenSaturation
        String appointmentId FK
    }

    Payment {
        String paymentId PK
        DateTime paymentDateTime
        String customerId FK
        String toId
        String description
        Decimal amount
        Boolean done
        String status
        Json appointmentDetails
    }

    Prescription {
        String prescriptionId PK
        String patientId FK
        String doctorId FK
        String appointmentId FK
        String notes
        Json medications
        Json tests
        String prescriptionUrl
        DateTime dateTime
    }

    Staff {
        String id PK
        String staffId FK
        String department
        DateTime hireDate
        Decimal salary
        String addressId FK
        String shiftId FK
        String status
        DateTime createdAt
        DateTime updatedAt
    }

    Address {
        String addressId PK
        String street
        String city
        String state
        String postalCode
        String country
    }

    Shift {
        String shiftId PK
        String shiftName
        DateTime startTime
        DateTime endTime
    }

    Schedule {
        Int scheduleId PK
        String staffId FK
        String shiftId FK
        DateTime date
        DateTime createdAt
        DateTime updatedAt
    }

    %% User base profile relations
    User ||--o| Patient : "userPatient"
    User ||--o| Doctor : "userDoctor"
    User ||--o| Staff : "userStaff"

    %% Patient relations
    Patient ||--o{ Report : "testReports"
    Patient ||--o{ Appointment : "appointments"
    Patient ||--o{ Payment : "paymentHistory"
    Patient ||--o{ Prescription : "prescriptions"

    %% Doctor relations
    Doctor ||--o{ Education : "education"
    Doctor ||--o| Availability : "availability"
    Doctor ||--o{ Report : "testReports"
    Doctor ||--o{ Appointment : "patientAppointments"
    Doctor ||--o{ Prescription : "prescriptions"

    %% Scheduling
    Availability ||--o{ TimeSlot : "timeslots"
    Appointment }o--|| TimeSlot : "timeSlot"

    %% Appointment sub-records
    Appointment ||--o| Vitals : "vitals"
    Appointment ||--o| Prescription : "prescription"

    %% Staff relations
    Address ||--o{ Staff : "staff"
    Shift ||--o{ Staff : "workers"
    Staff ||--o| Schedule : "schedule"
    Shift ||--o{ Schedule : "schedules"
```
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
git clone https://github.com/Dyuti01/Smart_Hospital.git
cd Smart_Hospital
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
