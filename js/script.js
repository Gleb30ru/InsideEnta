// Тексты
const text1 = "Привет!";
const text2 = "Это сайт об Inside_Enta! И о его команде!";

const el1 = document.getElementById('greet1');
const el2 = document.getElementById('greet2');
const downBtn = document.getElementById('downBtn');

function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

async function type(el, text, delay = 80){
  el.textContent = "";
  for (let i = 0; i < text.length; i++){
    el.textContent += text[i];
    await sleep(delay);
  }
}

(async function(){
  await sleep(300);
  await type(el1, text1, 100);
  await sleep(300);
  await type(el2, text2, 60);
})();

// Плавный скролл к секции информации
downBtn.addEventListener('click', ()=> {
  document.getElementById('info').scrollIntoView({ behavior: 'smooth' });
});

// Анимация прогрессов при появлении в viewport
(function(){
  const fills = document.querySelectorAll('.progress-fill');
  if (!fills.length) return;

  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const value = parseInt(fill.dataset.fill || 0, 10);
        fill.style.width = value + '%';
        o.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  fills.forEach(f => obs.observe(f));
})();

// Анимация числовых счётчиков при появлении
(function(){
  const counters = document.querySelectorAll('.count-num');
  if (!counters.length) return;

  const format = v => Math.round(v);

  const obsNums = new IntersectionObserver((entries, o) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target || el.textContent || 0, 10);
      if (isNaN(target)) { o.unobserve(el); return; }
      let start = 0;
      const duration = 1200;
      const startTime = performance.now();
      function step(now){
        const t = Math.min((now - startTime) / duration, 1);
        const ease = t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t; // easeInOutQuad-ish
        el.textContent = format(ease * target);
        if (t < 1) requestAnimationFrame(step);
        else { el.textContent = target; o.unobserve(el); }
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });

  counters.forEach(c => obsNums.observe(c));
})();

// Пагинация для .counts на мобильных (простая реализация)
(function(){
  const countsWrap = document.querySelector('.counts');
  const cards = countsWrap ? Array.from(countsWrap.querySelectorAll('.count-card')) : [];
  if (!countsWrap || !cards.length) return;

  let index = 0;
  const prevBtn = document.querySelector('.pager-btn.prev');
  const nextBtn = document.querySelector('.pager-btn.next');
  const pagerInfo = document.querySelector('.pager-info');

  function updatePager(){
    // visible cards on mobile are those with data-visible="1"
    const visibleCards = cards.filter(c => c.dataset.visible === "1");
    const total = Math.max(1, visibleCards.length);
    index = Math.max(0, Math.min(index, total - 1));
    const offset = -index * 100;
    // translate based on visibleCards indices
    visibleCards.forEach((c, i) => {
      c.style.transform = `translateX(${(i - index) * 100}%)`;
    });
    if (pagerInfo) pagerInfo.textContent = (index + 1) + " / " + total;
  }

  if (prevBtn) prevBtn.addEventListener('click', ()=> { index = Math.max(0, index - 1); updatePager(); });
  if (nextBtn) nextBtn.addEventListener('click', ()=> { index = index + 1; updatePager(); });

  // init when on mobile
  const mql = window.matchMedia('(max-width:700px)');
  function handleMql(e){
    if (e.matches) {
      // show only visible=1 cards (others are display:none via CSS) and reset transforms
      index = 0;
      // ensure inline styles removed for non-visible cards
      cards.forEach(c => { c.style.transform = ''; });
      updatePager();
    } else {
      // remove transforms on desktop
      cards.forEach(c => { c.style.transform = ''; });
      if (pagerInfo) pagerInfo.textContent = '';
    }
  }
  mql.addEventListener ? mql.addEventListener('change', handleMql) : mql.addListener(handleMql);
  handleMql(mql);
})();

// Tabs functionality
(function() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;

      // Remove active from all buttons and panels
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      // Add active to clicked button and corresponding panel
      btn.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });
})();
