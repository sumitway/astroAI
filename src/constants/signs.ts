export interface SignInfo {
  number: number;         // 1-12
  id: string;
  name: string;
  sanskritName: string;
  symbol: string;
  unicode: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  quality: 'Cardinal' | 'Fixed' | 'Mutable';
  ruler: string;
  color: string;
  bodyPart: string;
  keywords: string[];
}

export const SIGNS: SignInfo[] = [
  { number:1,  id:'aries',       name:'Aries',       sanskritName:'Mesha',    symbol:'♈', unicode:'♈', element:'Fire',  quality:'Cardinal', ruler:'mars',    color:'#FF6B6B', bodyPart:'Head',           keywords:['courage','initiative','leadership','impulsive'] },
  { number:2,  id:'taurus',      name:'Taurus',      sanskritName:'Vrishabha', symbol:'♉',unicode:'♉', element:'Earth', quality:'Fixed',    ruler:'venus',   color:'#4CAF50', bodyPart:'Face/Neck',      keywords:['stability','wealth','sensual','patient'] },
  { number:3,  id:'gemini',      name:'Gemini',      sanskritName:'Mithuna',  symbol:'♊', unicode:'♊', element:'Air',   quality:'Mutable',  ruler:'mercury', color:'#FFD700', bodyPart:'Arms/Lungs',     keywords:['communication','versatile','intellect','dual'] },
  { number:4,  id:'cancer',      name:'Cancer',      sanskritName:'Kataka',   symbol:'♋', unicode:'♋', element:'Water', quality:'Cardinal', ruler:'moon',    color:'#B0C4DE', bodyPart:'Chest/Heart',    keywords:['nurturing','home','emotions','protective'] },
  { number:5,  id:'leo',         name:'Leo',         sanskritName:'Simha',    symbol:'♌', unicode:'♌', element:'Fire',  quality:'Fixed',    ruler:'sun',     color:'#FF8C42', bodyPart:'Spine/Heart',    keywords:['royalty','creativity','pride','generous'] },
  { number:6,  id:'virgo',       name:'Virgo',       sanskritName:'Kanya',    symbol:'♍', unicode:'♍', element:'Earth', quality:'Mutable',  ruler:'mercury', color:'#66BB6A', bodyPart:'Abdomen',        keywords:['analysis','service','detail','perfectionist'] },
  { number:7,  id:'libra',       name:'Libra',       sanskritName:'Tula',     symbol:'♎', unicode:'♎', element:'Air',   quality:'Cardinal', ruler:'venus',   color:'#CE93D8', bodyPart:'Kidneys',        keywords:['balance','justice','relationships','diplomatic'] },
  { number:8,  id:'scorpio',     name:'Scorpio',     sanskritName:'Vrishchika',symbol:'♏',unicode:'♏', element:'Water', quality:'Fixed',    ruler:'mars',    color:'#EF5350', bodyPart:'Genitals',       keywords:['transformation','mystery','intense','occult'] },
  { number:9,  id:'sagittarius', name:'Sagittarius', sanskritName:'Dhanus',   symbol:'♐', unicode:'♐', element:'Fire',  quality:'Mutable',  ruler:'jupiter', color:'#29B6F6', bodyPart:'Thighs/Hips',   keywords:['philosophy','travel','wisdom','optimistic'] },
  { number:10, id:'capricorn',   name:'Capricorn',   sanskritName:'Makara',   symbol:'♑', unicode:'♑', element:'Earth', quality:'Cardinal', ruler:'saturn',  color:'#78909C', bodyPart:'Knees',          keywords:['ambition','discipline','karma','practical'] },
  { number:11, id:'aquarius',    name:'Aquarius',    sanskritName:'Kumbha',   symbol:'♒', unicode:'♒', element:'Air',   quality:'Fixed',    ruler:'saturn',  color:'#7E57C2', bodyPart:'Calves/Ankles',  keywords:['innovation','humanitarian','independent','future'] },
  { number:12, id:'pisces',      name:'Pisces',      sanskritName:'Meena',    symbol:'♓', unicode:'♓', element:'Water', quality:'Mutable',  ruler:'jupiter', color:'#4DB6AC', bodyPart:'Feet',           keywords:['spiritual','compassionate','intuitive','dreamy'] },
];

export const SIGN_BY_ID: Record<string, SignInfo> = Object.fromEntries(
  SIGNS.map(s => [s.id, s])
);

export const SIGN_BY_NUMBER: Record<number, SignInfo> = Object.fromEntries(
  SIGNS.map(s => [s.number, s])
);

export const SIGN_ABBREVIATIONS: Record<string, string> = {
  aries:'Ar', taurus:'Ta', gemini:'Ge', cancer:'Ca', leo:'Le', virgo:'Vi',
  libra:'Li', scorpio:'Sc', sagittarius:'Sg', capricorn:'Cp', aquarius:'Aq', pisces:'Pi',
};
