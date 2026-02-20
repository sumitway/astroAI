export interface PlanetInfo {
  id: string;
  name: string;
  sanskritName: string;
  symbol: string;
  color: string;
  element: string;
  day: string;
  signRuled: string[];
  exaltedIn: string;
  debilitatedIn: string;
  nature: 'malefic' | 'benefic' | 'neutral';
  description: string;
}

export const PLANETS: PlanetInfo[] = [
  {
    id: 'sun',
    name: 'Sun',
    sanskritName: 'Surya',
    symbol: '☉',
    color: '#FFB347',
    element: 'Fire',
    day: 'Sunday',
    signRuled: ['Leo'],
    exaltedIn: 'Aries',
    debilitatedIn: 'Libra',
    nature: 'malefic',
    description: 'Soul, father, authority, government, vitality, ego, and leadership.',
  },
  {
    id: 'moon',
    name: 'Moon',
    sanskritName: 'Chandra',
    symbol: '☽',
    color: '#B0C4DE',
    element: 'Water',
    day: 'Monday',
    signRuled: ['Cancer'],
    exaltedIn: 'Taurus',
    debilitatedIn: 'Scorpio',
    nature: 'benefic',
    description: 'Mind, mother, emotions, intuition, imagination, and nurturing.',
  },
  {
    id: 'mars',
    name: 'Mars',
    sanskritName: 'Mangala',
    symbol: '♂',
    color: '#FF6B6B',
    element: 'Fire',
    day: 'Tuesday',
    signRuled: ['Aries', 'Scorpio'],
    exaltedIn: 'Capricorn',
    debilitatedIn: 'Cancer',
    nature: 'malefic',
    description: 'Energy, courage, action, siblings, land, and property.',
  },
  {
    id: 'mercury',
    name: 'Mercury',
    sanskritName: 'Budha',
    symbol: '☿',
    color: '#4FC3F7',
    element: 'Earth',
    day: 'Wednesday',
    signRuled: ['Gemini', 'Virgo'],
    exaltedIn: 'Virgo',
    debilitatedIn: 'Pisces',
    nature: 'neutral',
    description: 'Intellect, communication, business, education, and adaptability.',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    sanskritName: 'Guru / Brihaspati',
    symbol: '♃',
    color: '#FFD700',
    element: 'Ether',
    day: 'Thursday',
    signRuled: ['Sagittarius', 'Pisces'],
    exaltedIn: 'Cancer',
    debilitatedIn: 'Capricorn',
    nature: 'benefic',
    description: 'Wisdom, expansion, wealth, children, teacher, and spirituality.',
  },
  {
    id: 'venus',
    name: 'Venus',
    sanskritName: 'Shukra',
    symbol: '♀',
    color: '#FF9EC7',
    element: 'Water',
    day: 'Friday',
    signRuled: ['Taurus', 'Libra'],
    exaltedIn: 'Pisces',
    debilitatedIn: 'Virgo',
    nature: 'benefic',
    description: 'Love, beauty, relationships, luxury, arts, and sensory pleasures.',
  },
  {
    id: 'saturn',
    name: 'Saturn',
    sanskritName: 'Shani',
    symbol: '♄',
    color: '#7986CB',
    element: 'Air',
    day: 'Saturday',
    signRuled: ['Capricorn', 'Aquarius'],
    exaltedIn: 'Libra',
    debilitatedIn: 'Aries',
    nature: 'malefic',
    description: 'Discipline, karma, limitations, longevity, service, and detachment.',
  },
  {
    id: 'rahu',
    name: 'Rahu',
    sanskritName: 'Rahu',
    symbol: '☊',
    color: '#546E7A',
    element: 'Air',
    day: 'Saturday',
    signRuled: ['Aquarius'],
    exaltedIn: 'Taurus / Gemini',
    debilitatedIn: 'Scorpio / Sagittarius',
    nature: 'malefic',
    description: 'North node. Illusion, obsession, foreign lands, materialism, and amplification.',
  },
  {
    id: 'ketu',
    name: 'Ketu',
    sanskritName: 'Ketu',
    symbol: '☋',
    color: '#A1887F',
    element: 'Fire',
    day: 'Tuesday',
    signRuled: ['Scorpio'],
    exaltedIn: 'Scorpio / Sagittarius',
    debilitatedIn: 'Taurus / Gemini',
    nature: 'malefic',
    description: 'South node. Spirituality, liberation, past life, mysticism, and detachment.',
  },
];

export const PLANET_BY_ID: Record<string, PlanetInfo> = Object.fromEntries(
  PLANETS.map(p => [p.id, p])
);

export const PLANET_ABBREVIATIONS: Record<string, string> = {
  sun: 'Su', moon: 'Mo', mars: 'Ma', mercury: 'Me',
  jupiter: 'Ju', venus: 'Ve', saturn: 'Sa', rahu: 'Ra', ketu: 'Ke',
};

export const UPAGRAHAS = [
  { id: 'gulika',    name: 'Gulika',    symbol: 'Gu' },
  { id: 'mandi',     name: 'Mandi',     symbol: 'Ma' },
  { id: 'dhuma',     name: 'Dhuma',     symbol: 'Dh' },
  { id: 'vyatipaata',name: 'Vyatipaata',symbol: 'Vy' },
  { id: 'parivesha', name: 'Parivesha', symbol: 'Pa' },
  { id: 'indrachapa',name: 'Indrachapa',symbol: 'In' },
  { id: 'upaketu',   name: 'Upaketu',   symbol: 'Uk' },
] as const;
