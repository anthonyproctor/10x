// ============================================
// 10x Equity - JavaScript
// Scroll animations and interactions
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Mobile Menu Toggle
    // ============================================
    
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const allNavLinks = document.querySelectorAll('.nav-link');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });
        
        // Close menu when clicking on a link
        allNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ============================================
    // Scroll Animation Observer
    // ============================================
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-stagger');
    animatedElements.forEach(el => observer.observe(el));
    
    
    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    
    function smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 40;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            e.preventDefault();
            smoothScrollTo(href);
        });
    });
    
    
    // ============================================
    // Active Section Detection & Navigation
    // ============================================
    
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sectionDots = document.querySelectorAll('.section-dot[data-section]');
    const navProgressBar = document.querySelector('.nav-progress-bar');
    const sectionIndicator = document.querySelector('.section-indicator');
    
    function updateActiveSection() {
        const scrollPosition = window.pageYOffset + 150; // Offset for better detection
        
        // Update progress bar
        if (navProgressBar) {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollableHeight = documentHeight - windowHeight;
            const scrollProgress = (window.pageYOffset / scrollableHeight) * 100;
            navProgressBar.style.width = Math.min(100, Math.max(0, scrollProgress)) + '%';
        }
        
        // Show/hide section indicator
        if (sectionIndicator) {
            if (window.pageYOffset > 200) {
                sectionIndicator.classList.add('visible');
            } else {
                sectionIndicator.classList.remove('visible');
            }
        }
        
        // Find active section
        let activeSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = sectionId;
            }
        });
        
        // If at top, make hero active
        if (window.pageYOffset < 100) {
            activeSection = 'main-content';
        }
        
        // Update nav links
        navLinks.forEach(link => {
            const linkSection = link.getAttribute('data-section');
            if (linkSection === activeSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update section dots
        sectionDots.forEach(dot => {
            const dotSection = dot.getAttribute('data-section');
            if (dotSection === activeSection) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // ============================================
    // Navigation Scroll Effect
    // ============================================
    
    let lastScroll = 0;
    const nav = document.querySelector('.nav');
    
    const handleScroll = throttle(function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow on scroll
        if (currentScroll > 50) {
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            nav.style.boxShadow = 'none';
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
        }
        
        // Update active section
        updateActiveSection();
        
        lastScroll = currentScroll;
    }, 50);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    updateActiveSection();
    
    
    // ============================================
    // Growth Multiplied - Expanding Particle System
    // ============================================

    const canvas = document.getElementById('neural-canvas');
    const hero = document.querySelector('.hero');

    if (canvas && hero) {
        const ctx = canvas.getContext('2d');

        // Particles that multiply
        const particles = [];
        const maxParticles = 300;

        // Origin point (left side, vertically centered)
        let originX = 0;
        let originY = 0;

        // Mouse for subtle interaction
        let mouseX = 0.5;
        let mouseY = 0.5;

        // Timing for spawning waves
        let lastSpawn = 0;
        const spawnInterval = 800;

        // Resize canvas
        function resizeCanvas() {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
            originX = canvas.width * 0.08;
            originY = canvas.height * 0.5;
        }

        // Create a new particle
        function createParticle(x, y, generation = 0, angle = null) {
            const baseAngle = angle !== null ? angle : (Math.random() - 0.3) * Math.PI * 0.8;
            const speed = (Math.random() * 0.8 + 0.4) * (1 - generation * 0.15);

            return {
                x: x,
                y: y,
                vx: Math.cos(baseAngle) * speed,
                vy: Math.sin(baseAngle) * speed,
                size: Math.max(1, 2.5 - generation * 0.4),
                alpha: Math.max(0.15, 0.7 - generation * 0.12),
                life: 0,
                maxLife: 400 + Math.random() * 200,
                generation: generation,
                hasMultiplied: false,
                multiplyAt: 80 + Math.random() * 60
            };
        }

        // Spawn a wave of particles from origin
        function spawnWave() {
            if (particles.length > maxParticles * 0.7) return;

            const count = 3 + Math.floor(Math.random() * 2);
            for (let i = 0; i < count; i++) {
                const angle = (Math.random() - 0.4) * Math.PI * 0.6;
                particles.push(createParticle(originX, originY, 0, angle));
            }
        }

        // Update particles
        function updateParticles(timestamp) {
            // Spawn new waves
            if (timestamp - lastSpawn > spawnInterval) {
                spawnWave();
                lastSpawn = timestamp;
            }

            // Mouse influence
            const mx = (mouseX - 0.5) * 0.3;
            const my = (mouseY - 0.5) * 0.3;

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];

                // Update position
                p.x += p.vx + mx * p.alpha;
                p.y += p.vy + my * p.alpha;

                // Slight curve upward for growth feel
                p.vy -= 0.002;

                // Age the particle
                p.life++;

                // Multiply! Create child particles
                if (!p.hasMultiplied && p.life > p.multiplyAt && p.generation < 4 && particles.length < maxParticles) {
                    p.hasMultiplied = true;

                    // Spawn 2-3 children (multiplication!)
                    const children = 2 + (Math.random() > 0.6 ? 1 : 0);
                    for (let c = 0; c < children; c++) {
                        const spreadAngle = Math.atan2(p.vy, p.vx) + (Math.random() - 0.5) * 1.2;
                        particles.push(createParticle(p.x, p.y, p.generation + 1, spreadAngle));
                    }
                }

                // Fade out and remove
                if (p.life > p.maxLife || p.x > canvas.width + 50 || p.y < -50 || p.y > canvas.height + 50) {
                    particles.splice(i, 1);
                }
            }
        }

        // Draw everything
        function draw() {
            // Clear with slight fade for subtle trails
            ctx.fillStyle = 'rgba(33, 60, 89, 0.12)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw connections between nearby particles (same or adjacent generation)
            ctx.strokeStyle = 'rgba(211, 166, 74, 0.08)';
            ctx.lineWidth = 0.5;

            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];

                    // Only connect similar generations
                    if (Math.abs(p1.generation - p2.generation) > 1) continue;

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 60) {
                        const alpha = (1 - dist / 60) * 0.15 * Math.min(p1.alpha, p2.alpha);
                        ctx.strokeStyle = `rgba(211, 166, 74, ${alpha})`;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles
            for (const p of particles) {
                const lifeRatio = p.life / p.maxLife;
                const fadeIn = Math.min(1, p.life / 20);
                const fadeOut = lifeRatio > 0.7 ? 1 - (lifeRatio - 0.7) / 0.3 : 1;
                const currentAlpha = p.alpha * fadeIn * fadeOut;

                // Gold color with slight variation by generation
                const goldShift = p.generation * 10;
                const r = Math.min(255, 211 + goldShift);
                const g = Math.min(255, 166 + goldShift * 0.5);
                const b = 74 + p.generation * 15;

                // Soft glow
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${currentAlpha})`);
                gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.3})`);
                gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Bright core
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.9})`;
                ctx.fill();
            }

            // Draw origin glow (the source of growth)
            const originGlow = ctx.createRadialGradient(originX, originY, 0, originX, originY, 40);
            originGlow.addColorStop(0, 'rgba(211, 166, 74, 0.3)');
            originGlow.addColorStop(0.5, 'rgba(211, 166, 74, 0.1)');
            originGlow.addColorStop(1, 'rgba(211, 166, 74, 0)');

            ctx.beginPath();
            ctx.arc(originX, originY, 40, 0, Math.PI * 2);
            ctx.fillStyle = originGlow;
            ctx.fill();
        }

        // Animation loop
        function animate(timestamp) {
            updateParticles(timestamp);
            draw();
            requestAnimationFrame(animate);
        }

        // Event listeners
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width;
            mouseY = (e.clientY - rect.top) / rect.height;
        });

        hero.addEventListener('mouseleave', () => {
            mouseX = 0.5;
            mouseY = 0.5;
        });

        window.addEventListener('resize', resizeCanvas);

        // Initialize
        resizeCanvas();

        // Start with some particles
        for (let i = 0; i < 5; i++) {
            spawnWave();
        }

        requestAnimationFrame(animate);
    }
    
    // ============================================
    // Scroll to Top Button
    // ============================================
    
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (scrollToTopBtn) {
        const handleScrollToTop = debounce(function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }, 100);
        
        window.addEventListener('scroll', handleScrollToTop, { passive: true });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    
    // ============================================
    // Performance Optimization
    // ============================================
    
    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function for frequent events
    function throttle(func, limit) {
        let inThrottle;
        let lastFunc;
        let lastRan;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                lastRan = Date.now();
                inThrottle = true;
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
    
    
    // ============================================
    // Accessibility Enhancements
    // ============================================
    
    // Reduce motion for users who prefer it
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable animations
        document.querySelectorAll('.fade-in-up, .fade-in-stagger').forEach(el => {
            el.style.transition = 'none';
            el.classList.add('visible');
        });
    }
    
    
    // ============================================
    // Console Message (Easter Egg)
    // ============================================
    
    console.log('%c10x Equity', 'font-size: 24px; font-weight: bold; color: #d3a64a;');
    console.log('%cGrowth Multiplied.', 'font-size: 14px; color: #5D7173;');
    console.log('%cInterested in joining our team? Email: admin@10x-equity.com', 'font-size: 12px; color: #213c59;');
    
});


// ============================================
// Page Load Performance
// ============================================

window.addEventListener('load', function() {
    // Mark page as fully loaded
    document.body.classList.add('loaded');
    
    // Log performance metrics (development only)
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
});
