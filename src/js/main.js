import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initContactForm } from './form.js';
import { initProjects } from './projects.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAnimations();
  initContactForm();
  initProjects();

  document.getElementById('year').textContent = new Date().getFullYear();
});
