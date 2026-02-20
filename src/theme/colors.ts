export const Colors = {
  // Deep Space Backgrounds
  cosmicVoid:   '#03000F',
  deepSpace:    '#080621',
  nebulaDark:   '#0D0B2A',
  nebulaLight:  '#13103A',

  // Glassmorphism Surfaces
  glassSurface:      'rgba(255,255,255,0.06)',
  glassSurfaceHover: 'rgba(255,255,255,0.10)',
  glassBorder:       'rgba(255,255,255,0.12)',
  glassBorderBright: 'rgba(255,255,255,0.22)',
  glassOverlay:      'rgba(8,6,33,0.75)',

  // Primary Brand
  primary:    '#667EEA',
  primaryDim: 'rgba(102,126,234,0.18)',
  secondary:  '#764BA2',

  // Brand Gradients
  gradients: {
    cosmic:  ['#667EEA', '#764BA2'] as const,
    golden:  ['#F7971E', '#FFD200'] as const,
    aurora:  ['#11998E', '#38EF7D'] as const,
    moon:    ['#4776E6', '#8E54E9'] as const,
    fire:    ['#FF512F', '#DD2476'] as const,
    ocean:   ['#2196F3', '#00BCD4'] as const,
    sunrise: ['#FF8C00', '#FFC107'] as const,
    mystic:  ['#8B5CF6', '#EC4899'] as const,
    astral:  ['#0F2027', '#203A43', '#2C5364'] as const,
  },

  // Planet Accent Colors
  planets: {
    sun:     '#FFB347',
    moon:    '#B0C4DE',
    mars:    '#FF6B6B',
    mercury: '#4FC3F7',
    jupiter: '#FFD700',
    venus:   '#FF9EC7',
    saturn:  '#7986CB',
    rahu:    '#546E7A',
    ketu:    '#A1887F',
  },

  // Zodiac Sign Colors
  signs: {
    aries:       '#FF6B6B',
    taurus:      '#4CAF50',
    gemini:      '#FFD700',
    cancer:      '#B0C4DE',
    leo:         '#FF8C42',
    virgo:       '#66BB6A',
    libra:       '#CE93D8',
    scorpio:     '#EF5350',
    sagittarius: '#29B6F6',
    capricorn:   '#78909C',
    aquarius:    '#7E57C2',
    pisces:      '#4DB6AC',
  },

  // Semantic Colors
  success:  '#38EF7D',
  warning:  '#FFD200',
  error:    '#FF6B6B',
  info:     '#4FC3F7',

  // Text
  textPrimary:   'rgba(255,255,255,0.95)',
  textSecondary: 'rgba(255,255,255,0.60)',
  textMuted:     'rgba(255,255,255,0.35)',
  textGold:      '#FFD200',
  textPurple:    '#B39DDB',

  // UI Elements
  divider:     'rgba(255,255,255,0.08)',
  overlay:     'rgba(0,0,0,0.65)',
  shimmer:     'rgba(255,255,255,0.05)',
  activeTab:   '#667EEA',
  inactiveTab: 'rgba(255,255,255,0.35)',

  // Nakshatra Category Colors
  nakshatraDevata:   '#FFD700',
  nakshatraRakshasa: '#FF6B6B',
  nakshatraManusha:  '#4FC3F7',

  // Dosha Colors
  doshaHigh:   '#FF4444',
  doshaMedium: '#FF8C00',
  doshaLow:    '#FFD200',
  doshaClean:  '#38EF7D',
} as const;

export type ColorKey = keyof typeof Colors;
