import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://anwwjqupywbnwanuckdf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFud3dqcXVweXdibndhbnVja2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MzgxOTksImV4cCI6MjA2NTAxNDE5OX0.ExlSkJTP3mJ9u-7SVws0FYcNvlL9a4MJNsm8ZaK1X48';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function formatMoney(val) {
  return "$" + Number(val || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2});
}
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'});
}
function formatDateShort(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
}

export function getDashboardSnapshotCardHTML() {
  return `
    <div class="card flex-[2_2_0%] min-w-0" id="bank-balance-card">
      <div class="dashboard-section-title flex items-center">
        <span class="icon-circle">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M12 8v8m0 0c-4 0-8-2-8-6V6a2 2 0 012-2h12a2 2 0 012 2v4c0 4-4 6-8 6z"/>
          </svg>
        </span>
        Current Financial Snapshot
      </div>
      <div class="flex justify-between items-center mt-1 mb-2">
        <span class="font-semibold text-ww-light-accent dark:text-ww-dark-accent text-sm">
          Pay Period:
          <span class="font-normal text-ww-light-secondary dark:text-ww-dark-accent" id="user-balance-period">
            Loading...
          </span>
        </span>
      </div>
      <div class="flex flex-col md:flex-row items-baseline gap-2 mb-1">
        <span class="font-semibold text-ww-light-accent dark:text-ww-dark-accent text-sm mr-2">Banking Balance</span>
        <span class="stat-value text-2xl" id="user-balance-amount">$0.00</span>
        <button id="open-allowances-modal-btn" class="ml-2 px-2 py-1 flex items-center gap-1 rounded-md border border-ww-light-accent-contrast bg-ww-field-light hover:bg-ww-light-accent-contrast dark:bg-ww-dark-card dark:border-ww-dark-accent dark:hover:bg-ww-dark-card" type="button" title="Update Bank & Allowances">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 20 20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 7l3-3 3 3m0 6l-3 3-3-3"/>
          </svg>
          <span class="text-xs font-semibold">Edit</span>
        </button>
      </div>
      <div class="flex flex-wrap items-center mb-2 gap-4">
        <span class="font-semibold text-ww-light-accent dark:text-ww-dark-accent text-sm">Allowances</span>
        <span id="user-food-allowance" class="px-2 py-1 rounded bg-ww-field-lighter dark:bg-ww-dark-card text-xs font-medium mr-2">Food: $0.00</span>
        <span id="user-fuel-allowance" class="px-2 py-1 rounded bg-ww-field-lighter dark:bg-ww-dark-card text-xs font-medium">Fuel: $0.00</span>
      </div>
      <div class="mt-3">
        <div class="font-semibold text-ww-light-accent dark:text-ww-dark-accent text-sm mb-1">Bills Due This Pay Period</div>
        <div class="flex items-center mb-1">
          <span class="text-xs font-semibold text-ww-light-secondary dark:text-ww-dark-accent mr-2">Check if Paid</span>
        </div>
        <ul class="bills-list" id="user-balance-bills">
          <li>Loading bills...</li>
        </ul>
      </div>
    </div>
  `;
}

async function loadCurrentBalanceCard() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error("Supabase getUser error:", userError);
    }
    if (!user) {
      document.getElementById("user-balance-amount").textContent = "$0.00";
      document.getElementById("user-balance-period").textContent = "Not signed in";
      document.getElementById("user-food-allowance").textContent = "Food: $0.00";
      document.getElementById("user-fuel-allowance").textContent = "Fuel: $0.00";
      document.getElementById("user-balance-bills").innerHTML = "<li>Not signed in</li>";
      return;
    }

    // Get latest balance snapshot and pay period
    const { data: balanceRows, error: balanceError } = await supabase
      .from('user_balances')
      .select('total_remaining_balance,start_date,end_date')
      .eq('user_id', user.id)
      .order('end_date', { ascending: false })
      .limit(1);

    if (balanceError) {
      console.error("Supabase user_balances error:", balanceError);
    }

    let balance = null;
    if (balanceRows && balanceRows.length > 0) {
      balance = balanceRows[0];
      document.getElementById("user-balance-amount").textContent =
        formatMoney(balance.total_remaining_balance || 0);
      document.getElementById("user-balance-period").textContent =
        formatDate(balance.start_date) + " - " + formatDate(balance.end_date);
    } else {
      document.getElementById("user-balance-amount").textContent = "$0.00";
      document.getElementById("user-balance-period").textContent = "No pay period found";
    }

    // Get Allowances
    const { data: allowances, error: allowancesError } = await supabase
      .from('current_food_and_fuel_allowance')
      .select('allowance_name,amount')
      .eq('user_id', user.id);

    if (allowancesError) {
      console.error("Supabase current_food_and_fuel_allowance error:", allowancesError);
    }

    let foodAmt = 0, fuelAmt = 0;
    if (allowances && Array.isArray(allowances)) {
      const food = allowances.find(a => a.allowance_name.toLowerCase() === 'food');
      const fuel = allowances.find(a => a.allowance_name.toLowerCase() === 'fuel');
      foodAmt = food ? food.amount : 0;
      fuelAmt = fuel ? fuel.amount : 0;
    }
    document.getElementById("user-food-allowance").textContent = `Food: ${formatMoney(foodAmt)}`;
    document.getElementById("user-fuel-allowance").textContent = `Fuel: ${formatMoney(fuelAmt)}`;

    // Get bills for this pay period (SHOW ALL, regardless of paid status)
    let billsHtml = '<li>No bills found for this pay period.</li>';
    if (balance) {
      const { data: bills, error: billsError } = await supabase
        .from('bills')
        .select('id,bill_name,due_date,amount,is_paid')
        .eq('user_id', user.id)
        .eq('record_type', 'original')
        .gte('due_date', balance.start_date)
        .lte('due_date', balance.end_date)
        .order('due_date', { ascending: true });

      if (billsError) {
        console.error("Supabase bills error:", billsError);
      }

      if (bills && bills.length > 0) {
        billsHtml = bills.map(bill => `
          <li>
            <label>
              <input 
                type="checkbox" 
                ${bill.is_paid ? "checked" : ""} 
                data-bill-id="${bill.id}" 
                onchange="window.handlePaidCheckboxChange && window.handlePaidCheckboxChange(event)"
                style="accent-color: #2563eb; margin-right:6px;"
              >
              <span class="bill-name font-medium text-ww-accent-blue dark:text-ww-dark-accent ${bill.is_paid ? 'line-through text-gray-400' : ''}" title="${bill.bill_name}">${bill.bill_name}</span>
              <span class="bill-date ml-2 text-ww-light-secondary dark:text-ww-dark-accent">(${formatDateShort(bill.due_date)})</span>
              <span class="bill-amount font-semibold ml-auto">${formatMoney(bill.amount)}</span>
            </label>
          </li>
        `).join('');
      }
    }
    document.getElementById("user-balance-bills").innerHTML = billsHtml;
  } catch (err) {
    console.error("Error in loadCurrentBalanceCard:", err);
    document.getElementById("user-balance-bills").innerHTML = `<li style="color:red;">Error loading data</li>`;
  }
}
window.loadCurrentBalanceCard = loadCurrentBalanceCard;

if (document.getElementById('dashboard-snapshot-root')) {
  document.getElementById('dashboard-snapshot-root').innerHTML = getDashboardSnapshotCardHTML();
  // Wait for the DOM elements to be inserted before loading data
  setTimeout(loadCurrentBalanceCard, 0);
}
