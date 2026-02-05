# 🎟️ Bơticket - Modern Cinema Booking Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

</div>

<p align="center">
  <strong>BơTicket</strong> is a strictly modern, high-performance cinema booking application built to deliver a premium user experience. It features real-time seat selection, multiple payment gateway integrations, and a robust loyalty program.
</p>

<div align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-configuration">Configuration</a>
</div>

---

## ✨ Features

### 🎬 User Experience
- **Interactive Seat Map**: Choose your perfect spot with a visual, real-time seat layout. Supports Standard, VIP, and Couple seats.
- **Movies & Showtimes**: Browse "Now Showing" and "Coming Soon" movies with rich details, trailers, and cast info.
- **Concessions**: Pre-order popcorn and drinks (Combo offerings) directly during the booking flow.
- **Loyalty Program**: Earn points with every booking. Rank up from Member → VIP → VVIP to unlock higher earning rates.

### 💳 Payments & Checkout
- **Multiple Gateways**: Secure payments via **PayOS** (QR), **VNPay**, and **PayPal**.
- **QR Code Check-in**: Receive a unique QR code for every confirmed booking for easy cinema entry.
- **Auto-Cancellation**: Unpaid bookings are automatically released after the holding period.

### 🛡️ Admin & System
- **NextAuth Authentication**: Secure login/signup flow.
- **Dashboard**: Manage movies, showtimes, cinemas, and view booking statistics (Admin).
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile devices.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [MySQL](https://www.mysql.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MySQL** database instance

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/BoDL49/Booking-Ticket-Movie
    cd Booking-Ticket-Movie
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Setup Environment Variables**
    Create a `.env` file in the root directory (see [Configuration](#-configuration) for details).

4.  **Database Setup**
    Push the Prisma schema to your MySQL database:
    ```bash
    npx prisma db push
    # Optional: Seed initial data
    npx prisma db seed
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## ⚙ Configuration

Create a `.env` file in the root directory with the following keys:

```env
# Database
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

# Authentication (NextAuth)
AUTH_SECRET="your_generated_secret" # Generate with: npx auth secret

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Payment Gateways (Required for Payments)
# PayOS
PAYOS_CLIENT_ID=""
PAYOS_API_KEY=""
PAYOS_CHECKSUM_KEY=""

# VNPay
VNPAY_TMN_CODE=""
VNPAY_HASH_SECRET=""
VNPAY_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"

# PayPal
PAYPAL_CLIENT_ID=""
PAYPAL_CLIENT_SECRET=""
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<div align="center">
  Built with ❤️ by the Trần Minh Tuấn
</div>
