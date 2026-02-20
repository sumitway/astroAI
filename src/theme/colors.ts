export const Colors = {
  // ─── Warm Deep Backgrounds (Sacred Embers palette) ────────────────────────
  // Shifted from cold blue-black to warm charcoal — like ink on ancient palm leaf
  cosmicVoid:   '#0C0804',
  deepSpace:    '#120D07',
  nebulaDark:   '#1A1008',
  nebulaLight:  '#231608',

  // ─── Glassmorphism Surfaces — warm amber-tinted ──────────────────────────
  glassSurface:      'rgba(255,240,210,0.06)',
  glassSurfaceHover: 'rgba(255,240,210,0.10)',
  glassBorder:       'rgba(212,137,26,0.20)',
  glassBorderBright: 'rgba(212,137,26,0.38)',
  glassOverlay:      'rgba(12,8,4,0.80)',

  // ─── Primary Brand — Saffron Amber / Sacred Fire ─────────────────────────
  // Inspired by AstroTalk's warm energy; amber = sacred fire, enlightenment
  primary:    '#D4891A',
  primaryDim: 'rgba(212,137,26,0.18)',
  secondary:  '#8B2500',   // deep vermillion — Vedic sacred red

  // ─── Brand Gradients ─────────────────────────────────────────────────────
  gradients: {
    cosmic:  ['#D4891A', '#8B2500'] as const,   // amber → vermillion (main brand)
    golden:  ['#F7971E', '#FFD200'] as const,   // warm gold (auspicious)
    aurora:  ['#11998E', '#38EF7D'] as const,   // teal → green (success/growth)
    moon:    ['#8B2500', '#D4891A'] as const,   // vermillion → amber (lunar)
    fire:    ['#FF6B00', '#D4891A'] as const,   // deep orange fire
    ocean:   ['#1A5276', '#2E86C1'] as const,   // deep navy (kept for contrast)
    sunrise: ['#FF8C00', '#FFC107'] as const,   // sunrise warm
    mystic:  ['#6B1717', '#D4891A'] as const,   // deep maroon → saffron
    astral:  ['#1A0A00', '#3D1A00', '#5C2A00'] as const, // warm dark night
  },

  // ─── Planet Accent Colors — traditional Vedic associations ───────────────
  planets: {
    sun:     '#FFB347',  // golden orange
    moon:    '#B0C4DE',  // silver blue
    mars:    '#FF6B6B',  // red (Mangal)
    mercury: '#4FC3F7',  // light cyan (Budh)
    jupiter: '#FFD700',  // pure gold (Guru)
    venus:   '#FF9EC7',  // rose pink (Shukra)
    saturn:  '#7986CB',  // slate indigo (Shani)
    rahu:    '#546E7A',  // smoky blue-grey
    ketu:    '#A1887F',  // dusty brown
  },

  // ─── Zodiac Sign Colors ──────────────────────────────────────────────────
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

  // ─── Semantic ─────────────────────────────────────────────────────────────
  success:  '#38EF7D',
  warning:  '#FFD200',
  error:    '#FF6B6B',
  info:     '#4FC3F7',

  // ─── Text — warm cream tones, easier on eyes than pure white ─────────────
  textPrimary:   'rgba(255,245,230,0.95)',   // warm near-white
  textSecondary: 'rgba(255,230,190,0.62)',   // warm secondary
  textMuted:     'rgba(255,215,160,0.38)',   // warm muted
  textGold:      '#D4AF37',                  // traditional 22k gold
  textPurple:    '#C4A882',                  // warm tan (replaces cold purple)

  // ─── UI Elements ─────────────────────────────────────────────────────────
  divider:     'rgba(212,137,26,0.14)',
  overlay:     'rgba(0,0,0,0.70)',
  shimmer:     'rgba(255,240,210,0.04)',
  activeTab:   '#D4891A',
  inactiveTab: 'rgba(255,215,160,0.38)',

  // ─── Nakshatra Category Colors ───────────────────────────────────────────
  nakshatraDevata:   '#FFD700',
  nakshatraRakshasa: '#FF6B6B',
  nakshatraManusha:  '#4FC3F7',

  // ─── Dosha Severity Colors ───────────────────────────────────────────────
  doshaHigh:   '#FF4444',
  doshaMedium: '#FF8C00',
  doshaLow:    '#FFD200',
  doshaClean:  '#38EF7D',
} as const;

export type ColorKey = keyof typeof Colors;
