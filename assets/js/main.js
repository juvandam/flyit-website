/**
 * Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scrolled State
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle hamburger icon animation
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

    // 3. Mobile Submenu Toggle
    const dropdowns = document.querySelectorAll('.nav-item.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('.nav-link');
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('open');
            }
        });
    });

    // 4. Language Switcher stub
    const langBtns = document.querySelectorAll('.lang-switcher button');
    langBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            langBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Here you would implement routing or translation array logic
            // e.g. if btn.textContent === 'EN', redirect to /en/
            console.log("Language changed to:", e.target.textContent);
        });
    });

    // 5. Inventory Advanced Filtering Logic
    try {
        const filterType = document.getElementById('filter-type');
        const filterMake = document.getElementById('filter-make');
        const filterModel = document.getElementById('filter-model');
        const aircraftCards = document.querySelectorAll('.aircraft-card');

        if (filterType && filterMake && filterModel) {
            // Database of models per manufacturer
            const modelsByMake = {
                'cessna': [
                    { value: '150j', text: '150J' },
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

                aircraftCards.forEach(card => {
                    const cardType = card.getAttribute('data-type');
                    const cardMake = card.getAttribute('data-make');
                    const cardModel = card.getAttribute('data-model');
                    
                    const typeMatch = typeValue === 'all' || typeValue === cardType;
                    const makeMatch = makeValue === 'all' || makeValue === cardMake;
                    const modelMatch = modelValue === 'all' || modelValue === cardModel;

                    // Simple fade animation for filtering
                    if (typeMatch && makeMatch && modelMatch) {
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

    // 7. Reveal on scroll
    try {
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
                // Fallback for older browsers
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
        // Fail-safe: show everything
        document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
        const tc = document.getElementById('partnersTimeline');
        if (tc) tc.classList.add('timeline-active');
    }

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

    // 9. Dynamic Hero
    try {
        const hero = document.querySelector('.hero');
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        
        if (hero && heroTitle && heroSubtitle) {
            const isMobile = window.innerWidth <= 768;
            
            const slides = [
                {
                    bg: isMobile ? 'url("assets/images/fotos_aeronaves_web/aviacion_privada.jpg")' : 'url("assets/images/fotos_aeronaves_web/jet_airplane.jpg")',
                    title: 'Elevando los<br>Estándares de<br>la Aviación',
                    text: 'Experiencia, gestión corporativa y un nivel incomparable de profesionalismo en administración y venta de aeronaves.'
                },
                {
                    bg: isMobile ? 'url("assets/images/fotos_aeronaves_web/aeronave_turbohelice.jpg")' : 'url("assets/images/fotos_aeronaves_web/avion_venta_King.jpg")',
                    title: 'Encuentra tu<br>próxima aeronave',
                    text: 'Acceda a nuestro catálogo exclusivo.<br>Conectamos compradores con vendedores<br>de manera eficiente y transparente.'
                }
            ];

            let currentSlide = 0;
            
            // Initial setup
            hero.style.backgroundImage = slides[currentSlide].bg;
            heroTitle.innerHTML = slides[currentSlide].title;
            heroSubtitle.innerHTML = slides[currentSlide].text;

            // Add transition properties (ensure they are applied)
            hero.style.transition = 'background-image 1.5s ease-in-out';
            heroTitle.style.transition = 'opacity 0.6s ease-in-out';
            heroSubtitle.style.transition = 'opacity 0.6s ease-in-out';

            setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                
                // Fade out
                heroTitle.style.opacity = '0';
                heroSubtitle.style.opacity = '0';
                
                setTimeout(() => {
                    hero.style.backgroundImage = slides[currentSlide].bg;
                    heroTitle.innerHTML = slides[currentSlide].title;
                    heroSubtitle.innerHTML = slides[currentSlide].text;
                    
                    // Fade in
                    heroTitle.style.opacity = '1';
                    heroSubtitle.style.opacity = '1';
                }, 600); // Wait for fade out
                
            }, 6500);
        }
    } catch(e) { console.error('Hero animation error:', e); }
