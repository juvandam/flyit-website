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

    // 6. Featured Aircraft Carousels
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

            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);

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

            requestAnimationFrame(() => {
                updateTransform();
                startAutoplay();
            });
        }
    });

    // 7. Reveal on scroll (Plan de Vuelo timeline + otros elementos con data-reveal)
    const timelineContainer = document.getElementById('partnersTimeline');
    const revealEls = document.querySelectorAll('[data-reveal]');

    if (revealEls.length > 0 && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: mostrar todo si no hay IntersectionObserver
        revealEls.forEach(el => el.classList.add('revealed'));
    }

    // Activar animación del merge (Y) y la línea central cuando el timeline entra en viewport
    if (timelineContainer && 'IntersectionObserver' in window) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timelineContainer.classList.add('timeline-active');
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        timelineObserver.observe(timelineContainer);
    } else if (timelineContainer) {
        timelineContainer.classList.add('timeline-active');
    }
});
