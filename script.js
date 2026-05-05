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
        renderProjects('construction'); // Default to Nouvelle Construction
    } catch (err) {
        console.error("Error loading projects:", err);
    }
}

let currentMainCat = 'construction';
let currentSubCat = 'all';

function renderProjects(cat, subCat = 'all') {
    const container = document.getElementById('masonryContainer');
    if (!container) return;

    container.innerHTML = '';
    let filtered = cat === 'all' ? allProjects : allProjects.filter(p => p.category === cat);
    
    if (subCat !== 'all') {
        filtered = filtered.filter(p => p.subCategory === subCat);
    }

    filtered.forEach((p, index) => {
        const item = document.createElement('div');
        item.className = `m-item reveal ${p.isGroup ? 'is-group' : ''}`;
        item.style.transitionDelay = `${index * 0.1}s`;
        item.dataset.cat = p.category;
        
        const hasTitle = p.title && p.title.trim() !== "";
        const h = p.height || '350px';

        let mediaHtml = '';
        if (p.isGroup && p.images && p.images.length === 2) {
            mediaHtml = `
                <div class="m-split-container" style="height: ${h};">
                    <div class="m-split-pane split-left" style="background-image: url('${p.images[0]}');"></div>
                    <div class="m-split-pane split-right" style="background-image: url('${p.images[1]}');"></div>
                    <div class="m-split-divider">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                </div>
            `;
        } else if (p.isGroup && p.images && p.images.length > 2) {
            const mainImg = p.images[0];
            const subImgs = p.images.slice(1, 4); // Show up to 3 thumbnails
            mediaHtml = `
                <div class="m-img-group" style="height: ${h};">
                    <div class="m-img-main" style="background-image: url('${mainImg}');"></div>
                    <div class="m-img-subs">
                        ${subImgs.map(img => `<div class="m-img-sub" style="background-image: url('${img}');"></div>`).join('')}
                    </div>
                </div>
            `;
        } else {
            const thumb = p.isGroup ? p.images[0] : p.image;
            mediaHtml = `<div class="m-img" style="background-image: url('${thumb}'); height: ${h};"></div>`;
        }

        
        item.innerHTML = `
            ${mediaHtml}
            <div class="m-ov">
                ${hasTitle ? `<div class="m-line"></div>` : ''}
                ${hasTitle ? `<div class="m-title">${p.title}</div>` : ''}
                <div class="m-cat">${p.categoryLabel}</div>
            </div>
        `;
        
        // Open lightbox on click
        item.addEventListener('click', () => {
            const imagesToLoad = p.isGroup ? p.images : [p.image];
            openLightbox(imagesToLoad);
        });
        
        container.appendChild(item);
        
        // Trigger reveal animation after a tiny delay
        setTimeout(() => {
            item.classList.add('vis');
        }, 50);
    });
}

function doFilter(btn, cat) {
    currentMainCat = cat;
    currentSubCat = 'all';

    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');

    const subFilters = document.getElementById('subFilters');
    if (cat === 'interieur') {
        subFilters.classList.add('active');
        // Reset sub buttons (none selected by default)
        document.querySelectorAll('.sf-btn').forEach(b => b.classList.remove('on'));
    } else {
        subFilters.classList.remove('active');
    }

    renderProjects(cat, 'all');
}

function doSubFilter(btn, sub) {
    currentSubCat = sub;
    document.querySelectorAll('.sf-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    renderProjects(currentMainCat, sub);
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

/* ── LIGHTBOX / ZOOM / CAROUSEL ── */
const lightbox    = document.getElementById('lightbox');
const lbImg       = document.getElementById('lbImg');
const btnZoomIn   = document.getElementById('lbZoomIn');
const btnZoomOut  = document.getElementById('lbZoomOut');
const btnClose    = document.getElementById('lbClose');
const btnPrev     = document.getElementById('lbPrev');
const btnNext     = document.getElementById('lbNext');
const lbCounter   = document.getElementById('lbCounter');

let currentZoom   = 1;
const zoomStep    = 0.4;
const maxZoom     = 4;
const minZoom     = 0.5;

let isDragging    = false;
let startX, startY, translateX = 0, translateY = 0;

let currentGallery = [];
let currentIndex   = 0;

function openLightbox(images, index = 0) {
    if(!lightbox || !lbImg) return;
    
    currentGallery = images;
    currentIndex   = index;
    
    updateLightboxContent();
    
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    updateImgTransform();
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function updateLightboxContent() {
    lbImg.src = currentGallery[currentIndex];
    
    // Update Counter
    if (lbCounter) {
        lbCounter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;
        lbCounter.style.display = currentGallery.length > 1 ? 'flex' : 'none';
    }
    
    // Show/Hide Nav Buttons
    if (btnPrev && btnNext) {
        const isMulti = currentGallery.length > 1;
        btnPrev.classList.toggle('hidden', !isMulti);
        btnNext.classList.toggle('hidden', !isMulti);
    }
}

function nextImage() {
    if (currentGallery.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentGallery.length;
    updateLightboxContent();
    resetZoom();
}

function prevImage() {
    if (currentGallery.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    updateLightboxContent();
    resetZoom();
}

function resetZoom() {
    currentZoom = 1;
    translateX = 0;
    translateY = 0;
    updateImgTransform();
}

function closeLightbox() {
    if(!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 400);
}

function updateImgTransform() {
    lbImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
}

if(lightbox) {
    btnClose.addEventListener('click', closeLightbox);
    
    // Navigation
    if(btnPrev) btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
    if(btnNext) btnNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox || e.target.classList.contains('lb-content')) {
            closeLightbox();
        }
    });

    // Zoom Controls
    btnZoomIn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentZoom < maxZoom) {
            currentZoom += zoomStep;
            updateImgTransform();
        }
    });

    btnZoomOut.addEventListener('click', (e) => {
        e.stopPropagation();
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

    // Keyboard support
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
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
