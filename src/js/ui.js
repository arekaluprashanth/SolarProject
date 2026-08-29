import { planetsData, sunData } from '../data/planets.js';

export class UIManager {
  constructor(solarSystem) {
    this.solarSystem = solarSystem;
    this.selectedPlanet = null;
    this.isSidebarOpen = false;
    this.isDetailOpen = false;

    this.elements = {};
    this.initElements();
    this.bindEvents();
    this.renderPlanetList();
  }

  initElements() {
    this.elements = {
      sidebar: document.getElementById('sidebar'),
      sidebarToggle: document.getElementById('sidebarToggle'),
      sidebarOverlay: document.getElementById('sidebarOverlay'),
      planetList: document.getElementById('planetList'),
      detailPanel: document.getElementById('detailPanel'),
      detailClose: document.getElementById('detailClose'),
      detailBackdrop: document.getElementById('detailBackdrop'),
      detailContent: document.getElementById('detailContent'),
      controls: {
        timeScale: document.getElementById('timeScale'),
        timeScaleValue: document.getElementById('timeScaleValue'),
        speedMultiplier: document.getElementById('speedMultiplier'),
        speedValue: document.getElementById('speedValue'),
        showOrbits: document.getElementById('showOrbits'),
        showLabels: document.getElementById('showLabels'),
        pauseBtn: document.getElementById('pauseBtn'),
        resetBtn: document.getElementById('resetBtn'),
        viewMode: document.getElementById('viewMode')
      },
      info: {
        planetName: document.getElementById('planetName'),
        planetType: document.getElementById('planetType'),
        planetDistance: document.getElementById('planetDistance'),
        planetOrbitalPeriod: document.getElementById('planetOrbitalPeriod'),
        planetRadius: document.getElementById('planetRadius'),
        planetGravity: document.getElementById('planetGravity'),
        planetTemp: document.getElementById('planetTemp'),
        planetMoons: document.getElementById('planetMoons')
      },
      stats: {
        totalPlanets: document.getElementById('totalPlanets'),
        totalMoons: document.getElementById('totalMoons'),
        sunTemp: document.getElementById('sunTemp')
      }
    };

    // Set up solar system callback
    this.solarSystem.onPlanetClick = (planetId) => this.openDetail(planetId);
  }

  bindEvents() {
    // Sidebar toggle
    this.elements.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
    this.elements.sidebarOverlay.addEventListener('click', () => this.closeSidebar());

    // Detail panel
    this.elements.detailClose.addEventListener('click', () => this.closeDetail());
    this.elements.detailBackdrop.addEventListener('click', () => this.closeDetail());

    // Controls
    this.elements.controls.timeScale.addEventListener('input', (e) => {
      this.elements.controls.timeScaleValue.textContent = `${parseFloat(e.target.value).toFixed(1)}x`;
      this.solarSystem.setTimeScale(parseFloat(e.target.value));
    });

    this.elements.controls.speedMultiplier.addEventListener('input', (e) => {
      this.elements.controls.speedValue.textContent = `${parseFloat(e.target.value).toFixed(1)}x`;
      this.solarSystem.setSpeedMultiplier(parseFloat(e.target.value));
    });

    this.elements.controls.showOrbits.addEventListener('change', (e) => {
      this.solarSystem.setShowOrbits(e.target.checked);
    });

    this.elements.controls.showLabels.addEventListener('change', (e) => {
      this.solarSystem.setShowLabels(e.target.checked);
    });

    this.elements.controls.pauseBtn.addEventListener('click', () => {
      if (this.solarSystem.isPaused) {
        this.solarSystem.play();
        this.elements.controls.pauseBtn.textContent = '⏸ Pause';
        this.elements.controls.pauseBtn.classList.remove('paused');
      } else {
        this.solarSystem.pause();
        this.elements.controls.pauseBtn.textContent = '▶ Play';
        this.elements.controls.pauseBtn.classList.add('paused');
      }
    });

    this.elements.controls.resetBtn.addEventListener('click', () => {
      this.solarSystem.resetView();
      this.closeDetail();
    });

    this.elements.controls.viewMode.addEventListener('change', (e) => {
      this.setViewMode(e.target.value);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));

    // Touch support for mobile
    this.bindTouchEvents();
  }

  handleKeyboard(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    switch (e.key) {
      case ' ':
        e.preventDefault();
        this.elements.controls.pauseBtn.click();
        break;
      case 'Escape':
        this.closeDetail();
        this.closeSidebar();
        break;
      case 'r':
      case 'R':
        this.solarSystem.resetView();
        break;
      case '1': case '2': case '3': case '4': case '5':
      case '6': case '7': case '8': case '9':
        const idx = parseInt(e.key) - 1;
        if (planetsData[idx]) {
          this.openDetail(planetsData[idx].id);
        }
        break;
    }
  }

  bindTouchEvents() {
    let touchStartX = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > 80) {
        if (diff > 0 && !this.isSidebarOpen) {
          // Swipe left - open sidebar
          this.openSidebar();
        } else if (diff < 0 && this.isSidebarOpen) {
          // Swipe right - close sidebar
          this.closeSidebar();
        }
      }
    }, { passive: true });
  }

  toggleSidebar() {
    if (this.isSidebarOpen) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  openSidebar() {
    this.isSidebarOpen = true;
    this.elements.sidebar.classList.add('open');
    this.elements.sidebarOverlay.classList.add('visible');
    this.elements.sidebarToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  closeSidebar() {
    this.isSidebarOpen = false;
    this.elements.sidebar.classList.remove('open');
    this.elements.sidebarOverlay.classList.remove('visible');
    this.elements.sidebarToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  renderPlanetList() {
    const container = this.elements.planetList;
    container.innerHTML = '';

    planetsData.forEach((planet, index) => {
      const item = document.createElement('button');
      item.className = 'planet-item';
      item.dataset.planetId = planet.id;
      item.setAttribute('role', 'listitem');
      item.setAttribute('aria-label', `${planet.name} - ${planet.type}`);

      item.innerHTML = `
        <div class="planet-preview" style="background-image: url('${planet.texture}')"></div>
        <div class="planet-info">
          <div class="planet-name-row">
            <span class="planet-color-dot" style="background: ${planet.color}"></span>
            <span class="planet-name">${planet.name}</span>
          </div>
          <span class="planet-type">${planet.type}</span>
        </div>
        <span class="planet-order">${index + 1}</span>
      `;

      item.addEventListener('click', () => {
        this.openDetail(planet.id);
        this.closeSidebar();
      });

      container.appendChild(item);
    });

    // Update stats
    const totalMoons = planetsData.reduce((sum, p) => sum + p.moons, 0);
    this.elements.stats.totalPlanets.textContent = planetsData.length;
    this.elements.stats.totalMoons.textContent = totalMoons;
    this.elements.stats.sunTemp.textContent = `${sunData.temperature.surface.toLocaleString()}°C`;
  }

  openDetail(planetId) {
    const planet = planetsData.find(p => p.id === planetId);
    if (!planet) return;

    this.selectedPlanet = planet;
    this.isDetailOpen = true;

    // Focus camera on planet
    this.solarSystem.focusPlanet(planetId);

    // Update detail panel
    this.populateDetail(planet);

    // Show panel with animation
    this.elements.detailPanel.classList.add('open');
    this.elements.detailBackdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';

    // Focus for accessibility
    this.elements.detailClose.focus();
  }

  closeDetail() {
    if (!this.isDetailOpen) return;

    this.isDetailOpen = false;
    this.selectedPlanet = null;

    this.elements.detailPanel.classList.remove('open');
    this.elements.detailBackdrop.classList.remove('visible');
    document.body.style.overflow = '';

    // Reset camera after animation
    setTimeout(() => {
      this.solarSystem.resetView();
    }, 300);
  }

  populateDetail(planet) {
    const content = this.elements.detailContent;

    content.innerHTML = `
      <div class="detail-header">
        <div class="detail-planet-visual">
          <div class="planet-sphere" style="background-image: url('${planet.texture}')"></div>
          ${planet.hasRing ? '<div class="planet-ring"></div>' : ''}
        </div>
        <div class="detail-title-block">
          <h2 class="detail-name">${planet.name}</h2>
          <span class="detail-type">${planet.type}</span>
          <span class="detail-order">Planet #${planet.order} from Sun</span>
        </div>
      </div>

      <div class="detail-description">
        <p>${planet.description}</p>
      </div>

      <div class="detail-facts-grid">
        ${planet.facts.map(fact => `
          <div class="fact-card">
            <span class="fact-label">${fact.label}</span>
            <span class="fact-value">${fact.value}</span>
          </div>
        `).join('')}
      </div>

      <div class="detail-section">
        <h3>Physical Characteristics</h3>
        <div class="specs-grid">
          <div class="spec-item">
            <span class="spec-label">Equatorial Radius</span>
            <span class="spec-value">${planet.radius.toLocaleString()} km (${planet.relativeSize}x Earth)</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Mass</span>
            <span class="spec-value">${this.formatScientific(planet.mass)} kg</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Surface Gravity</span>
            <span class="spec-value">${planet.gravity} m/s² (${(planet.gravity / 9.81).toFixed(2)}x Earth)</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Temperature Range</span>
            <span class="spec-value">${planet.temperature.min}°C to ${planet.temperature.max}°C</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Atmosphere</span>
            <span class="spec-value">${planet.atmosphere}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Composition</span>
            <span class="spec-value">${planet.composition}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <h3>Orbital Parameters</h3>
        <div class="specs-grid">
          <div class="spec-item">
            <span class="spec-label">Average Distance from Sun</span>
            <span class="spec-value">${planet.distanceFromSun} AU (${(planet.distanceFromSun * 149.6e6).toLocaleString()} km)</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Orbital Period</span>
            <span class="spec-value">${this.formatOrbitalPeriod(planet.orbitalPeriod)}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Rotation Period</span>
            <span class="spec-value">${planet.rotationPeriod < 1 ?
              (planet.rotationPeriod * 24).toFixed(1) + ' hours' :
              planet.rotationPeriod + ' Earth days'}${planet.data && planet.data.retrograde ? ' (retrograde)' : ''}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Axial Tilt</span>
            <span class="spec-value">${planet.axialTilt}°</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Orbital Eccentricity</span>
            <span class="spec-value">${planet.orbitalEccentricity.toFixed(4)}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Orbital Speed</span>
            <span class="spec-value">${this.calculateOrbitalSpeed(planet)}</span>
          </div>
        </div>
      </div>

      ${planet.moonData && planet.moonData.length > 0 ? `
        <div class="detail-section">
          <h3>Major Moons (${planet.moons} total)</h3>
          <div class="moons-grid">
            ${planet.moonData.slice(0, 5).map(moon => `
              <div class="moon-card">
                <span class="moon-name">${moon.name}</span>
                <span class="moon-stats">
                  ${moon.radius} km radius · ${moon.distance.toLocaleString()} km from planet
                  · ${moon.orbitalPeriod} days orbit
                </span>
              </div>
            `).join('')}
            ${planet.moons > 5 ? `<div class="moon-card more-moons">+${planet.moons - 5} more moons</div>` : ''}
          </div>
        </div>
      ` : ''}

      <div class="detail-section">
        <h3>Discovery & History</h3>
        <p class="discovery-info">Discovered: ${planet.discovered}</p>
      </div>
    `;
  }

  formatScientific(num) {
    if (num >= 1e24) return (num / 1e24).toFixed(2) + ' × 10²⁴';
    if (num >= 1e21) return (num / 1e21).toFixed(2) + ' × 10²¹';
    if (num >= 1e18) return (num / 1e18).toFixed(2) + ' × 10¹⁸';
    return num.toLocaleString();
  }

  formatOrbitalPeriod(days) {
    if (days < 365) return `${days} days`;
    const years = days / 365.25;
    if (years < 100) return `${years.toFixed(2)} Earth years`;
    return `${years.toFixed(1)} Earth years`;
  }

  calculateOrbitalSpeed(planet) {
    const GM = 1.327e20; // m³/s²
    const r = planet.distanceFromSun * 149.6e9; // meters
    const v = Math.sqrt(GM / r) / 1000; // km/s
    return `${v.toFixed(1)} km/s`;
  }

  setViewMode(mode) {
    if (mode === 'top') {
      // Animate to top-down view
      this.solarSystem.animateCamera(
        new THREE.Vector3(0, 500, 0),
        new THREE.Vector3(0, 0, 0)
      );
    } else if (mode === 'side') {
      this.solarSystem.animateCamera(
        new THREE.Vector3(0, 0, 300),
        new THREE.Vector3(0, 0, 0)
      );
    } else {
      this.solarSystem.resetView();
    }
  }
}