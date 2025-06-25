export function getUpcomingBillsCardHTML() {
  return `
    <div class="card flex-[2_2_0%] min-w-0">
      <div class="dashboard-section-title flex items-center">
        <span class="icon-circle">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"/>
          </svg>
        </span>
        Upcoming Bills
      </div>
      <ul class="mb-2">
        <li><span class="stat-label">Rent</span>: $1,200 due Jul 1</li>
        <li><span class="stat-label">Electric</span>: $115 due Jun 26</li>
        <li><span class="stat-label">Internet</span>: $55 due Jun 28</li>
      </ul>
      <button class="ww-btn" id="open-bills-modal-btn-alt">Manage Bills</button>
    </div>
  `;
}

if (document.getElementById('upcoming-bills-card-root')) {
  document.getElementById('upcoming-bills-card-root').innerHTML = getUpcomingBillsCardHTML();
}