import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const candidates = [
  {
    name: "John Doe",
    description: "Experienced leader with a vision for transparency.",
    vision: "To create a fair and accessible voting system for everyone.",
    mission: "Implementing block-chain based security for all elections.",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    name: "Jane Smith",
    description: "Community advocate focusing on local development.",
    vision: "Empowering local communities through direct participation.",
    mission: "Allocating 20% more budget to community-led initiatives.",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
  {
    name: "Robert Brown",
    description: "Tech innovator aiming to modernize infrastructure.",
    vision: "A digital-first approach to government services.",
    mission: "Digitizing 100% of public records by 2026.",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
  }
];

const users = [
  {
    name: "Admin User",
    email: "admin@election.com",
    isAdmin: true,
    selectedCandidate: "",
  },
  {
    name: "Alice Voter",
    email: "alice@example.com",
    isAdmin: false,
    selectedCandidate: "",
  },
  {
    name: "Bob Voter",
    email: "bob@example.com",
    isAdmin: false,
    selectedCandidate: "",
  }
];

async function seed() {
  console.log("Starting seed process...");

  try {
    // 1. Add Candidates
    console.log("Adding candidates...");
    for (const candidate of candidates) {
      const docRef = await addDoc(collection(db, "candidates"), candidate);
      console.log(`Added candidate: ${candidate.name} with ID: ${docRef.id}`);
    }

    // 2. Add Users
    console.log("Adding users...");
    for (const user of users) {
      const docRef = await addDoc(collection(db, "users"), user);
      console.log(`Added user: ${user.name} with ID: ${docRef.id}`);
    }

    console.log("Seed process completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

seed();
