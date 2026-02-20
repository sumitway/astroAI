export interface NakshatraInfo {
  number: number;
  id: string;
  name: string;
  meaning: string;
  deity: string;
  lord: string;
  symbol: string;
  nature: 'Deva' | 'Manushya' | 'Rakshasa';
  gana: string;
  nadi: 'Vata' | 'Pitta' | 'Kapha';
  caste: string;
  quality: 'Movable' | 'Fixed' | 'Sharp' | 'Soft/Tender' | 'Mixed' | 'Fierce/Severe' | 'Dreadful';
  pada: [string, string, string, string];
  signSpan: [number, string]; // [sign number, degrees range]
  dashaYears: number;
  keywords: string[];
}

export const NAKSHATRAS: NakshatraInfo[] = [
  { number:1,  id:'ashwini',      name:'Ashwini',      meaning:'The Horse Lady',       deity:'Ashwini Kumaras', lord:'ketu',    symbol:'Horse Head',    nature:'Deva',     gana:'Deva',     nadi:'Vata',  caste:'Vaishya',   quality:'Movable',     pada:['Le','Vi','Li','Sc'], signSpan:[1,'0°-13°20\''],  dashaYears:7,  keywords:['healing','speed','initiation','horse'] },
  { number:2,  id:'bharani',      name:'Bharani',       meaning:'The Bearer',          deity:'Yama',            lord:'venus',   symbol:'Yoni (Vulva)',  nature:'Manushya', gana:'Manushya', nadi:'Pitta', caste:'Mleccha',   quality:'Fierce/Severe',pada:['Ta','Ge','Ca','Le'], signSpan:[1,'13°20\'-26°40\'' ], dashaYears:20, keywords:['transformation','death','rebirth','restraint'] },
  { number:3,  id:'krittika',     name:'Krittika',      meaning:'The Cutter',          deity:'Agni',            lord:'sun',     symbol:'Razor/Flame',   nature:'Rakshasa', gana:'Rakshasa', nadi:'Kapha', caste:'Brahmin',   quality:'Mixed',       pada:['Vi','Li','Sc','Sg'], signSpan:[1,'26°40\'-30°/2:0°-10°'],dashaYears:6,keywords:['fire','purification','sharp','piercing'] },
  { number:4,  id:'rohini',       name:'Rohini',        meaning:'The Red One',         deity:'Brahma',          lord:'moon',    symbol:'Cart/Chariot',  nature:'Manushya', gana:'Manushya', nadi:'Pitta', caste:'Shudra',    quality:'Fixed',       pada:['Cp','Aq','Pi','Ar'], signSpan:[2,'10°-23°20\''], dashaYears:10, keywords:['fertility','beauty','abundance','growth'] },
  { number:5,  id:'mrigashira',   name:'Mrigashira',    meaning:'Deer Head',           deity:'Soma (Moon)',     lord:'mars',    symbol:'Deer Head',     nature:'Deva',     gana:'Deva',     nadi:'Vata',  caste:'Farmer',    quality:'Soft/Tender', pada:['Ta','Ge','Ca','Le'], signSpan:[2,'23°20\'-30°/3:0°-6°40\''],dashaYears:7,keywords:['searching','seeking','gentle','beauty'] },
  { number:6,  id:'ardra',        name:'Ardra',          meaning:'The Moist One',      deity:'Rudra',           lord:'rahu',    symbol:'Teardrop',      nature:'Manushya', gana:'Manushya', nadi:'Kapha', caste:'Butcher',   quality:'Sharp',       pada:['Vi','Li','Sc','Sg'], signSpan:[3,'6°40\'-20°'],  dashaYears:18, keywords:['storm','destruction','renewal','tears'] },
  { number:7,  id:'punarvasu',    name:'Punarvasu',      meaning:'Return of Light',    deity:'Aditi',           lord:'jupiter', symbol:'Bow/Quiver',    nature:'Deva',     gana:'Deva',     nadi:'Vata',  caste:'Vaishya',   quality:'Movable',     pada:['Cp','Aq','Pi','Ar'], signSpan:[3,'20°-30°/4:0°-3°20\''],dashaYears:16,keywords:['renewal','goodness','return','expansion'] },
  { number:8,  id:'pushya',       name:'Pushya',         meaning:'Nourisher',          deity:'Brihaspati',      lord:'saturn',  symbol:'Cow Udder',     nature:'Deva',     gana:'Deva',     nadi:'Pitta', caste:'Kshatriya', quality:'Movable',     pada:['Ta','Ge','Ca','Le'], signSpan:[4,'3°20\'-16°40\''],dashaYears:19,keywords:['nourishment','care','protection','wealth'] },
  { number:9,  id:'ashlesha',     name:'Ashlesha',       meaning:'The Embracer',       deity:'Nagas (Serpents)',lord:'mercury', symbol:'Serpent',       nature:'Rakshasa', gana:'Rakshasa', nadi:'Kapha', caste:'Mleccha',   quality:'Sharp',       pada:['Vi','Li','Sc','Sg'], signSpan:[4,'16°40\'-30°'], dashaYears:17, keywords:['serpent','mysticism','poison','cunning'] },
  { number:10, id:'magha',        name:'Magha',          meaning:'The Mighty One',     deity:'Pitrs (Ancestors)',lord:'ketu',  symbol:'Royal Throne',  nature:'Rakshasa', gana:'Rakshasa', nadi:'Vata',  caste:'Shudra',    quality:'Fierce/Severe',pada:['Cp','Aq','Pi','Ar'], signSpan:[5,'0°-13°20\''],  dashaYears:7,  keywords:['royalty','ancestors','power','authority'] },
  { number:11, id:'purva_phalguni',name:'Purva Phalguni',meaning:'First Reddish One', deity:'Bhaga',           lord:'venus',   symbol:'Hammock',       nature:'Manushya', gana:'Manushya', nadi:'Pitta', caste:'Brahmin',   quality:'Fierce/Severe',pada:['Ta','Ge','Ca','Le'], signSpan:[5,'13°20\'-26°40\''],dashaYears:20,keywords:['pleasure','rest','creativity','love'] },
  { number:12, id:'uttara_phalguni',name:'Uttara Phalguni',meaning:'Latter Reddish One',deity:'Aryaman',       lord:'sun',     symbol:'Bed/Fig Tree',  nature:'Manushya', gana:'Manushya', nadi:'Kapha', caste:'Kshatriya', quality:'Fixed',       pada:['Vi','Li','Sc','Sg'], signSpan:[5,'26°40\'-30°/6:0°-10°'],dashaYears:6,keywords:['patronage','social','contract','union'] },
  { number:13, id:'hasta',        name:'Hasta',          meaning:'The Hand',           deity:'Savitar',         lord:'moon',    symbol:'Hand/Fist',     nature:'Deva',     gana:'Deva',     nadi:'Vata',  caste:'Vaishya',   quality:'Movable',     pada:['Cp','Aq','Pi','Ar'], signSpan:[6,'10°-23°20\''], dashaYears:10, keywords:['skill','craftsmanship','healing hands','dexterity'] },
  { number:14, id:'chitra',       name:'Chitra',         meaning:'The Brilliant',      deity:'Vishwakarma',     lord:'mars',    symbol:'Pearl/Jewel',   nature:'Rakshasa', gana:'Rakshasa', nadi:'Pitta', caste:'Farmer',    quality:'Soft/Tender', pada:['Ta','Ge','Ca','Le'], signSpan:[6,'23°20\'-30°/7:0°-6°40\''],dashaYears:7,keywords:['art','creation','beauty','architecture'] },
  { number:15, id:'swati',        name:'Swati',          meaning:'Independent One',    deity:'Vayu (Wind)',     lord:'rahu',    symbol:'Sword/Coral',   nature:'Deva',     gana:'Deva',     nadi:'Kapha', caste:'Butcher',   quality:'Movable',     pada:['Vi','Li','Sc','Sg'], signSpan:[7,'6°40\'-20°'],  dashaYears:18, keywords:['independence','freedom','trade','wind'] },
  { number:16, id:'vishakha',     name:'Vishakha',       meaning:'Forked Branches',    deity:'Indra-Agni',      lord:'jupiter', symbol:'Triumphal Arch',nature:'Rakshasa', gana:'Rakshasa', nadi:'Vata',  caste:'Mleccha',   quality:'Mixed',       pada:['Cp','Aq','Pi','Ar'], signSpan:[7,'20°-30°/8:0°-3°20\''],dashaYears:16,keywords:['goal-oriented','determination','ambition','harvest'] },
  { number:17, id:'anuradha',     name:'Anuradha',       meaning:'Following Radha',    deity:'Mitra',           lord:'saturn',  symbol:'Lotus/Star',    nature:'Deva',     gana:'Deva',     nadi:'Pitta', caste:'Shudra',    quality:'Soft/Tender', pada:['Ta','Ge','Ca','Le'], signSpan:[8,'3°20\'-16°40\''],dashaYears:19,keywords:['friendship','devotion','organization','follow'] },
  { number:18, id:'jyeshtha',     name:'Jyeshtha',       meaning:'The Elder',          deity:'Indra',           lord:'mercury', symbol:'Earring/Talisman',nature:'Rakshasa',gana:'Rakshasa',nadi:'Kapha', caste:'Farmer',    quality:'Sharp',       pada:['Vi','Li','Sc','Sg'], signSpan:[8,'16°40\'-30°'], dashaYears:17, keywords:['eldest','power','heroism','protection'] },
  { number:19, id:'mula',         name:'Mula',           meaning:'The Root',           deity:'Nirriti (Kali)',  lord:'ketu',    symbol:'Root/Tail',     nature:'Rakshasa', gana:'Rakshasa', nadi:'Vata',  caste:'Butcher',   quality:'Dreadful',    pada:['Cp','Aq','Pi','Ar'], signSpan:[9,'0°-13°20\''],  dashaYears:7,  keywords:['root','foundation','destruction','research'] },
  { number:20, id:'purva_ashadha',name:'Purva Ashadha',  meaning:'First Invincible',   deity:'Apas (Water)',    lord:'venus',   symbol:'Fan/Winnowing', nature:'Manushya', gana:'Manushya', nadi:'Pitta', caste:'Brahmin',   quality:'Fierce/Severe',pada:['Ta','Ge','Ca','Le'], signSpan:[9,'13°20\'-26°40\''],dashaYears:20,keywords:['invincibility','purification','early victory','water'] },
  { number:21, id:'uttara_ashadha',name:'Uttara Ashadha',meaning:'Latter Invincible', deity:'Vishwadevas',     lord:'sun',     symbol:'Elephant Tusk', nature:'Manushya', gana:'Manushya', nadi:'Kapha', caste:'Kshatriya', quality:'Fixed',       pada:['Vi','Li','Sc','Sg'], signSpan:[9,'26°40\'-30°/10:0°-10°'],dashaYears:6,keywords:['final victory','ethics','leadership','righteousness'] },
  { number:22, id:'shravana',     name:'Shravana',       meaning:'Hearing',            deity:'Vishnu',          lord:'moon',    symbol:'Ear/Three Footprints',nature:'Deva',gana:'Deva',   nadi:'Vata',  caste:'Mleccha',   quality:'Movable',     pada:['Cp','Aq','Pi','Ar'], signSpan:[10,'10°-23°20\''], dashaYears:10, keywords:['listening','learning','preservation','connection'] },
  { number:23, id:'dhanishtha',   name:'Dhanishtha',     meaning:'Wealthy',            deity:'Ashta Vasus',     lord:'mars',    symbol:'Drum/Flute',    nature:'Rakshasa', gana:'Rakshasa', nadi:'Pitta', caste:'Farmer',    quality:'Movable',     pada:['Ta','Ge','Ca','Le'], signSpan:[10,'23°20\'-30°/11:0°-6°40\''],dashaYears:7,keywords:['wealth','music','rhythm','abundance'] },
  { number:24, id:'shatabhisha',  name:'Shatabhisha',    meaning:'100 Healers',        deity:'Varuna',          lord:'rahu',    symbol:'Empty Circle',  nature:'Rakshasa', gana:'Rakshasa', nadi:'Kapha', caste:'Butcher',   quality:'Movable',     pada:['Vi','Li','Sc','Sg'], signSpan:[11,'6°40\'-20°'],  dashaYears:18, keywords:['healing','mystery','isolation','100 stars'] },
  { number:25, id:'purva_bhadra', name:'Purva Bhadrapada',meaning:'First Blessed Feet',deity:'Aja Ekapada',   lord:'jupiter', symbol:'Sword/Two Front Legs',nature:'Manushya',gana:'Manushya',nadi:'Vata', caste:'Brahmin',   quality:'Fierce/Severe',pada:['Cp','Aq','Pi','Ar'], signSpan:[11,'20°-30°/12:0°-3°20\''],dashaYears:16,keywords:['asceticism','transformation','one-footed goat','intensity'] },
  { number:26, id:'uttara_bhadra',name:'Uttara Bhadrapada',meaning:'Latter Blessed Feet',deity:'Ahir Budhnya', lord:'saturn',  symbol:'Twins/Serpent in Water',nature:'Manushya',gana:'Manushya',nadi:'Pitta',caste:'Kshatriya',quality:'Fixed',pada:['Ta','Ge','Ca','Le'], signSpan:[12,'3°20\'-16°40\''],dashaYears:19,keywords:['depth','wisdom','endurance','rain-bringer'] },
  { number:27, id:'revati',       name:'Revati',          meaning:'The Wealthy',       deity:'Pushan',          lord:'mercury', symbol:'Fish/Drum',     nature:'Deva',     gana:'Deva',     nadi:'Kapha', caste:'Shudra',    quality:'Soft/Tender', pada:['Vi','Li','Sc','Sg'], signSpan:[12,'16°40\'-30°'], dashaYears:17, keywords:['nourishment','protection','journey','fertile'] },
];

export const NAKSHATRA_BY_ID: Record<string, NakshatraInfo> = Object.fromEntries(
  NAKSHATRAS.map(n => [n.id, n])
);

export const NAKSHATRA_BY_NUMBER: Record<number, NakshatraInfo> = Object.fromEntries(
  NAKSHATRAS.map(n => [n.number, n])
);

/** Vimshottari dasha years by planet */
export const VIMSHOTTARI_YEARS: Record<string, number> = {
  ketu: 7, venus: 20, sun: 6, moon: 10, mars: 7,
  rahu: 18, jupiter: 16, saturn: 19, mercury: 17,
};

export const VIMSHOTTARI_ORDER = ['ketu','venus','sun','moon','mars','rahu','jupiter','saturn','mercury'];
