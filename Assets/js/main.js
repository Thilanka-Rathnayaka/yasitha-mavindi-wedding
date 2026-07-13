// Countdown
  const weddingDate = new Date('2026-08-30T08:00:00+05:30').getTime();
  function updateCountdown(){
    const now = Date.now();
    const diff = weddingDate - now;
    if(diff <= 0){
      document.getElementById('countdown').innerHTML = '<p style="font-family:Playfair Display, serif; font-size:20px;">Today is the day! 🎉</p>';
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    document.getElementById('cd-days').textContent = days;
    document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
    document.getElementById('cd-mins').textContent = String(mins).padStart(2,'0');
    document.getElementById('cd-secs').textContent = String(secs).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Attend toggle
  let attending = null;
  const toggleBtns = document.querySelectorAll('#attendToggle button');
  toggleBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      toggleBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      attending = btn.dataset.val;
    });
  });

  // RSVP submit -> shared storage
  const form = document.getElementById('rsvpForm');
  const formMsg = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    formMsg.textContent = '';
    formMsg.className = 'form-msg';

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const guests = document.getElementById('guests').value;
    const message = document.getElementById('message').value.trim();

    if(!name || !phone){
      formMsg.textContent = 'Please fill in your name and contact number.';
      formMsg.classList.add('error');
      return;
    }
    if(!attending){
      formMsg.textContent = 'Please let us know whether you can join us.';
      formMsg.classList.add('error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const entry = {
      name, phone, guests, attending, message,
      submittedAt: new Date().toISOString()
    };
    const key = 'rsvp:' + Date.now() + '-' + Math.random().toString(36).slice(2,8);

    // Best-effort save. window.storage only exists inside the Claude.ai artifact
    // preview, so on a real hosted site (Netlify, GitHub Pages, etc.) this will
    // simply be skipped — that's fine, since WhatsApp is the real confirmation.
    try{
      if(window.storage && typeof window.storage.set === 'function'){
        await window.storage.set(key, JSON.stringify(entry), true);
      }
    }catch(err){
      console.warn('Optional storage save skipped:', err);
    }

    form.style.display = 'none';
    const confirmation = document.getElementById('confirmation');
    const cTitle = document.getElementById('confirmTitle');
    const cText = document.getElementById('confirmText');
    if(attending === 'yes'){
      cTitle.textContent = 'Thank you, ' + name + '!';
      cText.textContent = "We've noted your RSVP for " + guests + " guest(s). We can't wait to celebrate with you on the 30th of August!";
    } else {
      cTitle.textContent = 'We\'ll miss you, ' + name;
      cText.textContent = "Thank you for letting us know. You'll be in our hearts on the big day.";
    }
    confirmation.classList.add('show');

    // Build a WhatsApp deep link to Yasitha's number with the RSVP pre-filled.
    // Sri Lankan mobile 077 477 2563 -> international 94774772563 (drop leading 0, add country code 94).
    const yasithaWhatsApp = '94774772563';
    const attendLine = attending === 'yes'
      ? 'Attending: Yes (' + guests + ' guest' + (guests > 1 ? 's' : '') + ')'
      : 'Attending: No, sorry I\'ll miss it';
    let waText = 'Wedding RSVP for Mavindi & Yasitha\n\n'
      + 'Name: ' + name + '\n'
      + 'Phone: ' + phone + '\n'
      + attendLine;
    if(message){ waText += '\nMessage: ' + message; }
    const waLink = 'https://wa.me/' + yasithaWhatsApp + '?text=' + encodeURIComponent(waText);
    document.getElementById('whatsappBtn').href = waLink;
  });

  // ---------- Sealed envelope intro ----------
  (function(){
    const gate = document.getElementById('envelopeGate');
    const scene = document.getElementById('envelopeScene');
    const seal = document.getElementById('waxSeal');
    if(!gate || !scene || !seal) return;

    // Keep the site from scrolling behind the envelope until it's opened.
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    let opened = false;
    function openEnvelope(){
      if(opened) return;
      opened = true;
      gate.classList.add('open');

      // Let the seal-break / flap-open / letter-rise sequence play out,
      // then fade the whole gate away and hand control back to the page.
      setTimeout(() => {
        gate.classList.add('hide');
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }, 1550);
      setTimeout(() => {
        gate.style.display = 'none';
      }, 2250);
    }

    seal.addEventListener('click', openEnvelope);
    // Forgiving tap target on mobile — tapping anywhere on the envelope
    // itself also opens it, while the seal stays the visual focal point.
    scene.addEventListener('click', openEnvelope);
  })();

  // ---------- Background floral / hearts / butterflies animation ----------
  (function(){
    const field = document.getElementById('petalField');
    if(!field) return;
    // Reduced-motion users get no generated elements (CSS also hides the field).
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const w = window.innerWidth;
    const petalColors = ['#B8892E', '#C24568', '#7C1D3E', '#1E4A38', '#D9B45E'];
    const heartColors = ['#C24568', '#7C1D3E', '#D9B45E'];
    const wingColors = ['#B8892E', '#C24568', '#D9B45E', '#7C1D3E'];

    function densityFor(mobile, tablet, desktop, wide){
      if(w < 640) return mobile;
      if(w < 1024) return tablet;
      if(w < 1600) return desktop;
      return wide;
    }
    const PETAL_COUNT = densityFor(8, 14, 20, 26);
    const HEART_COUNT = densityFor(6, 10, 15, 20);
    const BUTTERFLY_COUNT = densityFor(3, 5, 7, 9);

    function makePetal(){
      const el = document.createElement('div');
      el.className = 'petal';
      const size = 10 + Math.random() * 12;
      const color = petalColors[Math.floor(Math.random() * petalColors.length)];
      el.style.setProperty('--x', Math.random() * 100 + 'vw');
      el.style.setProperty('--size', size + 'px');
      el.style.setProperty('--delay', (Math.random() * -25) + 's');
      el.style.setProperty('--fall-dur', (14 + Math.random() * 12) + 's');
      el.style.setProperty('--sway-dur', (3.5 + Math.random() * 3) + 's');
      el.style.setProperty('--max-opacity', (0.35 + Math.random() * 0.35).toFixed(2));
      el.innerHTML = '<svg viewBox="0 0 32 32"><path d="M16 2C10 8 6 12 6 18a10 10 0 0 0 20 0c0-6-4-10-10-16Z" fill="' + color + '"/></svg>';
      field.appendChild(el);
    }

    function makeHeart(){
      const el = document.createElement('div');
      el.className = 'heart';
      const size = 12 + Math.random() * 14;
      const color = heartColors[Math.floor(Math.random() * heartColors.length)];
      el.style.setProperty('--x', Math.random() * 100 + 'vw');
      el.style.setProperty('--size', size + 'px');
      el.style.setProperty('--delay', (Math.random() * -22) + 's');
      el.style.setProperty('--float-dur', (11 + Math.random() * 9) + 's');
      el.style.setProperty('--sway-dur', (3 + Math.random() * 2.5) + 's');
      el.style.setProperty('--max-opacity', (0.45 + Math.random() * 0.35).toFixed(2));
      el.innerHTML = '<svg viewBox="0 0 32 29"><path d="M16 29S1 18.6 1 9.6C1 4.3 5 1 9.4 1 12.6 1 15 2.8 16 5.4 17 2.8 19.4 1 22.6 1 27 1 31 4.3 31 9.6 31 18.6 16 29 16 29Z" fill="' + color + '"/></svg>';
      field.appendChild(el);
    }

    function makeButterfly(){
      const el = document.createElement('div');
      const reverse = Math.random() < 0.5;
      el.className = 'butterfly' + (reverse ? ' reverse' : '');
      const size = 20 + Math.random() * 16;
      const color = wingColors[Math.floor(Math.random() * wingColors.length)];
      el.style.setProperty('--y', (5 + Math.random() * 70) + 'vh');
      el.style.setProperty('--bsize', size + 'px');
      el.style.setProperty('--delay', (Math.random() * -20) + 's');
      el.style.setProperty('--fly-dur', (16 + Math.random() * 10) + 's');
      el.style.setProperty('--max-opacity', (0.6 + Math.random() * 0.3).toFixed(2));
      el.innerHTML =
        '<svg viewBox="0 0 40 40">' +
          '<g class="wing-l"><path d="M20 20C16 8 4 4 2 10c-2 6 6 14 18 12Z" fill="' + color + '" opacity="0.85"/></g>' +
          '<g class="wing-r"><path d="M20 20c4-12 16-16 18-10 2 6-6 14-18 12Z" fill="' + color + '" opacity="0.85"/></g>' +
          '<g class="wing-l"><path d="M20 20C17 27 8 30 6 26c-2-4 4-9 14-6Z" fill="' + color + '" opacity="0.65"/></g>' +
          '<g class="wing-r"><path d="M20 20c3 7 12 10 14 6 2-4-4-9-14-6Z" fill="' + color + '" opacity="0.65"/></g>' +
          '<ellipse cx="20" cy="20" rx="1.4" ry="6" fill="#3A2C1E" opacity="0.7"/>' +
        '</svg>';
      field.appendChild(el);
    }

    for(let i = 0; i < PETAL_COUNT; i++) makePetal();
    for(let i = 0; i < HEART_COUNT; i++) makeHeart();
    for(let i = 0; i < BUTTERFLY_COUNT; i++) makeButterfly();
  })();

  // ---------- Background wedding music ----------
  (function(){
    const audio = document.getElementById('bgMusic');
    const toggle = document.getElementById('musicToggle');
    const hint = document.getElementById('musicHint');
    if(!audio || !toggle) return;

    audio.volume = 0.55;
    let userPaused = false;
    let unlocked = false; // becomes true once real, audible playback has started

    function setPlayingUI(isPlaying){
      toggle.classList.toggle('playing', isPlaying);
      toggle.setAttribute('aria-pressed', String(isPlaying));
      toggle.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
    }

    // Browsers block autoplay of audible audio, but they universally allow
    // autoplay of MUTED audio. So: start muted immediately on page load (this
    // is the closest thing to true autoplay), then unmute the instant the
    // visitor does anything at all — click, tap, scroll, or key press — so
    // sound kicks in almost immediately without them needing to find a button.
    function startMutedAutoplay(){
      audio.muted = true;
      const p = audio.play();
      if(p && typeof p.then === 'function'){
        p.then(() => {
          setPlayingUI(true);
          hint.classList.add('show');
        }).catch(() => {
          // Even muted autoplay was blocked — fall back to showing the hint.
          setPlayingUI(false);
          hint.classList.add('show');
        });
      }
    }

    function unmuteAndPlay(){
      if(unlocked || userPaused) return;
      unlocked = true;
      audio.muted = false;
      audio.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
      hint.classList.remove('show');
    }

    toggle.addEventListener('click', () => {
      hint.classList.remove('show');
      if(audio.paused || audio.muted){
        userPaused = false;
        unlocked = true;
        audio.muted = false;
        audio.play().then(() => setPlayingUI(true)).catch(() => setPlayingUI(false));
      } else {
        userPaused = true;
        audio.pause();
        setPlayingUI(false);
      }
    });

    // Any of these count as "the visitor did something" and unlock real sound.
    ['click', 'touchstart', 'keydown', 'scroll', 'pointerdown'].forEach(evt => {
      window.addEventListener(evt, unmuteAndPlay, { once: true, passive: true });
    });

    window.addEventListener('load', startMutedAutoplay);
    // In case 'load' already fired before this script ran.
    if(document.readyState === 'complete') startMutedAutoplay();
  })();
