/* ── NAVBAR SCROLL ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60));

/* ── HERO ZOOM ── */
document.getElementById('hero').classList.add('loaded');

/* ── SCROLL REVEAL ── */
const obs = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* ── PORTFOLIO FILTER ── */
function doFilter(btn, cat) {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    document.querySelectorAll('.m-item').forEach(item => {
        const s = cat === 'all' || item.dataset.cat === cat;
        item.style.opacity = s ? '1' : '0.15';
        item.style.transform = s ? 'scale(1)' : 'scale(0.96)';
        item.style.transition = 'opacity .4s, transform .4s';
    });
}

/* ── MOBILE DROPDOWN MENU ── */
const menuBtn   = document.getElementById('menuBtn');
const mobMenu   = document.getElementById('mobMenu');
const mobOverlay = document.getElementById('mobOverlay');

menuBtn.addEventListener('click', () => {
    const isOpen = mobMenu.classList.contains('open');
    isOpen ? closeMob() : openMob();
});

function openMob() {
    mobMenu.classList.add('open');
    mobOverlay.classList.add('visible');
    menuBtn.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    mobMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeMob() {
    mobMenu.classList.remove('open');
    mobOverlay.classList.remove('visible');
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    mobMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

/* Close on overlay click */
mobOverlay.addEventListener('click', closeMob);

/* Close on Escape key */
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMob(); });

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) {
            e.preventDefault();
            closeMob();
            setTimeout(() => t.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    });
});

/* ── SERVICES SPOTLIGHT ── */
const svcSection = document.getElementById('services');
if (svcSection) {
    svcSection.addEventListener('mousemove', e => {
        const rect = svcSection.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        svcSection.style.setProperty('--mouse-x', `${x}px`);
        svcSection.style.setProperty('--mouse-y', `${y}px`);
    });
}
