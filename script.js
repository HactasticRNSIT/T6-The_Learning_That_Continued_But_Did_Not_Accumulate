// Initialization and UI Effects
(function() {
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  let mx = 0, my = 0, tx = 0, ty = 0;
  
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  });
  
  setInterval(() => {
    tx += (mx - tx) * 0.2; ty += (my - ty) * 0.2;
    trail.style.left = tx + 'px'; trail.style.top = ty + 'px';
  }, 16);
  
  document.querySelectorAll('a,button').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width = '28px'; cursor.style.height = '28px'; });
    el.addEventListener('mouseleave', () => { cursor.style.width = '18px'; cursor.style.height = '18px'; });
  });

  setTimeout(() => { document.getElementById('loader').classList.add('hide'); }, 2000);

  // Background Canvas Animation
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], animId;
  
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 80; i++) {
    nodes.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
      col: Math.random() < 0.5 ? [26,106,255] : Math.random() < 0.5 ? [139,61,255] : [0,212,255]
    });
  }

  let mouseX = W/2, mouseY = H/2;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      const dx = n.x - mouseX, dy = n.y - mouseY;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if (dist < 120) { n.x += dx * 0.02; n.y += dy * 0.02; }

      for (let j = i+1; j < nodes.length; j++) {
        const m = nodes[j];
        const ex = n.x-m.x, ey = n.y-m.y;
        const ed = Math.sqrt(ex*ex+ey*ey);
        if (ed < 130) {
          const op = (1 - ed/130) * 0.18;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = `rgba(${n.col[0]},${n.col[1]},${n.col[2]},${op})`;
          ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${n.col[0]},${n.col[1]},${n.col[2]},${n.alpha})`;
      ctx.fill();
    }
    animId = requestAnimationFrame(draw);
  }
  draw();

  // Typing Effect
  const phrases = [
    "Learning That Actually Stays.",
    "AI-Powered Learning Intelligence.",
    "Personalized Education for the Future."
  ];
  let pi = 0, ci = 0, deleting = false, wait = 0;
  const el = document.getElementById('typing-text');
  
  function type() {
    const p = phrases[pi];
    if (!deleting) {
      el.textContent = p.slice(0, ++ci);
      if (ci === p.length) { deleting = true; wait = 60; }
    } else {
      if (wait-- > 0) { setTimeout(type, 30); return; }
      el.textContent = p.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi+1) % phrases.length; }
    }
    setTimeout(type, deleting ? 35 : 65);
  }
  setTimeout(type, 1400);

  // Scroll Reveal Observer
  const revealEls = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => obs.observe(el));
})();

/* ═══════════════════════════════════════════
   FLASHCARDS ENGINE
═══════════════════════════════════════════ */
let fcCards = [];
let fcStudyIndex = 0;
let fcStudyFlipped = false;

function openFlashcards() {
  document.getElementById('fc-portal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeFlashcards() {
  document.getElementById('fc-portal').classList.remove('open');
  document.body.style.overflow = '';
}

function switchPortalTab(tab) {
  document.querySelectorAll('.fc-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.fc-screen').forEach(s => s.classList.remove('visible'));
  if (tab === 'upload') {
    document.querySelector('.fc-tab:nth-child(1)').classList.add('active');
    document.getElementById('fc-upload-screen').classList.add('visible');
  } else {
    document.querySelector('#fc-cards-tab').classList.add('active');
    document.getElementById('fc-cards-screen').classList.add('visible');
  }
}

function selectSeg(segId, btn) {
  document.querySelectorAll('#' + segId + ' .fc-seg-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}

// Drag & drop logic
const dz = document.getElementById('fc-dropzone');
const fi = document.getElementById('fc-file-input');
dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
dz.addEventListener('drop', e => {
  e.preventDefault(); dz.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) loadFile(file);
});
fi.addEventListener('change', () => { if (fi.files[0]) loadFile(fi.files[0]); });

function loadFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['txt','md'].includes(ext)) { showError('Please upload a .txt or .md file.'); return; }
  const fn = document.getElementById('fc-filename');
  fn.textContent = '📎 ' + file.name; fn.style.display = 'inline-block';
  const reader = new FileReader();
  reader.onload = e => { document.getElementById('fc-text-input').value = e.target.result; };
  reader.readAsText(file);
}

function showError(msg) {
  const el = document.getElementById('fc-error');
  el.textContent = msg; el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 5000);
}

function getConfig() {
  const countBtn = document.querySelector('#fc-count-seg .fc-seg-btn.sel');
  const diffBtn  = document.querySelector('#fc-diff-seg .fc-seg-btn.sel');
  return {
    count: countBtn ? parseInt(countBtn.dataset.val) : 10,
    difficulty: diffBtn ? diffBtn.dataset.val : 'Mixed'
  };
}

async function generateCards() {
  const notes = document.getElementById('fc-text-input').value.trim();
  if (!notes) { showError('Please upload a file or paste your notes first.'); return; }
  document.getElementById('fc-error').classList.remove('show');
  const btn = document.getElementById('fc-gen-btn');
  const label = document.getElementById('fc-gen-label');
  const spinner = document.getElementById('fc-spinner');
  
  btn.disabled = true; btn.classList.add('generating');
  label.textContent = 'Generating…'; spinner.style.display = 'block';

  const { count, difficulty } = getConfig();

  const prompt = `You are a flashcard generation expert. Given the following study notes, extract the ${count} most important concepts and create exactly ${count} flashcards at ${difficulty} difficulty level.

Return ONLY a valid JSON array with no markdown, no extra text. Each element must have:
- "q": a clear, specific question (string)
- "a": a concise but complete answer (string)

Rules:
- Basic: definitions and straightforward facts
- Mixed: mix of definitions, applications, and comparisons  
- Advanced: deeper understanding, synthesis, edge cases

Study notes:
${notes.slice(0, 6000)}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    const text = data.content.map(c => c.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    if (!Array.isArray(parsed) || !parsed[0]?.q) throw new Error('Invalid format');
    
    fcCards = parsed;
    renderDeck(count, difficulty);
  } catch (err) {
    showError('Generation failed. Check your API key or try again with shorter notes.');
    console.error(err);
  } finally {
    btn.disabled = false; btn.classList.remove('generating');
    label.textContent = 'Generate Flashcards'; spinner.style.display = 'none';
  }
}

function renderDeck(count, difficulty) {
  document.getElementById('fc-deck-title').textContent = `Your Flashcards`;
  document.getElementById('fc-deck-sub').textContent = `${fcCards.length} cards · ${difficulty} difficulty`;
  document.getElementById('fc-cards-tab').style.display = '';
  buildGrid();
  setView('grid');
  switchPortalTab('cards');
}

function buildGrid() {
  const grid = document.getElementById('fc-grid');
  grid.innerHTML = '';
  fcCards.forEach((card, i) => {
    const delay = i * 50;
    const wrap = document.createElement('div');
    wrap.className = 'fc-card-wrap';
    wrap.style.animationDelay = delay + 'ms';
    wrap.innerHTML = `
      <div class="fc-card-inner">
        <div class="fc-card-face fc-card-front">
          <div class="fc-card-num">Card ${i+1} / ${fcCards.length}</div>
          <div class="fc-card-q">${card.q}</div>
          <div class="fc-card-hint">Tap to flip ↻</div>
        </div>
        <div class="fc-card-face fc-card-back">
          <div class="fc-card-a-label">Answer</div>
          <div class="fc-card-a">${card.a}</div>
          <div class="fc-card-hint">Tap to flip ↻</div>
        </div>
      </div>`;
    wrap.addEventListener('click', () => wrap.classList.toggle('flipped'));
    grid.appendChild(wrap);
  });
}

function setView(view) {
  const gridView  = document.getElementById('fc-grid-view');
  const studyView = document.getElementById('fc-study-view');
  const vtGrid    = document.getElementById('fc-vt-grid');
  const vtStudy   = document.getElementById('fc-vt-study');
  
  if (view === 'grid') {
    gridView.classList.remove('hidden'); studyView.classList.remove('visible');
    vtGrid.classList.add('active'); vtStudy.classList.remove('active');
  } else {
    gridView.classList.add('hidden'); studyView.classList.add('visible');
    vtGrid.classList.remove('active'); vtStudy.classList.add('active');
    fcStudyIndex = 0; fcStudyFlipped = false;
    renderStudyCard();
  }
}

function renderStudyCard() {
  if (!fcCards.length) return;
  const card = fcCards[fcStudyIndex];
  document.getElementById('fc-study-q').textContent = card.q;
  document.getElementById('fc-study-a').textContent = card.a;
  document.getElementById('fc-study-counter').textContent = `Card ${fcStudyIndex+1} of ${fcCards.length}`;
  document.getElementById('fc-nav-pos').textContent = `${fcStudyIndex+1} / ${fcCards.length}`;
  
  const pct = ((fcStudyIndex + 1) / fcCards.length * 100).toFixed(0);
  document.getElementById('fc-progress-bar').style.width = pct + '%';
  document.getElementById('fc-prev-btn').disabled = fcStudyIndex === 0;
  document.getElementById('fc-next-btn').disabled = fcStudyIndex === fcCards.length - 1;
  
  const wrap = document.getElementById('fc-study-card');
  fcStudyFlipped = false; wrap.classList.remove('flipped');
}

function flipStudyCard() {
  fcStudyFlipped = !fcStudyFlipped;
  document.getElementById('fc-study-card').classList.toggle('flipped', fcStudyFlipped);
}

function studyNav(dir) {
  fcStudyIndex = Math.max(0, Math.min(fcCards.length - 1, fcStudyIndex + dir));
  renderStudyCard();
}

function newUpload() {
  fcCards = [];
  document.getElementById('fc-text-input').value = '';
  document.getElementById('fc-filename').style.display = 'none';
  document.getElementById('fc-file-input').value = '';
  document.getElementById('fc-cards-tab').style.display = 'none';
  switchPortalTab('upload');
}
