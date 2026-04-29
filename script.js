const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60));
document.getElementById('hero').classList.add('loaded');
const obs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } }); }, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
function doFilter(btn, cat) {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    document.querySelectorAll('.m-item').forEach(item => {
        const s = cat === 'all' || item.dataset.cat === cat;
        item.style.opacity = s ? '1' : '0.15';
        item.style.transform = s ? 'scale(1)' : 'scale(0.96)';
        item.style.transition = 'opacity .4s,transform .4s';
    });
}
const menuBtn = document.getElementById('menuBtn');
const mobMenu = document.getElementById('mobMenu');
menuBtn.addEventListener('click', () => {
    mobMenu.classList.toggle('open');
    menuBtn.classList.toggle('active');
});
function closeMob() { 
    mobMenu.classList.remove('open'); 
    menuBtn.classList.remove('active');
}
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => { const t = document.querySelector(a.getAttribute('href')); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); } });
});
