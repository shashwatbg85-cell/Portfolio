/**
 * SHASHWAT SAGAR SRIVASTAVA - DEVELOPER DASHBOARD PORTFOLIO
 * Theme: Emerald Green Cyber-Aesthetic (#10b981) + Matrix Digital Rain
 * Features: HTML5 Canvas Matrix rain, spotlight cursor, 3D tilt, live IST clock,
 * terminal typewriter, interactive skills matrix, CARGO-KARMA route simulator,
 * clipboard copy toast & Web Audio API cyber synth.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. HTML5 Canvas Matrix Digital Rain Animation Engine
  // ------------------------------------------------------------------------
  const matrixCanvas = document.getElementById('matrixCanvas');
  if (matrixCanvas) {
    const ctx = matrixCanvas.getContext('2d');

    // Matrix characters: Katakana, Binary, Hex & Syntax Glyphs
    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const latin = '0123456789ABCDEF01{}[]<>=/+-*~#!$@';
    const alphabet = katakana + latin;

    const fontSize = 15;
    let columns = 0;
    let drops = [];
    let animationFrameId = null;
    let lastDrawTime = 0;
    const fpsInterval = 1000 / 30; // 30 FPS for cinematic smooth feel & low CPU

    function initMatrix() {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;

      columns = Math.floor(matrixCanvas.width / fontSize);
      drops = [];

      for (let i = 0; i < columns; i++) {
        // Randomize initial starting Y position for natural scatter
        drops[i] = Math.floor(Math.random() * -100);
      }
    }

    function drawMatrix(timestamp) {
      animationFrameId = requestAnimationFrame(drawMatrix);

      if (!timestamp) timestamp = 0;
      const elapsed = timestamp - lastDrawTime;

      if (elapsed > fpsInterval) {
        lastDrawTime = timestamp - (elapsed % fpsInterval);

        // Translucent fade over canvas creates trailing fade effect
        ctx.fillStyle = 'rgba(4, 8, 6, 0.07)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

        for (let i = 0; i < drops.length; i++) {
          const char = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Leading drop has bright glowing mint/white tip
          if (Math.random() > 0.88) {
            ctx.fillStyle = '#a7f3d0'; // Bright mint glow
            ctx.shadowColor = '#34d399';
            ctx.shadowBlur = 8;
          } else {
            ctx.fillStyle = '#10b981'; // Cyber emerald
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
          }

          ctx.fillText(char, x, y);

          // Reset to top once drop exceeds bottom edge
          if (y > matrixCanvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }

          drops[i]++;
        }
      }
    }

    initMatrix();
    animationFrameId = requestAnimationFrame(drawMatrix);

    // Responsive Canvas Resize with Debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initMatrix();
      }, 150);
    }, { passive: true });
  }

  // ------------------------------------------------------------------------
  // 2. Audio Synth Feedback (Web Audio API - Synthesized cyber clicks)
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
        osc.frequency.setValueAtTime(820, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(360, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      } catch (e) {
        // Audio policy
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
        osc.frequency.setValueAtTime(540, this.ctx.currentTime);
        osc.frequency.setValueAtTime(840, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.045, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.22);
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
  // 3. Interactive Spotlight Cursor & Bento Card Mouse Tracking
  // ------------------------------------------------------------------------
  const spotlightCursor = document.getElementById('spotlightCursor');
  const bentoCards = document.querySelectorAll('.bento-card');

  window.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e;

    if (spotlightCursor) {
      spotlightCursor.style.left = `${x}px`;
      spotlightCursor.style.top = `${y}px`;
    }

    bentoCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardX = x - rect.left;
      const cardY = y - rect.top;
      card.style.setProperty('--mouse-x', `${cardX}px`);
      card.style.setProperty('--mouse-y', `${cardY}px`);
    });
  }, { passive: true });

  // ------------------------------------------------------------------------
  // 4. Vanilla-Tilt 3D Initialization
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
  // 5. Live Real-Time Indian Standard Time (IST) Clock
  // ------------------------------------------------------------------------
  const hourHand = document.getElementById('hourHand');
  const minHand = document.getElementById('minHand');
  const secHand = document.getElementById('secHand');
  const digitalTime = document.getElementById('digitalTime');
  const digitalDate = document.getElementById('digitalDate');

  function updateISTClock() {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istTime = new Date(utcTime + (3600000 * 5.5));

    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const seconds = istTime.getSeconds();

    const secDeg = (seconds / 60) * 360;
    const minDeg = ((minutes + seconds / 60) / 60) * 360;
    const hourDeg = (((hours % 12) + minutes / 60) / 12) * 360;

    if (secHand) secHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
    if (minHand) minHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
    if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;

    const pad = (n) => String(n).padStart(2, '0');
    const timeStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    if (digitalTime) digitalTime.textContent = timeStr;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = istTime.toLocaleDateString('en-US', options);
    if (digitalDate) digitalDate.textContent = dateStr;
  }

  updateISTClock();
  setInterval(updateISTClock, 1000);

  // ------------------------------------------------------------------------
  // 6. Live Animated Terminal Snippet
  // ------------------------------------------------------------------------
  const typingElement = document.getElementById('terminalTypingText');
  const terminalCommands = [
    'git status --portfolio',
    'python3 -m matrix_rain --emerald',
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
  // 7. Interactive Toast Notification System
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

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 3500);
  }

  // ------------------------------------------------------------------------
  // 8. Interactive Copy-to-Clipboard for Email
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

  const btnCopyEmail = document.getElementById('btnCopyEmail');
  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', () => {
      const email = btnCopyEmail.getAttribute('data-email') || 'shashwatbg85@gmail.com';
      copyEmailToClipboard(email);
    });
  }

  const copyEmailChannelBtn = document.getElementById('copyEmailChannelBtn');
  if (copyEmailChannelBtn) {
    copyEmailChannelBtn.addEventListener('click', () => {
      copyEmailToClipboard('shashwatbg85@gmail.com');
    });
  }

  // ------------------------------------------------------------------------
  // 9. Tech Stack Matrix & Interactive Skill Inspector
  // ------------------------------------------------------------------------
  const skillCards = document.querySelectorAll('.skill-item-card');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const calloutTitle = document.getElementById('calloutTitle');
  const calloutDesc = document.getElementById('calloutDesc');

  function animateProgressBars() {
    skillCards.forEach(card => {
      const fill = card.querySelector('.skill-progress-fill');
      if (fill) {
        fill.style.width = card.getAttribute('data-proficiency');
      }
    });
  }

  setTimeout(animateProgressBars, 300);

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
  // 10. CARGO-KARMA Interactive Logistics Simulation
  // ------------------------------------------------------------------------
  const btnSimulateRoute = document.getElementById('btnSimulateRoute');
  const btnToggleTransit = document.getElementById('btnToggleTransit');
  const routeProgressLine = document.getElementById('routeProgressLine');
  const routeStatePill = document.getElementById('routeStatePill');
  const nodeMid = document.getElementById('nodeMid');
  const nodeDest = document.getElementById('nodeDest');
  const mockLoadCount = document.getElementById('mockLoadCount');

  let simulationStage = 1;

  if (btnSimulateRoute) {
    btnSimulateRoute.addEventListener('click', () => {
      audioSynth.playClick();
      btnSimulateRoute.classList.add('active');

      simulationStage = (simulationStage + 1) % 3;

      if (simulationStage === 0) {
        updateRouteStyle('15%');
        if (routeStatePill) routeStatePill.textContent = 'DEPARTED • ORIGIN GATEWAY';
        if (nodeMid) nodeMid.classList.remove('active');
        if (nodeDest) nodeDest.classList.remove('active');
        showToast('CARGO-KARMA: Consignment departed Delhi Hub.', 'info');
      } else if (simulationStage === 1) {
        updateRouteStyle('55%');
        if (routeStatePill) routeStatePill.textContent = 'IN TRANSIT • ON SCHEDULE';
        if (nodeMid) nodeMid.classList.add('active');
        if (nodeDest) nodeDest.classList.remove('active');
        showToast('CARGO-KARMA: Checkpoint verified at Kanpur Depot.', 'info');
      } else if (simulationStage === 2) {
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
  // 11. Minimalist Contact Form Transmission & Mailto Bridge
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
        submitFormBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        showToast(`Thank you, ${name}! Your transmission has been queued.`, 'success');

        const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${inquiry} - from ${name}`);
        const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInquiry: ${inquiry}\n\nMessage:\n${message}`);
        
        setTimeout(() => {
          contactForm.reset();
          submitFormBtn.disabled = false;
          submitFormBtn.innerHTML = originalBtnHTML;
          submitFormBtn.style.background = '';

          showToast(`Opening client draft to shashwatbg85@gmail.com...`, 'info');
          window.location.href = `mailto:shashwatbg85@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
        }, 1800);
      }, 1200);
    });
  }

  // ------------------------------------------------------------------------
  // 12. Navigation Bar Active Highlighting & Mobile Drawer
  // ------------------------------------------------------------------------
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

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
  // 13. Staggered Entrance Animations on Initial Load
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

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', () => {
      audioSynth.playClick();
    });
  });

  console.log("%c Shashwat.dev | Emerald Matrix Cyber Dashboard initialized. %c", 
    "background: #040806; color: #10b981; font-size: 13px; font-weight: bold; padding: 6px 12px; border: 1px solid #10b981; border-radius: 6px;", 
    "");
});
