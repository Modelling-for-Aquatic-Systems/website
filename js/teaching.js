/**
 * Teaching Page - Marilaure Grégoire Website
 *
 * Load and display courses
 */

/**
 * Create HTML for a course item
 * If course.url is defined and non-empty, wraps the card in an anchor tag.
 */
function createCourseItem(course) {
  const cardInner = `
    <div class="course-item">
      <div class="course-header">
        <h3 class="course-title">${escapeHTML(course.title)}</h3>
        <div class="course-meta">
          ${course.code ? `<span>${escapeHTML(course.code)}</span> | ` : ''}
          <span>${escapeHTML(course.level)}</span> |
          <span>${course.ects} ECTS</span> |
          <span>${escapeHTML(course.language)}</span>
        </div>
      </div>
      <p class="course-description">${escapeHTML(course.description)}</p>
    </div>
  `;

  if (course.url) {
    return `<a href="${escapeHTML(course.url)}" target="_blank" rel="noopener" class="course-link">${cardInner}</a>`;
  }
  return cardInner;
}

/**
 * Load and display courses
 */
async function loadCourses() {
  const courseList = document.getElementById('course-list');

  if (!courseList) return;

  const data = await fetchJSON('../data/teaching.json');

  if (!data || !data.courses || data.courses.length === 0) {
    courseList.innerHTML = `
      <p class="text-center" style="color: var(--gray-600);">
        Course information will be available soon.
      </p>
    `;
    return;
  }

  courseList.innerHTML = data.courses
    .map(course => createCourseItem(course))
    .join('');
}

/**
 * Initialize page
 */
document.addEventListener('DOMContentLoaded', function() {
  loadCourses();
});
