import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Anon Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyCandidates = [
  {
    name: "John Doe",
    description: "Experienced leader with a vision for the future.",
    vision: "A prosperous and inclusive community for all.",
    mission: "* Empower local businesses\n* Improve public infrastructure\n* Enhance education quality",
    photo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=300&fit=crop"
  },
  {
    name: "Jane Smith",
    description: "Passionate advocate for environmental sustainability.",
    vision: "A greener, cleaner city for future generations.",
    mission: "* Implement zero-waste policies\n* Increase urban green spaces\n* Promote renewable energy",
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=300&fit=crop"
  }
];

async function seed() {
  console.log('Seeding dummy candidates...');
  
  for (const candidate of dummyCandidates) {
    const { data, error } = await supabase
      .from('candidates')
      .insert(candidate)
      .select();
      
    if (error) {
      console.error(`Error inserting candidate ${candidate.name}:`, error.message);
    } else {
      console.log(`Inserted candidate: ${candidate.name}`);
    }
  }
  
  console.log('Seeding completed!');
}

seed();
