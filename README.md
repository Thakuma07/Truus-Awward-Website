# Truus.co — Awwward-Winning Web Design Clone

A highly interactive, visually stunning recreation of the **Truus.co** website, built with modern frontend technologies and focused on premium user experience and animations. This project was developed using **Antigravity AI** to demonstrate elite-level web development practices.

<table>
  <tr>
    <td align="center"><b>Service Card Section</b><br/><img width="100%" alt="Service Card Section" src="https://github.com/user-attachments/assets/cb80f406-998e-4853-9ea5-7dec87952117" /></td>
    <td align="center"><b>Double Marquee Section</b><br/><img width="100%" alt="Double marquee section" src="https://github.com/user-attachments/assets/9ca5af12-5e0b-4b81-954c-1dcb484c671a" /></td>
  </tr>
  <tr>
    <td colspan="2" align="center"><b>Footer Section</b><br/><img width="100%" alt="Footer section" src="https://github.com/user-attachments/assets/6335c2ee-a2ad-4795-96ad-e1b9841cacf0" /></td>
  </tr>
</table>




## 🚀 Overview

This project is a high-fidelity clone of the Truus advertising agency website. It captures the bold aesthetics, playful interactivity, and smooth motion design that are characteristic of Awwward-winning websites. The codebase is built with vanilla technologies to ensure maximum performance and control over every frame of animation.

## ✨ Key Features

-   **Dynamic Navigation System**: Context-aware navbar that automatically adapts its colour theme (light/dark) based on the current scroll section.
-   **JS-Driven DOM**: Service cards, social icons, and marquee logos are all injected at runtime from clean JS data arrays — keeping `index.html` lean and maintainable.
-   **Elastic Card Interactions**: Custom GSAP-powered hover effects on service cards, featuring horizontal repulsion, elastic scaling, and smooth clustering.
-   **Smart Randomized Marquee**: Infinite scrolling logo section with advanced randomisation logic:
    -   No two identical logos appear consecutively (matched by image `src`).
    -   No two identical background colours appear consecutively.
    -   Both constraints also hold at the seamless scroll seam (loop wrap-around).
-   **Scroll-Triggered SVG Animations**: Hand-drawn style underlines and path animations that reveal as the user explores the page.
-   **Centralized Wiggle Config**: All hover-wiggle intensities (socials, heading, map link, email, WhatsApp) are controlled from a single `WIGGLE_CONFIG` object in `data.js` — change one number to tune the whole site.
-   **Footer Sticker — Velocity Push Effect**: Footer stickers react to fast cursor swipes nearby. The sticker is pushed in the direction of the cursor movement, with strength proportional to swipe speed. Has no effect when the cursor is directly on the sticker; auto-springs back when the cursor slows or leaves.
-   **High-End Typography**: Premium variable fonts (*Epilogue* and *DM Sans*) for a brutalist yet polished look.
-   **Interactive Micro-details**:
    -   Visibility-triggered tab titles ("Hey, over here! 👋") to re-engage users.
    -   Configurable per-element wiggle animations on hover via `data-wiggle` attributes.
    -   Custom SVG cursor with context-aware states.
-   **Self-Hosted SVG Logos**: All 8 brand logos are downloaded locally into `assets/Brand Logos SVG/` — no CDN dependency at runtime.
-   **Responsive & Semantic**: Built with clean HTML5 and modern CSS3 (Flexbox / Grid / Variables) for a solid foundation.

## 🛠️ Built With

-   **HTML5 & CSS3**: Native styling using CSS Variables for an easy-to-manage design system.
-   **JavaScript (ES6+)**: Custom logic for DOM manipulation, dynamic rendering, and state management.
-   **GSAP (GreenSock Animation Platform)**: The core engine for all sophisticated timing and motion.
-   **ScrollTrigger**: For orchestration of animations linked to the user's scroll progress.
-   **Lenis**: Ultra-smooth inertia scrolling.

## 📦 Project Structure

```text
├── assets/
│   ├── Brand Logos SVG/           # Self-hosted marquee brand logos (8 SVGs)
│   │   ├── oxxio_logo.svg
│   │   ├── hema_logo.svg
│   │   ├── kfc_logo.svg
│   │   ├── swapfiets_logo.svg
│   │   ├── anwb_logo.svg
│   │   ├── netflix_logo.svg
│   │   ├── ace_tate_logo.svg
│   │   └── getir_logo.svg
│   ├── Card-Sticker SVG/          # Stickers on service cards
│   ├── Cursor SVG/                # Custom cursor states
│   ├── Footer-Sticker SVG/        # Decorative footer stickers (6 SVGs)
│   ├── Marquee-blob SVG/          # Blob background + hand in marquee section
│   └── Navbar SVG/                # Navbar icons and blobs
├── fonts/                         # Custom web fonts (Epilogue, DM Sans)
├── index.html                     # Lean page shell — structure only
├── data.js                        # All static data: brands, colors, cards, icons, WIGGLE_CONFIG
├── script.js                      # GSAP animations + all dynamic DOM injection
├── styles.css                     # Core styles and design system tokens
└── README.md                      # Project documentation
```

## 🎨 SVG Architecture

All SVGs are handled using one of three strategies:

| Strategy | Used For | Why |
|---|---|---|
| External `.svg` + `<img>` | Brand logos, stickers, blobs | No CSS dependency; best for large, non-reused shapes |
| Inline `<symbol>` + `<use>` | Repeated icons (`bullet-icon`, `card-divider`) | Defined once, rendered many times; supports `currentColor` |
| Inline `<svg>` | Animated paths (title underline, map link) | Requires `stroke-dasharray` draw animations |

## ⚡ Architecture: `data.js` Separation

All static data lives in `data.js` (loaded before `script.js`) so configuration is clean and separated from logic:

| Export | Purpose |
|---|---|
| `brands[]` | 8 brand objects `{ name, src }` pointing to local SVG files |
| `colors[]` | Background colour pool for the marquee |
| `SOCIAL_ICONS[]` | LinkedIn, Instagram, TikTok link + SVG definitions |
| `CARDS_DATA[]` | 5 service card definitions with sticker, tags, services |
| `WIGGLE_CONFIG` | Single source of truth for all hover-wiggle intensities |

### `WIGGLE_CONFIG` — Tune all wiggle from one place

```js
const WIGGLE_CONFIG = {
    socials:    10,  // LinkedIn / Instagram / TikTok icons
    jobHeading:  1,  // "not hiring right now" heading
    googleMap:   1,  // Google Maps link text
    email:       2,  // hello@truus.co
    whatsapp:    2,  // send us a whatsapp
};
```
Higher number = more rotation (degrees). Set to `0` to disable for any element.

## 🎲 Marquee Randomisation Logic

The marquee uses two constraint-aware helpers in `script.js`:

- **`shuffleNoAdjacentSrc(brands)`** — Fisher-Yates shuffle + post-processing to ensure no two cards with the same logo image appear next to each other, including at the loop seam.
- **`assignColorsNoAdjacent(count, colors)`** — Assigns background colours one-by-one, always excluding the previous colour (and the first colour on the last item, to fix the seam).

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