# Solar System Explorer

An interactive, beautifully crafted Solar System explorer built **entirely with CSS and HTML**—no JavaScript required for the core animations and UI interactions! 

## 🚀 Live Demo & Deployment

- **Production URL**: [https://solar-project-livid.vercel.app](https://solar-project-livid.vercel.app)
- **Deployment URL**: [https://solar-project-fzi80hfkn-arekaluprashanths-projects.vercel.app](https://solar-project-fzi80hfkn-arekaluprashanths-projects.vercel.app)
- **Vercel Inspect**: [View Deployment Details](https://vercel.com/arekaluprashanths-projects/solar-project/4uqd7JMmffLcABBmreaUfr7Rn52G)

---

## 📖 About the Project

This project demonstrates the sheer power of modern CSS. It features a fully animated solar system where planets orbit the sun, complete with moons and trajectory paths. 

Users can click on different planets using a custom-built radio-button navigation system (the "CSS Checkbox Hack") to reveal detailed information panels about each celestial body.

### ✨ Features
- **Pure CSS Animations**: Smooth, infinite planetary orbits using CSS `@keyframes`.
- **Interactive UI**: Clickable planets that trigger information overlays without writing a single line of JavaScript for the state management.
- **Responsive Design**: Carefully positioned elements using absolute positioning and transformations.
- **High Performance & 24/7 Availability**: The site is statically hosted on Vercel with aggressive caching headers.
- **Offline Capable (PWA)**: Implements a Service Worker to cache assets, ensuring lightning-fast load times and seamless offline access.

### 🪐 Planets Included
1. **Mercury** - The swift planet
2. **Venus** - The morning star
3. **Earth** - Our home
4. **Mars** - The red planet
5. **Jupiter** - The gas giant
6. **Saturn** - The ringed beauty
7. **Uranus** - The tilted ice giant
8. **Neptune** - The blue planet
9. **Pluto** - The beloved dwarf planet

---

## 🛠️ Technologies Used
- **HTML5** for semantic structure.
- **CSS3** for styling, complex animations, state management (via `:checked`), and 3D visual effects.
- **Service Workers** for progressive web app (PWA) capabilities and asset caching.
- **Vercel** for ultra-fast global CDN deployment.

---

## 💻 How to Run Locally

Since this is a static site, running it locally is incredibly simple.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/arekaluprashanth/SolarProject.git
   ```
2. **Navigate to the directory:**
   ```bash
   cd SolarProject
   ```
3. **Open `index.html` in your browser:**
   Simply double-click the `index.html` file, or serve it using a local development server like Live Server (VS Code) or Python's HTTP server:
   ```bash
   npx serve .
   ```

---

## ⚡ Performance Optimizations

To ensure the website runs 24/7 seamlessly and loads instantly:
- **Vercel Edge Network:** The site is distributed globally.
- **Aggressive Caching:** `vercel.json` is configured to cache static assets (`.css`, `.jpg`, `.png`, etc.) for up to a year.
- **Service Worker:** Caches the core structure so returning visitors get instant load times, even on flaky networks.

## 📄 License
This project is open-source and available for educational purposes. Feel free to fork, modify, and learn from the CSS tricks used here!
