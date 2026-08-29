/**
 * Solar System Planet Data
 * All distances in AU (Astronomical Units), sizes relative to Earth, orbital periods in Earth days/years
 */

export const planetsData = [
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'Planet',
    order: 1,
    distanceFromSun: 0.39, // AU
    orbitalPeriod: 88, // Earth days
    rotationPeriod: 58.6, // Earth days
    radius: 2439.7, // km
    relativeSize: 0.38, // Earth = 1
    mass: 3.3011e23, // kg
    gravity: 3.7, // m/s²
    temperature: { min: -173, max: 427 }, // Celsius
    atmosphere: 'Minimal (oxygen, sodium, hydrogen, helium, potassium)',
    moons: 0,
    color: '#E8927C',
    description: `The closest planet to the Sun. It circles the Sun faster than all the other planets, which is why Romans named it after their swift-footed messenger god.`,
    facts: [
      { label: 'Year Length', value: '88 Earth days' },
      { label: 'Day Length', value: '176 Earth days (solar)' },
      { label: 'Size', value: 'Smallest planet' },
      { label: 'Density', value: '2nd densest (5.4 g/cm³)' },
      { label: 'Surface', value: 'Heavily cratered, wrinkled crust' },
      { label: 'Orbital Speed', value: '47.4 km/s (fastest)' }
    ],
    texture: 'textures/texture_13.jpg',
    hasRing: false,
    ringData: null,
    axialTilt: 0.03, // degrees
    orbitalEccentricity: 0.2056,
    discovered: 'Ancient times',
    composition: 'Iron core (75%), silicate mantle (25%)'
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'Planet',
    order: 2,
    distanceFromSun: 0.723,
    orbitalPeriod: 225,
    rotationPeriod: 243, // retrograde
    radius: 6051.8,
    relativeSize: 0.95,
    mass: 4.8675e24,
    gravity: 8.87,
    temperature: { min: 462, max: 462 }, // nearly constant
    atmosphere: '96.5% CO₂, 3.5% N₂, trace SO₂',
    moons: 0,
    color: '#B45D15',
    description: `Named for the Roman goddess of love and beauty. In ancient times, Venus was often thought to be two different stars — the evening star and the morning star.`,
    facts: [
      { label: 'Year Length', value: '225 Earth days' },
      { label: 'Day Length', value: '243 Earth days (retrograde)' },
      { label: 'Size', value: 'Earth\'s twin (0.95x)' },
      { label: 'Pressure', value: '92x Earth (crushing)' },
      { label: 'Brightness', value: '2nd brightest night object' },
      { label: 'Rotation', value: 'Retrograde (backwards)' }
    ],
    texture: 'textures/texture_1.jpg',
    hasRing: false,
    ringData: null,
    axialTilt: 177.4,
    orbitalEccentricity: 0.0068,
    discovered: 'Ancient times',
    composition: 'Iron core, silicate mantle, thick CO₂ atmosphere'
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'Planet',
    order: 3,
    distanceFromSun: 1.0,
    orbitalPeriod: 365.25,
    rotationPeriod: 1.0,
    radius: 6371,
    relativeSize: 1.0,
    mass: 5.972e24,
    gravity: 9.81,
    temperature: { min: -89, max: 57 },
    atmosphere: '78% N₂, 21% O₂, 1% Ar, trace CO₂',
    moons: 1,
    moonData: [
      { name: 'Moon', radius: 1737.4, distance: 384400, orbitalPeriod: 27.3 }
    ],
    color: '#26DAAA',
    description: `Earth, our home. The only planet known to have an atmosphere containing free oxygen, oceans of liquid water on its surface, and life.`,
    facts: [
      { label: 'Year Length', value: '365.25 days' },
      { label: 'Day Length', value: '24 hours' },
      { label: 'Water', value: '71% surface covered' },
      { label: 'Magnetic Field', value: 'Strong (nickel-iron core)' },
      { label: 'Life', value: 'Only known planet with life' },
      { label: 'Atmosphere', value: 'Protective ozone layer' }
    ],
    texture: 'textures/texture_20.jpg',
    hasRing: false,
    ringData: null,
    axialTilt: 23.44,
    orbitalEccentricity: 0.0167,
    discovered: 'Ancient times',
    composition: 'Iron core, silicate mantle, crust, oceans, atmosphere'
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'Planet',
    order: 4,
    distanceFromSun: 1.524,
    orbitalPeriod: 687,
    rotationPeriod: 1.03,
    radius: 3389.5,
    relativeSize: 0.53,
    mass: 6.4171e23,
    gravity: 3.71,
    temperature: { min: -125, max: 20 },
    atmosphere: '95% CO₂, 2.7% N₂, 1.6% Ar',
    moons: 2,
    moonData: [
      { name: 'Phobos', radius: 11.1, distance: 9376, orbitalPeriod: 0.32 },
      { name: 'Deimos', radius: 6.2, distance: 23460, orbitalPeriod: 1.26 }
    ],
    color: '#E55F45',
    description: `Fourth planet from the Sun and the second smallest. Named after the Roman god of war, often described as the "Red Planet" due to iron oxide on its surface.`,
    facts: [
      { label: 'Year Length', value: '687 Earth days' },
      { label: 'Day Length', value: '24.6 hours' },
      { label: 'Tallest Mountain', value: 'Olympus Mons (21 km)' },
      { label: 'Dust Storms', value: 'Planet-wide, months long' },
      { label: 'Land Area', value: '≈ Earth\'s land area' },
      { label: 'Gravity', value: '37% of Earth' }
    ],
    texture: 'textures/texture_9.jpg',
    hasRing: false,
    ringData: null,
    axialTilt: 25.19,
    orbitalEccentricity: 0.0934,
    discovered: 'Ancient times',
    composition: 'Iron core, silicate mantle, thin atmosphere'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'Gas Giant',
    order: 5,
    distanceFromSun: 5.203,
    orbitalPeriod: 4333, // 11.86 years
    rotationPeriod: 0.41, // 9h 55m
    radius: 69911,
    relativeSize: 11.2,
    mass: 1.898e27,
    gravity: 24.79,
    temperature: { min: -145, max: -145 }, // cloud tops
    atmosphere: '90% H₂, 10% He, trace CH₄, NH₃',
    moons: 95,
    moonData: [
      { name: 'Io', radius: 1821.6, distance: 421700, orbitalPeriod: 1.77 },
      { name: 'Europa', radius: 1560.8, distance: 671100, orbitalPeriod: 3.55 },
      { name: 'Ganymede', radius: 2634.1, distance: 1070400, orbitalPeriod: 7.15 },
      { name: 'Callisto', radius: 2410.3, distance: 1882700, orbitalPeriod: 16.69 }
    ],
    color: '#D4A574',
    description: `The largest planet in the Solar System. Fittingly named after the king of the gods in Roman mythology. Jupiter's four large Galilean moons were the first celestial bodies discovered orbiting another planet.`,
    facts: [
      { label: 'Year Length', value: '11.86 Earth years' },
      { label: 'Day Length', value: '9h 55m (shortest day)' },
      { label: 'Great Red Spot', value: 'Storm > Earth size, 350+ years' },
      { label: 'Moons', value: '95 confirmed (4 large Galilean)' },
      { label: 'Magnetic Field', value: '20,000x Earth\'s' },
      { label: 'Composition', value: 'Mostly hydrogen & helium' }
    ],
    texture: 'textures/jupiter.jpg',
    hasRing: true,
    ringData: { innerRadius: 1.72, outerRadius: 1.81, opacity: 0.15, color: '#8B7355' },
    axialTilt: 3.13,
    orbitalEccentricity: 0.0489,
    discovered: 'Ancient times',
    composition: 'Hydrogen/helium gas, possible rocky core'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'Gas Giant',
    order: 6,
    distanceFromSun: 9.539,
    orbitalPeriod: 10759, // 29.45 years
    rotationPeriod: 0.44, // 10h 34m
    radius: 58232,
    relativeSize: 9.45,
    mass: 5.683e26,
    gravity: 10.44,
    temperature: { min: -178, max: -178 },
    atmosphere: '96% H₂, 3% He, trace CH₄, NH₃',
    moons: 146,
    moonData: [
      { name: 'Titan', radius: 2574.7, distance: 1221870, orbitalPeriod: 15.95 },
      { name: 'Enceladus', radius: 252.1, distance: 238040, orbitalPeriod: 1.37 },
      { name: 'Mimas', radius: 198.2, distance: 185540, orbitalPeriod: 0.94 },
      { name: 'Rhea', radius: 763.8, distance: 527100, orbitalPeriod: 4.52 }
    ],
    color: '#B29D81',
    description: `The sixth planet from the Sun, famous for its spectacular ring system. Saturn was the Roman name for Cronus, the lord of the Titans. The root of the English word "Saturday."`,
    facts: [
      { label: 'Year Length', value: '29.45 Earth years' },
      { label: 'Day Length', value: '10h 34m' },
      { label: 'Rings', value: 'Most extensive (ice/rock particles)' },
      { label: 'Density', value: '0.69 g/cm³ (would float!)' },
      { label: 'Moons', value: '146 confirmed' },
      { label: 'Titan', value: 'Larger than Mercury, thick atmosphere' }
    ],
    texture: 'textures/texture_18.jpg',
    hasRing: true,
    ringData: { innerRadius: 1.23, outerRadius: 2.27, opacity: 0.6, color: '#C9C0B0' },
    axialTilt: 26.73,
    orbitalEccentricity: 0.0565,
    discovered: 'Ancient times',
    composition: 'Hydrogen/helium, possible rocky/icy core'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'Ice Giant',
    order: 7,
    distanceFromSun: 19.18,
    orbitalPeriod: 30687, // 84 years
    rotationPeriod: 0.72, // 17h 14m (retrograde)
    radius: 25362,
    relativeSize: 4.0,
    mass: 8.681e25,
    gravity: 8.69,
    temperature: { min: -224, max: -224 },
    atmosphere: '83% H₂, 15% He, 2% CH₄',
    moons: 28,
    moonData: [
      { name: 'Miranda', radius: 235.8, distance: 129390, orbitalPeriod: 1.41 },
      { name: 'Ariel', radius: 578.9, distance: 190900, orbitalPeriod: 2.52 },
      { name: 'Umbriel', radius: 584.7, distance: 266000, orbitalPeriod: 4.14 },
      { name: 'Titania', radius: 788.9, distance: 436300, orbitalPeriod: 8.71 },
      { name: 'Oberon', radius: 761.4, distance: 583500, orbitalPeriod: 13.46 }
    ],
    color: '#8DCDD8',
    description: `The first planet discovered by scientists (William Herschel, 1781). Notable for its dramatic 98° axial tilt — it essentially rolls around the Sun on its side.`,
    facts: [
      { label: 'Year Length', value: '84 Earth years' },
      { label: 'Day Length', value: '17h 14m (retrograde)' },
      { label: 'Axial Tilt', value: '98° (rotates on its side!)' },
      { label: 'Type', value: 'Ice Giant (water, ammonia, methane)' },
      { label: 'Color', value: 'Pale blue from methane' },
      { label: 'Rings', value: '13 faint, dark rings' }
    ],
    texture: 'textures/texture_6.jpg',
    hasRing: true,
    ringData: { innerRadius: 1.6, outerRadius: 2.0, opacity: 0.3, color: '#4A4A5A' },
    axialTilt: 97.77,
    orbitalEccentricity: 0.0472,
    discovered: 'March 13, 1781 (William Herschel)',
    composition: 'Icy mantle (water, ammonia, methane), rocky core'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'Ice Giant',
    order: 8,
    distanceFromSun: 30.06,
    orbitalPeriod: 60190, // 164.8 years
    rotationPeriod: 0.67, // 16h 6m
    radius: 24622,
    relativeSize: 3.88,
    mass: 1.024e26,
    gravity: 11.15,
    temperature: { min: -218, max: -218 },
    atmosphere: '80% H₂, 19% He, 1.5% CH₄',
    moons: 16,
    moonData: [
      { name: 'Triton', radius: 1353.4, distance: 354760, orbitalPeriod: 5.88 },
      { name: 'Proteus', radius: 210, distance: 117650, orbitalPeriod: 1.12 },
      { name: 'Nereid', radius: 170, distance: 5513400, orbitalPeriod: 360.14 }
    ],
    color: '#4F83E2',
    description: `The first planet whose existence was predicted mathematically before being observed. Discovered in 1846 due to irregularities in Uranus's orbit. Famous for the fastest sustained winds in the Solar System (2,100 km/h).`,
    facts: [
      { label: 'Year Length', value: '164.8 Earth years' },
      { label: 'Day Length', value: '16h 6m' },
      { label: 'Winds', value: '2,100 km/h (fastest sustained)' },
      { label: 'Discovery', value: 'Mathematical prediction (1846)' },
      { label: 'Great Dark Spot', value: 'Storm system (observed 1989)' },
      { label: 'Triton', value: 'Retrograde orbit, geysers' }
    ],
    texture: 'textures/texture_0.jpg',
    hasRing: true,
    ringData: { innerRadius: 1.7, outerRadius: 2.5, opacity: 0.25, color: '#3A3A6A' },
    axialTilt: 28.32,
    orbitalEccentricity: 0.0086,
    discovered: 'Sept 23, 1846 (Galle/Le Verrier)',
    composition: 'Icy mantle, rocky core, diamond rain theorized'
  },
  {
    id: 'pluto',
    name: 'Pluto',
    type: 'Dwarf Planet',
    order: 9,
    distanceFromSun: 39.48,
    orbitalPeriod: 90560, // 248 years
    rotationPeriod: 6.39,
    radius: 1188.3,
    relativeSize: 0.186,
    mass: 1.303e22,
    gravity: 0.62,
    temperature: { min: -240, max: -218 },
    atmosphere: 'Thin N₂, CH₄, CO (freezes/falls as snow)',
    moons: 5,
    moonData: [
      { name: 'Charon', radius: 606, distance: 19591, orbitalPeriod: 6.39 },
      { name: 'Nix', radius: 49.8, distance: 48694, orbitalPeriod: 24.9 },
      { label: 'Hydra', radius: 81, distance: 64738, orbitalPeriod: 38.2 },
      { name: 'Kerberos', radius: 19, distance: 57783, orbitalPeriod: 32.1 },
      { name: 'Styx', radius: 10, distance: 42656, orbitalPeriod: 20.2 }
    ],
    color: '#FF8732',
    description: `Once considered the 9th planet, reclassified as a dwarf planet in 2006. Largest known object in the Kuiper Belt. Has a binary relationship with its largest moon Charon — they orbit a common center of mass outside Pluto.`,
    facts: [
      { label: 'Year Length', value: '248 Earth years' },
      { label: 'Day Length', value: '6.4 Earth days' },
      { label: 'Status', value: 'Dwarf Planet (since 2006)' },
      { label: 'Binary System', value: 'Orbits barycenter with Charon' },
      { label: 'Heart Feature', value: 'Tombaugh Regio (nitrogen glacier)' },
      { label: 'Orbit', value: 'Highly elliptical, crosses Neptune' }
    ],
    texture: 'textures/texture_7.jpg',
    hasRing: false,
    ringData: null,
    axialTilt: 122.5,
    orbitalEccentricity: 0.2488,
    discovered: 'Feb 18, 1930 (Clyde Tombaugh)',
    composition: 'Rock (70%) and ice (30%)'
  }
];

export const sunData = {
  name: 'Sun',
  type: 'Star (G2V)',
  radius: 696340, // km
  mass: 1.989e30, // kg
  temperature: { surface: 5778, core: 15000000 }, // Celsius
  gravity: 274, // m/s²
  age: 4.6, // billion years
  luminosity: 3.828e26, // Watts
  composition: '73% H, 25% He, 2% heavier elements',
  description: `The star at the center of our Solar System. A nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core. Contains 99.86% of the Solar System's mass.`,
  facts: [
    { label: 'Type', value: 'G2V Main Sequence Star' },
    { label: 'Age', value: '4.6 billion years' },
    { label: 'Core Temp', value: '15 million °C' },
    { label: 'Surface Temp', value: '5,778 °C' },
    { label: 'Mass', value: '99.86% of Solar System' },
    { label: 'Fusion Rate', value: '620 million tons H/sec' }
  ],
  color: '#FFF8E7'
};