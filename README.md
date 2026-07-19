# Nova Carter Portfolio

An original, responsive frontend portfolio built with semantic HTML5, Tailwind CSS, custom CSS, and vanilla JavaScript. Its spacious card-led composition takes visual cues from modern ecommerce homepages while using original branding, content, assets, and interactions.

## Project structure

- `index.html` — semantic page structure and content
- `css/custom.css` — design system, responsive layouts, and motion
- `js/app.js` — navigation, filters, reveals, counters, slider, parallax, and validation
- `assets/images/` — original local SVG illustrations
- `assets/icons/` — local interface icons

## Features

- Sticky responsive navigation with active-section tracking
- Asymmetric editorial hero with floating technology cards
- Responsive expertise, work, career, technology, testimonial, and contact sections
- Animated project filters and career counters
- Auto-rotating, keyboard-accessible testimonial controls
- Accessible form validation and live status feedback
- Pointer parallax, cursor glow, magnetic buttons, and scroll reveals
- `prefers-reduced-motion` support

## Preview

Open `index.html` directly, or serve the directory locally:

```bash
cd portfolio
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

Tailwind and the web fonts are loaded from CDNs; the custom visual system and all page-specific behavior live locally.
