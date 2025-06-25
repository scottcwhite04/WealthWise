import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- SUPABASE CONFIG ---
const SUPABASE_URL = 'https://anwwjqupywbnwanuckdf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFud3dqcXVweXdibndhbnVja2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MzgxOTksImV4cCI6MjA2NTAxNDE5OX0.ExlSkJTP3mJ9u-7SVws0FYcNvlL9a4MJNsm8ZaK1X48';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- HELPER FUNCTIONS ---
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

// --- THEME TOGGLE (CLEAN AND PROFESSIONAL) ---
function setupThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Modern toggle switch UI
  themeToggleBtn.innerHTML = `
    <span class="sr-only">Toggle dark mode</span>
    <span class="toggle-bg" style="
      display:inline-block;
      width:40px;
      height:22px;
      border-radius:9999px;
      background:#e2e9f3;
      position:relative;
      vertical-align:middle;
      transition:background 0.16s;
      ">
      <span id="toggle-ball" style="
        width:18px;height:18px;display:block;position:absolute;top:2px;left:2px;
        border-radius:50%;background:#2563eb;transition:left 0.16s, background 0.16s;
        box-shadow:0 1px 4px #22304a22;
      "></span>
      <span id="toggle-sun" style="
        position:absolute;left:7px;top:3px;font-size:12px;z-index:10;color:#FFD600;">☀️</span>
      <span id="toggle-moon" style="
        position:absolute;right:7px;top:3px;font-size:12px;z-index:10;display:none;color:#FFD600;">🌙</span>
    </span>
  `;

  function updateToggleVisual() {
    const isDark = document.documentElement.classList.contains('dark');
    const ball = document.getElementById('toggle-ball');
    const sun = document.getElementById('toggle-sun');
    const moon = document.getElementById('toggle-moon');
    const bg = themeToggleBtn.querySelector('.toggle-bg');
    if (isDark) {
      ball.style.left = "20px";
      ball.style.background = "#f3c96b";
      sun.style.display = "none";
      moon.style.display = "block";
      bg.style.background = "#333b4d";
    } else {
      ball.style.left = "2px";
      ball.style.background = "#2563eb";
      sun.style.display = "block";
      moon.style.display = "none";
      bg.style.background = "#e2e9f3";
    }
  }
  updateToggleVisual();
  themeToggleBtn.onclick = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('wealthwise-theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('wealthwise-theme', 'dark');
    }
    updateToggleVisual();
  };
}

// --- GREETING & AVATAR FROM PROFILES TABLE ---
async function setUserGreetingAndAvatar() {
  const { data: { user } } = await supabase.auth.getUser();
  let greeting = '';
  let avatarUrl = 'https://ui-avatars.com/api/?name=W+User&background=2563eb&color=fff';

  if (user) {
    // Fetch from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name,avatar_url')
      .eq('id', user.id)
      .single();

    if (profile) {
      greeting = profile.display_name ? `Hello, ${profile.display_name}!` : '';
      if (profile.avatar_url) avatarUrl = profile.avatar_url;
    } else {
      // fallback to user_metadata/email
      let name = user.user_metadata?.full_name || user.user_metadata?.name || user.email || user.id || '';
      if (name && name.includes('@')) name = name.split('@')[0];
      greeting = name ? `Hello, ${name}!` : '';
    }
  }

  // Header area (if present)
  const headerGreeting = document.getElementById('header-greeting');
  if (headerGreeting) headerGreeting.textContent = greeting;
  const headerAvatar = document.getElementById('header-avatar-img');
  if (headerAvatar) headerAvatar.src = avatarUrl;

  // Dashboard area (if present)
  const welcomeUser = document.getElementById('welcome-user');
  if (welcomeUser) welcomeUser.textContent = greeting;
  const dashboardAvatar = document.getElementById('dashboard-avatar-img');
  if (dashboardAvatar) dashboardAvatar.src = avatarUrl;
}

// --- INIT ON LOAD ---
window.addEventListener('DOMContentLoaded', function() {
  setupThemeToggle();
  setUserGreetingAndAvatar();

  // Chart.js rendering for trends
  var ctxTrend = document.getElementById('trendChart');
  if (ctxTrend) {
    ctxTrend = ctxTrend.getContext('2d');
    new Chart(ctxTrend, {
      type: 'line',
      data: {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Balance',
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37,99,235,0.08)',
          data: [3000, 3200, 2500, 4000, 4100, 7000, 7800, 7000, 4200, 2700, 2120, 4250],
          fill: true,
          tension: 0.34,
          pointRadius: 3,
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: false, grid: { color: '#e2e9f3' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Terms link update
  const termsLink = document.getElementById('footer-terms-link');
  if (termsLink) {
    termsLink.href = '/terms-of-service.html?return=' + encodeURIComponent(window.location.href);
  }
});

// --- DASHBOARD SNAPSHOT CARD ---
async function loadCurrentBalanceCard() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    document.getElementById("user-balance-amount").textContent = "$0.00";
    document.getElementById("user-balance-period").textContent = "Not signed in";
    document.getElementById("user-food-allowance").textContent = "Food: $0.00";
    document.getElementById("user-fuel-allowance").textContent = "Fuel: $0.00";
    document.getElementById("user-balance-bills").innerHTML = "<li>Not signed in</li>";
    return;
  }

  // Get latest balance snapshot and pay period
  const { data: balanceRows } = await supabase
    .from('user_balances')
    .select('total_remaining_balance,start_date,end_date')
    .eq('user_id', user.id)
    .order('end_date', { ascending: false })
    .limit(1);

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
  const { data: allowances } = await supabase
    .from('current_food_and_fuel_allowance')
    .select('allowance_name,amount')
    .eq('user_id', user.id);

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
    const { data: bills } = await supabase
      .from('bills')
      .select('id,bill_name,due_date,amount,is_paid')
      .eq('user_id', user.id)
      .eq('record_type', 'original')
      .gte('due_date', balance.start_date)
      .lte('due_date', balance.end_date)
      .order('due_date', { ascending: true });

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
}
window.loadCurrentBalanceCard = loadCurrentBalanceCard;
loadCurrentBalanceCard();

// --- PAID CHECKBOX HANDLER ---
window.handlePaidCheckboxChange = async function(event) {
  const checkbox = event.target;
  const billId = checkbox.getAttribute('data-bill-id');
  if (!billId) return;
  const is_paid = !!checkbox.checked;
  const { error } = await supabase
    .from('bills')
    .update({ is_paid })
    .eq('id', billId);
  if (error) {
    alert("Error updating bill status: " + error.message);
    checkbox.checked = !is_paid;
  }
  await loadCurrentBalanceCard();
};

// --- ALLOWANCES MODAL LOGIC ---
let loggedInUser = null;
async function fetchUserAllowances() {
  if (loggedInUser) return loggedInUser;
  const { data: { user } } = await supabase.auth.getUser();
  loggedInUser = user;
  return user;
}
function closeAllowancesModal() {
  document.getElementById("allowances-modal").classList.remove("open");
}
function openAllowancesModal() {
  document.getElementById("allowances-modal").classList.add("open");
  loadAllowancesData();
}
const openAllowancesModalBtn = document.getElementById("open-allowances-modal-btn");
if (openAllowancesModalBtn) {
  openAllowancesModalBtn.addEventListener("click", openAllowancesModal);
}
document.getElementById("allowances-modal-close").addEventListener("click", closeAllowancesModal);
document.getElementById("allowances-modal").addEventListener("click", function(e) {
  if (e.target === this) closeAllowancesModal();
});
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeAllowancesModal();
});

async function loadAllowancesData() {
  const user = await fetchUserAllowances();
  if (!user) return;
  const { data: bank } = await supabase
    .from('bank_accounts')
    .select('id,balance,pay_start_date,pay_frequency')
    .eq('user_id', user.id)
    .limit(1)
    .single();
  if (bank) {
    document.getElementById("bank-balance").value = bank.balance || '';
    document.getElementById("bank-pay-start-date").value = bank.pay_start_date || '';
    document.getElementById("bank-pay-frequency").value = bank.pay_frequency || '';
    document.getElementById("bank-accounts-form").dataset.bankId = bank.id || '';
  } else {
    document.getElementById("bank-balance").value = '';
    document.getElementById("bank-pay-start-date").value = '';
    document.getElementById("bank-pay-frequency").value = '';
    document.getElementById("bank-accounts-form").dataset.bankId = '';
  }
  const { data: allowances } = await supabase
    .from('current_food_and_fuel_allowance')
    .select('id,allowance_name,amount')
    .eq('user_id', user.id);

  let food = null, fuel = null;
  if (allowances && Array.isArray(allowances)) {
    food = allowances.find(a => a.allowance_name.toLowerCase() === 'food');
    fuel = allowances.find(a => a.allowance_name.toLowerCase() === 'fuel');
  }
  document.getElementById("food-allowance").value = food ? food.amount : '';
  document.getElementById("fuel-allowance").value = fuel ? fuel.amount : '';
  document.getElementById("food-allowance-label").innerText =
      `Food Allowance (${formatMoney(food ? food.amount : 0)})`;
  document.getElementById("fuel-allowance-label").innerText =
      `Fuel Allowance (${formatMoney(fuel ? fuel.amount : 0)})`;
  if (food) document.getElementById("allowance-form").dataset.foodId = food.id;
  else document.getElementById("allowance-form").dataset.foodId = '';
  if (fuel) document.getElementById("allowance-form").dataset.fuelId = fuel.id;
  else document.getElementById("allowance-form").dataset.fuelId = '';
}

document.getElementById("bank-accounts-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const user = await fetchUserAllowances();
  if (!user) return;
  const balance = parseFloat(document.getElementById("bank-balance").value);
  const pay_start_date = document.getElementById("bank-pay-start-date").value;
  const pay_frequency = document.getElementById("bank-pay-frequency").value;
  const bankId = e.target.dataset.bankId;

  let updateObj = {
    balance,
    pay_start_date,
    pay_frequency,
    user_id: user.id
  };

  if (bankId) {
    const { error } = await supabase.from('bank_accounts').update(updateObj).eq('id', bankId);
    if (error) return alert("Error updating bank account: " + error.message);
    alert("Bank account updated!");
  } else {
    const { error } = await supabase.from('bank_accounts').insert([updateObj]);
    if (error) return alert("Error creating bank account: " + error.message);
    alert("Bank account created!");
  }
  closeAllowancesModal();
  await loadCurrentBalanceCard();
});

// Robust upsert for food & fuel
document.getElementById("allowance-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const user = await fetchUserAllowances();
  if (!user) return;
  const foodAmount = parseFloat(document.getElementById("food-allowance").value) || 0;
  const fuelAmount = parseFloat(document.getElementById("fuel-allowance").value) || 0;
  const foodId = e.target.dataset.foodId;
  const fuelId = e.target.dataset.fuelId;

  if (foodId) {
    const { data, error } = await supabase.from('current_food_and_fuel_allowance')
      .update({ amount: foodAmount })
      .eq('id', foodId)
      .select();
    if (error) return alert("Error updating food allowance: " + error.message);
    if (!data || data.length === 0) {
      await supabase.from('current_food_and_fuel_allowance')
        .insert([{ user_id: user.id, allowance_name: 'Food', amount: foodAmount }]);
    }
  } else {
    await supabase.from('current_food_and_fuel_allowance')
      .insert([{ user_id: user.id, allowance_name: 'Food', amount: foodAmount }]);
  }
  if (fuelId) {
    const { data, error } = await supabase.from('current_food_and_fuel_allowance')
      .update({ amount: fuelAmount })
      .eq('id', fuelId)
      .select();
    if (error) return alert("Error updating fuel allowance: " + error.message);
    if (!data || data.length === 0) {
      await supabase.from('current_food_and_fuel_allowance')
        .insert([{ user_id: user.id, allowance_name: 'Fuel', amount: fuelAmount }]);
    }
  } else {
    await supabase.from('current_food_and_fuel_allowance')
      .insert([{ user_id: user.id, allowance_name: 'Fuel', amount: fuelAmount }]);
  }

  alert("Allowances updated!");
  closeAllowancesModal();
  await loadAllowancesData();
});

// --- BILLS MODAL LOGIC ---
let billsUserId = null;
async function fetchUser() {
  const { data: { user } } = await supabase.auth.getUser();
  billsUserId = user ? user.id : null;
  return user;
}
function closeBillsModal() {
  document.getElementById("bills-modal").classList.remove("open");
}
function openBillsModal() {
  document.getElementById("bills-modal").classList.add("open");
  loadBillsTable();
}
document.getElementById("open-bills-modal-btn-alt").addEventListener("click", openBillsModal);
document.getElementById("bills-modal-close").addEventListener("click", closeBillsModal);
document.getElementById("bills-modal").addEventListener("click", function(e) {
  if (e.target === this) closeBillsModal();
});
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeBillsModal();
});

async function loadBillsTable() {
  const user = await fetchUser();
  const tbody = document.getElementById("bills-table-body");
  if (!user) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-ww-light-secondary dark:text-ww-dark-accent">Not signed in.</td></tr>`;
    return;
  }
  const { data: bills, error: selectError } = await supabase
    .from('bills')
    .select('id,bill_name,amount,due_date')
    .eq('user_id', user.id)
    .eq('record_type', 'original')
    .order('due_date', { ascending: true });
  if (selectError) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-red-600">Error: ${selectError.message}</td></tr>`;
    return;
  }
  if (!bills || bills.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-ww-light-secondary dark:text-ww-dark-accent">No bills found.</td></tr>`;
    return;
  }
  tbody.innerHTML = bills.map(bill => `
    <tr>
      <td>${bill.bill_name}</td>
      <td>${formatMoney(bill.amount)}</td>
      <td>${formatDate(bill.due_date)}</td>
      <td>
        <button class="ww-btn py-1 px-2 text-xs" style="background:#b91c1c;" onclick="deleteBillModal('${bill.id}')">
          Delete
        </button>
      </td>
    </tr>
  `).join('');
}

// Add Bill
document.getElementById("bills-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const user = await fetchUser();
  if (!user) {
    alert("You must be logged in to add a bill.");
    return;
  }
  const bill_name = document.getElementById("bill-name").value.trim();
  const amount = parseFloat(document.getElementById("bill-amount").value);
  const due_date = document.getElementById("bill-due-date").value;
  if (!bill_name || isNaN(amount) || !due_date) {
    alert("Please fill out all fields.");
    return;
  }
  const { error } = await supabase.from('bills').insert([{
    user_id: user.id,
    bill_name: bill_name,
    amount: amount,
    due_date: due_date
  }]);
  if (error) {
    alert("Error adding bill: " + error.message);
    return;
  }
  document.getElementById("bill-name").value = "";
  document.getElementById("bill-amount").value = "";
  document.getElementById("bill-due-date").value = "";
  await loadBillsTable();
  await loadCurrentBalanceCard();
});

// Delete Bill
window.deleteBillModal = async function(billId) {
  if (!confirm("Delete this bill?")) return;
  const { error: deleteError } = await supabase.from('bills').delete().eq('id', billId);
  if (deleteError) {
    alert("Error deleting bill: " + deleteError.message);
    return;
  }
  await loadBillsTable();
  await loadCurrentBalanceCard();
};

// --- CHART AND FOOTER ---
document.getElementById('footer-terms-link').href = '/terms-of-service.html?return=' + encodeURIComponent(window.location.href);

// Chart.js rendering for trends (unchanged)
window.addEventListener('DOMContentLoaded', function() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn && !themeToggleBtn.hasAttribute('data-setup')) {
    setupThemeToggle();
    themeToggleBtn.setAttribute('data-setup', 'true');
  }
  var ctxTrend = document.getElementById('trendChart');
  if (ctxTrend) {
    ctxTrend = ctxTrend.getContext('2d');
    new Chart(ctxTrend, {
      type: 'line',
      data: {
        labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Balance',
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37,99,235,0.08)',
          data: [3000, 3200, 2500, 4000, 4100, 7000, 7800, 7000, 4200, 2700, 2120, 4250],
          fill: true,
          tension: 0.34,
          pointRadius: 3,
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: false, grid: { color: '#e2e9f3' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
});
