/**
 * Joviraj 3D Studios - Interactive 3D Games & Parallax Engine
 * Zero external dependencies. Accessible, lightweight vanilla JS with CSS 3D transforms.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Theme Toggle (Light / Dark Mode with Persistence)
  // =========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  function getPreferredTheme() {
    const saved = localStorage.getItem('Joviraj_theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('Joviraj_theme', theme);
    if (themeIcon) {
      themeIcon.innerHTML = theme === 'dark'
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  }

  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // =========================================================================
  // 2. Mobile Navigation Toggle
  // =========================================================================
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isExpanded = navMenu.classList.toggle('open');
      mobileNavToggle.setAttribute('aria-expanded', isExpanded);
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // =========================================================================
  // 3. Web Audio API Synthesizer (Retro 3D Game Sound Effects)
  // =========================================================================
  let audioCtx = null;
  let audioMuted = false;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioClass();
    }
  }

  function playTone(freq, duration, type = 'sine', gainVal = 0.1) {
    if (audioMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  function playSound(type) {
    if (audioMuted) return;
    if (type === 'move') {
      playTone(320, 0.08, 'sine', 0.08);
    } else if (type === 'water') {
      playTone(440, 0.06, 'triangle', 0.07);
      setTimeout(() => playTone(587.33, 0.1, 'sine', 0.07), 60);
    } else if (type === 'harvest') {
      playTone(523.25, 0.08, 'triangle');
      setTimeout(() => playTone(659.25, 0.08, 'triangle'), 60);
      setTimeout(() => playTone(783.99, 0.18, 'sine'), 120);
    } else if (type === 'correct') {
      playTone(523.25, 0.1, 'sine');
      setTimeout(() => playTone(659.25, 0.1, 'sine'), 80);
      setTimeout(() => playTone(783.99, 0.25, 'triangle'), 160);
    } else if (type === 'wrong') {
      playTone(220, 0.15, 'sawtooth', 0.08);
      setTimeout(() => playTone(180, 0.25, 'sawtooth', 0.08), 120);
    } else if (type === 'level-up') {
      playTone(523.25, 0.08, 'triangle');
      setTimeout(() => playTone(659.25, 0.08, 'triangle'), 70);
      setTimeout(() => playTone(783.99, 0.08, 'triangle'), 140);
      setTimeout(() => playTone(1046.5, 0.3, 'sine'), 210);
    }
  }

  // =========================================================================
  // 4. Lightweight Canvas Confetti Particles
  // =========================================================================
  const confettiCanvas = document.getElementById('confetti-canvas');
  let confettiCtx = null;
  let particles = [];
  let confettiAnimationId = null;

  if (confettiCanvas) {
    confettiCtx = confettiCanvas.getContext('2d');
    function resizeCanvas() {
      if (confettiCanvas.parentElement) {
        confettiCanvas.width = confettiCanvas.parentElement.clientWidth;
        confettiCanvas.height = confettiCanvas.parentElement.clientHeight;
      }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function triggerConfetti() {
    if (!confettiCtx || !confettiCanvas) return;
    particles = [];
    const colors = ['#5c3cf6', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e', '#ec4899'];
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: confettiCanvas.width / 2,
        y: confettiCanvas.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12 - 3,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 15,
        alpha: 1
      });
    }

    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);

    function renderConfetti() {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3;
        p.rotation += p.vr;
        p.alpha -= 0.02;

        if (p.alpha > 0) {
          alive = true;
          confettiCtx.save();
          confettiCtx.translate(p.x, p.y);
          confettiCtx.rotate((p.rotation * Math.PI) / 180);
          confettiCtx.fillStyle = p.color;
          confettiCtx.globalAlpha = Math.max(0, p.alpha);
          confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          confettiCtx.restore();
        }
      }

      if (alive) {
        confettiAnimationId = requestAnimationFrame(renderConfetti);
      } else {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }

    renderConfetti();
  }

  // =========================================================================
  // 5. Interactive Mouse Parallax & 3D Card Tilt Engine
  // =========================================================================
  const tiltElements = document.querySelectorAll('.card-3d, .hero-stage-card-3d, .roadmap-card-3d');

  tiltElements.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate tilt angles (-10deg to +10deg)
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Global mouse parallax for floating background layers
  const floatingShapes = document.querySelectorAll('.floating-3d-shape');
  window.addEventListener('mousemove', e => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 30;

    floatingShapes.forEach((shape, idx) => {
      const factor = (idx + 1) * 0.4;
      shape.style.transform = `translate3d(${mouseX * factor}px, ${mouseY * factor}px, 0)`;
    });
  });

  // =========================================================================
  // 6. Playable 3D Chess Tactics Lab (Spatial & Mathematical Logic)
  // =========================================================================
  // 4x4 Chessboard Tactical Puzzles
  const chessPuzzles = [
    {
      id: 1,
      title: "The Knight's L-Shape Fork",
      pedagogy: "Mathematical coordinates: Knight moves (2,1) or (1,2) in vector space.",
      objective: "White Knight (♘) must fork Black King (♚) and Black Queen (♛) simultaneously!",
      // 4x4 board layout: 0=empty, 'WN'=White Knight, 'WK'=White King, 'BK'=Black King, 'BQ'=Black Queen
      // Indices: 0-3 (row 1), 4-7 (row 2), 8-11 (row 3), 12-15 (row 4)
      board: [
        'BK', null, null, 'BQ', // row 1 (a4, b4, c4, d4)
        null, null, null, null, // row 2 (a3, b3, c3, d3)
        null, 'WN', null, null, // row 3 (a2, b2, c2, d2)
        'WK', null, null, null  // row 4 (a1, b1, c1, d1)
      ],
      knightIndex: 9, // b2
      correctTarget: 2, // c4 forks a4(BK) and d4(BQ) -> knight from (2,1) to (0,2): dRow = -2, dCol = +1!
      explanation: "Brilliant! From c4, the Knight simultaneously attacks both the King on a4 and Queen on d4 (an unstoppable double attack)!"
    },
    {
      id: 2,
      title: "The Smothered Checkmate in 1",
      pedagogy: "Spatial entrapment & geometry: utilizing opponent's blocked pieces.",
      objective: "Find the decisive Knight move (♘) that delivers checkmate to the cornered King (♚)!",
      board: [
        'BK', 'BP', null, null, // a4, b4, c4, d4 (King trapped by pawn on b4)
        'BP', null, null, null, // a3
        null, null, 'WN', null, // c2
        null, null, null, 'WK'  // d1
      ],
      knightIndex: 10, // c2
      correctTarget: 1, // b4 or b3? From c2 (row 2, col 2) -> b4 is row 0, col 1 (dRow=-2, dCol=-1) which is index 1!
      explanation: "Checkmate! The Knight jumps over obstacles to strike the King, who has no escape squares due to friendly pawns!"
    }
  ];

  let currentChessPuzzleIdx = 0;
  let selectedChessTile = null;

  const chessGridEl = document.getElementById('chessboard-3d');
  const chessFeedbackEl = document.getElementById('chess-feedback');
  const chessPuzzleTitleEl = document.getElementById('chess-puzzle-title');
  const chessObjectiveEl = document.getElementById('chess-objective');
  const chessPedagogyEl = document.getElementById('chess-pedagogy');
  const chessNextBtn = document.getElementById('chess-next-btn');
  const chessResetBtn = document.getElementById('chess-reset-btn');

  const pieceIcons = {
    'WN': '♘',
    'WK': '♔',
    'BK': '♚',
    'BQ': '♛',
    'BP': '♟'
  };

  function renderChessBoard(puzzleIdx) {
    const puzzle = chessPuzzles[puzzleIdx % chessPuzzles.length];
    selectedChessTile = null;

    if (chessPuzzleTitleEl) chessPuzzleTitleEl.textContent = `Puzzle ${puzzle.id}: ${puzzle.title}`;
    if (chessObjectiveEl) chessObjectiveEl.textContent = puzzle.objective;
    if (chessPedagogyEl) chessPedagogyEl.textContent = `💡 Spatial Geometry: ${puzzle.pedagogy}`;
    if (chessFeedbackEl) {
      chessFeedbackEl.className = 'chess-feedback-msg';
      chessFeedbackEl.textContent = 'Click the White Knight (♘) to view candidate vector jumps:';
    }
    if (chessNextBtn) chessNextBtn.style.display = 'none';

    if (!chessGridEl) return;
    chessGridEl.innerHTML = '';

    puzzle.board.forEach((pieceCode, index) => {
      const tile = document.createElement('div');
      const row = Math.floor(index / 4);
      const col = index % 4;
      const isDark = (row + col) % 2 === 1;

      tile.className = `chess-tile-3d ${isDark ? 'tile-dark' : 'tile-light'}`;
      tile.dataset.index = index;

      if (pieceCode) {
        const pieceSpan = document.createElement('span');
        pieceSpan.className = 'chess-piece-3d';
        pieceSpan.textContent = pieceIcons[pieceCode] || '';
        tile.appendChild(pieceSpan);
      }

      tile.addEventListener('click', () => handleChessTileClick(index, puzzle));
      chessGridEl.appendChild(tile);
    });
  }

  function handleChessTileClick(index, puzzle) {
    const tiles = chessGridEl.querySelectorAll('.chess-tile-3d');

    // If user clicked the Knight
    if (index === puzzle.knightIndex) {
      playSound('move');
      selectedChessTile = index;
      tiles.forEach(t => t.classList.remove('tile-selected', 'tile-target'));
      tiles[index].classList.add('tile-selected');

      // Highlight possible knight L-moves from this position
      const kRow = Math.floor(puzzle.knightIndex / 4);
      const kCol = puzzle.knightIndex % 4;

      tiles.forEach((t, i) => {
        const r = Math.floor(i / 4);
        const c = i % 4;
        const dR = Math.abs(r - kRow);
        const dC = Math.abs(c - kCol);

        if ((dR === 1 && dC === 2) || (dR === 2 && dC === 1)) {
          // If square doesn't contain friendly piece
          if (puzzle.board[i] !== 'WK') {
            t.classList.add('tile-target');
          }
        }
      });

      if (chessFeedbackEl) {
        chessFeedbackEl.className = 'chess-feedback-msg';
        chessFeedbackEl.textContent = 'Knight selected! Click an illuminated green square to execute your tactical move:';
      }
      return;
    }

    // If a candidate move square was clicked after selecting Knight
    if (selectedChessTile !== null) {
      const targetTile = tiles[index];
      if (targetTile.classList.contains('tile-target')) {
        // Move was attempted
        if (index === puzzle.correctTarget) {
          // Correct move!
          playSound('correct');
          triggerConfetti();

          // Move the piece visually
          const knightTile = tiles[puzzle.knightIndex];
          const knightPiece = knightTile.querySelector('.chess-piece-3d');
          if (knightPiece) knightTile.removeChild(knightPiece);

          // Clear any captured piece on target square
          targetTile.innerHTML = '';
          const newPiece = document.createElement('span');
          newPiece.className = 'chess-piece-3d';
          newPiece.textContent = '♘';
          targetTile.appendChild(newPiece);

          tiles.forEach(t => t.classList.remove('tile-selected', 'tile-target'));
          targetTile.classList.add('tile-selected');

          if (chessFeedbackEl) {
            chessFeedbackEl.className = 'chess-feedback-msg success';
            chessFeedbackEl.innerHTML = `✓ <strong>Masterful Tactic!</strong> ${puzzle.explanation}`;
          }
          if (chessNextBtn) {
            chessNextBtn.style.display = 'inline-flex';
            chessNextBtn.focus();
          }
        } else {
          // Incorrect candidate
          playSound('wrong');
          if (chessFeedbackEl) {
            chessFeedbackEl.className = 'chess-feedback-msg error';
            chessFeedbackEl.textContent = '✕ That move attacks only one target or leaves the King free. Re-evaluate the geometry!';
          }
        }
      }
    }
  }

  if (chessNextBtn) {
    chessNextBtn.addEventListener('click', () => {
      currentChessPuzzleIdx++;
      playSound('level-up');
      renderChessBoard(currentChessPuzzleIdx);
    });
  }

  if (chessResetBtn) {
    chessResetBtn.addEventListener('click', () => {
      renderChessBoard(currentChessPuzzleIdx);
    });
  }

  // =========================================================================
  // 7. Playable 3D Eco-Farming Game (STEM & Ecological Cycles)
  // =========================================================================
  // 3x3 Isometric Farm Grid State
  // Tile states: 0: tilled soil, 1: seeded, 2: hydrated & growing, 3: mature wheat ready for harvest
  let farmTiles = [
    { state: 0, crop: 'empty' },
    { state: 2, crop: 'wheat' },
    { state: 0, crop: 'empty' },
    { state: 3, crop: 'wheat' },
    { state: 1, crop: 'wheat' },
    { state: 0, crop: 'empty' },
    { state: 0, crop: 'empty' },
    { state: 2, crop: 'wheat' },
    { state: 0, crop: 'empty' }
  ];

  let selectedTool = 'water'; // 'seed', 'water', 'sun', 'harvest'
  let ecoScore = 150;
  let harvestYield = 12;
  let waterReserve = 85;

  const farmGridEl = document.getElementById('farm-grid-3d');
  const ecoScoreEl = document.getElementById('farm-eco-score');
  const harvestYieldEl = document.getElementById('farm-harvest-yield');
  const waterReserveEl = document.getElementById('farm-water-reserve');
  const farmFeedbackEl = document.getElementById('farm-feedback');
  const toolButtons = document.querySelectorAll('.tool-btn-3d');

  function renderFarmGrid() {
    if (!farmGridEl) return;
    farmGridEl.innerHTML = '';

    farmTiles.forEach((tileData, index) => {
      const tile = document.createElement('div');
      tile.className = 'farm-tile-3d';
      tile.dataset.index = index;

      const plantSpan = document.createElement('span');
      plantSpan.className = 'farm-plant-visual';

      if (tileData.state === 0) {
        // Tilled rich soil
        plantSpan.textContent = '🌱';
        plantSpan.style.opacity = '0.35';
      } else if (tileData.state === 1) {
        // Seeded
        tile.classList.add('seeded');
        plantSpan.textContent = '🌰';
      } else if (tileData.state === 2) {
        // Growing / Hydrated sprout
        tile.classList.add('hydrated', 'sprout');
        plantSpan.textContent = '🌿';
      } else if (tileData.state === 3) {
        // Mature harvestable wheat
        tile.classList.add('mature');
        plantSpan.textContent = '🌾';
      }

      tile.appendChild(plantSpan);
      tile.addEventListener('click', () => handleFarmTileClick(index));
      farmGridEl.appendChild(tile);
    });

    if (ecoScoreEl) ecoScoreEl.textContent = ecoScore;
    if (harvestYieldEl) harvestYieldEl.textContent = `${harvestYield} bu`;
    if (waterReserveEl) waterReserveEl.textContent = `${waterReserve}%`;
  }

  function handleFarmTileClick(index) {
    const tile = farmTiles[index];

    if (selectedTool === 'seed') {
      if (tile.state === 0) {
        tile.state = 1;
        tile.crop = 'wheat';
        playSound('move');
        if (farmFeedbackEl) {
          farmFeedbackEl.textContent = '🌰 Seeds planted in aerated soil! Next, irrigate with water to trigger germination.';
        }
      } else {
        if (farmFeedbackEl) farmFeedbackEl.textContent = 'This plot already contains active crops.';
      }
    } else if (selectedTool === 'water') {
      if (tile.state === 1) {
        tile.state = 2; // Seeds germinate
        waterReserve = Math.max(0, waterReserve - 10);
        ecoScore += 25;
        playSound('water');
        if (farmFeedbackEl) {
          farmFeedbackEl.textContent = '💧 Water applied! Capillary action hydrates the seed embryo, sparking cellular mitosis!';
        }
      } else if (tile.state === 0) {
        playSound('water');
        if (farmFeedbackEl) farmFeedbackEl.textContent = 'Soil moistened. Plant seeds next for optimal growth!';
      } else if (tile.state === 2) {
        if (farmFeedbackEl) farmFeedbackEl.textContent = 'Soil already has sufficient moisture. Use Solar Sun to fuel photosynthesis!';
      }
    } else if (selectedTool === 'sun') {
      if (tile.state === 2) {
        tile.state = 3; // Sprout grows to mature wheat
        ecoScore += 40;
        playSound('level-up');
        triggerConfetti();
        if (farmFeedbackEl) {
          farmFeedbackEl.textContent = '☀️ Solar radiation absorbed! Chlorophyll synthesized sunlight and CO2 into golden wheat!';
        }
      } else {
        if (farmFeedbackEl) farmFeedbackEl.textContent = 'Plants need to be germinated and hydrated before photosynthesis can finish ripening!';
      }
    } else if (selectedTool === 'harvest') {
      if (tile.state === 3) {
        tile.state = 0; // Harvested, returns to soil
        harvestYield += 15;
        ecoScore += 100;
        playSound('harvest');
        triggerConfetti();
        if (farmFeedbackEl) {
          farmFeedbackEl.textContent = '🌾 Crop harvested! Biomass yield: +15 bu. Soil is naturally aerated for the next rotation cycle!';
        }
      } else {
        playSound('wrong');
        if (farmFeedbackEl) farmFeedbackEl.textContent = 'Crop is not yet fully ripened for harvest. Nurture it with water and sun!';
      }
    }

    renderFarmGrid();
  }

  // Tool selector events
  toolButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      toolButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTool = btn.dataset.tool;
      playSound('move');
    });
  });

  // =========================================================================
  // 8. Upcoming 3D Games Showcase Filtering
  // =========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const gameCards = document.querySelectorAll('.game-card-3d');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter') || 'all';

      gameCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // =========================================================================
  // 9. Accessible Game Concept Dialog (Native <dialog>)
  // =========================================================================
  const gameModal = document.getElementById('game-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-game-title');
  const modalDesc = document.getElementById('modal-game-desc');
  const modalBadge = document.getElementById('modal-game-badge');
  const previewButtons = document.querySelectorAll('.preview-game-btn');

  previewButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title') || 'Upcoming 3D Title';
      const desc = btn.getAttribute('data-desc') || '3D concept preview and development notes.';
      const badge = btn.getAttribute('data-badge') || 'In Development';

      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalBadge) modalBadge.textContent = badge;

      if (gameModal) {
        gameModal.showModal();
        initAudio();
        playSound('level-up');
      }
    });
  });

  if (modalCloseBtn && gameModal) {
    modalCloseBtn.addEventListener('click', () => {
      gameModal.close();
    });

    gameModal.addEventListener('click', e => {
      if (e.target === gameModal) {
        gameModal.close();
      }
    });
  }

  // =========================================================================
  // 10. Accessible FAQ Accordion
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('active', !isActive);
      btn.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
    });
  });

  // =========================================================================
  // 11. Early Access Waitlist Form
  // =========================================================================
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterInput = document.getElementById('newsletter-email');
  const newsletterFeedback = document.getElementById('newsletter-feedback');

  if (newsletterForm && newsletterInput && newsletterFeedback) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = newsletterInput.value.trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newsletterFeedback.style.color = 'var(--color-accent-coral)';
        newsletterFeedback.textContent = 'Please enter a valid email address.';
        newsletterInput.focus();
        return;
      }

      newsletterFeedback.style.color = '#ffffff';
      newsletterFeedback.innerHTML = `🎉 <strong>You're on the early access 3D playtest list!</strong> We'll notify <em>${email}</em> for closed alpha access.`;
      newsletterInput.value = '';
      playSound('level-up');
      triggerConfetti();
    });
  }

  // =========================================================================
  // 12. Smooth Scrolling
  // =========================================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Initial renders
  renderChessBoard(currentChessPuzzleIdx);
  renderFarmGrid();

})();
