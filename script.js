/* ============================================
   PORTFOLIO JS — ANIMATIONS & INTERACTIONS
   ============================================ */

// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initHeroAnimations();
  }, 1800);
});

function initHeroAnimations() {
  // Already handled by CSS animations
}

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .project-card, .timeline-card, .contact-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('expanded');
    follower.classList.add('expanded');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('expanded');
    follower.classList.remove('expanded');
  });
});

// ===== NAVIGATION =====
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => mobileNav.classList.remove('open'));
});

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '#00f5a0' : '#00d9f5';
    this.life = 0;
    this.maxLife = Math.random() * 200 + 100;
  }
  update() {
    this.x += this.speedX; this.y += this.speedY; this.life++;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height || this.life > this.maxLife) {
      this.reset();
    }
  }
  draw() {
    const fade = Math.sin((this.life / this.maxLife) * Math.PI);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity * fade;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// Mouse interaction particles
let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
canvas.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

// Create particles
for (let i = 0; i < 120; i++) particles.push(new Particle());

// Draw gradient orbs in background
function drawOrbs() {
  const time = Date.now() * 0.0005;
  const grad1 = ctx.createRadialGradient(
    canvas.width * 0.3 + Math.sin(time) * 50, canvas.height * 0.4 + Math.cos(time) * 50, 0,
    canvas.width * 0.3, canvas.height * 0.4, 400
  );
  grad1.addColorStop(0, 'rgba(0,245,160,0.04)');
  grad1.addColorStop(1, 'transparent');
  ctx.fillStyle = grad1;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const grad2 = ctx.createRadialGradient(
    canvas.width * 0.7 + Math.cos(time * 0.7) * 60, canvas.height * 0.6 + Math.sin(time * 0.7) * 60, 0,
    canvas.width * 0.7, canvas.height * 0.6, 500
  );
  grad2.addColorStop(0, 'rgba(0,217,245,0.03)');
  grad2.addColorStop(1, 'transparent');
  ctx.fillStyle = grad2;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw connections
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,245,160,${0.06 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawOrbs();
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(animateParticles);
}
animateParticles();

// Stop particles when hero is out of view
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) cancelAnimationFrame(animFrame);
    else animateParticles();
  });
}, { threshold: 0 });
heroObserver.observe(document.getElementById('hero'));

// ===== ANIMATED TAGLINE ROTATION =====
const words = document.querySelectorAll('.tagline-animated .word');
let wordIndex = 0;
setInterval(() => {
  words[wordIndex].classList.remove('active');
  words[wordIndex].classList.add('exit');
  setTimeout(() => words[(wordIndex - 1 + words.length) % words.length < 0 ? 0 : wordIndex].classList.remove('exit'), 500);
  wordIndex = (wordIndex + 1) % words.length;
  setTimeout(() => {
    words.forEach(w => w.classList.remove('exit'));
    words[wordIndex].classList.add('active');
  }, 100);
}, 3000);

// ===== INTERSECTION OBSERVER — REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.section-label, .section-title, .section-sub, .about-card').forEach(el => {
  revealObserver.observe(el);
});

// ===== TIMELINE ANIMATION =====
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.1}s`;
  timelineObserver.observe(item);
});

// Timeline progress bar
const timelineProgress = document.getElementById('timelineProgress');
const journeySection = document.getElementById('journey');

window.addEventListener('scroll', () => {
  if (!journeySection) return;
  const rect = journeySection.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, (-rect.top) / (rect.height - window.innerHeight)));
  if (timelineProgress) timelineProgress.style.height = (progress * 100) + '%';
});

// ===== PROJECTS ANIMATION =====
const projectObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), entry.target.dataset.delay || 0);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card').forEach((card, i) => {
  card.dataset.delay = i * 80;
  projectObserver.observe(card);
});

// ===== PROJECT MODAL =====
const projectData = [
  {
    icon: '📊',
    title: 'OneAndro Webinar Tracking System',
    desc: 'A comprehensive end-to-end system designed to track webinar attendance, engagement metrics, and follow-up actions across hundreds of sessions. This project transformed chaotic spreadsheet management into a streamlined, automated reporting system.',
    features: [
      'Automated attendance data collection from Zoom exports',
      'Real-time engagement scoring based on participation metrics',
      'Automated follow-up task generation for low-engagement users',
      'Weekly and monthly summary reports with visual dashboards',
      'Integration with CRM for seamless lead tracking'
    ],
    tags: ['Microsoft Excel', 'Zoom API', 'Automation', 'Analytics', 'Dashboard']
  },
  {
    icon: '✅',
    title: 'Soft Code Attendance Tracking Idea',
    desc: 'Conceptualized a smart attendance management system that uses soft-check mechanisms to auto-flag anomalies, significantly reduce manual data entry errors, and generate comprehensive weekly summaries automatically.',
    features: [
      'Intelligent anomaly detection for unusual attendance patterns',
      'Automated weekly and monthly report generation',
      'Exception-based workflow: only flags what needs human attention',
      'Integration with payroll systems for seamless processing',
      'Mobile-friendly check-in mechanisms'
    ],
    tags: ['System Design', 'Process Automation', 'HR Tech', 'Analytics']
  },
  {
    icon: '📹',
    title: 'Zoom Tracking Automation',
    desc: 'Developed an automation concept to extract Zoom participation data, intelligently track late joiners and early leavers, and auto-generate clean attendance reports — eliminating hours of manual work every week.',
    features: [
      'Automated extraction of Zoom meeting reports via API',
      'Intelligent classification of participants by engagement level',
      'Late joiner and early leaver detection with timestamps',
      'Auto-generated formatted reports sent to managers',
      'Historical trend analysis across multiple meetings'
    ],
    tags: ['Zoom API', 'Python', 'Automation', 'Reporting', 'Data Processing']
  },
  {
    icon: '📧',
    title: 'Email Engagement System',
    desc: 'Designed a tracking and intent-scoring system for email campaigns that goes beyond basic open rates. This system identifies user intent signals and automates follow-up sequences based on behavioral patterns.',
    features: [
      'Multi-touch engagement scoring across email campaigns',
      'Behavioral pattern recognition for intent classification',
      'Automated segmentation based on engagement score',
      'A/B test tracking and performance comparison',
      'Integration with CRM for lead qualification'
    ],
    tags: ['Email Marketing', 'CRM', 'Analytics', 'Automation', 'Lead Scoring']
  },
  {
    icon: '🤖',
    title: 'AI Receptionist System',
    desc: 'Built a comprehensive AI-powered receptionist concept that handles initial customer queries, intelligently routes to the right departments, and automatically logs every interaction — creating a seamless first-touch experience.',
    features: [
      'Natural language understanding for query classification',
      'Intelligent routing to correct departments based on intent',
      'Automatic interaction logging and CRM integration',
      'Escalation protocols for complex or sensitive queries',
      'Analytics dashboard for interaction patterns and bottlenecks'
    ],
    tags: ['AI', 'NLP', 'Automation', 'System Design', 'Customer Experience']
  },
  {
    icon: '📈',
    title: 'Data Analytics Dashboards',
    desc: 'Created a suite of business intelligence dashboards for operations teams, transforming raw operational data into actionable insights with real-time KPI tracking, performance trend analysis, and automated alerting.',
    features: [
      'Real-time KPI monitoring with configurable thresholds',
      'Cross-functional performance comparison views',
      'Automated alert system for metric deviations',
      'Drill-down capabilities from summary to individual records',
      'Export-ready reports for stakeholder presentations'
    ],
    tags: ['Power BI', 'Excel', 'SQL', 'Data Visualization', 'Business Intelligence']
  },
  {
    icon: '⚡',
    title: 'Automation Projects Suite',
    desc: 'A collection of workflow automation tools built to eliminate repetitive manual work across different operational areas — from data entry bots to intelligent notification systems and scheduled report generators.',
    features: [
      'Data entry automation reducing manual work by 70%',
      'Smart notification systems for team coordination',
      'Scheduled report generation and distribution',
      'Cross-platform data synchronization workflows',
      'Error detection and self-healing automation scripts'
    ],
    tags: ['Process Automation', 'Workflow Design', 'Productivity', 'Integration', 'Scripting']
  }
];

const modal = document.getElementById('projectModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

document.querySelectorAll('.project-card').forEach((card, i) => {
  card.addEventListener('click', () => {
    const data = projectData[i];
    if (!data) return;
    modalBody.innerHTML = `
      <div class="modal-icon">${data.icon}</div>
      <div class="modal-title">${data.title}</div>
      <p class="modal-desc">${data.desc}</p>
      <div class="modal-features">
        <h4>Key Features & Impact</h4>
        ${data.features.map(f => `<div class="modal-feature-item">${f}</div>`).join('')}
      </div>
      <div class="modal-tags">${data.tags.map(t => `<span>${t}</span>`).join('')}</div>
    `;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

[modalOverlay, modalClose].forEach(el => {
  el.addEventListener('click', () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { modal.classList.remove('open'); document.body.style.overflow = ''; }
});

// ===== SKILLS ANIMATION =====
const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Animate bars
      entry.target.querySelectorAll('.skill-bar-item').forEach((item, i) => {
        setTimeout(() => item.classList.add('animated'), i * 150);
      });
      // Animate orbs
      entry.target.querySelectorAll('.orb-fill').forEach((fill, i) => {
        const p = parseFloat(fill.closest('.orb-inner').dataset.percent || 0);
        const circumference = 263.9;
        const offset = circumference - (p / 100) * circumference;
        setTimeout(() => {
          fill.style.strokeDashoffset = offset;
        }, i * 200 + 300);
      });
    }
  });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillsObserver.observe(skillsSection);

// Add SVG gradient defs
const svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svgDefs.style.position = 'absolute'; svgDefs.style.width = '0'; svgDefs.style.height = '0';
svgDefs.innerHTML = `
  <defs>
    <linearGradient id="orbGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00f5a0"/>
      <stop offset="100%" stop-color="#00d9f5"/>
    </linearGradient>
  </defs>
`;
document.body.prepend(svgDefs);

// ===== COUNTER ANIMATION =====
function animateCounter(el, target) {
  let current = 0;
  const increment = target / 60;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current);
  }, 24);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(num => {
        animateCounter(num, parseInt(num.dataset.target));
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const aboutSection = document.getElementById('about');
if (aboutSection) counterObserver.observe(aboutSection);

// ===== FINALE ANIMATION =====
const finaleObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelector('.finale-line')?.classList.add('visible');
      entry.target.querySelectorAll('.q-line').forEach((line, i) => {
        setTimeout(() => line.classList.add('visible'), parseFloat(line.dataset.delay || 0) * 1000 + 500);
      });
      setTimeout(() => {
        entry.target.querySelector('.finale-sub')?.classList.add('visible');
        entry.target.querySelector('.back-top-btn')?.classList.add('visible');
      }, 1500);
    }
  });
}, { threshold: 0.3 });

const finaleSection = document.getElementById('finale');
if (finaleSection) finaleObserver.observe(finaleSection);

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.submit-btn span');
    btn.textContent = 'Sending...';
    setTimeout(() => {
      btn.textContent = 'Send Message';
      formSuccess.classList.add('show');
      contactForm.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 4000);
    }, 1500);
  });
}

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== PARALLAX SUBTLE EFFECT ON HERO =====
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const scrolled = window.scrollY;
  const heroContent = hero.querySelector('.hero-content');
  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
  }
});

// ===== PAGE TRANSITION EFFECT =====
document.querySelectorAll('a:not([href^="#"])').forEach(link => {
  if (link.hostname === window.location.hostname || link.getAttribute('href') === '#') return;
  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.href;
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '0';
    setTimeout(() => window.location.href = href, 300);
  });
});
