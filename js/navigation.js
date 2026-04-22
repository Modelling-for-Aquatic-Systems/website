/**
 * Navigation - Marilaure Grégoire Website
 *
 * Handles mobile menu toggle functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];

  if (mobileMenuToggle && navMenu) {
    // Toggle mobile menu on button click
    mobileMenuToggle.addEventListener('click', function() {
      const isActive = navMenu.classList.toggle('active');

      // Update button icon
      mobileMenuToggle.textContent = isActive ? '✕' : '☰';

      // Update ARIA attribute for accessibility
      mobileMenuToggle.setAttribute('aria-expanded', isActive);
    });

    // Close mobile menu when clicking on a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          mobileMenuToggle.textContent = '☰';
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideNav = navMenu.contains(event.target);
      const isClickOnToggle = mobileMenuToggle.contains(event.target);

      if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenuToggle.textContent = '☰';
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Highlight active page in navigation
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});
