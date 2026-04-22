/**
 * People Page - Marilaure Grégoire Website
 *
 * Load and display team members
 */

const SVG_EMAIL = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
const SVG_GLOBE = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
const SVG_BOOK = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;

/**
 * Create HTML for a person card (horizontal layout: photo left, content right)
 * @param {Object} person - Person data
 * @param {boolean} isAlumni - Whether to render as alumni card
 */
function createPersonCard(person, isAlumni = false) {
  const photoPath = `../assets/people/${person.photo}`;

  const methodTags = person.methods.map(m =>
    `<span class="tag tag-method">${escapeHTML(m)}</span>`
  ).join('');

  const themeTags = person.themes.map(t =>
    `<span class="tag tag-theme">${escapeHTML(t)}</span>`
  ).join('');

  const links = [];
  if (person.email && !isAlumni) {
    links.push(`<a href="mailto:${escapeHTML(person.email)}" title="Email">${SVG_EMAIL}</a>`);
  }
  if (person.website) {
    links.push(`<a href="${escapeHTML(person.website)}" target="_blank" rel="noopener" title="Website">${SVG_GLOBE}</a>`);
  }

  const alumniClass = isAlumni ? ' alumni' : '';
  const alumniBadge = isAlumni ? `<span class="alumni-badge">Alumni</span>` : '';

  return `
    <div class="person-card${alumniClass}">
      <img src="${photoPath}"
           alt="${escapeHTML(person.name)}"
           class="person-photo"
           loading="lazy"
           width="80"
           height="80">
      <div class="person-content">
        <div class="person-header">
          <div class="person-name-info">
            <h3 class="person-name">${escapeHTML(person.name)}</h3>
            <p class="person-role">${escapeHTML(person.role)}</p>
          </div>
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            ${alumniBadge}
            ${links.length > 0 ? `<div class="person-links">${links.join('')}</div>` : ''}
          </div>
        </div>
        ${!isAlumni ? `<div class="person-tags">${methodTags}${themeTags}</div>` : ''}
      </div>
    </div>
  `;
}

/**
 * Create HTML for a master student card
 * Uses thesis link (book icon) and a teal "Master Student" badge
 */
function createMasterStudentCard(person) {
  const photoHtml = person.photo
    ? `<img src="../assets/people/${escapeHTML(person.photo)}"
           alt="${escapeHTML(person.name)}"
           class="person-photo"
           loading="lazy"
           width="80"
           height="80">`
    : `<div class="person-photo person-photo-placeholder">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      </div>`;

  const thesisLink = person.thesis_url
    ? `<div class="person-links"><a href="${escapeHTML(person.thesis_url)}" target="_blank" rel="noopener" title="Master Thesis">${SVG_BOOK}</a></div>`
    : '';

  return `
    <div class="person-card grad">
      ${photoHtml}
      <div class="person-content">
        <div class="person-header">
          <div class="person-name-info" style="flex: 1; min-width: 0;">
            <h3 class="person-name">${escapeHTML(person.name)}</h3>
            ${person.thesis ? `<p class="person-role">${escapeHTML(person.thesis)}</p>` : ''}
          </div>
          <div style="display: flex; align-items: center; gap: 0.4rem; flex-shrink: 0;">
            <span class="master-badge">Grad</span>
            ${thesisLink}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Load and display all team members (current + alumni)
 */
async function loadTeam() {
  const teamGrid = document.getElementById('team-grid');
  if (!teamGrid) return;

  const data = await fetchJSON('../data/people.json');

  if (!data || !data.current) {
    teamGrid.innerHTML = '<p>Unable to load team data.</p>';
    return;
  }

  // Render current members
  const allMembers = [
    ...(data.current.postdocs || []),
    ...(data.current.phd_students || [])
  ];

  if (allMembers.length > 0) {
    teamGrid.innerHTML = allMembers.map(person => createPersonCard(person)).join('');
  } else {
    teamGrid.innerHTML = '<p>No team members currently listed.</p>';
  }

  // Render master students
  const masterGrid = document.getElementById('master-grid');
  if (masterGrid && data.master_students && data.master_students.length > 0) {
    masterGrid.innerHTML = data.master_students
      .map(person => createMasterStudentCard(person))
      .join('');
  } else if (masterGrid) {
    masterGrid.innerHTML = '<p style="color: var(--gray-600);">No master students currently listed.</p>';
  }

  // Render alumni
  const alumniGrid = document.getElementById('alumni-grid');
  if (alumniGrid && data.alumni && data.alumni.length > 0) {
    alumniGrid.innerHTML = data.alumni
      .map(person => createPersonCard(person, true))
      .join('');
  } else if (alumniGrid) {
    alumniGrid.innerHTML = '<p style="color: var(--gray-600);">No alumni listed.</p>';
  }
}

/**
 * Initialize page
 */
document.addEventListener('DOMContentLoaded', function() {
  loadTeam();
});
