// GSAP and ScrollTrigger (optional — page still works without CDN)
const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
if (hasGsap) {
  gsap.registerPlugin(ScrollTrigger);
}

// Lucide Icons (optional — page still works without CDN)
const lucideIcons = {
  init() {
    if (typeof lucide === 'undefined') return;
    lucide.createIcons({ attrs: { 'stroke-width': 1.5 } });
  }
};

// Language Toggle (single button, label = target language)
const langToggle = {
  init() {
    this.button = document.querySelector('.lang-btn[data-lang-btn]');
    if (!this.button) return; // EN page: inline onclick navigates to the ES page
    this.content = document.querySelectorAll('[data-lang]');
    
    this.button.addEventListener('click', () => {
      const next = this.button.dataset.state === 'es' ? 'en' : 'es';
      this.apply(next);
      this.updateUrl(next);
    });
    
    window.addEventListener('popstate', () => {
      this.apply(window.location.pathname.includes('/en/') ? 'en' : 'es');
    });
    
    // Respect URL (e.g. dev server serving the ES file under /en/)
    this.apply(window.location.pathname.includes('/en/') ? 'en' : 'es');
  },
  
  apply(lang) {
    this.button.dataset.state = lang;
    // Show target language: "EN" while reading ES, "ES" while reading EN
    this.button.textContent = lang === 'es' ? 'EN' : 'ES';
    this.content.forEach(el => {
      el.style.display = el.dataset.lang === lang ? '' : 'none';
    });
  },
  
  updateUrl(lang) {
    // Push language to URL (may fail on file:// protocol)
    try {
      const url = new URL(window.location);
      if (lang === 'en') {
        url.pathname = url.pathname.replace(/^\/en\//, '/');
        if (!url.pathname.startsWith('/en/')) {
          url.pathname = '/en' + url.pathname;
        }
      } else {
        url.pathname = url.pathname.replace(/^\/en\//, '/');
      }
      history.pushState({}, '', url);
    } catch (e) {
      // file://: language already switched, URL update is cosmetic
    }
  }
};

// Fade In Animations
const fadeAnimations = {
  init() {
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => observer.observe(el));
  }
};

// Hero Animations
const heroAnimation = {
  init() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tl.from('.hero__label', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.3
    })
    .from('.hero__title', {
      opacity: 0,
      y: 30,
      duration: 0.8
    }, '-=0.3')
    .from('.hero__subtitle', {
      opacity: 0,
      y: 20,
      duration: 0.6
    }, '-=0.5')
    .from('.hero__meta-item', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1
    }, '-=0.3')
    .from('.hero__tool', {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      stagger: 0.1
    }, '-=0.3')
    .from('.hero__device', {
      opacity: 0,
      x: 50,
      duration: 0.8
    }, '-=0.8')
    .from('.hero__glow', {
      opacity: 0,
      scale: 0.5,
      duration: 1
    }, '-=0.6');
  }
};

// Timeline Animation
const timelineAnimation = {
  init() {
    const line = document.querySelector('.process__line');
    const steps = document.querySelectorAll('.process__step');
    const dots = document.querySelectorAll('.process__dot');
    
    if (!line || !steps.length) return;
    
    // Animate line fill on scroll
    gsap.to(line, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.process__timeline',
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      }
    });
    
    // Animate each step
    steps.forEach((step, index) => {
      gsap.from(step, {
        opacity: 0,
        x: index % 2 === 0 ? -50 : 50,
        duration: 0.8,
        scrollTrigger: {
          trigger: step,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
      
      // Activate dot when step is in view
      ScrollTrigger.create({
        trigger: step,
        start: 'top 60%',
        onEnter: () => dots[index]?.classList.add('active'),
        onLeaveBack: () => dots[index]?.classList.remove('active')
      });
    });
  }
};

// Gallery Horizontal Scroll
const galleryScroll = {
  init() {
    const gallery = document.querySelector('.design__gallery');
    if (!gallery) return;
    
    // Only enable drag scroll on mobile
    if (window.innerWidth < 992) {
      let isDown = false;
      let startX;
      let scrollLeft;
      
      gallery.addEventListener('mousedown', (e) => {
        isDown = true;
        gallery.style.cursor = 'grabbing';
        startX = e.pageX - gallery.offsetLeft;
        scrollLeft = gallery.scrollLeft;
      });
      
      gallery.addEventListener('mouseleave', () => {
        isDown = false;
        gallery.style.cursor = 'grab';
      });
      
      gallery.addEventListener('mouseup', () => {
        isDown = false;
        gallery.style.cursor = 'grab';
      });
      
      gallery.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - gallery.offsetLeft;
        const walk = (x - startX) * 2;
        gallery.scrollLeft = scrollLeft - walk;
      });
    }
  }
};

// Smooth Scroll for Navigation
const smoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
};

// Active Navigation Link
const activeNav = {
  init() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav a');
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }
};

// Footer Year
const footerYear = {
  init() {
    document.querySelectorAll('.js-year').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }
};

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
  lucideIcons.init();
  langToggle.init();
  fadeAnimations.init();
  if (hasGsap) {
    heroAnimation.init();
    timelineAnimation.init();
  }
  galleryScroll.init();
  smoothScroll.init();
  activeNav.init();
  footerYear.init();
});
