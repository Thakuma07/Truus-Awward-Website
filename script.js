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

// GSAP Truus-style Card Hover Animation
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

const isMobile = window.matchMedia('(max-width: 768px)').matches;

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
const brands = [
    { name: "oxxio", src: "https://cdn.prod.website-files.com/683863cbe1f5a81b667b9939/686bc2c07339dde8931c0c50_oxxio_logo.svg" },
    { name: "hema", src: "https://cdn.prod.website-files.com/683863cbe1f5a81b667b9939/686bc2d117d329bcecd8377b_hema_logo.svg" },
    { name: "kfc", src: "https://cdn.prod.website-files.com/683863cbe1f5a81b667b9939/686bc2b720d4c815b09435c2_KFC_Logo.svg" },
    { name: "swapfiets", src: "https://cdn.prod.website-files.com/683863cbe1f5a81b667b9939/686bc2d7cace3b14a9d8aa44_swapfiets_logo.svg" },
    { name: "anwb", src: "https://cdn.prod.website-files.com/683863cbe1f5a81b667b9939/686bc2a8f4b310a3d6a5ce7d_anwb_logo.svg" },
    { name: "netflix", src: "https://cdn.prod.website-files.com/683863cbe1f5a81b667b9939/686bc2d117d329bcecd8377b_hema_logo.svg" }, // Placeholder logo for netflix
    { name: "ace-tate", src: "https://cdn.prod.website-files.com/683863cbe1f5a81b667b9939/686bc299e71b345ff0fd4429_ace_tate_kigi.svg" },
    { name: "getir", src: "https://cdn.prod.website-files.com/683863cbe1f5a81b667b9939/686bc2d117d329bcecd8377b_hema_logo.svg" } // Placeholder logo for getir
];

const colors = [
    "var(--color-green)",
    "var(--color-lightblue)",
    "var(--color-darkblue)",
    "var(--color-lightgreen)",
    "var(--color-orange)",
    "var(--color-maroon)",
    "var(--color-pink)"
];

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
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

    tracks.forEach((track, trackIndex) => {
        const shuffledBrands = shuffleArray(brands);
        const shuffledColors = shuffleArray(colors);

        let trackContent = '';
        shuffledBrands.forEach((brand, index) => {
            const color = shuffledColors[index % shuffledColors.length];
            trackContent += createMarqueeItem(brand, color);
        });

        // On mobile: single set of items (grid layout, no infinite loop needed)
        // On desktop: duplicate for seamless vertical scroll
        track.innerHTML = isMobile ? trackContent : trackContent + trackContent;
    });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    populateMarquees();
} else {
    document.addEventListener('DOMContentLoaded', populateMarquees);
}

// Social Wiggle Animation
const wiggleElements = document.querySelectorAll('[data-wiggle]');

wiggleElements.forEach(element => {
    const intensity = parseFloat(element.getAttribute('data-wiggle')) || 5;
    const target = element.querySelector('[data-wiggle-target]') || element;

    // Set origin to center for proper wiggle
    gsap.set(target, { transformOrigin: "center center" });

    let wiggleTween;

    element.addEventListener('mouseenter', () => {
        wiggleTween = gsap.to(target, {
            rotation: intensity,
            duration: 0.14,
            repeat: -1,
            yoyo: true,
            ease: "steps(1)"
        });
    });

    element.addEventListener('mouseleave', () => {
        if (wiggleTween) {
            wiggleTween.kill();
            gsap.to(target, {
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
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

