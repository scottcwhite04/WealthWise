import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://anwwjqupywbnwanuckdf.supabase.co', 'YOUR_SUPABASE_KEY');
const today = new Date().toISOString().split('T')[0];

const { data: verse } = await supabase.from('verses').select('*').eq('verse_date', today).single();

if (verse) {
  document.getElementById('daily-verse').innerHTML = `
    <h2 class="font-semibold text-lg mb-1">Today's Stewardship Verse</h2>
    <p class="italic mb-2">"${verse.verse_text}"</p>
    <p><strong>Explanation:</strong> ${verse.explanation}</p>
    <p><strong>Application:</strong> ${verse.application}</p>
  `;
} else {
  document.getElementById('daily-verse').innerHTML = `<p>No verse found for today.</p>`;
}