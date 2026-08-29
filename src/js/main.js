import { SolarSystem } from './scene.js';
import { UIManager } from './ui.js';
import { planetsData, sunData } from '../data/planets.js';

let solarSystem;
let uiManager;

document.addEventListener('DOMContentLoaded', async () => {
  // Show loading screen
  const loadingScreen = document.getElementById('loadingScreen');

  try {
    // Initialize Three.js scene
    const container = document.getElementById('canvasContainer');
    solarSystem = new SolarSystem(container);

    // Initialize UI
    uiManager = new UIManager(solarSystem);

    // Hide loading screen with fade
    await new Promise(resolve => setTimeout(resolve, 500));
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