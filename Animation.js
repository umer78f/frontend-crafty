// Initialize smooth scroll instance
const locomotiveScroll = new LocomotiveScroll();

/* ==========================================
   NAVIGATION & UI CONTROLS
   ========================================== */

function hideNav() {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Keep header visible at top
        if (currentScrollY <= 0) {
            header.classList.remove('header--hidden');
            return;
        }

        // Toggle header visibility based on scroll direction
        if (currentScrollY > lastScrollY && !header.classList.contains('header--hidden')) {
            header.classList.add('header--hidden');
        } else if (currentScrollY < lastScrollY && header.classList.contains('header--hidden')) {
            header.classList.remove('header--hidden');
        }

        lastScrollY = currentScrollY;
    }, { passive: true });
}
function navControl() {
    const nav = document.querySelector('.nav');
    const navClose = document.querySelectorAll('.navClose');
    const navOpen = document.querySelector('.humburger');
    const navLinks = document.querySelectorAll('.navLinks p a');
    const borderLines = document.querySelectorAll('.navLinks p');

    if (!nav || !navClose || !navOpen) return;

    // Set initial GSAP properties to avoid initial layout pop
    gsap.set(nav, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        visibility: "visible"
    });
    gsap.set(navLinks, { y: "120%", rotate: 3 });

    // Master Timeline
    const tl = gsap.timeline({ paused: true, reversed: true });

    tl.to(nav, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.85,
        ease: "power4.inOut"
    })
        .to(borderLines, {
            borderBottomColor: "rgba(169, 176, 231, 1)",
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out"
        }, "-=0.4")
        .to(navLinks, {
            y: "0%",
            rotate: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: "power3.out"
        }, "-=0.5");

    // Event Listeners
    navOpen.addEventListener('click', () => {
        if (tl.reversed()) tl.play();
    });

    navClose.forEach(e => {
        e.addEventListener('click', () => {
            if (!tl.reversed()) tl.reverse();
        });
    })


    // Close menu automatically on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => tl.reverse());
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', navControl);
function initCalculator() {
    const rateInput = document.getElementById('rateInput');
    const hoursInput = document.getElementById('hoursInput');
    const rateValue = document.getElementById('rateValue');
    const hoursValue = document.getElementById('hoursValue');
    const formulaText = document.getElementById('formulaText');
    const totalLoss = document.getElementById('totalLoss');

    if (!rateInput || !hoursInput) return;

    const ALINA_RATE = 19;

    function updateCalculator() {
        const userRate = parseInt(rateInput.value, 10) || 0;
        const hours = parseInt(hoursInput.value, 10) || 0;

        const rateDiff = Math.max(0, userRate - ALINA_RATE);
        const annualLoss = rateDiff * hours * 12;

        rateValue.textContent = userRate;
        hoursValue.textContent = hours;
        formulaText.textContent = `$${userRate} x ${hours} x 12 months =`;
        totalLoss.textContent = `$${annualLoss.toLocaleString()}`;
    }

    rateInput.addEventListener('input', updateCalculator);
    hoursInput.addEventListener('input', updateCalculator);

    updateCalculator();
}

function initCursorFollower() {
    if (window.matchMedia('(hover: none)').matches) return;

    document.querySelectorAll('.work').forEach((work) => {
        const card = work.querySelector('.workCard');
        if (!card) return;

        work.addEventListener('mousemove', (e) => {
            const rect = work.getBoundingClientRect();
            gsap.to(card, {
                x: e.clientX - rect.left - card.offsetWidth / 2,
                y: e.clientY - rect.top - card.offsetHeight / 2,
                duration: 1,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        work.addEventListener('mouseenter', () => {
            gsap.to(card, { autoAlpha: 1, scale: 1, duration: 0.4 });
        });

        work.addEventListener('mouseleave', () => {
            gsap.to(card, { autoAlpha: 0, scale: 0.9, duration: 0.3 });
        });
    });
}

function initTiltEffect() {
    if (window.matchMedia('(hover: none)').matches) return;

    const cards = document.querySelectorAll('.priceCard');

    cards.forEach((card) => {
        gsap.set(card, { transformPerspective: 1000 });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            gsap.to(card, {
                rotateY: x * 20,
                rotateX: -y * 20,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.6,
                ease: "power2.out",
                overwrite: "auto"
            });
        });
    });
}

/* ==========================================
   GSAP ANIMATIONS
   ========================================== */

function heroAnimation() {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
        }
    });

    tl.to(['.heroTitle', '.heroBottom'], {
        scale: 0.9,
        ease: "power2.out"
    }, 0)
        .to('.heroImg img', {
            opacity: 0.5,
            filter: "blur(9px)"
        }, 0)
        .to('.heroNav', {
            opacity: 0,
            stagger: 0.1,
            ease: "power2.out",
        }, 0);
}

function section2Animation() {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".section2",
            start: "top 220%",
            end: "bottom top",
            scrub: 1
        }
    });

    tl.from('.section2 h1', {
        y: -100,
        opacity: 0
    });
}

function section3Animation() {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 601px)", () => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.section3',
                start: "top top",
                end: "+=300%",
                pin: true,
                scrub: true,
            }
        });

        tl.to(".section3Content", {
            '--clip': "100%",
            duration: 1,
            ease: "power2.inOut"
        }, 0)
            .from('.section3Content h1', {
                y: 140,
                duration: 1,
                ease: "power2.out"
            }, 0);

        return () => tl.kill();
    });
    mm.add("(max-width: 601px)", () => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.section3Content',
                start: "top 100%",
                end: "+=100%",
                scrub: 0.7
            }
        });

        tl.to(".section3Content", {
            '--clip': "100%",
            duration: 1,
            ease: "power2.inOut"
        }, 0)
            .from('.section3Content h1', {
                y: 140,
                duration: 1,
                ease: "power2.out"
            }, 0);
    });
}

function section4Animation() {
    let mm = gsap.matchMedia();
    mm.add('(min-width:600px)', () => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.section4',
                start: "top top",
                end: "+=300%",
                pin: true,
                scrub: 0.8,
            }
        });

        tl.to('.work', {
            x: '-200%',
        });
    })
    mm.add('(max-width:600px)', () => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.section4',
                start: "top top",
                end: "+=100%",
                pin: true,
                scrub: true,
            }
        });

        tl.to('.work', {
            x: '-200%'
        });
    })

}

function comparisonAnimation() {
    const mm = gsap.matchMedia();

    mm.add("(max-width: 600px)", () => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.sec5Sticky',
                start: "top 60%",
                end: "+=75%",
                pin: true,
                scrub: 1,
            }
        });
        return () => tl.kill();
    });

    mm.add("(min-width: 601px)", () => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.sec5Sticky',
                start: "top 40%",
                end: "+=100%",
                pin: true,
                scrub: 1,
            }
        });

        const animOut = { scale: 1.2, opacity: 1, stagger: 0.3, fontWeight: "bold", ease: "power2.inOut" };
        const animIn = { scale: 1, opacity: 0.8, stagger: 0.3, fontWeight: "normal", ease: "power2.inOut" };

        tl.to('.section5 .alina ul li', { ...animOut, x: -70 }, 0)
            .to('.section5 .freelancer ul li', { ...animOut, x: 70 }, 0)
            .to('.section5 .alina ul li', { ...animIn, x: 0 }, 1)
            .to('.section5 .freelancer ul li', { ...animIn, x: 0 }, 1);

        return () => tl.kill();
    });
}

function section6Animation() {
    const mm = gsap.matchMedia();

    const createSection6Tl = (start, end) => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.section6',
                start: start,
                end: end,
                scrub: 0.7,
            }
        });

        tl.from('.saveMoney div h1', {
            y: 100,
            opacity: 0,
            stagger: 0.1,
            ease: "power2.inOut"
        });

        return () => tl.kill();
    };

    mm.add('(min-width: 601px)', () => createSection6Tl("top 60%", "+=120%"));
    mm.add('(max-width: 600px)', () => createSection6Tl("top 100%", "+=80%"));
}

function formAnimation() {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 600px)', () => {
        document.querySelectorAll('.contactRow p').forEach(p => {
            const text = p.textContent;
            p.innerHTML = Array.from(text)
                .map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`)
                .join('');
        });

        const textAnim = { opacity: 0, stagger: 0.3, ease: 'power2.out' };
        const buttonAnim = { opacity: 0, y: 30, stagger: 1, ease: 'power2.out' };

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.contactForm',
                start: 'top t',
                end: '+=600%',
                scrub: 0.3,
                pin: true
            }
        });

        tl.from('#p1 span', textAnim)
            .to('.inputWrapper1', { '--line-width': '100%' })
            .from('#inp1', { opacity: 0 })

            .from('#p2 span', textAnim)
            .to('.inputWrapper2', { '--line-width': '100%' })
            .from('#inp2', { opacity: 0 })

            .from('#p3 span', textAnim)
            .from('.contactRow:nth-child(2) button', buttonAnim)

            .from('#p4 span', textAnim)
            .to('.inputWrapper3', { '--line-width': '100%' })
            .from('#inp3', { opacity: 0 })
            .from('.contactRow:nth-child(3) button', buttonAnim)

            .from('#p5 span', textAnim)
            .to('.inputWrapper4', { '--line-width': '100%' })
            .from('#inp4', { opacity: 0, duration: 3, ease: 'power2.inOut' })
            .from('.sendForm', { opacity: 0 })

            .to('.formContainer', {
                backgroundImage: 'linear-gradient(90deg, rgba(245, 207, 253, 0.84) 0%, rgba(188, 220, 253, 0.9) 45%, rgba(188, 220, 253, 0.9) 100%)',
                duration: 1,
                ease: 'power2.inOut'
            })
            .to('.formContainer p, .formContainer input', {
                color: '#000000',
                duration: 1,
                ease: 'power2.inOut'
            }, 'a')
            .to('.formContainer button', {
                borderColor: '#000000',
                duration: 1,
                ease: 'power2.inOut'
            }, 'a');

        return () => tl.kill();
    });
}

/* ==========================================
   INITIALIZATION & RESIZE LISTENERS
   ========================================== */
navControl()
hideNav();
heroAnimation();
section2Animation();
section3Animation();
section4Animation();
initCursorFollower();
section6Animation();
comparisonAnimation();
initCalculator();
initTiltEffect();
formAnimation();

document.addEventListener('DOMContentLoaded', () => ScrollTrigger.refresh());

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
});