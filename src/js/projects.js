import projectsData from '../data/projects.json';

export function initProjects() {
  const grid = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function getProjectImage(project) {
    if (!project.images || project.images.length === 0) {
      return `
        <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 group-hover:scale-105 transition-transform duration-500"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <svg class="w-16 h-16 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z"/>
          </svg>
        </div>
      `;
    }

    if (project.images.length === 1) {
      return `
        <img src="${project.images[0]}" alt="${project.title}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20\\'></div><div class=\\'absolute inset-0 flex items-center justify-center\\'><svg class=\\'w-16 h-16 text-slate-600\\' fill=\\'currentColor\\' viewBox=\\'0 0 24 24\\'><path d=\\'M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4z\\'/></svg></div>'">
        <div class="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-transparent to-transparent"></div>
      `;
    }

    const imagesHtml = project.images.map((img, i) => `
      <div class="w-full h-full flex-shrink-0">
        <img src="${img}" alt="${project.title} - Screenshot ${i + 1}" class="w-full h-full object-cover" loading="lazy">
      </div>
    `).join('');

    return `
      <div class="project-carousel absolute inset-0 overflow-hidden" data-current="0" data-total="${project.images.length}">
        <div class="flex w-full h-full transition-transform duration-500 ease-out">
          ${imagesHtml}
        </div>
        <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          ${project.images.map((_, i) => `
            <button class="carousel-dot w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors ${i === 0 ? 'bg-white' : ''}" data-index="${i}" aria-label="Screenshot ${i + 1}"></button>
          `).join('')}
        </div>
        <button class="carousel-prev absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Screenshot anterior">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button class="carousel-next absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Próximo screenshot">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-dark-900/40 via-transparent to-transparent pointer-events-none"></div>
    `;
  }

  function initCarousel(card) {
    const carousel = card.querySelector('.project-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.flex');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    let current = 0;
    const total = parseInt(carousel.dataset.total);

    function goTo(index) {
      current = ((index % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('bg-white', i === current);
        dot.classList.toggle('bg-white/50', i !== current);
      });
    }

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goTo(current - 1);
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goTo(current + 1);
    });

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goTo(parseInt(dot.dataset.index));
      });
    });

    let autoPlay = setInterval(() => goTo(current + 1), 4000);

    card.addEventListener('mouseenter', () => clearInterval(autoPlay));
    card.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => goTo(current + 1), 4000);
    });
  }

  function renderProjects(filter = 'all') {
    let filtered = filter === 'all'
      ? projectsData
      : projectsData.filter(p => p.category === filter);

    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    grid.innerHTML = '';

    filtered.forEach((project, index) => {
      const card = document.createElement('div');
      card.className = 'reveal glass rounded-xl overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-2 group';
      card.style.transitionDelay = `${index * 100}ms`;

      const hasDemo = project.demoUrl && project.demoUrl !== '#';
      const hasRepo = project.repoUrl && project.repoUrl !== '#';

      card.innerHTML = `
        <div class="aspect-video bg-dark-700 relative overflow-hidden">
          ${project.featured ? '<div class="absolute top-3 left-3 z-20 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">Destaque</div>' : ''}
          ${getProjectImage(project)}
        </div>
        <div class="p-6">
          <h3 class="text-white font-heading text-lg font-bold mb-2 group-hover:text-primary transition-colors">${project.title}</h3>
          <p class="text-slate-400 text-sm mb-4 line-clamp-3">${project.description}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            ${project.tags.map(tag => `<span class="px-3 py-1 bg-dark-600 text-slate-300 text-xs rounded-full">${tag}</span>`).join('')}
          </div>
          <div class="flex gap-3">
            ${hasDemo ? `
              <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-sm text-primary hover:text-primary-400 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                Demo
              </a>
            ` : ''}
            ${hasRepo ? `
              <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 2.614-.322 1.606 0 2.614.322 2.614.322.652 1.652.24 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Código
              </a>
            ` : ''}
          </div>
        </div>
      `;

      grid.appendChild(card);
      initCarousel(card);
    });

    const newRevealElements = grid.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    newRevealElements.forEach(el => observer.observe(el));
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-primary', 'text-white');
        b.classList.add('bg-dark-700', 'text-slate-400');
      });
      btn.classList.remove('bg-dark-700', 'text-slate-400');
      btn.classList.add('bg-primary', 'text-white');
      renderProjects(btn.dataset.filter);
    });
  });

  renderProjects();
}
