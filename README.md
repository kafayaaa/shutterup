<div align="center" style="display: flex; align-items: center; justify-content: center; gap: 15px;">
  <img src="./public/shutterup.webp" alt="ShutterUp Logo" width="150" style="margin-bottom: 10px;">
  <h1 style="border-bottom: none; margin-bottom: 20px;">ShutterUp</h1>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Midtrans-002D52?style=for-the-badge&logo=shippo&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Shadcn%20UI-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
</p>

---

**ShutterUp** is a premium online webstore dedicated to photography enthusiasts. From high-end cameras to professional lighting and accessories, ShutterUp provides a seamless shopping experience. Built with a full-stack Next.js architecture and powered by Supabase, it ensures speed, security, and a modern aesthetic.

## ✨ Key Features

- **📷 Specialized Catalog**: Browse through a curated selection of cameras, lenses, and photography gear.
- **🔐 Secure Authentication**: Integrated with **Supabase Auth** for safe user sign-ins and profile management.
- **💳 Integrated Payment**: Seamless checkout process powered by **Midtrans Payment Gateway**.
- **🛠️ Admin Dashboard**: Dedicated area for admins to:
  - **Manage Products**: Add, edit, or remove photography gear from the store.
  - **Order Management**: Monitor and manage incoming order lists and transaction statuses.
- **⚡ Server-Side Power**: Leveraging **Next.js Server Components and Actions** for fast, dynamic content.
- **📱 Mobile Ready**: Optimized for a flawless shopping experience on any device.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router - Fullstack)
- **Database & Auth**: Supabase
- **Payment Gateway**: Midtrans
- **Styling**: Tailwind CSS & Shadcn UI
- **Icons**: Lucide React
- **Language**: TypeScript

## 🚀 Getting Started

Follow these steps to set up the webstore locally:

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or pnpm
- A Supabase Project
- Midtrans Sandbox Account (for testing)

### Installation & Setup

1. **Clone the repository:**
   
   ```bash
   git clone [https://github.com/kafayaaa/shutterup.git](https://github.com/kafayaaa/shutterup.git)
   cd shutterup

2. **Install dependencies:**

   ```bash
   npm install

3. **Configure Environment Variables: Create a .env.local file in the root directory and add your Supabase credentials:**

   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    
   # Midtrans
   MIDTRANS_SERVER_KEY=your_midtrans_server_key
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key

4. **Run the development server:**

   ```bash
   npm run dev

Open http://localhost:3000 to view the store.

## 📂 Project Structure

- /app - Next.js App Router (Pages, API routes, and Server Actions).

- /app/admin - Admin Dashboard logic and management views.

- /components - Reusable UI components (Product cards, Navbar, Cart).

- /lib - Supabase client, Midtrans configuration, and utility functions.

## 📜 License

This project is licensed under the MIT License.

Developed with ❤️ by kafayaaa
