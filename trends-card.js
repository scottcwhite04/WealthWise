export function getTrendsCardHTML() {
  return `
    <div class="card flex-[2_2_0%] min-w-0">
      <div class="dashboard-section-title flex items-center">
        <span class="icon-circle">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" d="M3 17v-2a4 4 0 014-4h10a4 4 0 014 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </span>
        Balance Trends (12 Months)
      </div>
      <div class="flex flex-col mb-2">
        <div>
          <span class="stat-label">12-mo High:</span>
          <span class="stat-value">$7,800.22</span>
        </div>
        <div>
          <span class="stat-label">12-mo Low:</span>
          <span class="stat-value">$2,120.44</span>
        </div>
      </div>
      <div class="chart-container">
        <canvas id="trendChart"></canvas>
      </div>
    </div>
  `;
}

if (document.getElementById('trends-card-root')) {
  document.getElementById('trends-card-root').innerHTML = getTrendsCardHTML();

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
}