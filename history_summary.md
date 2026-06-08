# Fitcloo (FITCLO V2) Project History & Styling Specifications

This document serves as a condensed historical log and design specification for the **FITCLO V2** B2B activewear website. Read this to quickly understand the codebase's current state and maintain consistency.

---

## 🛠️ Project Profile & Tech Stack
*   **Website URL**: `https://www.fitcloo.com`
*   **Repository**: `fancojason/fitclo-v2` (GitHub)
*   **Framework**: Astro + Tailwind CSS
*   **Deployment**: Cloudflare Pages (automatically builds on branch `main` push)
*   **Deployment Script**: `deploy.cjs` (custom script used via `node deploy.cjs` to bypass local proxy/timeout restrictions).

---

## 🔑 Key Configurations & Credentials
*   **GitHub PAT**: `ghp_***` (securely hardcoded inside `deploy.cjs`)
*   **Resend API Key**: `re_***` (securely configured for form submissions)
*   **Contact Info**: Jason (`+86 15218851638`, `jason@dgfanco.com`)

---

## 🎨 Visual Identity & Typography
*   **Palette**: Luxury Black-Gold-White (Luxopack-inspired). Gold color: `#C9A84C` (accent).
*   **Fonts**:
    *   **Montserrat (900/Black)**: Main uppercase titles, high-impact headings.
    *   **Century Gothic**: Sentence-case subtitles, UI labels, body texts, form selectors.
    *   **Inter**: Navigation and utility tags.

---

## 🚀 Fully Implemented Modules & Styling Specs

### 1. Hero Section (`src/components/Hero.astro`)
*   **Style**: Pure Luxopack luxury dark landing.
*   **Typography**: Inter (700, 64px, 1.05 line-height, -0.04em spacing) for the 4-line main heading:
    `PRIVATE LABEL` / `ACTIVEWEAR` / `MANUFACTURER` / `IN CHINA`
*   **Subtext**: Edited to remove "packaging" references. Changed to: *"Custom Yoga Wear, Gym Wear & Athleisure Manufactured with Your Logo and Professional Branding."*

### 2. About Us (`src/pages/about.astro`)
*   **Factory Intro Section**: Custom introducing text (Founded 2010, 350+ staff, 12,000㎡ facility, 450k/mo capacity).
*   **Why Choose Fitclo Grid**: Left grid has factory photos; Right grid has numbers with red hover effects (`#e60012`).
*   **Global Certifications**:
    *   Image: `https://sc01.alicdn.com/kf/Hfd7099e6ab8a449db9590c84b4fdb066I.png`
    *   Style: Rendered in **full color** (grayscale filters completely removed) and aligned to the container width (`max-w-7xl`) to match the intro container.

### 3. High-Conversion Inquiry Form (`src/components/InquiryForm.astro`)
*   **Style**: 1:1 replica of Luxopack's high-converting dark-mode checkout/quote form.
*   **Header**: Emoji "🎁" aligned vertically with Title: *"Free Quote + Logo Mockup in 24 Hours"*.
*   **Consultant Card**: Jason is the advisor, green status pulse and "Online · Avg. 2h reply". Label changed from packaging to **Activewear consultant**.
*   **Form Inputs**: Labels and borders have increased contrast/brightness (`text-white/70`, `border-white/20`) for clear readability.
*   **Product Type Dropdown**: Custom choices: `Yoga Set`, `Sport Bras`, `Leggings`, `Yoga Top`, `Gym Shorts`, `T-shirt`, `Multiple Types / others`.
*   **Upload Area**: Rounded dashed border with clip icon supporting file selection of logos/reference images up to 10MB.
*   **CTA Button**: Gold background (`#C9A84C`) with uppercase black text: `🚀 SEND MY REQUEST — FREE & NO COMMITMENT`.
*   **Trust Badges Footer**: Embedded security badge (`🔒 Your information is safe...`) and 4 green checkmark items representing core corporate guarantees.

### 4. Live Production Tour (`src/components/LiveProduction.astro`)
*   **Bug Fix**: Resolved the double-rendering glitch where this section was displayed twice on the home page (by cleaning up the duplicated `<section>` in the component itself).
*   **Title Font**: Changed title to **Montserrat (font-black)** matching the luxury theme.
*   **Badges**: Removed the default "GUANGZHOU, CHINA" badge from the main factory photo.
*   **Action Buttons**: Removed uppercase transformation. Formatted buttons as **Title Case** with **bold** weight:
    *   Primary: `🎬 Full Factory Tour`
    *   Secondary: `Get Free Quote &rarr;`

---

## 📈 Deployment Workflow
Whenever any of these components are modified, they must be registered inside `deploy.cjs` array and pushed to GitHub using:
```bash
node deploy.cjs
```
This automatically updates the remote `main` branch, triggering Cloudflare Pages to build and deploy.
