document.addEventListener('DOMContentLoaded', () => {

    // --- 0. Intro Splash Animation ---
    const introSplash = document.querySelector('.intro-splash');
    const introName = document.querySelector('.intro-name');
    const introRole = document.querySelector('.intro-role');

    if (introSplash && introName && introRole) {
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);

        const nameText = introName.textContent.trim();
        const roleText = introRole.textContent.trim();
        
        introName.innerHTML = '';
        introRole.innerHTML = '';
        
        introName.style.opacity = '1';
        introName.style.transform = 'translateY(0)';
        introName.style.transition = 'none';
        
        introRole.style.opacity = '1';
        introRole.style.transform = 'translateY(0)';
        introRole.style.transition = 'none';

        const createCursor = () => {
            const cursor = document.createElement('span');
            cursor.textContent = '|';
            cursor.style.color = 'var(--accent-primary)';
            cursor.style.animation = 'blink 0.7s infinite';
            cursor.style.fontWeight = '300';
            cursor.style.marginLeft = '5px';
            return cursor;
        };

        const typeText = (element, text, speed, callback) => {
            let i = 0;
            const textNode = document.createTextNode('');
            const cursor = createCursor();
            element.appendChild(textNode);
            element.appendChild(cursor);

            const interval = setInterval(() => {
                textNode.nodeValue += text.charAt(i);
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                    if (element.contains(cursor)) element.removeChild(cursor);
                    if (callback) callback();
                }
            }, speed);
        };

        setTimeout(() => {
            typeText(introName, nameText, 60, () => {
                typeText(introRole, roleText, 40, () => {
                    setTimeout(() => {
                        introName.classList.add('active');
                        introRole.classList.add('active');
                        
                        introName.style.opacity = '';
                        introName.style.transform = '';
                        introName.style.transition = '';
                        
                        introRole.style.opacity = '';
                        introRole.style.transform = '';
                        introRole.style.transition = '';
                        
                        setTimeout(() => {
                            introSplash.classList.add('hidden');
                            document.body.style.overflow = '';
                            
                            setTimeout(() => {
                                if(typeof initTypewriter === 'function') initTypewriter();
                            }, 800);
                        }, 50);
                    }, 800);
                });
            });
        }, 300);
    }

    // --- 1. Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Adding a slight delay to the outline for a smooth trailing effect
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover effect on clickable elements
        const clickables = document.querySelectorAll('a, button, input, textarea, .service-card, .project-card, .social-link');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hovered');
                cursorOutline.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hovered');
                cursorOutline.classList.remove('hovered');
            });
        });
    }

    // --- 2. Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- 3. Sticky Navigation ---
    const navbar = document.querySelector('.navbar');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // --- 4. Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link, .nav-cta');

    const toggleMenu = () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- 5. Scroll Reveal Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Remove the class when out of view so it disappears and reappears again
                entry.target.classList.remove('active');
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // --- 6. Active Navigation Link Update on Scroll ---
    const sections = document.querySelectorAll('section[id]');

    const navHighlighter = () => {
        let scrollY = window.scrollY;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);

            if (!navLink) return;

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', navHighlighter);

    // --- 7. Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 8. Dynamic Typewriter Effect for Hero Section ---
    const typewriterElement = document.querySelector('.typewriter-text');
    
    function initTypewriter() {
        if (typewriterElement) {
            const words = ['Mahmoud abdelmawgoud mahmoud', 'Premium Front-End Developer'];
            let wordIndex = 0;
            let charIndex = 0;
            let isDeleting = false;

            function type() {
                const currentWord = words[wordIndex];

                if (isDeleting) {
                    // Remove char
                    typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    // Add char
                    typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                    charIndex++;
                }

                // Speed adjustments
                let typeSpeed = isDeleting ? 50 : 100;

                // If word is completely typed
                if (!isDeleting && charIndex === currentWord.length) {
                    typeSpeed = 2000; // Pause at the end of word
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length; // Move to next word
                    typeSpeed = 500; // Pause before typing next word
                }

                setTimeout(type, typeSpeed);
            }

            // Start the effect
            setTimeout(type, 500);
        }
    }
    
    if (!document.querySelector('.intro-splash')) {
        initTypewriter();
    }

    // --- 9. 3D Tilt & Glow Effect on Cards ---
    const tiltCards = document.querySelectorAll('.service-card, .project-card, .code-window, .glass-banner');
    
    tiltCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease-out';
        });
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            
            // Mouse tracking glow
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Calculate angle for conic gradient border glow
            const angle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI;
            card.style.setProperty('--mouse-angle', `${angle + 90}deg`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = '';
            card.style.setProperty('--mouse-x', `50%`);
            card.style.setProperty('--mouse-y', `50%`);
        });
    });

    // --- 9.5 Timeline Scroll Animation ---
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        // Create progress line dynamically
        const progressLine = document.createElement('div');
        progressLine.classList.add('timeline-progress-line');
        timeline.prepend(progressLine);

        const timelineDots = document.querySelectorAll('.timeline-dot');
        
        const updateTimeline = () => {
            const timelineRect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Check if timeline is in view
            if (timelineRect.top < windowHeight && timelineRect.bottom > 0) {
                // Calculate how much of the timeline we have scrolled past
                let progress = ((windowHeight * 0.7) - timelineRect.top) / timelineRect.height;
                progress = Math.max(0, Math.min(1, progress));
                progressLine.style.height = `${progress * 100}%`;
                
                // Light up dots
                timelineDots.forEach(dot => {
                    const dotTop = dot.getBoundingClientRect().top;
                    if (dotTop < windowHeight * 0.7) {
                        dot.classList.add('active-dot');
                    } else {
                        dot.classList.remove('active-dot');
                    }
                });
            }
        };
        
        window.addEventListener('scroll', updateTimeline);
        updateTimeline();
    }

    // --- 10. Magnetic Buttons ---
    const magneticBtns = document.querySelectorAll('.btn:not(.nav-cta), .floating-socials .social-link');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });

    // --- 11. Scroll Progress Bar ---
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight * 100}%`;
            progressBar.style.width = scroll;
        });
    }

    // --- 12. Parallax Effect on Scroll ---
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    const bgGlows = document.querySelectorAll('.bg-glow');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        if (scrolled < window.innerHeight) { // Only animate when in hero section
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.4}px) scale(${1 - scrolled * 0.0005})`;
                heroContent.style.opacity = 1 - (scrolled * 0.002);
            }
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${scrolled * 0.2}px)`;
            }
            bgGlows.forEach((glow, index) => {
                const speed = index === 0 ? 0.3 : 0.6;
                // Get the base animation transform and combine it
                glow.style.transform = `translateY(${scrolled * speed}px)`;
            });
        } else {
             // Reset opacities/transforms if needed or let them stay
        }
    });

    // --- 13. Interactive Background Particles Animation ---
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-3'; // Behind everything
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let particlesArray = [];

    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();

    window.addEventListener('resize', () => {
        setCanvasSize();
        initParticles();
    });

    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            
            // Get current accent color dynamically
            const computedStyle = getComputedStyle(document.documentElement);
            const primaryColor = computedStyle.getPropertyValue('--accent-primary').trim() || '#6366F1';
            
            ctx.fillStyle = primaryColor;
            ctx.globalAlpha = 0.5;
            ctx.fill();
        }

        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Mouse interaction
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (mouse.x != null && distance < mouse.radius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (mouse.radius - distance) / mouse.radius;
                let directionX = forceDirectionX * force * 3;
                let directionY = forceDirectionY * force * 3;
                
                this.x -= directionX;
                this.y -= directionY;
            } else {
                this.x += this.directionX * 0.5;
                this.y += this.directionY * 0.5;
            }

            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 12000;
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 2) - 1;
            let directionY = (Math.random() * 2) - 1;
            
            particlesArray.push(new Particle(x, y, directionX, directionY, size));
        }
    }

    function connectParticles() {
        let opacityValue = 1;
        const computedStyle = getComputedStyle(document.documentElement);
        const primaryColor = computedStyle.getPropertyValue('--accent-primary').trim() || '#6366F1';

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 15000);
                    ctx.globalAlpha = opacityValue * 0.3;
                    ctx.strokeStyle = primaryColor;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        
        connectParticles();
    }

    initParticles();
    animateParticles();

});
