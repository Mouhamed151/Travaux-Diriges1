/**
 * UN-CHK (Université numérique Cheikh Hamidou KANE)
 * Interactivité et micro-animations de la page d'accueil
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Ouverture et fermeture de la barre de recherche
    // ----------------------------------------------------
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');

    // ----------------------------------------------------
    // Ouverture / fermeture du méga-menu (bouton MENU)
    // ----------------------------------------------------
    const headerMenuBtn = document.getElementById('headerMenuBtn');
    const megaMenuOverlay = document.getElementById('megaMenuOverlay');
    const menuBars = document.querySelector('.menu-icon-bars');
    const menuClose = document.querySelector('.menu-icon-close');

    const toggleMegaMenu = (forceState) => {
        if (!megaMenuOverlay || !headerMenuBtn) return;
        const isOpen = forceState !== undefined ? forceState : !megaMenuOverlay.classList.contains('is-active');
        if (isOpen) {
            megaMenuOverlay.classList.add('is-active');
            megaMenuOverlay.setAttribute('aria-hidden', 'false');
            headerMenuBtn.classList.add('is-open');
            headerMenuBtn.setAttribute('aria-expanded', 'true');
            if (menuBars) menuBars.style.display = 'none';
            if (menuClose) menuClose.style.display = 'block';
            if (searchOverlay) searchOverlay.classList.remove('active');
        } else {
            megaMenuOverlay.classList.remove('is-active');
            megaMenuOverlay.setAttribute('aria-hidden', 'true');
            headerMenuBtn.classList.remove('is-open');
            headerMenuBtn.setAttribute('aria-expanded', 'false');
            if (menuBars) menuBars.style.display = 'block';
            if (menuClose) menuClose.style.display = 'none';
        }
    };

    if (headerMenuBtn && megaMenuOverlay) {
        headerMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMegaMenu();
        });

        // Fermer le méga-menu au clic en dehors
        document.addEventListener('click', (e) => {
            if (megaMenuOverlay.classList.contains('is-active') &&
                !megaMenuOverlay.contains(e.target) &&
                !headerMenuBtn.contains(e.target)) {
                toggleMegaMenu(false);
            }
        });

        // Fermer avec la touche Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                toggleMegaMenu(false);
                if (searchOverlay) searchOverlay.classList.remove('active');
            }
        });

        // Fermer au clic sur un lien du méga menu
        const megaLinks = megaMenuOverlay.querySelectorAll('a');
        megaLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleMegaMenu(false);
            });
        });
    }

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMegaMenu(false); // Ferme le méga-menu si ouvert
            searchOverlay.classList.toggle('active');
            if (searchOverlay.classList.contains('active')) {
                searchInput.focus();
            }
        });
    }

    // Fermer la recherche au clic à l'extérieur
    document.addEventListener('click', (e) => {
        if (searchOverlay && searchOverlay.classList.contains('active') && !searchOverlay.contains(e.target) && !searchBtn.contains(e.target)) {
            searchOverlay.classList.remove('active');
        }
    });

    // Gestion de la touche Entrée et clic sur l'icône de recherche
    const searchIconSubmit = document.querySelector('.unchk-search-icon');
    const executeSearch = () => {
        const query = searchInput ? searchInput.value.trim() : '';
        if (query) {
            console.log('Recherche UNCHK :', query);
            // Redirige ou filtre selon le besoin
            window.location.hash = '#formations';
            searchOverlay.classList.remove('active');
        }
    };

    if (searchIconSubmit) {
        searchIconSubmit.addEventListener('click', executeSearch);
    }
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                executeSearch();
            }
        });
    }

    // ----------------------------------------------------
    // 2. Menu de navigation mobile (hamburger)
    // ----------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('mobile-active');
            mobileMenuBtn.classList.toggle('is-open');
        });

        // Ouverture des sous-menus sur mobile
        const dropdownItems = mainNav.querySelectorAll('.has-dropdown');
        dropdownItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 991) {
                    e.preventDefault();
                    item.classList.toggle('open-sub');
                }
            });
        });
    }

    // ----------------------------------------------------
    // 3. Carrousel pleine largeur (diapositives du hero)
    // ----------------------------------------------------
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const heroPrev = document.getElementById('heroPrev');
    const heroNext = document.getElementById('heroNext');
    let currentSlide = 0;
    let autoSlideTimer = null;

    const showSlide = (index) => {
        if (!slides.length) return;
        currentSlide = (index + slides.length) % slides.length;

        // Met à jour les slides actives
        slides.forEach((slide, idx) => {
            if (idx === currentSlide) {
                slide.classList.add('active-slide');
            } else {
                slide.classList.remove('active-slide');
            }
        });

        // Met à jour les points de pagination
        dots.forEach((dot, idx) => {
            if (idx === currentSlide) {
                dot.classList.add('active-dot');
            } else {
                dot.classList.remove('active-dot');
            }
        });
    };

    // Clic sur les points de pagination
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(idx);
            startAutoSlide();
        });
    });

    // Flèches Précédente / Suivante
    if (heroPrev) {
        heroPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(currentSlide - 1);
            startAutoSlide();
        });
    }

    if (heroNext) {
        heroNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide(currentSlide + 1);
            startAutoSlide();
        });
    }

    // Défilement automatique toutes les 5 secondes (relancé après chaque interaction)
    function startAutoSlide() {
        if (autoSlideTimer) clearInterval(autoSlideTimer);
        if (slides.length > 1) {
            autoSlideTimer = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 5000);
        }
    }

    startAutoSlide();

    // Pause au survol
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            if (autoSlideTimer) clearInterval(autoSlideTimer);
        });
        heroSection.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }

    // ----------------------------------------------------
    // 4. Retour en haut de page avec défilement fluide
    // ----------------------------------------------------
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ----------------------------------------------------
    // 5. Animation des compteurs de statistiques
    // ----------------------------------------------------
    const statCards = document.querySelectorAll('.stat-big-number');
    let animated = false;

    const runCounterAnimation = () => {
        statCards.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            if (!isNaN(target)) {
                const duration = 1200;
                const startTime = performance.now();

                const updateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const value = Math.floor(progress * target);
                    
                    if (target === 1) {
                        stat.textContent = `${value}ère`;
                    } else if (target > 1000) {
                        stat.textContent = value.toLocaleString('fr-FR');
                    } else {
                        stat.textContent = value;
                    }

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        if (target === 1) {
                            stat.textContent = '1ère';
                        } else if (target > 1000) {
                            stat.textContent = target.toLocaleString('fr-FR');
                        } else {
                            stat.textContent = target;
                        }
                    }
                };

                requestAnimationFrame(updateCount);
            }
        });
    };

    const statsSection = document.getElementById('en-chiffres');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    runCounterAnimation();
                }
            });
        }, { threshold: 0.2 });

        observer.observe(statsSection);
    }

    // ----------------------------------------------------
    // 6. Menu actif au clic et suivi du défilement (scrollspy)
    // ----------------------------------------------------
    const allNavItems = document.querySelectorAll('.nav-item');
    const scrollMap = [
        { id: 'top', index: 0 },              // ACCUEIL
        { id: 'en-chiffres', index: 1 },      // INSTITUTION
        { id: 'formations', index: 2 },       // FORMATIONS
        { id: 'actualites', index: 3 },       // ACTUALITÉS
        { id: 'hero', index: 4 },             // RECHERCHE
        { id: 'vie-estudiantine', index: 5 }, // VIE ÉTUDIANTE
        { id: 'services', index: 6 }          // SERVICE À LA COMMUNAUTÉ
    ];

    allNavItems.forEach((item) => {
        const link = item.querySelector('.nav-link');
        if (link) {
            link.addEventListener('click', (e) => {
                // Si l'élément a un sous-menu, on bascule son affichage
                if (item.classList.contains('has-dropdown')) {
                    item.classList.toggle('hover-open');
                }
                allNavItems.forEach(i => {
                    i.classList.remove('active-nav');
                    if (i !== item) i.classList.remove('hover-open');
                });
                item.classList.add('active-nav');
            });
        }
    });

    // Fermer les sous-menus ouverts au clic à l'extérieur
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item')) {
            allNavItems.forEach(i => i.classList.remove('hover-open'));
        }
    });

    // Scrollspy : met à jour l'onglet actif (bleu) pendant le défilement
    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const scrollPos = window.scrollY + 160;
                let activeIdx = 0;

                for (let i = scrollMap.length - 1; i >= 0; i--) {
                    const sec = document.getElementById(scrollMap[i].id);
                    if (sec && scrollPos >= sec.offsetTop) {
                        activeIdx = scrollMap[i].index;
                        break;
                    }
                }

                if (window.scrollY < 200) {
                    activeIdx = 0;
                }

                allNavItems.forEach((item, idx) => {
                    if (idx === activeIdx) {
                        item.classList.add('active-nav');
                    } else {
                        item.classList.remove('active-nav');
                    }
                });

                isScrolling = false;
            });
            isScrolling = true;
        }
    }, { passive: true });
});
