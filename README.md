<<<<<<< HEAD
# 🗳️ ECB E-Vote Platform
### *Election Commission of Bharat (ECB) Electronic Voting Platform*
=======
# 🗳️ E-Vote (ECB) Platform
## Election Commission of Bharat (ECB)
### *Secure, Real-Time Digital Democracy & Electoral Integrity*
>>>>>>> 936ebad7fd8307a7d2ac57082a3e685735264221

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

## 🌟 Project Overview
The **ECB E-Vote Platform** is a high-fidelity full-stack simulation of a modern electronic voting ecosystem. It addresses the critical challenges of **security**, **transparency**, and **accessibility** in digital voting. By integrating Aadhaar-linked verification and real-time data synchronization, it provides a "Production-Grade" experience for both voters and election observers.

> **Note:** This project was developed as a sophisticated demonstration of secure full-stack architecture, focusing on electoral logic and identity verification.

---

## 🚀 Core Features

### 🔐 Security & Identity
- **Aadhaar-Linked Verification Gate**: A multi-step verification process requiring valid Aadhaar and Voter ID credentials before a ballot is generated.
- **Biometric-Simulated Auth**: Leverages Google OAuth 2.0 integrated with a secondary verification layer for "Two-Factor" electoral integrity.
- **One-Person-One-Vote (RLS)**: Implements strict **PostgreSQL Row Level Security** to prevent duplicate voting at the database level.

### 📊 Real-Time Analytics
- **Live Broadcast Dashboard**: A dynamic election results portal with real-time progress bars, leading/trailing indicators, and instant count updates.
- **Regionalized Ballot Logic**: Smart filtering ensures citizens only see and vote for candidates in their legally assigned constituencies (West Bengal, Maharashtra, etc.).

### 🗳️ Digital EVM Terminal
- **High-Fidelity Terminal UI**: A secure, focused "Digital EVM" experience designed with zero-distraction layout and visual confirmation of cast votes.
- **Candidate Transparency**: Voters can view detailed candidate profiles, including educational background, financial declarations, and manifestos.

---

## 🏗️ Technical Architecture

### **Frontend**
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Mobile-First, Dark-Themed)
- **Icons**: Lucide-React & React-Icons
- **Animations**: Framer Motion for smooth terminal transitions

### **Backend & Security**
- **Database**: Supabase (PostgreSQL)
- **Real-Time**: Supabase Realtime for instant vote counting
- **Authentication**: Supabase Auth (Google OAuth)
- **Security**: Advanced RLS Policies to ensure data immutability

---

## 📂 System Logic & RLS
This project demonstrates advanced PostgreSQL logic:
```sql
-- Example RLS Policy used in this project
create policy "Voters can only cast one vote"
  on votes for insert
  with check ( auth.uid() = voter_id AND NOT EXISTS (
    select 1 from votes where voter_id = auth.uid()
  ));
```

---

## 🔧 Installation & Local Setup

1. **Clone the Repo**
   ```bash
   git clone https://github.com/suryasubhrajit/e-vote.git
   cd e-vote
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Launch**
   ```bash
   npm run dev
   ```

---

## ⚖️ Legal Disclaimer
*This project is for **educational and simulation purposes only**. It is NOT affiliated with the Election Commission of India (ECI), the Election Commission of Bharat (ECB), or any government body. All data used is fictional and generic for demonstrating system logic.*

---

## 👨‍💻 Author
**Surya Subhrajit**  
*Full-Stack Developer | Focused on Secure Web Architectures*

[![GitHub](https://img.shields.io/badge/GitHub-Profile-black?style=flat-square&logo=github)](https://github.com/suryasubhrajit)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin)](https://linkedin.com/in/suryasubhrajit)
