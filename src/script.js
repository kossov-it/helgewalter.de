// ========================================
// MODERN MARITIME DESIGN - HELGE WALTER
// Enhanced JavaScript for Swiper 8 & Animations
// ========================================

// ========================================
// SWIPER CAROUSEL INITIALIZATION
// ========================================

// Configuration for all property swipers
const swiperConfig = {
  loop: true,
  speed: 800,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
  grabCursor: true,
  watchSlidesProgress: true,
};

// Initialize all swipers
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Swiper 1 (Palmaille 82)
  const swiper1 = new Swiper('.swiper-1', swiperConfig);

  // Initialize Swiper 2 (Hammer Deich 70)
  const swiper2 = new Swiper('.swiper-2', swiperConfig);

  // Initialize Swiper 3 (Hammer Deich 60)
  const swiper3 = new Swiper('.swiper-3', swiperConfig);
});

// ========================================
// SMOOTH SCROLL & NAVIGATION
// ========================================

// Smooth scroll to section
function scrollDown(event) {
  event.preventDefault();
  const windowHeight = window.innerHeight;
  window.scrollBy({
    top: windowHeight,
    behavior: 'smooth'
  });
}

// Update active navigation link on scroll
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.property-section');

function updateActiveNavLink() {
  const currentScrollPos = window.pageYOffset;
  const windowHeight = window.innerHeight;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    // Check if section is in viewport (with offset for fixed header)
    if (
      currentScrollPos >= sectionTop - 200 &&
      currentScrollPos < sectionTop + sectionHeight - 200
    ) {
      // Remove active class from all links
      navLinks.forEach((link) => link.classList.remove('active'));

      // Add active class to current section's link
      const targetLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
      if (targetLink) {
        targetLink.classList.add('active');
      }
    }
  });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

// Intersection Observer for fade-in animations
const observerOptions = {
  root: null,
  threshold: 0.15,
  rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optional: unobserve after animation to improve performance
      // observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all property sections
document.addEventListener('DOMContentLoaded', () => {
  const propertySections = document.querySelectorAll('.property-section');
  propertySections.forEach(section => {
    observer.observe(section);
  });
});

// ========================================
// HEADER BEHAVIOR ON SCROLL
// ========================================

let lastScrollTop = 0;
const header = document.querySelector('.header');
let ticking = false;

function updateHeader() {
  const currentScrollPos = window.pageYOffset;

  // Add shadow to header when scrolled
  if (currentScrollPos > 100) {
    header.style.boxShadow = '0 4px 20px rgba(0, 24, 41, 0.3)';
    header.style.background = 'rgba(0, 24, 41, 0.98)';
  } else {
    header.style.boxShadow = '0 4px 12px rgba(0, 24, 41, 0.1)';
    header.style.background = 'rgba(0, 24, 41, 0.95)';
  }

  lastScrollTop = currentScrollPos;
  ticking = false;
}

// ========================================
// EVENT LISTENERS
// ========================================

// Throttled scroll event
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateActiveNavLink();
      updateHeader();
    });
    ticking = true;
  }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');

    if (targetId === '#') {
      return; // Skip for scroll down button
    }

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = targetElement.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ========================================
// PARALLAX EFFECT (Optional Enhancement)
// ========================================

// Add subtle parallax effect to property images on scroll
function parallaxEffect() {
  const propertyImages = document.querySelectorAll('.property-image');

  propertyImages.forEach(image => {
    const parent = image.closest('.property-section');
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const scrollPercent = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

    if (scrollPercent >= 0 && scrollPercent <= 1) {
      const translateY = (scrollPercent - 0.5) * 20; // Subtle movement
      image.style.transform = `scale(1.05) translateY(${translateY}px)`;
    }
  });
}

// Apply parallax on scroll (throttled)
let parallaxTicking = false;
window.addEventListener('scroll', () => {
  if (!parallaxTicking) {
    window.requestAnimationFrame(() => {
      parallaxEffect();
      parallaxTicking = false;
    });
    parallaxTicking = true;
  }
});

// ========================================
// PRELOAD OPTIMIZATION
// ========================================

// Preload images for better performance
window.addEventListener('load', () => {
  const lazyImages = document.querySelectorAll('.property-image');

  lazyImages.forEach(image => {
    const bgImage = image.style.backgroundImage;
    if (bgImage) {
      const imgUrl = bgImage.slice(4, -1).replace(/"/g, '');
      const img = new Image();
      img.src = imgUrl;
    }
  });
});

// ========================================
// MOBILE MENU ENHANCEMENT (Future)
// ========================================

// Add touch event support for mobile
if ('ontouchstart' in window) {
  document.body.classList.add('touch-device');
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Debounce function for resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle window resize
const handleResize = debounce(() => {
  // Recalculate positions on resize
  updateActiveNavLink();
}, 250);

window.addEventListener('resize', handleResize);

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
  // Alt + number keys for quick navigation
  if (e.altKey && e.key >= '1' && e.key <= '3') {
    e.preventDefault();
    const sectionNum = parseInt(e.key);
    const section = document.getElementById(`section${sectionNum}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

// Focus management for accessibility
const focusableElements = document.querySelectorAll(
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
);

// Skip to main content (accessibility feature)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab' && e.shiftKey === false && document.activeElement === document.body) {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.focus();
    }
  }
});

// ========================================
// CONSOLE INFO
// ========================================

console.log('%c🌊 Helge Walter Maritime Properties', 'color: #003052; font-size: 16px; font-weight: bold;');
console.log('%c✨ Modern Premium Design by Claude', 'color: #d4af37; font-size: 12px;');
console.log('%c📱 Fully Responsive | Swiper 8 | Smooth Animations', 'color: #005a8c; font-size: 10px;');
