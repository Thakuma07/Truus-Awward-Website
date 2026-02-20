# Truus.co — Awwward-Winning Web Design Clone

A highly interactive, visually stunning recreation of the **Truus.co** website, built with modern frontend technologies and focused on premium user experience and animations. This project was developed using **Antigravity AI** to demonstrate elite-level web development practices.

<img width="1920" height="1080" alt="Screenshot 2026-02-20 110602" src="https://github.com/user-attachments/assets/cb80f406-998e-4853-9ea5-7dec87952117" />
<img width="1920" height="1080" alt="Screenshot 2026-02-20 110610" src="https://github.com/user-attachments/assets/9ca5af12-5e0b-4b81-954c-1dcb484c671a" />


## 🚀 Overview

This project is a high-fidelity clone of the Truus advertising agency website. It captures the bold aesthetics, playful interactivity, and smooth motion design that are characteristic of Awwward-winning websites. The codebase is built with vanilla technologies to ensure maximum performance and control over every frame of animation.

## ✨ Key Features

-   **Dynamic Navigation System**: Context-aware navbar that automatically adapts its color theme (light/dark) based on the current scroll section.
-   **JS-Driven DOM**: Service cards, social icons, and marquee logos are all injected at runtime from clean JS data arrays — keeping `index.html` lean and maintainable.
-   **Elastic Card Interactions**: Custom GSAP-powered hover effects on service cards, featuring horizontal repulsion, elastic scaling, and smooth clustering.
-   **Dual-Direction Randomized Marquees**: An infinite scrolling logo section with randomized brand placement and background colors for a fresh experience on every visit.
-   **Scroll-Triggered SVG Animations**: Hand-drawn style underlines and path animations that reveal themselves as the user explores the page.
-   **High-End Typography**: Integration of premium variable fonts (*Epilogue* and *DM Sans*) for a brutalist yet polished look.
-   **Interactive Micro-details**:
    -   Visibility-triggered tab titles ("Hey, over here!👋") to re-engage users.
    -   Haptic-style wiggling social icons with GSAP.
    -   Custom cursor implementation.
-   **Optimized SVG System**: A three-tier SVG strategy for maximum performance.
-   **Responsive & Semantic**: Built with clean HTML5 and modern CSS3 (Flexbox/Grid/Variables) for a solid foundation.

## 🛠️ Built With

-   **HTML5 & CSS3**: Native styling using CSS Variables for an easy-to-manage design system.
-   **JavaScript (ES6+)**: Custom logic for DOM manipulation, dynamic rendering, and state management.
-   **GSAP (GreenSock Animation Platform)**: The core engine for all sophisticated timing and motion.
-   **ScrollTrigger**: For orchestration of animations linked to the user's scroll progress.

## 📦 Project Structure

```text
├── assets/                        # All external SVG assets
│   ├── sticker-camera.svg         # Card sticker — brand card
│   ├── sticker-phone.svg          # Card sticker — social card
│   ├── sticker-smiley.svg         # Card sticker — activations card
│   ├── sticker-hand.svg           # Card sticker — video production card
│   ├── sticker-heart.svg          # Card sticker — with partners card
│   ├── nav-work-blob.svg          # Orange blob behind navbar "work" text
│   ├── marquee-blob.svg           # Blob background in marquee section
│   ├── marquee-hand.svg           # Decorative hand in marquee section
│   ├── footer-sticker-smiley.svg  # Footer decorative sticker
│   ├── footer-sticker-heart.svg   # Footer decorative sticker
│   ├── footer-sticker-hands.svg   # Footer decorative sticker
│   ├── footer-sticker-100.svg     # Footer decorative sticker
│   ├── footer-sticker-camera.svg  # Footer decorative sticker
│   └── footer-sticker-boom.svg    # Footer decorative sticker
├── fonts/                         # Custom web fonts (Epilogue, DM Sans)
├── index.html                     # Lean page shell — structure only, no card/icon markup
├── script.js                      # GSAP animations + all dynamic DOM injection
├── styles.css                     # Core styles and design system tokens
└── README.md                      # Project documentation
```

## 🎨 SVG Architecture

All SVGs are handled using one of three strategies:

| Strategy | Used For | Why |
|---|---|---|
| External `.svg` + `<img>` | Decorative stickers, blobs, logos with fixed colors | No CSS dependency; best for large, non-reused shapes |
| Inline `<symbol>` + `<use>` | Repeated icons (`bullet-icon`, `card-divider`) | Defined once, rendered many times; supports `currentColor` |
| Inline `<svg>` | Animated paths (title underline, map link) | Requires `stroke-dasharray` draw animations |

## ⚡ JS-Driven DOM Architecture

To keep `index.html` as a lean structural shell, all repeated or data-driven content is injected by `script.js` at runtime:

| Content | Injected by | How |
|---|---|---|
| 5 service cards | `injectCards()` | Built from `CARDS_DATA` array via `buildCard()` |
| LinkedIn, Instagram, TikTok icons | `injectSocialIcons()` | Built from `SOCIAL_ICONS` array |
| Marquee brand items (both columns) | `populateMarquees()` | Randomised from `brands[]` + `colors[]` arrays |

This approach reduced `index.html` from **246 KB / 646 lines** to **~24 KB / 219 lines** — a **90% file size reduction**.

## ⚙️ Setup & Installation

Since this project uses vanilla technologies and CDNs for libraries, no build process is required.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/Truus.co-Awwward-Website.git
    ```
2.  **Navigate to the project directory**:
    ```bash
    cd Truus.co-Awwward-Website
    ```
3.  **Open the website**:
    -   Simply open `index.html` in your browser.
    -   *Recommended*: Use a local server (like VS Code "Live Server") to ensure all assets and scripts load correctly.

## 👨‍💻 Developed By

Made with ❤️ by Arkyadeep Pal, Soumyakanta Mitra and Anshu Ram, powered by **Antigravity AI**.

## 📄 License

This project is for educational and portfolio purposes. All original brand assets belong to Truus.co.
