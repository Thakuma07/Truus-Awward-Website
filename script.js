// ─── Animation Configurations ─────────────────────────────────────────────
const ANIMATION_CONFIG = {
    transitionScribble: {
        strokeWidthStart: "8%",      // Reduced for smaller stroke (was 8%)
        strokeWidthMax: "31%",       // Reduced for smaller stroke max coverage (was 31%)
        scale: 0.7,
        durationIn: 2.2,             // Fast 60fps draw phase
        durationOut: 2.7             // Fast 60fps erase phase
    }
};

// ─── Lenis Smooth Scroll ───────────────────────────────────────────────────
const lenis = new Lenis({
    duration: 1.2,          // scroll duration multiplier
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
    smoothWheel: true,      // smooth mouse-wheel scrolling
    touchMultiplier: 1.5,   // feel on touch devices
});

// Keep GSAP ScrollTrigger in sync with Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0); // prevent GSAP catching up after tab focus

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
const header = document.querySelector('.header-content');
const contentSection = document.querySelector('.content-section');
const footer = document.querySelector('.main-footer');

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const updateNavbarColor = () => {
    const scrollPos = window.scrollY + navbar.offsetHeight / 2;

    // Check which section we are currently in
    const headerRect = header.getBoundingClientRect();
    const contentRect = contentSection.getBoundingClientRect();
    const doubleMarquee = document.querySelector('.Double-marquee');
    const doubleMarqueeRect = doubleMarquee ? doubleMarquee.getBoundingClientRect() : null;
    const footerRect = footer.getBoundingClientRect();

    // Adjust for absolute scroll position
    const headerTop = headerRect.top + window.scrollY;
    const contentTop = contentRect.top + window.scrollY;
    const doubleMarqueeTop = doubleMarqueeRect ? doubleMarqueeRect.top + window.scrollY : Infinity;
    const footerTop = footerRect.top + window.scrollY;

    if (scrollPos >= footerTop) {
        navbar.classList.add('on-dark');
        navbar.classList.remove('on-light');
    } else if (scrollPos >= doubleMarqueeTop) {
        navbar.classList.add('on-light');
        navbar.classList.remove('on-dark');
    } else if (scrollPos >= contentTop) {
        navbar.classList.add('on-light');
        navbar.classList.remove('on-dark');
    } else {
        navbar.classList.add('on-dark');
        navbar.classList.remove('on-light');
    }
};

window.addEventListener('scroll', updateNavbarColor);
updateNavbarColor(); // Initial check

// Underline Animation on Scroll
gsap.to(".title-underline-svg path", {
    strokeDashoffset: 0,
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.3,
    scrollTrigger: {
        trigger: ".content-section",
        start: "top 70%", // Start when the top of the section is at 70% of the viewport height
        once: true // Only animate once
    }
});

// GSAP Truus-style Card Hover Animation — called after cards are injected into DOM
const isMobile = window.matchMedia('(max-width: 768px)').matches;
function initCardAnimations() {
    const cards = gsap.utils.toArray(".card");

    // Original rotations from CSS
    const originalData = [
        { rotation: 4 },
        { rotation: -5 },
        { rotation: 5 },
        { rotation: -8 },
        { rotation: 5 }
    ];

    let leaveTimeout = null;

    if (!isMobile) {
        cards.forEach((card, index) => {
            card.addEventListener("mouseenter", () => {
                // Cancel any pending reset from leaving a previous card
                if (leaveTimeout) {
                    clearTimeout(leaveTimeout);
                    leaveTimeout = null;
                }

                const hoverGap = 120;   // gap between hovered card and nearest neighbor
                const clusterGap = 150;  // small gap between clustered non-hovered cards
                const cardWidth = 320;

                const hoveredLeft = cards[index].offsetLeft;

                // Separate into left and right groups
                const leftCards = [];
                const rightCards = [];

                cards.forEach((otherCard, otherIndex) => {
                    if (otherIndex < index) leftCards.push({ card: otherCard, index: otherIndex });
                    else if (otherIndex > index) rightCards.push({ card: otherCard, index: otherIndex });
                });

                // Hovered card moves to common vertical axis (50px from top)
                const currentTop = cards[index].offsetTop;
                const targetCommonTop = 50;
                const moveY = targetCommonTop - currentTop;

                gsap.to(cards[index], {
                    x: 0,
                    y: moveY,
                    rotation: 0,
                    scale: 1.08,
                    duration: 0.9,
                    ease: "elastic.out(1, 0.5)",
                    overwrite: true
                });

                // Right cluster: nearest card always at hoverGap distance
                if (rightCards.length) {
                    const clusterStart = hoveredLeft + cardWidth + hoverGap;

                    rightCards.forEach((item, i) => {
                        const targetAbsLeft = clusterStart + (i * clusterGap);
                        // Ensure card always moves right, never toward hovered card
                        const targetX = Math.max(targetAbsLeft - item.card.offsetLeft, 10);

                        // Calculate vertical offset to move along the card's rotation axis
                        const angleRad = originalData[item.index].rotation * (Math.PI / 180);
                        const targetY = targetX * Math.tan(angleRad);

                        gsap.to(item.card, {
                            x: targetX,
                            y: targetY,
                            rotation: originalData[item.index].rotation,
                            scale: 1, // original size, no shrinking
                            duration: 1.0,
                            ease: "elastic.out(1, 0.5)",
                            overwrite: true
                        });
                    });
                }

                // Left cluster: nearest card always at hoverGap distance
                if (leftCards.length) {
                    leftCards.reverse(); // nearest card first
                    const clusterStart = hoveredLeft - hoverGap - cardWidth;

                    leftCards.forEach((item, i) => {
                        const targetAbsLeft = clusterStart - (i * clusterGap);
                        // Ensure card always moves left, never toward hovered card
                        const targetX = Math.min(targetAbsLeft - item.card.offsetLeft, -10);

                        // Calculate vertical offset to move along the card's rotation axis
                        const angleRad = originalData[item.index].rotation * (Math.PI / 180);
                        const targetY = targetX * Math.tan(angleRad);

                        gsap.to(item.card, {
                            x: targetX,
                            y: targetY,
                            rotation: originalData[item.index].rotation,
                            scale: 1, // original size, no shrinking,
                            duration: 1.0,
                            ease: "elastic.out(1, 0.5)",
                            overwrite: true
                        });
                    });
                }
            });

            card.addEventListener("mouseleave", () => {
                // Delay the reset so moving between cards feels seamless
                leaveTimeout = setTimeout(() => {
                    cards.forEach((c, i) => {
                        gsap.to(c, {
                            x: 0,
                            y: 0,
                            scale: 1,
                            rotation: originalData[i].rotation,
                            duration: 1.0,
                            ease: "elastic.out(1, 0.5)",
                            overwrite: true,
                            zIndex: i + 1
                        });
                    });
                }, 80);
            });
        });
    } else {
        // ─── Mobile: Stacked card scroll reveal ───
        const cardsWrapper = document.querySelector('.cards-wrapper');
        const scrollPerCard = window.innerHeight * 0.8; // scroll distance to reveal each card
        const navH = 60;
        const cardTopOffset = 90; // distance from top of viewport to card stack

        // Rotation for each card in the mobile stack
        const mobileRotations = [-6, 4, -8, 5, -3];

        // Position all cards absolutely, stacked at top-center of wrapper
        cards.forEach((card, i) => {
            gsap.set(card, {
                position: 'absolute',
                left: '50%',
                top: '0',
                xPercent: -50,
                y: i === 0 ? 0 : window.innerHeight * 1.1, // first card visible, rest off-screen below
                rotation: mobileRotations[i % mobileRotations.length],
                zIndex: i + 1,   // later cards sit on top
                transformOrigin: 'center center'
            });
        });

        // Set wrapper height to give enough room to scroll through all cards
        const wrapperH = window.innerHeight * 0.7 + scrollPerCard * (cards.length - 1);
        gsap.set(cardsWrapper, { height: wrapperH });

        // Pin the wrapper so the deck stays on screen while scrolling
        ScrollTrigger.create({
            trigger: cardsWrapper,
            start: `top ${navH}px`,
            end: `+=${scrollPerCard * (cards.length - 1)}`,
            pin: true,
            pinSpacing: true,
            id: 'mobile-cards-pin'
        });

        // Reveal each card from below as user scrolls
        cards.forEach((card, i) => {
            if (i === 0) return; // first card is already visible

            gsap.fromTo(card,
                { y: window.innerHeight * 1.1 },
                {
                    y: 0,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: cardsWrapper,
                        start: `top+=${(i - 1) * scrollPerCard} ${navH}px`,
                        end: `top+=${i * scrollPerCard} ${navH}px`,
                        scrub: 0.4
                    }
                }
            );
        });
    }
} // end initCardAnimations

// Double Marquee Section Animations
gsap.set(".marquee-left .marquee-svg-item:nth-child(2) path", { strokeDashoffset: 1000 });

const marqueeTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".Double-marquee",
        start: "top 70%",
        toggleActions: "play none none none",
        once: true
    }
});

marqueeTl.to(".marquee-underline", {
    scaleX: 1,
    opacity: 1,
    duration: 1,
    ease: "power2.out"
})
    .to(".marquee-left .marquee-svg-item:nth-child(1)", {
        scale: 1,
        opacity: 1,
        rotation: -10,
        duration: 0.6,
        ease: "back.out(1.7)"
    }, "-=0.5")
    .to(".marquee-left .marquee-svg-item:nth-child(2) path", {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power2.out"
    }, "-=0.3");

// Marquee Randomization Logic
// brands[] and colors[] are defined in data.js

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Shuffle brands so no two visually identical logos appear back-to-back.
// Compares by `src` (not name) so placeholder logos with the same image are caught too.
// Also ensures the last item ≠ first item (fixes the seamless-loop seam).
function shuffleNoAdjacentSrc(array) {
    const arr = shuffleArray([...array]);
    for (let i = 1; i < arr.length; i++) {
        if (arr[i].src === arr[i - 1].src) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[j].src !== arr[i - 1].src) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    break;
                }
            }
        }
    }
    // Fix seam: last item must differ from first (they'll be adjacent in the loop)
    if (arr[arr.length - 1].src === arr[0].src) {
        for (let j = 1; j < arr.length - 1; j++) {
            if (arr[j].src !== arr[0].src && arr[j].src !== arr[arr.length - 2].src) {
                [arr[arr.length - 1], arr[j]] = [arr[j], arr[arr.length - 1]];
                break;
            }
        }
    }
    return arr;
}

// Assign colors so no two consecutive cards share the same color,
// including across the seamless-loop seam (last → first wrap-around).
function assignColorsNoAdjacent(count, colorPool) {
    const result = [];
    for (let i = 0; i < count; i++) {
        const prev = i > 0 ? result[i - 1] : null;
        // On last item, also avoid matching the first (seam constraint)
        const seamColor = i === count - 1 ? result[0] : null;
        const available = colorPool.filter(c => c !== prev && c !== seamColor);
        const pool = available.length > 0 ? available : colorPool.filter(c => c !== prev);
        result.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    return result;
}

function createMarqueeItem(brand, color) {
    return `
        <div class="marquee-item" data-brand="${brand.name}" style="background-color: ${color}">
            <div class="marquee-logo">
                <div class="marquee-logo__before"></div>
                <img src="${brand.src}" loading="lazy" alt="${brand.name}" class="cover-image">
            </div>
        </div>
    `;
}

function populateMarquees() {
    const tracks = document.querySelectorAll('.marquee-track');
    if (!tracks.length) return;

    tracks.forEach((track) => {
        const shuffledBrands = shuffleNoAdjacentSrc(brands);
        const assignedColors = assignColorsNoAdjacent(shuffledBrands.length, colors);

        let trackContent = '';
        shuffledBrands.forEach((brand, index) => {
            trackContent += createMarqueeItem(brand, assignedColors[index]);
        });

        // On mobile: single set (grid layout, no loop needed)
        // On desktop: duplicate for seamless vertical scroll
        track.innerHTML = isMobile ? trackContent : trackContent + trackContent;
    });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    populateMarquees();
} else {
    document.addEventListener('DOMContentLoaded', populateMarquees);
}

// ─── Wiggle Animation ────────────────────────────────────────────────────────
// Intensities are controlled by WIGGLE_CONFIG in data.js — edit there.

function initWiggle(element, intensity) {
    const target = element.querySelector('[data-wiggle-target]') || element;
    gsap.set(target, { transformOrigin: 'center center' });
    let tween;
    element.addEventListener('mouseenter', () => {
        tween = gsap.to(target, { rotation: intensity, duration: 0.17, repeat: -1, yoyo: true, ease: 'steps(1)' });
    });
    element.addEventListener('mouseleave', () => {
        if (tween) { tween.kill(); gsap.to(target, { rotation: 0, duration: 0.3, ease: 'power2.out' }); }
    });
}

// Map each element to its WIGGLE_CONFIG key
const WIGGLE_TARGETS = [
    { selector: '.logo-truus', key: 'logoTruus' },
    { selector: '.footer-column:first-child h3', key: 'jobHeading' },
    { selector: '.footer-map-link span', key: 'googleMap' },
    { selector: '.footer-email', key: 'email' },
    { selector: '.footer-whatsapp', key: 'whatsapp' },
];

WIGGLE_TARGETS.forEach(({ selector, key }) => {
    document.querySelectorAll(selector).forEach(el => initWiggle(el, WIGGLE_CONFIG[key]));
});

// Dynamic Tab Title Change
const originalTitle = document.title;
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = "Hey, over here!👋 - Truus";
    } else {
        document.title = originalTitle;
    }
});

// ─── Footer Sticker Pop-Up Animation (on scroll, same as marquee Heart/Hand) ───
const footerStickers = gsap.utils.toArray('.footer-sticker');
const stickerRotations = [12, -10, 8, -12, 10, -8]; // one per sticker

// Set initial state — hidden, scaled down, slightly rotated
gsap.set(footerStickers, { scale: 0, opacity: 0, transformOrigin: 'center bottom' });
footerStickers.forEach((sticker, i) => {
    gsap.set(sticker, { rotation: stickerRotations[i % stickerRotations.length] });
});

gsap.to(footerStickers, {
    scale: 1,
    opacity: 1,
    rotation: (i) => stickerRotations[i % stickerRotations.length] * 0.7, // settle slightly
    duration: 0.7,
    ease: 'back.out(1.7)',
    stagger: 0.12,
    scrollTrigger: {
        trigger: '.footer-stickers',
        start: 'top 80%',
        once: true
    }
});

// ─── Footer Sticker — Cursor-Velocity Push ───────────────────────────────────
// Fast cursor swipe near a sticker → sticker shoves in that direction.
// Cursor stops → sticker automatically springs back to original position.
// Cursor ON the sticker → no effect.

footerStickers.forEach((sticker, i) => {
    const baseRotation = stickerRotations[i % stickerRotations.length] * 0.7;

    const PROXIMITY_RADIUS = 180;  // px — zone around sticker where push activates
    const STRENGTH = 4;            // multiplier on raw cursor delta
    const MAX_PUSH = 55;          // max displacement in px
    const MIN_SPEED = 3;           // ignore tiny slow drifts (px/event)

    let prevX = 0, prevY = 0;

    const clamp = (v, max) => Math.max(-max, Math.min(max, v));

    document.addEventListener('mousemove', (e) => {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        prevX = e.clientX;
        prevY = e.clientY;

        const rect = sticker.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

        // Is cursor physically ON the sticker?
        const onSticker = (
            e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom
        );

        const speed = Math.hypot(dx, dy);

        if (!onSticker && dist < PROXIMITY_RADIUS && speed > MIN_SPEED) {
            // Proximity falloff — weaker push farther from sticker
            const falloff = 1 - (dist / PROXIMITY_RADIUS);

            const pushX = clamp(dx * STRENGTH * falloff, MAX_PUSH);
            const pushY = clamp(dy * STRENGTH * falloff, MAX_PUSH);

            // 1) Snap to push position quickly
            gsap.killTweensOf(sticker);
            gsap.to(sticker, {
                x: pushX,
                y: pushY,
                rotation: baseRotation + pushX * 0.25,
                duration: 0.18,
                ease: 'power3.out'
            });

            // 2) Auto-spring back after the push settles
            gsap.to(sticker, {
                x: 0,
                y: 0,
                rotation: baseRotation,
                duration: 1.1,
                ease: 'elastic.out(1, 0.35)',
                delay: 0.18
            });
        }
    });
});



// ─── Footer Map Link — underline SVG hover draw/undraw animation ───
const footerMapLink = document.querySelector('.footer-map-link');
if (footerMapLink) {
    const mapSvgPaths = footerMapLink.querySelectorAll('.draw-btn__svg path');

    // Measure each path length and start fully drawn (visible)
    mapSvgPaths.forEach(path => {
        const length = path.getTotalLength();
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: 0   // fully visible at rest
        });
    });

    // On hover: wipe out then draw back in
    footerMapLink.addEventListener('mouseenter', () => {
        gsap.fromTo(mapSvgPaths,
            { strokeDashoffset: (i, el) => el.getTotalLength() },
            {
                strokeDashoffset: 0,
                duration: 0.5,
                ease: 'power2.out',
                stagger: 0.1,
                overwrite: true
            }
        );
    });

    // On leave: draw back in if interrupted
    footerMapLink.addEventListener('mouseleave', () => {
        gsap.to(mapSvgPaths, {
            strokeDashoffset: 0,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: true
        });
    });
}


// --- Footer Social Icons - injected from JS to reduce HTML size ---
// SOCIAL_ICONS[] is defined in data.js

function injectSocialIcons() {
    const container = document.getElementById('footer-socials');
    if (!container) return;
    container.innerHTML = SOCIAL_ICONS.map(({ href, label, svg }) =>
        '<a data-custom-cursor="click" href="' + href + '" target="_blank" rel="noopener noreferrer" class="single-social w-inline-block" aria-label="' + label + '">' + svg + '</a>'
    ).join('');
    container.querySelectorAll('.single-social').forEach(el => initWiggle(el, WIGGLE_CONFIG.socials));
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    injectSocialIcons();
} else {
    document.addEventListener('DOMContentLoaded', injectSocialIcons);
}

// --- Service Cards â€” generated from JS data to reduce HTML size ---
// CARDS_DATA[] is defined in data.js

const BULLET_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="16" class="services-card__bullet-svg" aria-hidden="true"><use href="#bullet-icon" /></svg>';

function buildCard({ color, sticker, title, services }) {
    const items = services.map(s => '<li>' + BULLET_SVG + s + '</li>').join('');
    return (
        '<div class="card card-' + color + '">' +
        '<div class="card-sticker sticker-' + sticker + '">' +
        '<img src="assets/Card-Sticker SVG/sticker-' + sticker + '.svg" alt="" width="100%" loading="lazy" aria-hidden="true">' +
        '</div>' +
        '<h3 class="card-title">' + title + '</h3>' +
        '<svg width="100%" height="10" class="card-divider-svg" aria-hidden="true"><use href="#card-divider" /></svg>' +
        '<ul class="card-list">' + items + '</ul>' +
        '</div>'
    );
}

function injectCards() {
    const wrapper = document.getElementById('cards-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = CARDS_DATA.map(buildCard).join('');
    initCardAnimations(); // bind GSAP hover now that cards are in the DOM
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    injectCards();
} else {
    document.addEventListener('DOMContentLoaded', injectCards);
}


// --- Footer Credits Pop-out Animation ---
const creditsWrapper = document.querySelector('.footer-credits-wrapper');
if (creditsWrapper) {
    const creditsBox = creditsWrapper.querySelector('.credits-box');
    const creditsTexts = creditsBox.querySelectorAll('.credits-label, .credits-name');

    // Create a timeline for the credits animation
    const creditsTl = gsap.timeline({
        paused: true,
        onReverseComplete: () => gsap.set(creditsBox, { visibility: 'hidden' })
    });

    creditsTl.fromTo(creditsBox,
        {
            scale: 0,
            opacity: 0,
            y: 50,
            x: 50,
            transformOrigin: "bottom right"
        },
        {
            scale: 1,
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.5,
            ease: "back.out(1.5)"
        }
    ).fromTo(creditsTexts,
        { y: "100%" },
        {
            y: "0%",
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out"
        },
        "-=0.3"
    );

    creditsWrapper.addEventListener('mouseenter', () => {
        gsap.set(creditsBox, { visibility: 'visible' });
        creditsTl.play();
    });

    creditsWrapper.addEventListener('mouseleave', () => {
        creditsTl.reverse();
    });
}


// --- Custom Cursor Bubble Logic ---
const cursorBubble = document.querySelector('.cursor-bubble');
if (cursorBubble) {
    const xTo = gsap.quickTo(cursorBubble, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(cursorBubble, "y", { duration: 0.5, ease: "power3" });

    let isHoveringClickable = false;

    // Set initial custom state so it spawns tilted the very first time
    gsap.set(cursorBubble, { rotation: -30 });

    window.addEventListener("mousemove", (e) => {
        // Offset bubble slightly from cursor tip
        xTo(e.clientX + 13);
        yTo(e.clientY - 43);
    });

    document.addEventListener("mouseover", (e) => {
        // Target specific elements requested by the user
        const targetSelector = '.footer-column h3, .footer-map-link span, .footer-email, .footer-whatsapp, .single-social, .logo-truus';
        const found = e.target.closest(targetSelector);

        if (found && !isHoveringClickable) {
            isHoveringClickable = true;
            if (found.matches('.logo-truus')) {
                cursorBubble.textContent = "to home";
            } else {
                cursorBubble.textContent = "click";
            }
            // Explicitly kill any pending delayed animations for these properties ONLY (preserves x/y mouse tracking)
            gsap.killTweensOf(cursorBubble, "opacity,scale,rotation");
            // Pop out with delay, starting from a tilted angle (set during hide)
            gsap.to(cursorBubble, { opacity: 1, scale: 1, rotation: 0, duration: 1.7, delay: 0.1, ease: "elastic.out(1, 0.4)" });
        } else if (!found && isHoveringClickable) {
            isHoveringClickable = false;
            // Explicitly kill pending pop-outs
            gsap.killTweensOf(cursorBubble, "opacity,scale,rotation");
            // Hide and tilt it so next time it starts tilted
            gsap.to(cursorBubble, { opacity: 1, scale: 0, rotation: -30, duration: 0.3, ease: "sine.inOut" });
        }
    });

    document.addEventListener("mouseleave", () => {
        if (isHoveringClickable) {
            isHoveringClickable = false;
            gsap.killTweensOf(cursorBubble, "opacity,scale,rotation");
            gsap.to(cursorBubble, { opacity: 1, scale: 0, rotation: -30, duration: 0.3, ease: "sine.inOut" });
        }
    });
}

// ─── Logo Click Transition ──────────────────────────────────────────────────
const logoTruusClickable = document.querySelector('.logo-truus');
const transitionScribblePath = document.querySelector('.transition-scribble path');
const transitionScribbleSvg = document.querySelector('.transition-scribble');

if (logoTruusClickable && transitionScribblePath && transitionScribbleSvg) {
    // Collect all colors from :root (except bg-color) for random selection
    const transitionColors = [
        'var(--color-green)',
        'var(--color-lightblue)',
        'var(--color-darkblue)',
        'var(--color-lightgreen)',
        'var(--color-orange)',
        'var(--color-maroon)',
        'var(--color-pink)'
    ];

    const runScribbleAnimation = (e) => {
        if (e) e.preventDefault();

        // Prevent multiple clicks while animating
        if (gsap.isTweening(transitionScribblePath) || gsap.isTweening(transitionScribbleSvg) || document.body.classList.contains('is-transitioning')) return;

        // Fetch settings from config object
        const config = ANIMATION_CONFIG.transitionScribble;
        const currentScale = config.scale;
        const durIn = config.durationIn || 0.8;
        const durOut = config.durationOut || 1.5;

        // Apply scale globally on the SVG
        gsap.set(transitionScribbleSvg, { scale: currentScale });

        const pathLength = transitionScribblePath.getTotalLength();
        const l = pathLength + 5; // tiny buffer

        // Pick a random non-repeating color (simplified version of their getNonRepeatingRandomTheme)
        const randomColor = transitionColors[Math.floor(Math.random() * transitionColors.length)];
        transitionScribbleSvg.style.color = randomColor;

        // Contrast: if the scribble is a light color, make logo black. Otherwise, white.
        const lightColors = ['var(--color-lightblue)', 'var(--color-lightgreen)', 'var(--color-pink)'];
        const logoColor = lightColors.includes(randomColor) ? '#000' : '#fff';

        // Create transition logo if missing
        let transitionLogo = document.querySelector('.transition-logo');
        if (!transitionLogo) {
            transitionLogo = document.createElement('div');
            transitionLogo.className = 'transition-logo';
            transitionLogo.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); z-index:10000; pointer-events:none; opacity:0; display:flex; justify-content:center; align-items:center; transition: color 0.1s;';
            const svgClone = document.querySelector('.logo-truus').cloneNode(true);
            svgClone.style.width = '150px';
            svgClone.style.height = 'auto';
            transitionLogo.appendChild(svgClone);
            document.body.appendChild(transitionLogo);
        }

        // Apply dynamic contrast logo color for the current scribble pass
        transitionLogo.style.color = logoColor;

        // Set initial states (equivalent to drawSVG: '0% 0%')
        gsap.set(transitionScribblePath, {
            strokeDasharray: l,
            strokeDashoffset: l,
            strokeWidth: config.strokeWidthStart,
            opacity: 1
        });
        gsap.set(transitionScribbleSvg, { opacity: 1, x: 0, y: 0, rotation: 0 });
        gsap.set(transitionLogo, { opacity: 0, scale: 1 });

        // Hide cursor bubble and disable pointer events
        document.body.classList.add('is-transitioning');
        const cursorBubble = document.querySelector('.cursor-bubble');
        if (cursorBubble) gsap.to(cursorBubble, { opacity: 0, duration: 0.2 });

        let drawTl = gsap.timeline({
            onComplete: () => {
                document.body.classList.remove('is-transitioning');
                gsap.set(transitionScribblePath, { strokeWidth: "0%" });
                gsap.set(transitionLogo, { opacity: 0 });
            }
        });

        // 1. Draw from A to B (equivalent to drawSVG: '0% 100%')
        drawTl.to(transitionScribblePath, {
            strokeDashoffset: 0,
            duration: durIn,
            ease: "power1.inOut"
        }, 0);

        drawTl.to(transitionScribblePath, {
            strokeWidth: config.strokeWidthMax,
            duration: durIn,
            ease: "power2.inOut"
        }, 0);

        // Mask transition: scroll to top exactly when the screen is fully masked
        drawTl.call(() => {
            if (typeof lenis !== 'undefined') {
                lenis.scrollTo(0, { immediate: true });
            } else {
                window.scrollTo(0, 0);
            }
        }, null, durIn);

        // 2. Remove from A to B (equivalent to drawSVG: '100% 100%')
        drawTl.to(transitionScribblePath, {
            strokeDashoffset: -l,
            duration: durOut,
            ease: "power2.inOut"
        }, durIn);

        drawTl.to(transitionScribblePath, {
            strokeWidth: config.strokeWidthStart,
            duration: durOut,
            ease: "power2.inOut"
        }, durIn);

        // 3. Logo Animation (AutoAlpha 1 at 0.4s, AutoAlpha 0 at 1.5s as per Truus logic)
        // Ensure starting state
        drawTl.set(transitionLogo, { autoAlpha: 0 }, 0);

        drawTl.to(transitionLogo, {
            autoAlpha: 1,
            duration: durIn * 0.5,
            ease: "power2.out",
            onStart: () => {
                // Apply continuous wiggle effect
                gsap.to(transitionLogo.querySelector('svg'), {
                    rotation: 5,
                    duration: 0.15,
                    repeat: -1,
                    yoyo: true,
                    ease: "steps(1)",
                    overwrite: "auto"
                });
            }
        }, durIn * 0.5);

        // Vanish exactly when the scribble "whip" passes it. Like a cloth wiping a table.
        // Zero duration = no fade, no shrink, no move, no clip-path. Just a clean disappearance.
        drawTl.set(transitionLogo, {
            autoAlpha: 0,
            onComplete: () => {
                gsap.killTweensOf(transitionLogo.querySelector('svg'));
                gsap.set(transitionLogo.querySelector('svg'), { rotation: 0 });
            }
        }, durIn + (durOut * 0.48));
    };

    // Attach to real logo
    logoTruusClickable.addEventListener('click', runScribbleAnimation);

    // Run the animation automatically on initial load or reload
    window.addEventListener('load', () => {
        // Add a tiny delay to ensure everything is visually ready before starting the "reveal"
        setTimeout(() => {
            runScribbleAnimation(null);
        }, 100);
    });
}
