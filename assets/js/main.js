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

    // 5. Inventory Filtering Logic
    const filterType = document.getElementById('filter-type');
    const filterMake = document.getElementById('filter-make');
    const aircraftCards = document.querySelectorAll('.aircraft-card');

    if (filterType && filterMake) {
        function applyFilters() {
            const typeValue = filterType.value;
            const makeValue = filterMake.value;

            aircraftCards.forEach(card => {
                const cardType = card.getAttribute('data-type');
                const cardMake = card.getAttribute('data-make');
                
                const typeMatch = typeValue === 'all' || typeValue === cardType;
                const makeMatch = makeValue === 'all' || makeValue === cardMake;

                if (typeMatch && makeMatch) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        filterType.addEventListener('change', applyFilters);
        filterMake.addEventListener('change', applyFilters);
    }
});
