/* ==========================================================================
   AURA STUDIO ARCHITECTS - INTERACTIVE LOGIC (VANILLA JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. PRELOADER LOGIC
       ========================================== */
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloader-bar');
    const preloaderPercentage = document.getElementById('preloader-percentage');
    
    let currentProgress = 0;
    const progressDuration = 1800; // Total loading time in ms
    const intervalTime = 20; // Update rate
    const stepCount = progressDuration / intervalTime;
    
    const progressInterval = setInterval(() => {
        currentProgress += 100 / stepCount;
        if (currentProgress >= 100) {
            currentProgress = 100;
            clearInterval(progressInterval);
            
            // Wait slightly at 100% for smooth transition
            setTimeout(() => {
                preloader.classList.add('fade-out');
                // Force reveal Hero immediately on load
                const heroSection = document.getElementById('hero');
                if (heroSection) {
                    heroSection.classList.add('reveal-visible');
                }
                // Trigger animations for elements in view on load
                initIntersectionObserver();
            }, 300);
        }
        
        preloaderBar.style.width = `${currentProgress}%`;
        preloaderPercentage.textContent = `${Math.round(currentProgress)}%`;
    }, intervalTime);


    /* ==========================================
       2. CUSTOM CURSOR
       ========================================== */
    const cursorRing = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('custom-cursor-dot');
    
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    
    // Check if device supports hover interactions (not a touch device)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Move dot immediately
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
            cursorDot.style.opacity = 1;
            cursorRing.style.opacity = 1;
        });

        // Smooth cursor ring movement with slight lag (lerping)
        const animateCursorRing = () => {
            const ease = 0.15; // smoothness coefficient
            ringX += (mouseX - ringX) * ease;
            ringY += (mouseY - ringY) * ease;
            
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            
            requestAnimationFrame(animateCursorRing);
        };
        animateCursorRing();

        // Mouse click state
        window.addEventListener('mousedown', () => {
            cursorRing.classList.add('clicked');
        });
        window.addEventListener('mouseup', () => {
            cursorRing.classList.remove('clicked');
        });

        // Hover scaling triggers
        const hoverables = document.querySelectorAll('a, button, input, select, textarea, .project-card, .why-card, .faq-trigger, .expertise-tab-btn, .dot, .service-card');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursorRing.classList.add('hovered');
            });
            item.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('hovered');
            });
        });
    }


    /* ==========================================
       3. STICKY HEADER & MOBILE NAV
       ========================================== */
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile nav drawer when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Update active state in nav
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    });


    /* ==========================================
       4. INTERSECTION OBSERVER FOR REVEALS
       ========================================== */
    function initIntersectionObserver() {
        const sections = document.querySelectorAll('.scroll-reveal, .philosophy-section, .achievements-section');
        
        const observerOptions = {
            root: null,
            threshold: 0.15,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    
                    // Trigger counters inside this section if present
                    const counters = entry.target.querySelectorAll('.counter-val, .stat-number');
                    if (counters.length > 0) {
                        counters.forEach(counter => animateCounter(counter));
                    }
                    
                    // Unobserve after revealing to prevent repeating
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }


    /* ==========================================
       5. TIMELINE GROWTH & DOT ACTIVATION ON SCROLL
       ========================================== */
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineLine = document.querySelector('.timeline-line');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineContainer && timelineLine) {
        window.addEventListener('scroll', () => {
            const rect = timelineContainer.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Calculate how much of the timeline container has scrolled through the viewport
            const startScrollPoint = rect.top - viewportHeight + 100;
            const containerHeight = rect.height;
            
            if (rect.top < viewportHeight - 100 && rect.bottom > 100) {
                // Calculate percentage
                const scrolledDistance = (viewportHeight - 100) - rect.top;
                let scrollPercentage = (scrolledDistance / containerHeight) * 100;
                
                // Boundaries
                if (scrollPercentage < 0) scrollPercentage = 0;
                if (scrollPercentage > 100) scrollPercentage = 100;
                
                timelineLine.style.height = `${scrollPercentage}%`;
                
                // Highlight corresponding dots
                timelineItems.forEach(item => {
                    const itemRect = item.getBoundingClientRect();
                    if (itemRect.top < viewportHeight * 0.75) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }


    /* ==========================================
       6. NUMERICAL COUNTERS ANIMATION
       ========================================== */
    function animateCounter(counterElement) {
        if (counterElement.classList.contains('counted')) return;
        
        const target = parseInt(counterElement.getAttribute('data-target'), 10);
        let current = 0;
        const duration = 2000; // 2 seconds counting animation
        const steps = 50;
        const stepValue = target / steps;
        const stepTime = duration / steps;
        
        counterElement.classList.add('counted');
        
        let step = 0;
        const counterInterval = setInterval(() => {
            step++;
            current = Math.round(stepValue * step);
            
            if (step >= steps) {
                current = target;
                clearInterval(counterInterval);
            }
            
            counterElement.textContent = current;
        }, stepTime);
    }


    /* ==========================================
       7. EXPERTISE TAB toggles
       ========================================== */
    const tabButtons = document.querySelectorAll('.expertise-tab-btn');
    const panels = document.querySelectorAll('.expertise-panel');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedTab = btn.getAttribute('data-tab');
            
            // Update button active states
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update panel active states
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `tab-panel-${selectedTab}`) {
                    // Small timeout for nice transition effect
                    setTimeout(() => {
                        panel.classList.add('active');
                    }, 50);
                }
            });
        });
    });


    /* ==========================================
       8. FEATURED PROJECTS FILTERING (MASONRY)
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            
            // Update button active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Hide with zoom out animation, then display block/none
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });


    /* ==========================================
       9. CLIENT TESTIMONIALS SLIDER (CAROUSEL)
       ========================================== */
    const carousel = document.getElementById('testimonial-carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    const slides = document.querySelectorAll('.testimonial-slide');
    
    let currentIndex = 0;
    const slideCount = slides.length;
    let autoSlideTimer;
    
    function updateCarousel() {
        // Move track
        carousel.style.transform = `translateX(-${currentIndex * 33.3333}%)`;
        
        // Update slide active state
        slides.forEach((slide, idx) => {
            if (idx === currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Update dots indicators
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateCarousel();
    }
    
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
        
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
    }
    
    // Dot click triggers
    if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                currentIndex = parseInt(dot.getAttribute('data-index'), 10);
                updateCarousel();
                resetAutoSlide();
            });
        });
    }
    
    // Auto slider
    function startAutoSlide() {
        autoSlideTimer = setInterval(nextSlide, 6000); // 6s intervals
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }
    
    if (carousel) {
        startAutoSlide();
    }


    /* ==========================================
       10. FAQ ACCORDION TOGGLE
       ========================================== */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const panel = item.querySelector('.faq-panel');
        
        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-panel').style.maxHeight = null;
                faq.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
            });
            
            // Open current item if it was closed
            if (!isOpen) {
                item.classList.add('active');
                panel.style.maxHeight = `${panel.scrollHeight}px`;
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });


    /* ==========================================
       11. LUXURY FORMS SUBMISSION FEEDBACK
       ========================================== */
    const inquiryForm = document.getElementById('architectural-inquiry-form');
    const formFeedback = document.getElementById('form-feedback');
    
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show loading status inside submit button
            const submitBtn = inquiryForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn-text">Verifying Brief parameters...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Simulate API request to agency CRM
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Show luxury success feedback
                formFeedback.textContent = "Architectural Commission brief submitted successfully. Principal Architect will reach out shortly.";
                formFeedback.className = "form-feedback-message success";
                
                // Reset form
                inquiryForm.reset();
                
                // Fade feedback after 5 seconds
                setTimeout(() => {
                    formFeedback.style.display = 'none';
                }, 5000);
            }, 1800);
        });
    }

    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterFeedback = document.getElementById('newsletter-feedback');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate newsletter registration
            newsletterFeedback.textContent = "Thank you. You've been subscribed to the AURA Studio Journal.";
            newsletterFeedback.style.display = 'block';
            newsletterForm.reset();
            
            setTimeout(() => {
                newsletterFeedback.style.display = 'none';
            }, 4000);
        });
    }

    /* ==========================================
       15. INTERACTIVE INDIA MAP
       ========================================== */
    const hubsData = [
        { x: 28.3, y: 18.5, title: 'Ludhiana (HQ)', desc: 'AURA Studio Design Tower / Principal Hub' },
        { x: 27.5, y: 10.0, title: 'Srinagar', desc: 'Luxury Hillside Villa Residence' },
        { x: 30.0, y: 27.7, title: 'New Delhi', desc: 'Sarabha Corporate Headquarters' },
        { x: 23.3, y: 52.3, title: 'Mumbai', desc: 'Seafront Luxury Gated Estate' },
        { x: 30.8, y: 71.5, title: 'Bengaluru', desc: 'Wellness Sanctuary Eco-Resort' },
        { x: 58.3, y: 50.8, title: 'Kolkata', desc: 'Parametric Freight Terminal Hub' }
    ];

    const mapTooltip = document.getElementById('map-tooltip');
    const hubItems = document.querySelectorAll('.hub-item');
    const cityNodes = document.querySelectorAll('.city-node');
    const curvePaths = [
        null, // Ludhiana doesn't have a curve to itself
        document.querySelector('.path-srinagar'),
        document.querySelector('.path-delhi'),
        document.querySelector('.path-mumbai'),
        document.querySelector('.path-bengaluru'),
        document.querySelector('.path-kolkata')
    ];

    function activateHub(index) {
        // Deactivate all hubs and nodes
        hubItems.forEach(item => item.classList.remove('active'));
        cityNodes.forEach(node => node.classList.remove('active'));
        curvePaths.forEach(path => {
            if (path) path.classList.remove('highlighted');
        });

        // Activate selected hub and corresponding city node
        const activeHubItem = hubItems[index];
        const activeCityNode = cityNodes[index];
        
        if (activeHubItem) activeHubItem.classList.add('active');
        if (activeCityNode) activeCityNode.classList.add('active');
        
        // Highlight active curve path
        const activePath = curvePaths[index];
        if (activePath) activePath.classList.add('highlighted');

        // Show tooltip at position
        const data = hubsData[index];
        if (data && mapTooltip) {
            mapTooltip.querySelector('.tooltip-title').textContent = data.title;
            mapTooltip.querySelector('.tooltip-desc').textContent = data.desc;
            mapTooltip.style.left = `${data.x}%`;
            mapTooltip.style.top = `${data.y}%`;
            mapTooltip.classList.add('visible');
        }
    }

    // Add event listeners for Hub Items (Left List)
    hubItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const index = parseInt(item.getAttribute('data-index'), 10);
            activateHub(index);
        });
    });

    // Add event listeners for City Nodes (SVG Dots)
    cityNodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            const index = parseInt(node.getAttribute('data-index'), 10);
            activateHub(index);
        });
    });

    // Initialize with Ludhiana HQ active
    if (hubItems.length > 0) {
        setTimeout(() => {
            activateHub(0);
        }, 1000); // Small delay on load for smooth start
    }
});
