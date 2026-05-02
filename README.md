# Bharat Election Project (ECB) - Secure E-Voting Terminal

## 🎓 University Project Overview
**Project Name:** Secure Digital Election & Voter Verification System  
**Framework:** Next.js 14 (App Router) + Supabase (PostgreSQL)  
**Theme:** Election Commission of Bharat (ECB) - A simulation of secure, transparent, and regionalized electronic voting.

---

## 📝 Abstract
The **Bharat Election Project** is a sophisticated full-stack simulation of a modern electronic voting system. It addresses key challenges in digital democracy, including secure voter authentication via Aadhaar integration, regionalized candidate distribution based on Indian electoral laws (State, MP, and MLA constituencies), and a real-time "Electronic Voting Machine" (EVM) interface. 

The system implements strict **Row Level Security (RLS)** at the database level to ensure that one citizen can only vote once and only for candidates within their legally assigned constituencies.

---

## 🚀 Key Features
- **Biometric-Simulated Auth**: Integration with Google OAuth combined with Aadhaar-based voter ID verification.
- **Regionalized Voting Logic**: Sophisticated filtering ensures a West Bengal citizen can only see WB candidates, a Maharashtra citizen sees MH candidates, etc.
- **EVM Interface**: A high-fidelity "Digital Terminal" that mimics the look and feel of a physical EVM with real-time vote recording.
- **Candidate Directory**: A comprehensive public directory of contesting candidates, including their:
  - **Educational Background**
  - **Financial Assets & Liabilities (Form 26)**
  - **Criminal Records**
  - **Primary Vision & Manifesto**
- **Dynamic Avatars**: Automated generation of professional candidate profiles using the DiceBear API.
- **Secure Backend**: Leveraging Supabase for real-time data integrity and encrypted voter records.

---

## 🛠️ Technology Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Next.js 14, Tailwind CSS |
| **Backend/DB** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (Google OAuth) |
| **Styling** | Shadcn/UI, Lucide-React Icons |
| **Images** | DiceBear API (Dynamic Avatars) |

---

## 🔧 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/suryasubhrajit/e-vote.git
   cd e-vote
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Schema**
   Ensure the `voters`, `candidates`, `votes`, and `profiles` tables are initialized in your Supabase project with RLS enabled.

5. **Run the Application**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the terminal.

---

## ⚖️ Legal Disclaimer
*This project is for educational and simulation purposes only. It is NOT affiliated with the Election Commission of India (ECI), the Election Commission of Bharat (ECB), or any government organization. All data used is fictional and generic for demonstration of system logic.*

---
**Developed for academic submission.**
