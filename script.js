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

/* ── DYNAMIC PORTFOLIO ── */
let allProjects = [];

async function initPortfolio() {
    try {
        const res = await fetch('projets.json');
        allProjects = await res.json();
        renderProjects('all');
    } catch (err) {
        console.error("Error loading projects:", err);
    }
}

function renderProjects(cat) {
    const container = document.getElementById('masonryContainer');
    if (!container) return;

    container.innerHTML = '';
    const filtered = cat === 'all' ? allProjects : allProjects.filter(p => p.category === cat);

    filtered.forEach((p, index) => {
        const item = document.createElement('div');
        item.className = 'm-item reveal';
        item.style.transitionDelay = `${index * 0.1}s`;
        item.dataset.cat = p.category;
        
        const hasTitle = p.title && p.title.trim() !== "";
        
        item.innerHTML = `
            <div class="m-img" style="background-image: url('${p.image}'); height: ${p.height || '350px'};"></div>
            <div class="m-ov">
                ${hasTitle ? `<div class="m-line"></div>` : ''}
                ${hasTitle ? `<div class="m-title">${p.title}</div>` : ''}
                <div class="m-cat">${p.categoryLabel}</div>
            </div>
        `;
        
        // Open lightbox on click
        item.addEventListener('click', () => {
            openLightbox(p.image);
        });
        
        container.appendChild(item);
        
        // Trigger reveal animation after a tiny delay
        setTimeout(() => {
            item.classList.add('vis');
        }, 50);
    });
}

function doFilter(btn, cat) {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    renderProjects(cat);
}

// Initial Load
initPortfolio();


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

/* ── LIGHTBOX / ZOOM ── */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const btnZoomIn = document.getElementById('lbZoomIn');
const btnZoomOut = document.getElementById('lbZoomOut');
const btnClose = document.getElementById('lbClose');

let currentZoom = 1;
const zoomStep = 0.4;
const maxZoom = 4;
const minZoom = 0.5;

let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

function openLightbox(imgSrc) {
    if(!lightbox || !lbImg) return;
    lbImg.src = imgSrc;
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    updateImgTransform();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLightbox() {
    if(!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Small delay to clear src after fade out
    setTimeout(() => { lbImg.src = ''; }, 400);
}

function updateImgTransform() {
    lbImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
}

if(lightbox) {
    btnClose.addEventListener('click', closeLightbox);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox || e.target.classList.contains('lb-content')) {
            closeLightbox();
        }
    });

    // Zoom Controls
    btnZoomIn.addEventListener('click', () => {
        if (currentZoom < maxZoom) {
            currentZoom += zoomStep;
            updateImgTransform();
        }
    });

    btnZoomOut.addEventListener('click', () => {
        if (currentZoom > minZoom) {
            currentZoom -= zoomStep;
            updateImgTransform();
        }
    });

    // Mouse wheel zoom
    lightbox.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0 && currentZoom < maxZoom) currentZoom += zoomStep;
        else if (e.deltaY > 0 && currentZoom > minZoom) currentZoom -= zoomStep;
        updateImgTransform();
    });

    // Drag to pan
    lbImg.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        lbImg.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        updateImgTransform();
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        lbImg.style.cursor = 'grab';
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

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
