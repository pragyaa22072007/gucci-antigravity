/* ===================================
   GUCCI ANTI-GRAVITY — JavaScript
   Physics Engine, Particles & Interactions
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ========== Custom Cursor ========== */
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // cursor hover states
    const hoverElements = document.querySelectorAll('a, button, .product-card, .gallery-item, .showcase-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });

    /* ========== Particle Canvas Background ========== */
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 60;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.life = Math.random() * 600 + 200;
            this.maxLife = this.life;
            this.hue = 38 + Math.random() * 10; // gold range
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;

            // mouse attraction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                this.speedX += dx * 0.00008;
                this.speedY += dy * 0.00008;
            }

            // damping
            this.speedX *= 0.999;
            this.speedY *= 0.999;

            if (this.life <= 0 || this.x < -20 || this.x > canvas.width + 20 ||
                this.y < -20 || this.y > canvas.height + 20) {
                this.reset();
            }
        }
        draw() {
            const fadeRatio = Math.min(this.life / 60, (this.maxLife - this.life + 60) / 60, 1);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 55%, 65%, ${this.opacity * fadeRatio})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(201, 169, 110, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(drawParticles);
    }
    drawParticles();

    /* ========== Navbar Scroll Effect ========== */
    const navbar = document.getElementById('navbar');
    const scrollIndicator = document.getElementById('scrollIndicator');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        if (scrollIndicator) {
            scrollIndicator.style.opacity = Math.max(0, 1 - scrollY / 300);
        }
    });

    /* ========== Mobile Menu ========== */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    /* ========== Smooth Scroll ========== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                if (navLinks) navLinks.classList.remove('open');
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ========== Scroll Reveal (Intersection Observer) ========== */
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ========== Counter Animation ========== */
    const statElements = document.querySelectorAll('.highlight-stat');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                const numberEl = entry.target.querySelector('.stat-number');
                animateCounter(numberEl, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    statElements.forEach(el => counterObserver.observe(el));

    function animateCounter(element, target) {
        const duration = 2000;
        const startTime = performance.now();
        const start = 0;

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease out quart
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * eased);
            element.textContent = current.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }
        requestAnimationFrame(tick);
    }

    /* ========== Parallax on Hero ========== */
    const hero = document.getElementById('hero');
    const heroContent = hero ? hero.querySelector('.hero-content') : null;

    window.addEventListener('scroll', () => {
        if (heroContent) {
            const scrollY = window.scrollY;
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroContent.style.opacity = Math.max(0, 1 - scrollY / 600);
        }
    });

    /* ========== Product Card Tilt Effect ========== */
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    /* ========== ANTI-GRAVITY ENGINE ========== */
    const antiGravityBtn = document.getElementById('antiGravityBtn');
    const triggerGravity = document.getElementById('triggerGravity');
    const resetGravity = document.getElementById('resetGravity');
    const gravityOverlay = document.getElementById('gravityOverlay');

    let antiGravityActive = false;
    let floatingElements = [];
    let animationFrameId = null;
    let dragTarget = null;
    let dragOffset = { x: 0, y: 0 };

    class FloatingItem {
        constructor(el) {
            this.el = el;
            const rect = el.getBoundingClientRect();
            this.x = rect.left + window.scrollX;
            this.y = rect.top + window.scrollY;
            this.w = rect.width;
            this.h = rect.height;
            this.screenX = rect.left;
            this.screenY = rect.top;
            this.vx = (Math.random() - 0.5) * 3;
            this.vy = (Math.random() - 0.5) * 3 - 1; // slight upward bias
            this.rotation = 0;
            this.rotationSpeed = (Math.random() - 0.5) * 1.5;
            this.mass = 1 + Math.random();
            this.isDragged = false;
        }

        update() {
            if (this.isDragged) return;

            // anti-gravity (gentle float upward)
            this.vy -= 0.015;

            // mouse gravitational attraction
            const dx = mouseX - (this.screenX + this.w / 2);
            const dy = mouseY - (this.screenY + this.h / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 350 && dist > 30) {
                const force = 0.15 / (dist * 0.01);
                this.vx += (dx / dist) * force * 0.01;
                this.vy += (dy / dist) * force * 0.01;
            }

            // random drift
            this.vx += (Math.random() - 0.5) * 0.03;
            this.vy += (Math.random() - 0.5) * 0.03;

            // velocity clamping
            const maxSpeed = 4;
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > maxSpeed) {
                this.vx = (this.vx / speed) * maxSpeed;
                this.vy = (this.vy / speed) * maxSpeed;
            }

            // damping
            this.vx *= 0.995;
            this.vy *= 0.995;

            // update position
            this.screenX += this.vx;
            this.screenY += this.vy;
            this.rotation += this.rotationSpeed;

            // boundary collision
            const padding = 10;
            if (this.screenX < padding) {
                this.screenX = padding;
                this.vx *= -0.6;
                this.rotationSpeed *= -0.8;
            }
            if (this.screenX + this.w > window.innerWidth - padding) {
                this.screenX = window.innerWidth - this.w - padding;
                this.vx *= -0.6;
                this.rotationSpeed *= -0.8;
            }
            if (this.screenY < padding) {
                this.screenY = padding;
                this.vy *= -0.6;
                this.rotationSpeed *= -0.8;
            }
            if (this.screenY + this.h > window.innerHeight - padding) {
                this.screenY = window.innerHeight - this.h - padding;
                this.vy *= -0.6;
                this.rotationSpeed *= -0.8;
            }

            // slow down rotation
            this.rotationSpeed *= 0.998;

            // apply transform
            this.el.style.left = this.screenX + 'px';
            this.el.style.top = this.screenY + 'px';
            this.el.style.transform = `rotate(${this.rotation}deg)`;
        }
    }

    function activateAntiGravity() {
        if (antiGravityActive) return;
        antiGravityActive = true;

        // scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            document.body.classList.add('anti-gravity-mode');
            gravityOverlay.classList.add('active');

            const floatables = document.querySelectorAll('.floatable');
            floatingElements = [];

            floatables.forEach((el, i) => {
                const rect = el.getBoundingClientRect();
                const item = new FloatingItem(el);
                item.screenX = rect.left;
                item.screenY = rect.top;

                el.classList.add('anti-gravity-active');
                el.style.width = rect.width + 'px';
                el.style.height = rect.height + 'px';
                el.style.left = rect.left + 'px';
                el.style.top = rect.top + 'px';

                // staggered impulse
                setTimeout(() => {
                    item.vx = (Math.random() - 0.5) * 6;
                    item.vy = -Math.random() * 4 - 2;
                    item.rotationSpeed = (Math.random() - 0.5) * 3;
                }, i * 60);

                floatingElements.push(item);
            });

            // start physics loop
            function physicsLoop() {
                floatingElements.forEach(item => item.update());

                // simple collision between elements
                for (let i = 0; i < floatingElements.length; i++) {
                    for (let j = i + 1; j < floatingElements.length; j++) {
                        const a = floatingElements[i];
                        const b = floatingElements[j];
                        const dx = (a.screenX + a.w / 2) - (b.screenX + b.w / 2);
                        const dy = (a.screenY + a.h / 2) - (b.screenY + b.h / 2);
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const minDist = (a.w + b.w) / 3;
                        if (dist < minDist && dist > 0) {
                            const nx = dx / dist;
                            const ny = dy / dist;
                            const overlap = minDist - dist;
                            a.screenX += nx * overlap * 0.3;
                            a.screenY += ny * overlap * 0.3;
                            b.screenX -= nx * overlap * 0.3;
                            b.screenY -= ny * overlap * 0.3;
                            // exchange velocities
                            const dvx = a.vx - b.vx;
                            const dvy = a.vy - b.vy;
                            a.vx -= dvx * 0.3;
                            a.vy -= dvy * 0.3;
                            b.vx += dvx * 0.3;
                            b.vy += dvy * 0.3;
                        }
                    }
                }

                if (antiGravityActive) {
                    animationFrameId = requestAnimationFrame(physicsLoop);
                }
            }
            physicsLoop();
        }, 400);
    }

    function deactivateAntiGravity() {
        antiGravityActive = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        document.body.classList.remove('anti-gravity-mode');
        gravityOverlay.classList.remove('active');

        floatingElements.forEach(item => {
            item.el.classList.remove('anti-gravity-active');
            item.el.style.position = '';
            item.el.style.left = '';
            item.el.style.top = '';
            item.el.style.width = '';
            item.el.style.height = '';
            item.el.style.transform = '';
            item.el.style.zIndex = '';
        });

        floatingElements = [];
    }

    // Drag handling
    document.addEventListener('mousedown', (e) => {
        if (!antiGravityActive) return;
        floatingElements.forEach(item => {
            const rect = item.el.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                dragTarget = item;
                dragTarget.isDragged = true;
                dragOffset.x = e.clientX - item.screenX;
                dragOffset.y = e.clientY - item.screenY;
                item.vx = 0;
                item.vy = 0;
                item.rotationSpeed = 0;
            }
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (dragTarget) {
            dragTarget.screenX = e.clientX - dragOffset.x;
            dragTarget.screenY = e.clientY - dragOffset.y;
            dragTarget.el.style.left = dragTarget.screenX + 'px';
            dragTarget.el.style.top = dragTarget.screenY + 'px';
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (dragTarget) {
            dragTarget.isDragged = false;
            // fling based on approximate mouse velocity
            dragTarget.vx = (Math.random() - 0.5) * 4;
            dragTarget.vy = (Math.random() - 0.5) * 4;
            dragTarget = null;
        }
    });

    // Button bindings
    if (antiGravityBtn) antiGravityBtn.addEventListener('click', activateAntiGravity);
    if (triggerGravity) triggerGravity.addEventListener('click', activateAntiGravity);
    if (resetGravity) resetGravity.addEventListener('click', deactivateAntiGravity);

    /* ========== Escape Key to Reset ========== */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && antiGravityActive) {
            deactivateAntiGravity();
        }
    });

    /* ========== Gallery Lightbox ========== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            if (antiGravityActive) return;
            const img = item.querySelector('img');
            if (!img) return;

            // create lightbox
            const lightbox = document.createElement('div');
            lightbox.style.cssText = `
                position: fixed; inset: 0; z-index: 99999;
                background: rgba(0,0,0,0.92); backdrop-filter: blur(20px);
                display: flex; align-items: center; justify-content: center;
                cursor: none; opacity: 0; transition: opacity 0.4s;
            `;

            const lightboxImg = document.createElement('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxImg.style.cssText = `
                max-width: 85vw; max-height: 85vh; object-fit: contain;
                border: 1px solid rgba(201,169,110,0.3); border-radius: 4px;
                transform: scale(0.9); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
            `;

            const closeBtn = document.createElement('button');
            closeBtn.textContent = '✕';
            closeBtn.style.cssText = `
                position: absolute; top: 30px; right: 30px;
                background: none; border: 1px solid rgba(201,169,110,0.4);
                color: #C9A96E; font-size: 20px; width: 44px; height: 44px;
                cursor: none; transition: all 0.3s;
                display: flex; align-items: center; justify-content: center;
            `;

            lightbox.appendChild(lightboxImg);
            lightbox.appendChild(closeBtn);
            document.body.appendChild(lightbox);

            requestAnimationFrame(() => {
                lightbox.style.opacity = '1';
                lightboxImg.style.transform = 'scale(1)';
            });

            const closeLightbox = () => {
                lightbox.style.opacity = '0';
                lightboxImg.style.transform = 'scale(0.9)';
                setTimeout(() => lightbox.remove(), 400);
            };

            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) closeLightbox();
            });
        });
    });

    /* ========== Magnetic Button Effect ========== */
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .anti-gravity-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    /* ========== Text Scramble for Hero Badge ========== */
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        const originalText = heroBadge.textContent;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        function scramble() {
            let iterations = 0;
            const maxIterations = originalText.length;

            const interval = setInterval(() => {
                heroBadge.textContent = originalText.split('')
                    .map((char, index) => {
                        if (index < iterations) return originalText[index];
                        if (char === ' ') return ' ';
                        return chars[Math.floor(Math.random() * chars.length)];
                    }).join('');

                iterations += 1 / 2;
                if (iterations >= maxIterations) {
                    clearInterval(interval);
                    heroBadge.textContent = originalText;
                }
            }, 40);
        }

        // scramble on hover
        heroBadge.addEventListener('mouseenter', scramble);
        // initial scramble after page load
        setTimeout(scramble, 1500);
    }

    /* ========== Explore Button Scroll ========== */
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
        });
    }

    /* ========== Page Load Animation ========== */
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });

});
