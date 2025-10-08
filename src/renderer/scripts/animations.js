// Sistema de Animações e Micro-interações - Achievements Manager

// Animation Engine
class AnimationEngine {
  constructor() {
    this.animations = new Map();
    this.timeline = [];
    this.isPlaying = false;
    this.currentTime = 0;
    this.playbackRate = 1;

    // Performance settings
    this.preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isLiteMode = this.checkLiteMode();

    this.init();
    this.setupLiteModeListener();
  }

  checkLiteMode() {
    return (
      document.documentElement.getAttribute('data-lite-mode') === 'true' ||
      document.documentElement.classList.contains('lite-mode')
    );
  }

  setupLiteModeListener() {
    // Escutar mudanças no modo lite
    window.addEventListener('liteModeChanged', event => {
      this.isLiteMode = event.detail.enabled;

      if (this.isLiteMode) {
        this.disableAllAnimations();
      }
    });

    // Escutar mudanças na preferência de movimento reduzido
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
      this.preferReducedMotion = e.matches;
      if (this.preferReducedMotion || this.isLiteMode) {
        this.disableAllAnimations();
      }
    });
  }

  disableAllAnimations() {
    // Para todas as animações ativas
    this.animations.forEach((animation, id) => {
      if (animation.element && animation.element.style) {
        animation.element.style.animation = 'none';
        animation.element.style.transition = 'none';
      }
    });
    this.animations.clear();
    this.timeline = [];
    this.isPlaying = false;
  }

  init() {
    // Listen for reduced motion preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
      this.preferReducedMotion = e.matches;
      this.updateAnimationSettings();
    });

    // Listen for lite mode changes
    const observer = new MutationObserver(() => {
      this.isLiteMode = document.documentElement.classList.contains('lite-mode');
      this.updateAnimationSettings();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  updateAnimationSettings() {
    if (this.preferReducedMotion || this.isLiteMode) {
      // Disable or reduce animations
      document.documentElement.style.setProperty('--animation-duration-multiplier', '0.1');
      document.documentElement.style.setProperty('--transition-duration-multiplier', '0.1');
    } else {
      document.documentElement.style.setProperty('--animation-duration-multiplier', '1');
      document.documentElement.style.setProperty('--transition-duration-multiplier', '1');
    }
  }

  // Create animation
  animate(element, keyframes, options = {}) {
    // Verificar se animações devem ser desabilitadas
    if ((this.preferReducedMotion || this.isLiteMode) && !options.force) {
      // Skip animation, just apply final state
      const finalFrame = keyframes[keyframes.length - 1];
      Object.assign(element.style, finalFrame);

      // Garantir visibilidade imediata
      if (finalFrame.opacity !== undefined) {
        element.style.opacity = finalFrame.opacity;
      }
      if (finalFrame.transform !== undefined) {
        element.style.transform = finalFrame.transform;
      }

      return Promise.resolve();
    }

    const animation = element.animate(keyframes, {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards',
      ...options,
    });

    const id = Utils.StringUtils.generateId('anim');
    this.animations.set(id, { animation, element });

    // Clean up when animation finishes
    animation.addEventListener('finish', () => {
      this.animations.delete(id);
    });

    return animation.finished;
  }

  // Fade in animation
  fadeIn(element, options = {}) {
    return this.animate(
      element,
      [
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      {
        duration: 400,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        ...options,
      }
    );
  }

  // Fade out animation
  fadeOut(element, options = {}) {
    return this.animate(
      element,
      [
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-10px)' },
      ],
      {
        duration: 300,
        easing: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)',
        ...options,
      }
    );
  }

  // Slide in from direction
  slideIn(element, direction = 'left', options = {}) {
    const transforms = {
      left: ['translateX(-100%)', 'translateX(0)'],
      right: ['translateX(100%)', 'translateX(0)'],
      up: ['translateY(-100%)', 'translateY(0)'],
      down: ['translateY(100%)', 'translateY(0)'],
    };

    return this.animate(
      element,
      [
        { transform: transforms[direction][0], opacity: 0 },
        { transform: transforms[direction][1], opacity: 1 },
      ],
      {
        duration: 500,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        ...options,
      }
    );
  }

  // Scale animation
  scale(element, from = 0.8, to = 1, options = {}) {
    return this.animate(
      element,
      [
        { transform: `scale(${from})`, opacity: 0 },
        { transform: `scale(${to})`, opacity: 1 },
      ],
      {
        duration: 350,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        ...options,
      }
    );
  }

  // Bounce animation
  bounce(element, options = {}) {
    return this.animate(
      element,
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.1)' },
        { transform: 'scale(0.95)' },
        { transform: 'scale(1)' },
      ],
      {
        duration: 600,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        ...options,
      }
    );
  }

  // Shake animation
  shake(element, options = {}) {
    return this.animate(
      element,
      [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(0)' },
      ],
      {
        duration: 500,
        ...options,
      }
    );
  }

  // Pulse animation
  pulse(element, options = {}) {
    return this.animate(
      element,
      [
        { transform: 'scale(1)', opacity: 1 },
        { transform: 'scale(1.05)', opacity: 0.8 },
        { transform: 'scale(1)', opacity: 1 },
      ],
      {
        duration: 1000,
        iterations: Infinity,
        ...options,
      }
    );
  }

  // Stagger animations
  stagger(elements, animationFn, delay = 100) {
    const promises = [];

    elements.forEach((element, index) => {
      setTimeout(() => {
        promises.push(animationFn(element));
      }, index * delay);
    });

    return Promise.all(promises);
  }

  // Stop all animations
  stopAll() {
    this.animations.forEach(animation => {
      animation.cancel();
    });
    this.animations.clear();
  }

  // Pause all animations
  pauseAll() {
    this.animations.forEach(animation => {
      animation.pause();
    });
  }

  // Resume all animations
  resumeAll() {
    this.animations.forEach(animation => {
      animation.play();
    });
  }
}

// Micro-interactions Manager
class MicroInteractions {
  constructor() {
    this.interactions = new Map();
    this.isLiteMode = false;
    this.preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  init() {
    this.checkLiteMode();
    this.setupLiteModeListener();
    this.setupRippleEffect();
    this.setupHoverEffects();
    this.setupFocusEffects();
    this.setupClickEffects();
    this.setupScrollEffects();
  }

  checkLiteMode() {
    this.isLiteMode =
      document.documentElement.hasAttribute('data-lite-mode') &&
      document.documentElement.getAttribute('data-lite-mode') === 'true';
  }

  setupLiteModeListener() {
    // Listen for lite mode changes
    document.addEventListener('liteModeChanged', () => {
      this.checkLiteMode();
    });

    // Listen for reduced motion preference changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
      this.preferReducedMotion = e.matches;
    });
  }

  // Ripple effect for buttons
  setupRippleEffect() {
    document.addEventListener('click', e => {
      const button = e.target.closest('.btn, .card, .list-item');
      if (!button || button.classList.contains('no-ripple')) return;

      this.createRipple(button, e);
    });
  }

  createRipple(element, event) {
    // Não criar ripple se modo lite estiver ativo ou movimento reduzido preferido
    if (this.isLiteMode || this.preferReducedMotion) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = Utils.DOMUtils.createElement('div', {
      className: 'ripple-effect',
      style: `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: currentColor;
        border-radius: 50%;
        opacity: 0.3;
        pointer-events: none;
        transform: scale(0);
        z-index: 1000;
      `,
    });

    // Ensure element has relative positioning
    const originalPosition = element.style.position;
    if (!originalPosition || originalPosition === 'static') {
      element.style.position = 'relative';
    }

    element.appendChild(ripple);

    // Animate ripple
    const animation = ripple.animate(
      [
        { transform: 'scale(0)', opacity: 0.3 },
        { transform: 'scale(1)', opacity: 0 },
      ],
      {
        duration: 600,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    );

    animation.addEventListener('finish', () => {
      ripple.remove();
    });
  }

  // Hover effects
  setupHoverEffects() {
    const hoverElements = document.querySelectorAll('.hover-lift, .hover-glow, .hover-scale');

    hoverElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.applyHoverEffect(element, true);
      });

      element.addEventListener('mouseleave', () => {
        this.applyHoverEffect(element, false);
      });
    });
  }

  applyHoverEffect(element, isHover) {
    if (element.classList.contains('hover-lift')) {
      element.style.transform = isHover ? 'translateY(-2px)' : 'translateY(0)';
      element.style.boxShadow = isHover
        ? '0 8px 25px rgba(0, 0, 0, 0.15)'
        : '0 2px 10px rgba(0, 0, 0, 0.1)';
    }

    if (element.classList.contains('hover-glow')) {
      element.style.boxShadow = isHover ? '0 0 20px rgba(var(--primary-rgb), 0.3)' : 'none';
    }

    if (element.classList.contains('hover-scale')) {
      element.style.transform = isHover ? 'scale(1.02)' : 'scale(1)';
    }
  }

  // Focus effects
  setupFocusEffects() {
    document.addEventListener('focusin', e => {
      if (e.target.matches('input, textarea, select, button, [tabindex]')) {
        this.addFocusRing(e.target);
      }
    });

    document.addEventListener('focusout', e => {
      this.removeFocusRing(e.target);
    });
  }

  addFocusRing(element) {
    element.classList.add('focus-visible');

    // Create animated focus ring
    const ring = Utils.DOMUtils.createElement('div', {
      className: 'focus-ring',
      style: `
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 2px solid var(--primary);
        border-radius: inherit;
        pointer-events: none;
        opacity: 0;
        z-index: 1001;
      `,
    });

    // Ensure element has relative positioning
    const originalPosition = element.style.position;
    if (!originalPosition || originalPosition === 'static') {
      element.style.position = 'relative';
    }

    element.appendChild(ring);

    // Animate ring
    ring.animate(
      [
        { opacity: 0, transform: 'scale(0.95)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      {
        duration: 200,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards',
      }
    );
  }

  removeFocusRing(element) {
    element.classList.remove('focus-visible');

    const ring = element.querySelector('.focus-ring');
    if (ring) {
      const animation = ring.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(1.05)' },
        ],
        {
          duration: 150,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }
      );

      animation.addEventListener('finish', () => {
        ring.remove();
      });
    }
  }

  // Click effects
  setupClickEffects() {
    document.addEventListener('mousedown', e => {
      const clickable = e.target.closest('button, .btn, .clickable');
      if (clickable) {
        this.addClickEffect(clickable);
      }
    });

    document.addEventListener('mouseup', e => {
      const clickable = e.target.closest('button, .btn, .clickable');
      if (clickable) {
        this.removeClickEffect(clickable);
      }
    });
  }

  addClickEffect(element) {
    element.style.transform = 'scale(0.98)';
    element.style.transition = 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)';
  }

  removeClickEffect(element) {
    element.style.transform = 'scale(1)';
    setTimeout(() => {
      element.style.transition = '';
    }, 100);
  }

  // Scroll effects
  setupScrollEffects() {
    const scrollElements = document.querySelectorAll('.scroll-reveal, .parallax');

    if (scrollElements.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.applyScrollEffect(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    scrollElements.forEach(element => {
      observer.observe(element);
    });

    // Parallax effect
    if (document.querySelectorAll('.parallax').length > 0) {
      this.setupParallax();
    }
  }

  applyScrollEffect(element) {
    if (element.classList.contains('scroll-reveal')) {
      element.classList.add('revealed');

      // Animate element into view
      window.AnimationEngine?.fadeIn(element, { duration: 600 });
    }
  }

  setupParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');

    const updateParallax = Utils.throttle(() => {
      const scrollY = window.pageYOffset;

      parallaxElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const speed = element.dataset.parallaxSpeed || 0.5;
        const yPos = -(scrollY * speed);

        element.style.transform = `translateY(${yPos}px)`;
      });
    }, 16); // 60fps

    window.addEventListener('scroll', updateParallax);
  }
}

// Page Transitions
class PageTransitions {
  constructor() {
    this.isTransitioning = false;
    this.currentPage = null;
    this.init();
  }

  init() {
    // Listen for navigation events
    document.addEventListener('click', e => {
      const link = e.target.closest('[data-page]');
      if (link) {
        e.preventDefault();
        this.navigateTo(link.dataset.page);
      }
    });
  }

  async navigateTo(pageId, options = {}) {
    if (this.isTransitioning) return;

    this.isTransitioning = true;
    const newPage = document.querySelector(`[data-page-content="${pageId}"]`);

    if (!newPage) {
      // Log removido para evitar dependência circular com DebugManager
      this.isTransitioning = false;
      return;
    }

    try {
      // Hide current page
      if (this.currentPage) {
        await this.hidePage(this.currentPage, options.exitAnimation);
      }

      // Show new page
      await this.showPage(newPage, options.enterAnimation);

      this.currentPage = newPage;

      // Update URL if needed
      if (options.updateUrl !== false) {
        history.pushState({ pageId }, '', `#${pageId}`);
      }

      // Trigger page change event
      document.dispatchEvent(
        new CustomEvent('pagechange', {
          detail: { pageId, page: newPage },
        })
      );
    } catch (error) {
      // Log removido para evitar dependência circular com DebugManager
    } finally {
      this.isTransitioning = false;
    }
  }

  async hidePage(page, animation = 'fadeOut') {
    page.style.pointerEvents = 'none';

    switch (animation) {
      case 'slideLeft':
        await window.AnimationEngine?.slideOut(page, 'left');
        break;
      case 'slideRight':
        await window.AnimationEngine?.slideOut(page, 'right');
        break;
      case 'slideUp':
        await window.AnimationEngine?.slideOut(page, 'up');
        break;
      case 'slideDown':
        await window.AnimationEngine?.slideOut(page, 'down');
        break;
      default:
        await window.AnimationEngine?.fadeOut(page);
    }

    page.style.display = 'none';
  }

  async showPage(page, animation = 'fadeIn', tabName = null) {
    page.style.display = 'block';
    page.style.pointerEvents = 'auto';

    switch (animation) {
      case 'slideLeft':
        await window.AnimationEngine?.slideIn(page, 'left');
        break;
      case 'slideRight':
        await window.AnimationEngine?.slideIn(page, 'right');
        break;
      case 'slideUp':
        await window.AnimationEngine?.slideIn(page, 'up');
        break;
      case 'slideDown':
        await window.AnimationEngine?.slideIn(page, 'down');
        break;
      default:
        await window.AnimationEngine?.fadeIn(page);
    }
  }

  // Preload page content
  async preloadPage(pageId) {
    const page = document.querySelector(`[data-page-content="${pageId}"]`);
    if (page && page.dataset.src && !page.dataset.loaded) {
      try {
        const response = await fetch(page.dataset.src);
        const content = await response.text();
        page.innerHTML = content;
        page.dataset.loaded = 'true';

        // Initialize components in loaded content
        if (window.Components) {
          window.Components.ComponentFactory.initAll(page);
        }
      } catch (error) {
        // Log removido para evitar dependência circular com DebugManager
      }
    }
  }
}

// Loading Animations
class LoadingAnimations {
  static createSkeleton(container, type = 'card') {
    const skeletons = {
      card: `
        <div class="skeleton-card">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-content">
            <div class="skeleton-line skeleton-line--title"></div>
            <div class="skeleton-line skeleton-line--subtitle"></div>
            <div class="skeleton-line skeleton-line--text"></div>
          </div>
        </div>
      `,
      list: `
        <div class="skeleton-list">
          ${Array(5)
            .fill()
            .map(
              () => `
            <div class="skeleton-list-item">
              <div class="skeleton-avatar skeleton-avatar--small"></div>
              <div class="skeleton-line skeleton-line--title"></div>
            </div>
          `
            )
            .join('')}
        </div>
      `,
      text: `
        <div class="skeleton-text">
          ${Array(3)
            .fill()
            .map(
              () => `
            <div class="skeleton-line"></div>
          `
            )
            .join('')}
        </div>
      `,
    };

    container.innerHTML = skeletons[type] || skeletons.card;
    container.classList.add('skeleton-loading');
  }

  static removeSkeleton(container) {
    container.classList.remove('skeleton-loading');
  }

  static showProgress(container, progress = 0) {
    const progressBar =
      container.querySelector('.progress-bar') ||
      Utils.DOMUtils.createElement('div', {
        className: 'progress-bar',
        innerHTML: `
          <div class="progress-bar__track">
            <div class="progress-bar__fill"></div>
          </div>
          <div class="progress-bar__label">0%</div>
        `,
      });

    if (!container.contains(progressBar)) {
      container.appendChild(progressBar);
    }

    const fill = progressBar.querySelector('.progress-bar__fill');
    const label = progressBar.querySelector('.progress-bar__label');

    fill.style.width = `${progress}%`;
    label.textContent = `${Math.round(progress)}%`;
  }
}

// Initialize animation systems
document.addEventListener('DOMContentLoaded', () => {
  // Create global instances
  window.AnimationEngine = new AnimationEngine();
  window.MicroInteractions = new MicroInteractions();
  window.PageTransitions = new PageTransitions();

  // Add utility classes for animations
  document.documentElement.classList.add('animations-ready');
});

// Export to global scope
if (typeof window !== 'undefined') {
  window.Animations = {
    AnimationEngine,
    MicroInteractions,
    PageTransitions,
    LoadingAnimations,
  };
}

// Export ES6
export {
  AnimationEngine,
  MicroInteractions,
  PageTransitions,
  LoadingAnimations
};
