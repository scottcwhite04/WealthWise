import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient('https://anwwjqupywbnwanuckdf.supabase.co', 'YOUR_SUPABASE_KEY');
const user = (await supabase.auth.getUser()).data.user;

async function loadProjection() {
  if (!user) return;

  const [{ data: balance }, { data: salary }, { data: bills }, { data: bonuses }] = await Promise.all([
    supabase.from('balances').select('*').eq('user_id', user.id).single(),
    supabase.from('salaries').select('*').eq('user_id', user.id).single(),
    supabase.from('bills').select('*').eq('user_id', user.id),
    supabase.from('bonuses').select('*').eq('user_id', user.id)
  ]);

  if (!balance || !salary) return;

  document.getElementById('current-balance').textContent = balance.current_balance.toFixed(2);
  document.getElementById('food-allowance').textContent = balance.food_allowance.toFixed(2);
  document.getElementById('fuel-allowance').textContent = balance.fuel_allowance.toFixed(2);

  const payAmount = parseFloat(salary.amount);
  const fixedBills = bills.reduce((sum, b) => sum + parseFloat(b.amount), 0);
  const allowances = parseFloat(balance.food_allowance) + parseFloat(balance.fuel_allowance);
  const bonusByMonth = Array(12).fill(0);
  bonuses.forEach(b => {
    const date = new Date(b.bonus_date);
    bonusByMonth[date.getMonth()] += parseFloat(b.amount);
  });

  const projections = [];
  for (let i = 0; i < 12; i++) {
    let income = payAmount;
    if (salary.pay_cycle === 'biweekly') income *= 2;
    if (salary.pay_cycle === 'weekly') income *= 4;
    const projected = balance.current_balance + income + bonusByMonth[i] - fixedBills - allowances;
    projections.push(projected);
  }

  const lowest = Math.min(...projections);
  const highest = Math.max(...projections);
  document.getElementById('lowest-balance').textContent = lowest.toFixed(2);
  document.getElementById('highest-balance').textContent = highest.toFixed(2);

  const breakdown = document.getElementById('cycle-breakdown');
  breakdown.innerHTML = '';
  projections.forEach((value, index) => {
    const month = new Date(2025, index).toLocaleString('default', { month: 'long' });
    breakdown.innerHTML += `<p>${month}: $${value.toFixed(2)}</p>`;
  });
}

loadProjection();