import { SolarSystem } from './src/js/scene.js';
import { UIManager } from './src/js/ui.js';
import { planetsData, sunData } from './src/data/planets.js';

let solarSystem;
let uiManager;

document.addEventListener('DOMContentLoaded', async () => {
  // Show loading screen
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingBar = document.getElementById('loadingBar');

  try {
    // Initialize Three.js scene
    const container = document.getElementById('canvasContainer');
    solarSystem = new SolarSystem(container);

    // Initialize UI
    uiManager = new UIManager(solarSystem);

    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
      }
      loadingBar.style.width = `${progress}%`;
    }, 100);

    // Wait for textures to load (minimum 800ms for nice UX)
    await new Promise(resolve => setTimeout(resolve, 800));

    clearInterval(loadingInterval);
    loadingBar.style.width = '100%';

    // Hide loading screen with fade
    await new Promise(resolve => setTimeout(resolve, 200));
    loadingScreen.classList.add('hidden');

    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);

    // Add entrance animation
    document.body.classList.add('loaded');

    // Set initial control values
    document.getElementById('timeScale').value = 1;
    document.getElementById('timeScaleValue').textContent = '1.0x';
    document.getElementById('speedMultiplier').value = 1;
    document.getElementById('speedValue').textContent = '1.0x';

    // Register service worker for offline support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js').catch(() => {});
    }

  } catch (error) {
    console.error('Failed to initialize:', error);
    loadingScreen.innerHTML = `
      <div class="loading-error">
        <h2>Failed to Load</h2>
        <p>${error.message}</p>
        <button onclick="location.reload()">Retry</button>
      </div>
    `;
  }
});

// Expose for debugging
window.solarSystem = solarSystem;
window.uiManager = uiManager;