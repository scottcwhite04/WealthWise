import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- SUPABASE CONFIG ---
const SUPABASE_URL = 'https://anwwjqupywbnwanuckdf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFud3dqcXVweXdibndhbnVja2RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0MzgxOTksImV4cCI6MjA2NTAxNDE5OX0.ExlSkJTP3mJ9u-7SVws0FYcNvlL9a4MJNsm8ZaK1X48';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function formatAvatarUrl(display_name, avatar_url) {
  return avatar_url?.trim()
    ? avatar_url
    : `https://ui-avatars.com/api/?background=3157a1&color=fff&name=${encodeURIComponent(display_name || 'User')}`;
}

function profileDropdownHTML(display_name, avatar_url) {
  // Always show display_name, never truncate on desktop
  return `
    <div class="flex items-center gap-2">
      <span class="greeting-text text-base font-semibold text-ww-dark-accent dark:text-ww-dark-accent">Hello, ${display_name}</span>
      <button id="ww-avatar-btn" class="ww-avatar-btn relative focus:outline-none group" type="button" aria-label="Profile menu">
        <img src="${formatAvatarUrl(display_name, avatar_url)}" alt="User avatar" />
      </button>
    </div>
    <div id="ww-user-dropdown" class="ww-user-dropdown">
      <button id="ww-profile-update-btn" type="button">Update Profile</button>
      <button id="ww-logout-btn" type="button" style="color:#b91c1c;">Log Out</button>
    </div>
  `;
}

function profileModalHTML(profile) {
  return `
  <div id="ww-profile-modal" class="ww-profile-modal modal">
    <div class="modal-content dark:bg-ww-dark-card dark:text-ww-dark-text relative" style="max-width: 440px;">
      <button class="modal-close" id="ww-profile-modal-close" aria-label="Close">&times;</button>
      <h2 class="dashboard-section-title mb-3">Update Profile</h2>
      <form id="ww-profile-form" class="space-y-3">
        <div>
          <label class="block font-semibold mb-1" for="profile_display_name">Display Name</label>
          <input type="text" id="profile_display_name" name="display_name" class="form-input w-full" required value="${profile?.display_name || ''}">
        </div>
        <div>
          <label class="block font-semibold mb-1" for="profile_avatar_url">Avatar URL</label>
          <input type="url" id="profile_avatar_url" name="avatar_url" class="form-input w-full" value="${profile?.avatar_url || ''}">
        </div>
        <div>
          <label class="block font-semibold mb-1" for="profile_address_line1">Address Line 1</label>
          <input type="text" id="profile_address_line1" name="address_line1" class="form-input w-full" value="${profile?.address_line1 || ''}">
        </div>
        <div>
          <label class="block font-semibold mb-1" for="profile_address_line2">Address Line 2</label>
          <input type="text" id="profile_address_line2" name="address_line2" class="form-input w-full" value="${profile?.address_line2 || ''}">
        </div>
        <div>
          <label class="block font-semibold mb-1" for="profile_city">City</label>
          <input type="text" id="profile_city" name="city" class="form-input w-full" value="${profile?.city || ''}">
        </div>
        <div class="flex gap-2">
          <div class="flex-1">
            <label class="block font-semibold mb-1" for="profile_state">State</label>
            <input type="text" id="profile_state" name="state" class="form-input w-full" value="${profile?.state || ''}">
          </div>
          <div class="flex-1">
            <label class="block font-semibold mb-1" for="profile_postal_code">Postal Code</label>
            <input type="text" id="profile_postal_code" name="postal_code" class="form-input w-full" value="${profile?.postal_code || ''}">
          </div>
        </div>
        <div>
          <label class="block font-semibold mb-1" for="profile_country">Country</label>
          <input type="text" id="profile_country" name="country" class="form-input w-full" value="${profile?.country || ''}">
        </div>
        <div>
          <label class="block font-semibold mb-1" for="profile_phone">Phone</label>
          <input type="tel" id="profile_phone" name="phone" class="form-input w-full" value="${profile?.phone || ''}">
        </div>
        <div>
          <label class="block font-semibold mb-1" for="profile_birthdate">Birthdate</label>
          <input type="date" id="profile_birthdate" name="birthdate" class="form-input w-full" value="${profile?.birthdate ? profile.birthdate.split('T')[0] : ''}">
        </div>
        <button type="submit" class="ww-btn w-full">Save Changes</button>
      </form>
    </div>
  </div>
  `;
}

async function renderProfileGreeting() {
  const container = document.getElementById('profile-greeting-inject');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  container.innerHTML = profileDropdownHTML(profile?.display_name || 'User', profile?.avatar_url);

  const avatarBtn = document.getElementById('ww-avatar-btn');
  const dropdown = document.getElementById('ww-user-dropdown');
  avatarBtn.onclick = e => {
    dropdown.classList.toggle('open');
    e.stopPropagation();
  };
  document.body.addEventListener('click', () => dropdown.classList.remove('open'));
  dropdown.onclick = e => e.stopPropagation();

  document.getElementById('ww-logout-btn').onclick = async () => {
    await supabase.auth.signOut();
    window.location.href = 'logout.html';
  };

  document.getElementById('ww-profile-update-btn').onclick = () => {
    showProfileModal(profile);
    dropdown.classList.remove('open');
  };
}

function showProfileModal(profile) {
  let modal = document.getElementById('ww-profile-modal');
  if (modal) modal.remove();
  document.body.insertAdjacentHTML('beforeend', profileModalHTML(profile));
  modal = document.getElementById('ww-profile-modal');
  modal.classList.add('open');
  document.getElementById('ww-profile-modal-close').onclick = () => modal.classList.remove('open');
  modal.onclick = e => { if (e.target === modal) modal.classList.remove('open'); };
  document.getElementById('ww-profile-form').onsubmit = async function(e) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const values = {};
    for (const el of this.elements) {
      if (el.name) values[el.name] = el.value;
    }
    const { error } = await supabase.from('profiles').update(values).eq('id', user.id);
    if (error) alert('Error updating profile: ' + error.message);
    else {
      modal.classList.remove('open');
      await renderProfileGreeting();
    }
  };
  document.addEventListener('keydown', function esc(e) {
    if (e.key === "Escape") {
      modal.classList.remove('open');
      document.removeEventListener('keydown', esc);
    }
  });
}

window.addEventListener('DOMContentLoaded', renderProfileGreeting);

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
document.getElementById('theme-toggle').addEventListener('click', function() {
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  if (isDark) {
    html.classList.remove('dark');
    localStorage.setItem('wealthwise-theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('wealthwise-theme', 'dark');
  }
});
window.addEventListener('DOMContentLoaded', function() {
  var ctxTrend = document.getElementById('trendChart').getContext('2d');
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
});
