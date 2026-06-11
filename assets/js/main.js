/**
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // 0. PRIORITY: Reveal on scroll (movido al inicio para garantizar que se ejecuta)
    try {
        // Auto-aplicar data-reveal a todos los titulos h2/h3 que no esten
        // ya dentro de un contenedor con data-reveal, ni en header/hero/footer/page-header.
        try {
            document.querySelectorAll('h2, h3').forEach(el => {
                if (el.closest('.header, .hero, .footer, .page-header, [data-reveal]')) return;
                el.setAttribute('data-reveal', '');
            });
        } catch(_) {}

        const timelineContainer = document.getElementById('partnersTimeline');
        const revealEls = document.querySelectorAll('[data-reveal]');

        if (revealEls.length > 0) {
            if ('IntersectionObserver' in window) {
                const revealObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('revealed');
                            revealObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1, rootMargin: '0px 0px 50px 0px' });

                revealEls.forEach(el => revealObserver.observe(el));
            } else {
                revealEls.forEach(el => el.classList.add('revealed'));
            }
        }

        if (timelineContainer) {
            if ('IntersectionObserver' in window) {
                const timelineObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            timelineContainer.classList.add('timeline-active');
                            timelineObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.1 });

                timelineObserver.observe(timelineContainer);
            } else {
                timelineContainer.classList.add('timeline-active');
            }
        }
    } catch(e) {
        console.error('Reveal error:', e);
        document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
        const tc = document.getElementById('partnersTimeline');
        if (tc) tc.classList.add('timeline-active');
    }

    // FAILSAFE CONDICIONAL: solo si el IntersectionObserver NO funciono.
    // Detectamos eso porque despues de 2.5s ningun elemento debio haberse revelado
    // (al menos los que estan en el viewport inicial deberian disparar el IO).
    // Si IO funciona, los elementos fuera del viewport esperan al scroll del usuario,
    // que es exactamente el efecto "aparecer al scrollear" que queremos.
    setTimeout(() => {
        try {
            const anyRevealed = document.querySelector('[data-reveal].revealed');
            if (!anyRevealed) {
                // IO no funciono: revelar todo de una para evitar pagina vacia
                document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
                const tc = document.getElementById('partnersTimeline');
                if (tc) tc.classList.add('timeline-active');
            }
            // Si al menos uno fue revealed, IO funciona — dejarlo trabajar en scroll
        } catch(e) {}
    }, 2500);

    // 1. Header Scrolled State
    try {
        const header = document.querySelector('.header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
    } catch(e) { console.error('Header scroll error:', e); }

    // 2. Mobile Menu Toggle
    try {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                const spans = hamburger.querySelectorAll('span');
                if (navMenu.classList.contains('active')) {
                    spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        }
    } catch(e) { console.error('Hamburger error:', e); }

    // 3. Mobile Submenu Toggle
    try {
        const dropdowns = document.querySelectorAll('.nav-item.dropdown');
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            if (link) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        dropdown.classList.toggle('open');
                    }
                });
            }
        });
    } catch(e) { console.error('Submenu error:', e); }

    // 4. Language Switcher stub
    try {
        const langBtns = document.querySelectorAll('.lang-switcher button');
        langBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                langBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                console.log("Language changed to:", e.target.textContent);
            });
        });
    } catch(e) { console.error('Lang switcher error:', e); }

    // 5. Inventory Advanced Filtering Logic
    try {
        const filterType = document.getElementById('filter-type');
        const filterMake = document.getElementById('filter-make');
        const filterModel = document.getElementById('filter-model');
        const filterLocation = document.getElementById('filter-location');
        const aircraftCards = document.querySelectorAll('.aircraft-card');

        if (filterType && filterMake && filterModel) {
            // Database of models per manufacturer
            const modelsByMake = {
                'cessna': [
                    { value: '150j', text: '150J' },
                    { value: '172l', text: '172L' },
                    { value: '182c', text: '182C' },
                    { value: 'citation xls', text: 'Citation XLS' }
                ],
                'beechcraft': [
                    { value: 'king air 250', text: 'King Air 250' }
                ],
                'embraer': [
                    { value: 'phenom 300', text: 'Phenom 300' }
                ],
                'piper': [] // Ready for future additions
            };

            // Update models dropdown when manufacturer changes
            filterMake.addEventListener('change', () => {
                const selectedMake = filterMake.value;
                
                // Reset and clear model dropdown
                filterModel.innerHTML = '<option value="all">Todos los modelos</option>';
                
                if (selectedMake !== 'all' && modelsByMake[selectedMake] && modelsByMake[selectedMake].length > 0) {
                    // Populate options
                    modelsByMake[selectedMake].forEach(model => {
                        const option = document.createElement('option');
                        option.value = model.value;
                        option.textContent = model.text;
                        filterModel.appendChild(option);
                    });
                    filterModel.disabled = false;
                } else {
                    // Disable if no specific manufacturer is selected
                    filterModel.innerHTML = '<option value="all">Seleccione fabricante primero</option>';
                    filterModel.disabled = true;
                }

                applyFilters();
            });

            function applyFilters() {
                const typeValue = filterType.value;
                const makeValue = filterMake.value;
                const modelValue = filterModel.disabled ? 'all' : filterModel.value;
                const locationValue = filterLocation ? filterLocation.value : 'all';

                aircraftCards.forEach(card => {
                    const cardType = card.getAttribute('data-type');
                    const cardMake = card.getAttribute('data-make');
                    const cardModel = card.getAttribute('data-model');
                    const cardLocation = card.getAttribute('data-location') || 'all';

                    const typeMatch = typeValue === 'all' || typeValue === cardType;
                    const makeMatch = makeValue === 'all' || makeValue === cardMake;
                    const modelMatch = modelValue === 'all' || modelValue === cardModel;
                    const locationMatch = locationValue === 'all' || locationValue === cardLocation;

                    // Simple fade animation for filtering
                    if (typeMatch && makeMatch && modelMatch && locationMatch) {
                        card.style.display = 'block';
                        setTimeout(() => card.style.opacity = '1', 10);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                });
            }

            filterType.addEventListener('change', applyFilters);
            filterModel.addEventListener('change', applyFilters);
            if (filterLocation) {
                filterLocation.addEventListener('change', applyFilters);
            }

            // Initial setup
            aircraftCards.forEach(card => {
                card.style.transition = 'opacity 0.3s ease';
            });
        }
    } catch(e) { console.error('Filter logic error:', e); }

    // 6. Featured Aircraft Carousels
    try {
        const carousels = document.querySelectorAll('.featured-carousel');
        
        carousels.forEach(carousel => {
            const carouselTrack = carousel.querySelector('.carousel-track');
            const carouselPrev = carousel.querySelector('.carousel-prev');
            const carouselNext = carousel.querySelector('.carousel-next');

            if (carouselTrack && carouselPrev && carouselNext) {
                const slides = carouselTrack.querySelectorAll('.carousel-slide');
                const totalSlides = slides.length;
                let currentIndex = 0;
                let autoplayId = null;
                const AUTOPLAY_MS = 4000;

                function getVisibleSlides() {
                    if (window.innerWidth < 600) return 1;
                    if (window.innerWidth < 992) return 2;
                    return 3;
                }

                function getMaxIndex() {
                    return Math.max(0, totalSlides - getVisibleSlides());
                }

                function updateTransform() {
                    const firstSlide = carouselTrack.querySelector('.carousel-slide');
                    if (!firstSlide) return;
                    const slideWidth = firstSlide.getBoundingClientRect().width;
                    carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
                }

                function goToSlide(index) {
                    const maxIndex = getMaxIndex();
                    const range = maxIndex + 1;
                    currentIndex = ((index % range) + range) % range;
                    updateTransform();
                }

                function nextSlide() { goToSlide(currentIndex + 1); }
                function prevSlide() { goToSlide(currentIndex - 1); }

                function startAutoplay() {
                    stopAutoplay();
                    autoplayId = setInterval(nextSlide, AUTOPLAY_MS);
                }

                function stopAutoplay() {
                    if (autoplayId) {
                        clearInterval(autoplayId);
                        autoplayId = null;
                    }
                }

                carouselPrev.addEventListener('click', () => { prevSlide(); startAutoplay(); });
                carouselNext.addEventListener('click', () => { nextSlide(); startAutoplay(); });

                // Only add mouseenter/leave on desktop to avoid getting stuck on mobile touch
                if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
                    carousel.addEventListener('mouseenter', stopAutoplay);
                    carousel.addEventListener('mouseleave', startAutoplay);
                }

                let touchStartX = 0;
                let touchEndX = 0;
                carouselTrack.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                    stopAutoplay();
                }, { passive: true });
                carouselTrack.addEventListener('touchend', (e) => {
                    touchEndX = e.changedTouches[0].screenX;
                    const delta = touchEndX - touchStartX;
                    if (Math.abs(delta) > 40) {
                        if (delta < 0) nextSlide();
                        else prevSlide();
                    }
                    startAutoplay();
                }, { passive: true });

                let resizeTimer = null;
                window.addEventListener('resize', () => {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(() => {
                        const maxIndex = getMaxIndex();
                        if (currentIndex > maxIndex) currentIndex = maxIndex;
                        updateTransform();
                    }, 150);
                });

                // Use setTimeout to ensure DOM is fully laid out on older browsers
                setTimeout(() => {
                    updateTransform();
                    startAutoplay();
                }, 100);
            }
        });
    } catch(e) { console.error('Carousel error:', e); }

    // 7. (Reveal on scroll movido a seccion 0 al inicio + failsafe con setTimeout)

    // 8. Form Submission AJAX
    const forms = document.querySelectorAll('form[action^="https://formsubmit.co/"]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalBtnText = btn.textContent;
            btn.textContent = 'Enviando...';
            btn.disabled = true;

            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                form.innerHTML = `<div style="text-align: center; padding: 20px; color: #1a2b3c; font-weight: 600; font-size: 1.1rem; background: rgba(37, 211, 102, 0.1); border-radius: 8px;">
                                    <i class="fas fa-check-circle" style="font-size: 2.5rem; color: #25D366; margin-bottom: 15px;"></i><br>
                                    Gracias por escribirnos. Nos pondremos en contacto a la brevedad.
                                  </div>`;
            })
            .catch(error => {
                btn.textContent = 'Error al enviar. Intenta de nuevo.';
                btn.disabled = false;
                setTimeout(() => {
                    btn.textContent = originalBtnText;
                }, 3000);
            });
        });
    });

    // 9. Dynamic Hero - sincronizado con Web Animations API
    // Todas las animaciones (texto + imagen) arrancan en el mismo frame y duran lo mismo
    try {
        const hero = document.querySelector('.hero');
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');

        if (hero && heroTitle && heroSubtitle) {
            const isMobile = window.innerWidth <= 768;

            const slides = [
                {
                    bg: isMobile
                        ? 'assets/images/fotos_aeronaves_web/aviacion_privada.jpg'
                        : 'assets/images/fotos_aeronaves_web/jet_airplane.jpg',
                    title: 'Elevando los<br>Estándares de<br>la Aviación',
                    text: 'Experiencia, gestión corporativa y un nivel incomparable de profesionalismo en administración y venta de aeronaves.'
                },
                {
                    bg: isMobile
                        ? 'assets/images/fotos_aeronaves_web/aeronave_turbohelice.jpg'
                        : 'assets/images/fotos_aeronaves_web/avion_venta_King.jpg',
                    title: 'Encuentra tu<br>próxima aeronave',
                    text: 'Acceda a nuestro catálogo exclusivo.<br>Conectamos compradores con vendedores<br>de manera eficiente y transparente.'
                }
            ];

            const FADE = 500;
            const ENTER = 500;

            // Capa de fondo
            const makeLayer = (img) => {
                const el = document.createElement('div');
                el.className = 'hero-bg-layer';
                Object.assign(el.style, {
                    position: 'absolute',
                    inset: '0',
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url("' + img + '")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: isMobile ? 'scroll' : 'fixed',
                    zIndex: '0',
                    pointerEvents: 'none',
                    opacity: '0'
                });
                return el;
            };

            // Precargar TODAS las imagenes antes de iniciar el ciclo
            const preloadAll = Promise.all(slides.map(s => new Promise(resolve => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = resolve; // resolver aunque falle
                img.src = s.bg;
            })));

            preloadAll.then(() => {
                // Una vez que cargaron, sacamos el background del hero CSS y montamos las capas
                hero.style.backgroundImage = 'none';

                const layerA = makeLayer(slides[0].bg);
                const layerB = makeLayer(slides[1].bg);
                layerA.style.opacity = '1';
                hero.insertBefore(layerB, hero.firstChild);
                hero.insertBefore(layerA, hero.firstChild);

                heroTitle.innerHTML = slides[0].title;
                heroSubtitle.innerHTML = slides[0].text;

                let currentSlide = 0;
                let activeLayer = layerA;
                let standbyLayer = layerB;
                let isAnimating = false;

                const animateSlide = () => {
                    if (isAnimating) return;
                    isAnimating = true;

                    currentSlide = (currentSlide + 1) % slides.length;
                    const next = slides[currentSlide];

                    // Setear la imagen nueva en la capa standby
                    standbyLayer.style.backgroundImage = 'url("' + next.bg + '")';

                    // Web Animations API - todas arrancan en el MISMO frame
                    const FADE_OPTS = { duration: FADE, easing: 'ease-in-out', fill: 'forwards' };

                    const exitAnims = [
                        heroTitle.animate(
                            [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-12px)' }],
                            FADE_OPTS
                        ),
                        heroSubtitle.animate(
                            [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-12px)' }],
                            FADE_OPTS
                        ),
                        activeLayer.animate(
                            [{ opacity: 1 }, { opacity: 0 }],
                            FADE_OPTS
                        ),
                        standbyLayer.animate(
                            [{ opacity: 0 }, { opacity: 1 }],
                            FADE_OPTS
                        )
                    ];

                    Promise.all(exitAnims.map(a => a.finished)).then(() => {
                        // Persistir el estado final con styles directos
                        activeLayer.style.opacity = '0';
                        standbyLayer.style.opacity = '1';
                        heroTitle.style.opacity = '0';
                        heroTitle.style.transform = 'translateY(-12px)';
                        heroSubtitle.style.opacity = '0';
                        heroSubtitle.style.transform = 'translateY(-12px)';
                        exitAnims.forEach(a => { try { a.cancel(); } catch(_) {} });

                        // Cambiar contenido (invisible) y entrar deslizando
                        heroTitle.innerHTML = next.title;
                        heroSubtitle.innerHTML = next.text;

                        const ENTER_OPTS = { duration: ENTER, easing: 'ease-out', fill: 'forwards' };
                        const enterAnims = [
                            heroTitle.animate(
                                [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
                                ENTER_OPTS
                            ),
                            heroSubtitle.animate(
                                [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
                                ENTER_OPTS
                            )
                        ];

                        Promise.all(enterAnims.map(a => a.finished)).then(() => {
                            heroTitle.style.opacity = '1';
                            heroTitle.style.transform = 'translateY(0)';
                            heroSubtitle.style.opacity = '1';
                            heroSubtitle.style.transform = 'translateY(0)';
                            enterAnims.forEach(a => { try { a.cancel(); } catch(_) {} });

                            // Swap layers
                            const tmp = activeLayer;
                            activeLayer = standbyLayer;
                            standbyLayer = tmp;
                            isAnimating = false;
                        });
                    });
                };

                // Ciclo + pausa cuando la pestaña no es visible
                let intervalId = setInterval(animateSlide, 5500);
                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) {
                        if (intervalId) { clearInterval(intervalId); intervalId = null; }
                    } else if (!intervalId) {
                        intervalId = setInterval(animateSlide, 5500);
                    }
                });
            });
        }
    } catch(e) { console.error('Hero animation error:', e); }

});
