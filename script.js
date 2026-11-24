/**
 * SHASHWAT SAGAR SRIVASTAVA - DEVELOPER DASHBOARD PORTFOLIO
 * High-performance Vanilla JavaScript Engine
 * Features: Spotlight cursor, 3D tilt, live IST clock, terminal typewriter,
 * interactive skills matrix, CARGO-KARMA route simulator, copy-toast & cyber audio synth.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. Audio Synth Feedback (Web Audio API - Pure synthesized sound)
  // ------------------------------------------------------------------------
  class CyberAudioSynth {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.06);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
      } catch (e) {
        // Audio policy or unsupported
      }
    }

    playSuccess() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, this.ctx.currentTime);
        osc.frequency.setValueAtTime(780, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
      } catch (e) {
        // Audio policy
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      return this.enabled;
    }
  }

  const audioSynth = new CyberAudioSynth();

  // Sound toggle button in navbar
  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      const isEnabled = audioSynth.toggle();
      soundToggle.innerHTML = isEnabled 
        ? '<i class="fa-solid fa-volume-high"></i>' 
        : '<i class="fa-solid fa-volume-xmark"></i>';
      soundToggle.style.color = isEnabled ? 'var(--text-secondary)' : 'var(--text-muted)';
      showToast(isEnabled ? 'Audio Feedback: ENABLED' : 'Audio Feedback: MUTED', 'info');
      if (isEnabled) audioSynth.playSuccess();
    });
  }

  // ------------------------------------------------------------------------
  // 2. Interactive Spotlight Cursor & Bento Card Mouse Tracking
  // ------------------------------------------------------------------------
  const spotlightCursor = document.getElementById('spotlightCursor');
  const bentoCards = document.querySelectorAll('.bento-card');

  window.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;

    // Move global ambient cursor spotlight
    if (spotlightCursor) {
      spotlightCursor.style.left = `${x}px`;
      spotlightCursor.style.top = `${y}px`;
    }

    // Update individual bento card spotlight coordinates
    bentoCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardX = x - rect.left;
      const cardY = y - rect.top;
      card.style.setProperty('--mouse-x', `${cardX}px`);
      card.style.setProperty('--mouse-y', `${cardY}px`);
    });
  }, { passive: true });

  // ------------------------------------------------------------------------
  // 3. Vanilla-Tilt 3D Initialization
  // ------------------------------------------------------------------------
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
      max: 4,
      speed: 400,
      glare: true,
      "max-glare": 0.12,
      scale: 1.01
    });
  }

  // ------------------------------------------------------------------------
  // 4. Live Real-Time Indian Standard Time (IST) Clock
  // ------------------------------------------------------------------------
  const hourHand = document.getElementById('hourHand');
  const minHand = document.getElementById('minHand');
  const secHand = document.getElementById('secHand');
  const digitalTime = document.getElementById('digitalTime');
  const digitalDate = document.getElementById('digitalDate');

  function updateISTClock() {
    // Current UTC time + 5 hours 30 minutes for IST
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utcTime + (3600000 * 5.5));

    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const seconds = istTime.getSeconds();

    // Analog Clock Rotations
    const secDeg = (seconds / 60) * 360;
    const minDeg = ((minutes + seconds / 60) / 60) * 360;
    const hourDeg = (((hours % 12) + minutes / 60) / 12) * 360;

    if (secHand) secHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
    if (minHand) minHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
    if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;

    // Digital Time Format: HH:MM:SS IST
    const pad = (n) => String(n).padStart(2, '0');
    const timeStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    if (digitalTime) digitalTime.textContent = timeStr;

    // Full Date Format
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = istTime.toLocaleDateString('en-US', options);
    if (digitalDate) digitalDate.textContent = dateStr;
  }

  updateISTClock();
  setInterval(updateISTClock, 1000);

  // ------------------------------------------------------------------------
  // 5. Live Animated Terminal Snippet
  // ------------------------------------------------------------------------
  const typingElement = document.getElementById('terminalTypingText');
  const terminalCommands = [
    'git status --portfolio',
    'python3 -m train_model --logistics',
    'node build_cargo_karma.js',
    'shashwat.isAvailableForInternship()',
    'echo "Ready to build innovative solutions."'
  ];

  let cmdIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function typeTerminalCommand() {
    if (!typingElement) return;

    const currentCmd = terminalCommands[cmdIndex];

    if (isDeleting) {
      typingElement.textContent = currentCmd.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typingElement.textContent = currentCmd.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIndex === currentCmd.length) {
      // Pause at end of line
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      cmdIndex = (cmdIndex + 1) % terminalCommands.length;
      typingSpeed = 500;
    }

    setTimeout(typeTerminalCommand, typingSpeed);
  }

  typeTerminalCommand();

  // Terminal copy button
  const terminalCopyBtn = document.getElementById('terminalCopyBtn');
  if (terminalCopyBtn) {
    terminalCopyBtn.addEventListener('click', () => {
      audioSynth.playClick();
      const codeSnippet = `curl -s https://shashwat.dev/api/status`;
      navigator.clipboard.writeText(codeSnippet).then(() => {
        showToast('CLI command copied: ' + codeSnippet, 'success');
      });
    });
  }

  // ------------------------------------------------------------------------
  // 6. Interactive Toast Notification System
  // ------------------------------------------------------------------------
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'success') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success' 
      ? '<i class="fa-solid fa-circle-check toast-icon"></i>' 
      : '<i class="fa-solid fa-circle-info toast-icon"></i>';

    toast.innerHTML = `
      ${icon}
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Force layout reflow for animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 3500);
  }

  // ------------------------------------------------------------------------
  // 7. Interactive Copy-to-Clipboard for Email
  // ------------------------------------------------------------------------
  function copyEmailToClipboard(email = 'shashwatbg85@gmail.com') {
    audioSynth.playSuccess();
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Email copied to clipboard: ${email}`, 'success');
      }).catch(() => {
        fallbackCopy(email);
      });
    } else {
      fallbackCopy(email);
    }
  }

  function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Email copied: ${text}`, 'success');
    } catch (err) {
      showToast(`Email: ${text}`, 'info');
    }
    document.body.removeChild(textArea);
  }

  // Attach to Hero Button
  const btnCopyEmail = document.getElementById('btnCopyEmail');
  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', () => {
      const email = btnCopyEmail.getAttribute('data-email') || 'shashwatbg85@gmail.com';
      copyEmailToClipboard(email);
    });
  }

  // Attach to Contact Section Channel Button
  const copyEmailChannelBtn = document.getElementById('copyEmailChannelBtn');
  if (copyEmailChannelBtn) {
    copyEmailChannelBtn.addEventListener('click', () => {
      copyEmailToClipboard('shashwatbg85@gmail.com');
    });
  }

  // ------------------------------------------------------------------------
  // 8. Tech Stack Matrix & Interactive Skill Inspector
  // ------------------------------------------------------------------------
  const skillCards = document.querySelectorAll('.skill-item-card');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const calloutTitle = document.getElementById('calloutTitle');
  const calloutDesc = document.getElementById('calloutDesc');

  // Activate initial skill progress bars
  function animateProgressBars() {
    skillCards.forEach(card => {
      const fill = card.querySelector('.skill-progress-fill');
      if (fill) {
        fill.style.width = card.getAttribute('data-proficiency');
      }
    });
  }

  // Trigger progress animation on load
  setTimeout(animateProgressBars, 300);

  // Skill Inspector Hover / Tap
  skillCards.forEach(card => {
    function activateInspector() {
      skillCards.forEach(c => c.classList.remove('highlighted'));
      card.classList.add('highlighted');

      const skillName = card.getAttribute('data-skill');
      const details = card.getAttribute('data-details');
      const pct = card.getAttribute('data-proficiency');

      if (calloutTitle && calloutDesc) {
        calloutTitle.innerHTML = `<span class="text-cyan">${skillName}</span> (${pct} Proficiency)`;
        calloutDesc.textContent = details;
      }
    }

    card.addEventListener('mouseenter', () => {
      audioSynth.playClick();
      activateInspector();
    });

    card.addEventListener('click', activateInspector);
  });

  // Category Filtering
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      audioSynth.playClick();
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // ------------------------------------------------------------------------
  // 9. CARGO-KARMA Interactive Logistics Simulation
  // ------------------------------------------------------------------------
  const btnSimulateRoute = document.getElementById('btnSimulateRoute');
  const btnToggleTransit = document.getElementById('btnToggleTransit');
  const routeProgressLine = document.getElementById('routeProgressLine');
  const routeStatePill = document.getElementById('routeStatePill');
  const nodeMid = document.getElementById('nodeMid');
  const nodeDest = document.getElementById('nodeDest');
  const mockLoadCount = document.getElementById('mockLoadCount');

  let simulationStage = 1; // 1: Mid, 2: Dest, 0: Origin

  if (btnSimulateRoute) {
    btnSimulateRoute.addEventListener('click', () => {
      audioSynth.playClick();
      btnSimulateRoute.classList.add('active');

      simulationStage = (simulationStage + 1) % 3;

      if (simulationStage === 0) {
        // Origin Departed
        if (routeProgressLine) {
          routeProgressLine.style.setProperty('--progress-width', '15%');
          const afterElem = routeProgressLine.querySelector('&::after');
        }
        routeProgressLine.style.cssText = "position: absolute; top: 2rem; left: 20px; right: 20px; height: 3px; background: rgba(255,255,255,0.1);";
        updateRouteStyle('15%');
        if (routeStatePill) routeStatePill.textContent = 'DEPARTED • ORIGIN GATEWAY';
        if (nodeMid) nodeMid.classList.remove('active');
        if (nodeDest) nodeDest.classList.remove('active');
        showToast('CARGO-KARMA: Consignment departed Delhi Hub.', 'info');
      } else if (simulationStage === 1) {
        // Mid Checkpoint
        updateRouteStyle('55%');
        if (routeStatePill) routeStatePill.textContent = 'IN TRANSIT • ON SCHEDULE';
        if (nodeMid) nodeMid.classList.add('active');
        if (nodeDest) nodeDest.classList.remove('active');
        showToast('CARGO-KARMA: Checkpoint verified at Kanpur Depot.', 'info');
      } else if (simulationStage === 2) {
        // Destination Reached
        updateRouteStyle('100%');
        if (routeStatePill) routeStatePill.textContent = 'DELIVERED • LUCKNOW CENTRAL';
        if (nodeMid) nodeMid.classList.add('active');
        if (nodeDest) nodeDest.classList.add('active');
        audioSynth.playSuccess();
        showToast('CARGO-KARMA: Consignment successfully delivered!', 'success');
      }
    });
  }

  function updateRouteStyle(widthPct) {
    const styleSheet = document.getElementById('dynamicRouteStyle') || document.createElement('style');
    styleSheet.id = 'dynamicRouteStyle';
    styleSheet.innerHTML = `.route-progress-line::after { width: ${widthPct} !important; }`;
    document.head.appendChild(styleSheet);
  }

  // Toggle Consignment mock data
  let consignmentToggle = false;
  if (btnToggleTransit) {
    btnToggleTransit.addEventListener('click', () => {
      audioSynth.playClick();
      consignmentToggle = !consignmentToggle;

      const consignmentElem = document.querySelector('.consignment-id span');
      if (consignmentToggle) {
        if (consignmentElem) consignmentElem.textContent = 'CONSIGNMENT: #CK-9104-EXP';
        if (mockLoadCount) mockLoadCount.textContent = '1,452';
        showToast('Switched to Express Priority Consignment #CK-9104-EXP', 'info');
      } else {
        if (consignmentElem) consignmentElem.textContent = 'CONSIGNMENT: #CK-8942-IND';
        if (mockLoadCount) mockLoadCount.textContent = '1,428';
        showToast('Switched to Standard Consignment #CK-8942-IND', 'info');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 10. Minimalist Contact Form Transmission & Mailto Bridge
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const submitFormBtn = document.getElementById('submitFormBtn');

  if (contactForm && submitFormBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName')?.value.trim();
      const email = document.getElementById('senderEmail')?.value.trim();
      const inquiry = document.getElementById('inquiryType')?.value;
      const message = document.getElementById('senderMessage')?.value.trim();

      if (!name || !email || !message) {
        showToast('Please complete all required fields.', 'info');
        return;
      }

      // Animated Submission State
      audioSynth.playClick();
      const originalBtnHTML = submitFormBtn.innerHTML;
      submitFormBtn.disabled = true;
      submitFormBtn.innerHTML = `
        <span class="btn-submit-icon"><i class="fa-solid fa-spinner fa-spin"></i></span>
        <span>Encrypting & Transmitting...</span>
      `;

      setTimeout(() => {
        audioSynth.playSuccess();
        submitFormBtn.innerHTML = `
          <span class="btn-submit-icon"><i class="fa-solid fa-circle-check text-green"></i></span>
          <span>Transmission Sent!</span>
        `;
        submitFormBtn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';

        showToast(`Thank you, ${name}! Your transmission has been queued.`, 'success');

        // Optional mailto direct dispatch link
        const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${inquiry} - from ${name}`);
        const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInquiry: ${inquiry}\n\nMessage:\n${message}`);
        
        // Reset form after delay
        setTimeout(() => {
          contactForm.reset();
          submitFormBtn.disabled = false;
          submitFormBtn.innerHTML = originalBtnHTML;
          submitFormBtn.style.background = '';

          // Inform user that direct mail client can also open
          showToast(`Opening client draft to shashwatbg85@gmail.com...`, 'info');
          window.location.href = `mailto:shashwatbg85@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
        }, 1800);
      }, 1200);
    });
  }

  // ------------------------------------------------------------------------
  // 11. Navigation Bar Active Highlighting & Mobile Drawer
  // ------------------------------------------------------------------------
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  // Mobile drawer toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      audioSynth.playClick();
      mobileDrawer.classList.toggle('open');
    });

    mobileNavItems.forEach(item => {
      item.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // ScrollSpy with IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // ------------------------------------------------------------------------
  // 12. Staggered Entrance Animations on Initial Load
  // ------------------------------------------------------------------------
  bentoCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 + (index * 90));
  });

  // Global click sound for interactive elements
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
      audioSynth.playClick();
    });
  });

  console.log("%c Shashwat.dev | Portfolio Dashboard v2.4 initialized. System Online. %c", 
    "background: #111118; color: #06b6d4; font-size: 13px; font-weight: bold; padding: 6px 12px; border: 1px solid #6366f1; border-radius: 6px;", 
    "");
});
