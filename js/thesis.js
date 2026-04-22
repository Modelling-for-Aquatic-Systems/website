/**
 * Thesis Topics Page - Marilaure Grégoire Website
 *
 * Load and display Master thesis topics
 */

/**
 * Create HTML for a thesis topic card
 */
function createThesisCard(topic, index) {
  // Create contacts list (names only, no emails)
  const contacts = topic.supervisors
    .map(name => escapeHTML(name))
    .join(', ');

  return `
    <div class="thesis-card">
      <span class="thesis-number">#${index + 1}</span>
      <h3 class="thesis-title">${escapeHTML(topic.title)}</h3>

      <p class="thesis-description">${escapeHTML(topic.description)}</p>

      <div class="thesis-contacts">
        <strong>Contact:</strong> ${contacts}
      </div>
    </div>
  `;
}

/**
 * Load and display thesis topics
 */
async function loadThesisTopics() {
  const topicsList = document.getElementById('topics-list');

  if (!topicsList) return;

  const data = await fetchJSON('../data/thesis-topics.json');

  if (!data || !data.topics || data.topics.length === 0) {
    topicsList.innerHTML = `
      <p class="text-center" style="color: var(--gray-600);">
        No thesis topics available at the moment. Please check back later or contact us directly.
      </p>
    `;
    return;
  }

  // Display all topics
  topicsList.innerHTML = data.topics
    .map((topic, index) => createThesisCard(topic, index))
    .join('');
}

/**
 * Initialize page
 */
document.addEventListener('DOMContentLoaded', function() {
  loadThesisTopics();
});
