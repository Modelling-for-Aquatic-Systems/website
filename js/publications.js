/**
 * Publications Page - Marilaure Grégoire Website
 *
 * Load, search, and display publications
 */

// Global state
let allPublications = [];
let filteredPublications = [];

/**
 * Create HTML for a single publication
 */
function createPublicationHTML(pub) {
  // Format authors — highlight Grégoire
  const authors = pub.authors.map(author => {
    if (author.includes('Grégoire') || author.includes('Gregoire')) {
      return `<strong>${escapeHTML(author)}</strong>`;
    }
    return escapeHTML(author);
  }).join(', ');

  const venue = pub.journal ? `<em>${escapeHTML(pub.journal)}</em>` : '';
  const volumePages = [pub.volume, pub.pages].filter(Boolean).join(', ');

  return `
    <article class="publication">
      <h4 class="pub-title">
        ${pub.doi
          ? `<a href="https://doi.org/${escapeHTML(pub.doi)}" target="_blank" rel="noopener">${escapeHTML(pub.title)}</a>`
          : escapeHTML(pub.title)
        }
      </h4>
      <p class="pub-authors">${authors}</p>
      <p class="pub-venue">
        ${venue}${volumePages ? `, ${volumePages}` : ''} (${pub.year})
      </p>
    </article>
  `;
}

/**
 * Render publications grouped by year
 */
function renderPublications(publications) {
  const container = document.getElementById('publications-list');
  if (!container) return;

  if (publications.length === 0) {
    container.innerHTML = `
      <p class="text-center" style="color: var(--gray-600); padding: var(--space-2xl);">
        No publications found matching your search.
      </p>
    `;
    return;
  }

  // Group by year
  const byYear = groupBy(publications, 'year');

  // Sort years in descending order
  const sortedYears = Object.keys(byYear).sort((a, b) => b - a);

  container.innerHTML = sortedYears.map(year => `
    <div class="year-group">
      <h3 class="year-heading">${year}</h3>
      ${byYear[year].map(pub => createPublicationHTML(pub)).join('')}
    </div>
  `).join('');
}

/**
 * Update publication count
 */
function updateStats(publications) {
  const statsContainer = document.getElementById('pub-stats');
  if (!statsContainer) return;

  const years = publications.map(p => p.year);
  const yearRange = years.length > 0
    ? `${Math.min(...years)}–${Math.max(...years)}`
    : 'N/A';

  statsContainer.innerHTML = `
    Showing <strong>${publications.length}</strong> publication${publications.length !== 1 ? 's' : ''}
    | Years: <strong>${yearRange}</strong>
  `;
}

/**
 * Filter and search publications
 */
function filterPublications() {
  const searchTerm = document.getElementById('pub-search').value.toLowerCase();

  let results = [...allPublications];

  // Filter by search term
  if (searchTerm) {
    results = results.filter(pub => {
      const searchableText = [
        pub.title,
        pub.authors.join(' '),
        pub.journal,
        pub.year.toString()
      ].join(' ').toLowerCase();

      return searchableText.includes(searchTerm);
    });
  }

  // Sort by year descending
  results.sort((a, b) => b.year - a.year);

  filteredPublications = results;
  renderPublications(results);
  updateStats(results);
}

/**
 * Load publications from JSON
 */
async function loadPublications() {
  const data = await fetchJSON('../data/publications.json');

  if (!data || !data.publications) {
    document.getElementById('publications-list').innerHTML = `
      <p class="text-center" style="color: var(--gray-600);">
        Unable to load publications. Please try again later.
      </p>
    `;
    return;
  }

  allPublications = data.publications;
  filteredPublications = [...allPublications];

  // Initial render
  filterPublications();

  // Set up search listener
  const searchInput = document.getElementById('pub-search');
  if (searchInput) {
    searchInput.addEventListener('input', filterPublications);
  }
}

/**
 * Initialize page
 */
document.addEventListener('DOMContentLoaded', function() {
  loadPublications();
});
