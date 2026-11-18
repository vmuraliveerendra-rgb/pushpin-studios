/**
 * Pushpin Studios - Interactive Studio Application Logic
 * Audio Engine, Booking Estimator, Dynamic Portfolio, and Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioEngine();
  initBookingEstimator();
  initPortfolioFilter();
  initServicesTabs();
  initModals();
  initStudioStatus();
});

/* ==========================================================================
   1. Web Audio API - Studio Sound Room & Waveform Simulator
   ========================================================================== */
let audioCtx = null;
let analyser = null;
let osc1 = null;
let osc2 = null;
let filterNode = null;
let pannerNode = null;
let gainNode = null;
let isAudioPlaying = false;
let animFrameId = null;

const audioPresets = {
  vo: { type1: 'sine', type2: 'triangle', freq1: 220, freq2: 440, filterFreq: 1200, label: 'VO Warm Preamp' },
  atmos: { type1: 'sawtooth', type2: 'sine', freq1: 160, freq2: 320, filterFreq: 3200, label: 'Dolby Atmos 3D' },
  podcast: { type1: 'triangle', type2: 'sine', freq1: 260, freq2: 520, filterFreq: 1800, label: 'Podcast Multi-Mic' },
  master: { type1: 'sine', type2: 'square', freq1: 85, freq2: 170, filterFreq: 5000, label: 'Mastering 808 & Highs' }
};

let currentPreset = 'vo';

function initAudioEngine() {
  const canvas = document.getElementById('audioCanvas');
  const toggleBtn = document.getElementById('toggleAudioBtn');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const vuMeters = document.getElementById('vuMeters');

  if (!canvas || !toggleBtn) return;

  const ctx = canvas.getContext('2d');

  // Resize canvas
  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 160;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function startAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Nodes setup
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;

    filterNode = audioCtx.createBiquadFilter();
    filterNode.type = 'lowpass';

    pannerNode = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.3); // Safe, smooth volume

    applyPreset(currentPreset);

    if (pannerNode) {
      filterNode.connect(pannerNode);
      pannerNode.connect(gainNode);
    } else {
      filterNode.connect(gainNode);
    }

    gainNode.connect(analyser);
    analyser.connect(audioCtx.destination);

    isAudioPlaying = true;
    toggleBtn.innerHTML = '<i class="fas fa-pause"></i> Mute Acoustic Room';
    toggleBtn.classList.add('btn-primary');
    toggleBtn.classList.remove('btn-secondary');

    drawWaveform(ctx, canvas);
  }

  function stopAudio() {
    if (gainNode && audioCtx) {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
      setTimeout(() => {
        if (osc1) { osc1.stop(); osc1.disconnect(); osc1 = null; }
        if (osc2) { osc2.stop(); osc2.disconnect(); osc2 = null; }
      }, 200);
    }
    isAudioPlaying = false;
    toggleBtn.innerHTML = '<i class="fas fa-play"></i> Test Studio Acoustics';
    toggleBtn.classList.remove('btn-primary');
    toggleBtn.classList.add('btn-secondary');
  }

  function applyPreset(key) {
    if (!audioCtx) return;
    const config = audioPresets[key] || audioPresets.vo;

    if (osc1) { osc1.stop(); osc1.disconnect(); }
    if (osc2) { osc2.stop(); osc2.disconnect(); }

    osc1 = audioCtx.createOscillator();
    osc2 = audioCtx.createOscillator();

    osc1.type = config.type1;
    osc1.frequency.setValueAtTime(config.freq1, audioCtx.currentTime);

    osc2.type = config.type2;
    osc2.frequency.setValueAtTime(config.freq2, audioCtx.currentTime);

    filterNode.frequency.setValueAtTime(config.filterFreq, audioCtx.currentTime);

    osc1.connect(filterNode);
    osc2.connect(filterNode);

    osc1.start();
    osc2.start();

    // Atmos spatial sweep
    if (key === 'atmos' && pannerNode) {
      let sweepTime = audioCtx.currentTime;
      pannerNode.pan.setValueCurveAtTime([-0.8, 0.8, -0.8], sweepTime, 4);
    }
  }

  toggleBtn.addEventListener('click', () => {
    if (isAudioPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPreset = btn.getAttribute('data-preset');
      if (isAudioPlaying) {
        applyPreset(currentPreset);
      }
    });
  });

  // Visualizer drawing loop
  function drawWaveform(ctx, canvas) {
    if (!isAudioPlaying) {
      // Idle animated subtle wave
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawIdleWave(ctx, canvas);
      animFrameId = requestAnimationFrame(() => drawWaveform(ctx, canvas));
      return;
    }

    animFrameId = requestAnimationFrame(() => drawWaveform(ctx, canvas));

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = 'rgba(7, 8, 12, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 1.8;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i] / 255) * canvas.height * 0.85;

      const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
      gradient.addColorStop(0, '#e6283b');
      gradient.addColorStop(0.6, '#f59e0b');
      gradient.addColorStop(1, '#06b6d4');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

      x += barWidth;
    }

    // Update VU meter bar lights
    const avg = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
    updateVULights(avg);
  }

  let idlePhase = 0;
  function drawIdleWave(ctx, canvas) {
    ctx.strokeStyle = 'rgba(230, 40, 59, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const sliceWidth = canvas.width / 50;
    let x = 0;
    idlePhase += 0.05;

    for (let i = 0; i <= 50; i++) {
      const y = (canvas.height / 2) + Math.sin(i * 0.2 + idlePhase) * 12;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();
  }

  function updateVULights(level) {
    const bars = document.querySelectorAll('.meter-bars span');
    if (!bars.length) return;
    const activeCount = Math.floor((level / 120) * bars.length);
    bars.forEach((bar, idx) => {
      bar.classList.remove('lit-green', 'lit-yellow', 'lit-red');
      if (idx < activeCount) {
        if (idx < 5) bar.classList.add('lit-green');
        else if (idx < 8) bar.classList.add('lit-yellow');
        else bar.classList.add('lit-red');
      }
    });
  }

  // Draw initial idle wave
  drawIdleWave(ctx, canvas);
}

/* ==========================================================================
   2. Interactive Booking & Live Cost Estimator
   ========================================================================== */
const STUDIO_SERVICES = {
  podcast: { name: 'Podcast Recording Suite', ratePerHour: 2500, bay: 'Studio Alpha (Acoustic Treated)' },
  dubbing: { name: 'Multi-Language Dubbing & ADR', ratePerHour: 3500, bay: 'Suite Beta (Dubbing Room)' },
  vo: { name: 'Voice Over & Narration Booth', ratePerHour: 2800, bay: 'Vocal Isolation Booth' },
  atmos: { name: 'Dolby Atmos 7.1.4 Mixing & Mastering', ratePerHour: 5000, bay: 'Dolby Atmos Reference Bay' },
  editing: { name: 'Video Editing & DI Color Grading', ratePerHour: 3200, bay: 'DaVinci Resolve DI Bay' },
  adfilm: { name: 'Ad Film & Commercial Shoot', ratePerHour: 7500, bay: 'Multi-Cam Soundstage' },
  song: { name: 'Song Recording & Vocal Tracking', ratePerHour: 3500, bay: 'Live Instrument & Vocal Room' }
};

let currentBooking = {
  serviceKey: 'podcast',
  durationHours: 2,
  date: '',
  time: '10:00',
  addons: [],
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  notes: ''
};

function initBookingEstimator() {
  const serviceCards = document.querySelectorAll('.service-card-choice');
  const durationSelect = document.getElementById('bookingDuration');
  const dateInput = document.getElementById('bookingDate');
  const timeSelect = document.getElementById('bookingTime');
  const addonCheckboxes = document.querySelectorAll('.addon-item input[type="checkbox"]');
  const submitBtn = document.getElementById('confirmBookingBtn');
  const voucherModal = document.getElementById('voucherModal');

  // Set default min date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
    currentBooking.date = today;
  }

  // Service selection
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      currentBooking.serviceKey = card.getAttribute('data-service');
      recalculateBookingTotal();
    });
  });

  // Duration
  if (durationSelect) {
    durationSelect.addEventListener('change', (e) => {
      currentBooking.durationHours = parseFloat(e.target.value);
      recalculateBookingTotal();
    });
  }

  // Addons
  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      currentBooking.addons = Array.from(addonCheckboxes)
        .filter(c => c.checked)
        .map(c => ({ name: c.getAttribute('data-name'), price: parseInt(c.getAttribute('data-price')) }));
      recalculateBookingTotal();
    });
  });

  // Calculate & Refresh Summary
  function recalculateBookingTotal() {
    const service = STUDIO_SERVICES[currentBooking.serviceKey] || STUDIO_SERVICES.podcast;
    const baseHours = currentBooking.durationHours;
    let basePrice = service.ratePerHour * baseHours;

    // Apply 10% discount for full day (8+ hours)
    let discount = 0;
    if (baseHours >= 8) {
      discount = basePrice * 0.10;
    }

    let addonsTotal = currentBooking.addons.reduce((sum, item) => sum + item.price, 0);
    let finalTotal = basePrice - discount + addonsTotal;

    // Update DOM labels
    const summaryServiceName = document.getElementById('summaryServiceName');
    const summaryBayName = document.getElementById('summaryBayName');
    const summaryDuration = document.getElementById('summaryDuration');
    const summaryBasePrice = document.getElementById('summaryBasePrice');
    const summaryAddonsTotal = document.getElementById('summaryAddonsTotal');
    const summaryDiscountRow = document.getElementById('summaryDiscountRow');
    const summaryDiscountVal = document.getElementById('summaryDiscountVal');
    const summaryGrandTotal = document.getElementById('summaryGrandTotal');

    if (summaryServiceName) summaryServiceName.textContent = service.name;
    if (summaryBayName) summaryBayName.textContent = service.bay;
    if (summaryDuration) summaryDuration.textContent = `${baseHours} ${baseHours === 1 ? 'Hour' : 'Hours'}`;
    if (summaryBasePrice) summaryBasePrice.textContent = `₹${basePrice.toLocaleString('en-IN')}`;
    if (summaryAddonsTotal) summaryAddonsTotal.textContent = `₹${addonsTotal.toLocaleString('en-IN')}`;

    if (discount > 0 && summaryDiscountRow && summaryDiscountVal) {
      summaryDiscountRow.style.display = 'flex';
      summaryDiscountVal.textContent = `-₹${discount.toLocaleString('en-IN')} (Full Day 10% Off)`;
    } else if (summaryDiscountRow) {
      summaryDiscountRow.style.display = 'none';
    }

    if (summaryGrandTotal) summaryGrandTotal.textContent = `₹${finalTotal.toLocaleString('en-IN')}`;

    currentBooking.finalPrice = finalTotal;
    currentBooking.basePrice = basePrice;
    currentBooking.discount = discount;
  }

  // Initial calculation
  recalculateBookingTotal();

  // Booking Submit Handler
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('clientName');
      const phoneInput = document.getElementById('clientPhone');
      const emailInput = document.getElementById('clientEmail');
      const notesInput = document.getElementById('clientNotes');

      if (!nameInput.value.trim() || !phoneInput.value.trim()) {
        alert('Please enter your Name and Contact Phone Number to reserve your studio session.');
        nameInput.focus();
        return;
      }

      currentBooking.clientName = nameInput.value.trim();
      currentBooking.clientPhone = phoneInput.value.trim();
      currentBooking.clientEmail = emailInput ? emailInput.value.trim() : '';
      currentBooking.notes = notesInput ? notesInput.value.trim() : '';

      // Generate Session Voucher
      showBookingVoucher(currentBooking);
    });
  }
}

function showBookingVoucher(booking) {
  const modal = document.getElementById('voucherModal');
  const service = STUDIO_SERVICES[booking.serviceKey];
  const sessionId = '7K-PS-' + Math.floor(10000 + Math.random() * 90000);

  document.getElementById('voucherSessionId').textContent = sessionId;
  document.getElementById('voucherClientName').textContent = booking.clientName;
  document.getElementById('voucherService').textContent = service.name;
  document.getElementById('voucherBay').textContent = service.bay;
  document.getElementById('voucherDate').textContent = `${booking.date} at ${document.getElementById('bookingTime').value}`;
  document.getElementById('voucherDuration').textContent = `${booking.durationHours} Hours`;
  document.getElementById('voucherTotal').textContent = `₹${booking.finalPrice.toLocaleString('en-IN')}`;

  // WhatsApp prefilled message
  const waMsg = encodeURIComponent(
    `Hello Pushpin Studios!\n\n` +
    `I would like to confirm my studio booking:\n` +
    `• Booking ID: ${sessionId}\n` +
    `• Client: ${booking.clientName} (${booking.clientPhone})\n` +
    `• Service: ${service.name}\n` +
    `• Location: Banjara Hills, Hyderabad\n` +
    `• Date & Slot: ${booking.date} at ${document.getElementById('bookingTime').value}\n` +
    `• Duration: ${booking.durationHours} hrs\n` +
    `• Estimated Total: ₹${booking.finalPrice.toLocaleString('en-IN')}\n\n` +
    `Please confirm room availability.`
  );

  const waBtn = document.getElementById('voucherWhatsAppBtn');
  if (waBtn) {
    waBtn.href = `https://wa.me/919988999956?text=${waMsg}`;
  }

  modal.classList.add('active');
}

/* ==========================================================================
   3. Portfolio Showcase ("Recent Frames")
   ========================================================================== */
const PORTFOLIO_PROJECTS = [
  {
    id: 'monsoon-reel',
    title: 'Monsoon Reel',
    category: 'film',
    tag: 'Ad Film & DI Color',
    image: 'assets/images/monsoon_reel.png',
    client: 'High-Fashion & Automotive Commercial',
    desc: 'Cinematic visual production shot on ARRI & RED, color-graded with bespoke film grain emulation and rain atmospheric sound design.',
    deliverables: ['Color Grading (DI)', 'Sound Design', 'Commercial Video Editing']
  },
  {
    id: 'aurelia-vo',
    title: 'Aurelia VO',
    category: 'voice',
    tag: 'Voice Over & Dubbing',
    image: 'assets/images/aurelia_vo.png',
    client: 'International OTT Series Dubbing',
    desc: 'Multi-language voice acting captured using Neumann U87 microphones with zero noise floor and pristine dialogue clarity.',
    deliverables: ['Multi-lingual Dubbing', 'ADR Synchronization', 'Vocal Mastering']
  },
  {
    id: 'ad-astra',
    title: 'Ad Astra',
    category: 'film',
    tag: 'Promotional Content',
    image: 'assets/images/ad_astra.png',
    client: 'Global Tech Brand Campaign',
    desc: 'Complete studio shoot, motion graphics integration, and vibrant multi-platform color workflows.',
    deliverables: ['Studio Shoot', 'Motion Graphics', 'DI Process']
  },
  {
    id: 'amber-frequency',
    title: 'Amber Frequency',
    category: 'audio',
    tag: 'Song Recording & Master',
    image: 'assets/images/amber_frequency.png',
    client: 'Independent Music Artist Album',
    desc: 'Acoustic vocal tracking, live instrument capture, and warm analog-style summing for an expansive indie release.',
    deliverables: ['Song Recording', 'Mixing & Mastering', 'Stem Delivery']
  },
  {
    id: 'saturday-edit',
    title: 'Saturday Edit',
    category: 'post',
    tag: 'Video Editing',
    image: 'assets/images/saturday_edit.png',
    client: 'Feature Film Production',
    desc: 'Precision narrative cutting, pacing optimization, and offline-to-online conform for theatrical release.',
    deliverables: ['Feature Video Editing', 'Sync Sound Matching', 'Assembly to Picture Lock']
  },
  {
    id: 'glasshouse',
    title: 'Glasshouse',
    category: 'post',
    tag: 'DI Suite & Finishing',
    image: 'assets/images/glasshouse.png',
    client: 'Boutique Production House',
    desc: 'Dual-monitor color grading suite execution with calibrated OLED mastering for broadcast and streaming standards.',
    deliverables: ['Color Grading', 'VFX Clean-up', 'Deliverables Package']
  },
  {
    id: 'afterglow',
    title: 'Afterglow',
    category: 'film',
    tag: 'Corporate & Brand Film',
    image: 'assets/images/afterglow.png',
    client: 'Enterprise Innovation Showcase',
    desc: 'High-profile executive interviews and corporate visual storytelling with rich sound design.',
    deliverables: ['Corporate Video', 'Sound Design', 'Subtitling & Master']
  },
  {
    id: 'airwave-sessions',
    title: 'Airwave Sessions',
    category: 'audio',
    tag: 'Dolby Atmos & Podcast',
    image: 'assets/images/airwave_sessions.png',
    client: 'Top-10 Charting Audio Series',
    desc: 'Live multi-host podcast recording and spatial Dolby Atmos mixing on our large format control console.',
    deliverables: ['Podcast Multi-Mic Capture', 'Dolby ATMOS 7.1.4', 'Broadcast Loudness Normalization']
  }
];

function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;

  function renderProjects(filter = 'all') {
    grid.innerHTML = '';
    const filtered = filter === 'all' 
      ? PORTFOLIO_PROJECTS 
      : PORTFOLIO_PROJECTS.filter(p => p.category === filter);

    filtered.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'project-card glass-panel';
      card.innerHTML = `
        <div class="project-img-wrapper">
          <span class="project-tag">${proj.tag}</span>
          <img src="${proj.image}" alt="${proj.title}" class="project-img" loading="lazy">
          <div class="project-play-hover">
            <div class="play-circle-btn">
              <i class="fas fa-expand"></i>
            </div>
          </div>
        </div>
        <div class="project-details">
          <h3>${proj.title} <i class="fas fa-arrow-up-right-from-square text-muted" style="font-size: 0.85rem;"></i></h3>
          <p>${proj.desc}</p>
        </div>
      `;

      card.addEventListener('click', () => openProjectModal(proj));
      grid.appendChild(card);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.getAttribute('data-filter'));
    });
  });

  renderProjects('all');
}

function openProjectModal(proj) {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  document.getElementById('modalProjTitle').textContent = proj.title;
  document.getElementById('modalProjTag').textContent = proj.tag;
  document.getElementById('modalProjImage').src = proj.image;
  document.getElementById('modalProjClient').textContent = proj.client;
  document.getElementById('modalProjDesc').textContent = proj.desc;

  const delivContainer = document.getElementById('modalProjDeliverables');
  delivContainer.innerHTML = '';
  proj.deliverables.forEach(d => {
    const span = document.createElement('span');
    span.className = 'badge badge-red';
    span.textContent = d;
    delivContainer.appendChild(span);
  });

  modal.classList.add('active');
}

/* ==========================================================================
   4. Services Catalog Tabs
   ========================================================================== */
function initServicesTabs() {
  const tabs = document.querySelectorAll('.service-tab-btn');
  const cards = document.querySelectorAll('.services-grid .service-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-service-cat');
      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-cat') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Modal Dialogs Management
   ========================================================================== */
function initModals() {
  const closeBtns = document.querySelectorAll('.modal-close-btn, .modal-overlay');

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === btn || e.target.closest('.modal-close-btn')) {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      }
    });
  });

  // Prevent clicks inside modal-box from closing
  document.querySelectorAll('.modal-box').forEach(box => {
    box.addEventListener('click', (e) => e.stopPropagation());
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }
  });
}

/* ==========================================================================
   6. Live Studio Status Banner
   ========================================================================== */
function initStudioStatus() {
  const statusEl = document.getElementById('liveStatusText');
  if (!statusEl) return;

  const statuses = [
    'Studio A: Multilingual Dubbing Session in Progress',
    'Dolby Atmos Bay: Theatrical Sound Mix Conform',
    'Podcast Lounge: Multi-Mic 4K Recording Live',
    'Edit Bay Delta: DaVinci Resolve DI Color Pass',
    'Vocal Booth: High-Resolution Voiceover Tracking'
  ];

  let currentIdx = 0;
  setInterval(() => {
    currentIdx = (currentIdx + 1) % statuses.length;
    statusEl.style.opacity = '0';
    setTimeout(() => {
      statusEl.textContent = statuses[currentIdx];
      statusEl.style.opacity = '1';
    }, 300);
  }, 4500);
}
