export function getVerseCardHTML() {
  return `
    <div class="verse-card flex flex-col md:flex-row items-center">
      <div class="icon-circle mb-2 md:mb-0 md:mr-5">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-width="2" d="M11 17l-5-5m0 0l5-5m-5 5h12"/>
        </svg>
      </div>
      <div>
        <div class="verse-ref">Luke 16:10</div>
        <div class="verse-text">
          “Whoever can be trusted with very little can also be trusted with much...”
        </div>
        <div class="verse-life">
          <strong>Life Application:</strong>
          Faithfulness in small things builds the foundation for managing greater resources.<br>
          Start today by honoring God in every transaction and every minute.
        </div>
      </div>
    </div>
  `;
}

if (document.getElementById('verse-card-root')) {
  document.getElementById('verse-card-root').innerHTML = getVerseCardHTML();
}