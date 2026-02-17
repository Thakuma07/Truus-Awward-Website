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
        navbar.classList.add('on-light');
        navbar.classList.remove('on-dark');
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
    { rotation: -10 },
    { rotation: 5 },
    { rotation: -8 },
    { rotation: 5 }
];

cards.forEach((card, index) => {
    card.addEventListener("mouseenter", () => {
        const overlap = 100;
        const hoverGap = 150;

        cards.forEach((otherCard, otherIndex) => {
            const diff = otherIndex - index;
            const stackIndex = Math.abs(diff) - 1;

            if (otherIndex === index) {
                gsap.to(otherCard, {
                    x: 0,
                    y: 0,
                    rotation: 0,
                    scale: 1.08,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.5)",
                    overwrite: true
                });
            } else {
                let targetX;
                if (otherIndex < index) {
                    targetX = -hoverGap - (stackIndex * overlap);
                } else {
                    targetX = hoverGap + (stackIndex * overlap);
                }

                gsap.to(otherCard, {
                    x: targetX,
                    y: diff * 15,
                    rotation: originalData[otherIndex].rotation * 0.5,
                    scale: 0.95,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.5)",
                    overwrite: true
                });
            }
        });
    });

    card.addEventListener("mouseleave", () => {
        cards.forEach((c, i) => {
            gsap.to(c, {
                x: 0,
                y: 0,
                scale: 1,
                rotation: originalData[i].rotation,
                duration: 0.8,
                ease: "elastic.out(1, 0.5)",
                overwrite: true,
                zIndex: i + 1
            });
        });
    });
});

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

        track.innerHTML = trackContent + trackContent;
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
            duration: 0.3,
            repeat: -1,
            yoyo: true,
            ease: "steps(4)"
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
