/**
 * Main JavaScript - Marilaure Grégoire Website
 *
 * Utility functions and common functionality
 */

/**
 * Utility Functions
 */

// Fetch JSON data from a file
async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching JSON:', error);
    return null;
  }
}

// Format date from ISO string
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

// Group array of objects by a key
function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Load and display news items on the homepage
 */
async function loadNews() {
  const newsContainer = document.getElementById('news-list');
  if (!newsContainer) return;

  const data = await fetchJSON('data/news.json');

  if (!data || !data.news || data.news.length === 0) {
    newsContainer.innerHTML = `
      <li class="news-item">
        <p class="news-excerpt">No news items available at the moment.</p>
      </li>
    `;
    return;
  }

  // Sort news by date (most recent first)
  const sortedNews = data.news.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Display only the 5 most recent items
  const recentNews = sortedNews.slice(0, 5);

  newsContainer.innerHTML = recentNews.map(item => `
    <li class="news-item${item.link ? ' news-item--link' : ''}">
      <time class="news-date">${formatDate(item.date)}</time>
      <div class="news-body">
        <h3 class="news-title">${escapeHTML(item.title)}</h3>
        <p class="news-excerpt">${escapeHTML(item.content)}</p>
      </div>
      ${item.link ? `<a class="news-stretched-link" href="${escapeHTML(item.link)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(item.title)}"></a>` : ''}
    </li>
  `).join('');
}

/**
 * Initialize page-specific functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Load news on homepage
  if (document.getElementById('news-list')) {
    loadNews();
  }

  // Add external link icon and attributes
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    if (!link.getAttribute('rel')) {
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
});

/**
 * Export utility functions for use in other scripts
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchJSON,
    formatDate,
    groupBy,
    escapeHTML
  };
}
