import { PrismaClient, PropertyType, ListingType, PropertyStatus } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// ============================================================================
// CONFIGURATION
// ============================================================================

const DATA_DIR = path.resolve(__dirname, '../data');
const PUBLIC_UPLOADS = path.resolve(__dirname, '../public/uploads/properties');
const CSV_FILE = path.join(DATA_DIR, 'gorsel_eslestirme.csv');

// Max images per property to copy
const MAX_IMAGES_PER_PROPERTY = 25;

// Image source folders — search ALL folders for every image
const ALL_IMAGE_FOLDERS = [
  path.join(DATA_DIR, 'Satilik'),
  path.join(DATA_DIR, 'Kiralik'),
  path.join(DATA_DIR, 'Kapali'),
  path.join(DATA_DIR, 'Kapali 2'),
  path.join(DATA_DIR, 'Kapali 3'),
];

// ============================================================================
// NEIGHBORHOOD DEFINITIONS
// ============================================================================

interface NeighborhoodDef {
  slug: string;
  nameEn: string;
  nameTr: string;
  district?: string;
  descriptionEn: string;
  descriptionTr: string;
}

const NEIGHBORHOODS: Record<string, NeighborhoodDef> = {
  pera: {
    slug: 'pera',
    nameEn: 'Pera',
    nameTr: 'Pera',
    district: 'Beyoğlu',
    descriptionEn: 'Historic European quarter of Istanbul, known for its grand architecture, consulates, and cultural heritage. Home to İstiklal Avenue and the Pera Palace Hotel.',
    descriptionTr: 'İstanbul\'un tarihi Avrupa mahallesi, görkemli mimarisi, konsoloslukları ve kültürel mirası ile tanınır.',
  },
  'asmali-mescit': {
    slug: 'asmali-mescit',
    nameEn: 'Asmalı Mescit',
    nameTr: 'Asmalı Mescit',
    district: 'Beyoğlu',
    descriptionEn: 'A charming bohemian neighborhood in the heart of Beyoğlu, filled with art galleries, cozy restaurants, and historic apartment buildings.',
    descriptionTr: 'Beyoğlu\'nun kalbinde, sanat galerileri, şirin restoranlar ve tarihi apartmanlarla dolu bohem bir mahalle.',
  },
  cihangir: {
    slug: 'cihangir',
    nameEn: 'Cihangir',
    nameTr: 'Cihangir',
    district: 'Beyoğlu',
    descriptionEn: 'Istanbul\'s artistic and cosmopolitan neighborhood with stunning Bosphorus views, trendy cafes, and a vibrant expat community. Known for its creative energy and bohemian lifestyle.',
    descriptionTr: 'İstanbul\'un sanatsal ve kozmopolit mahallesi, muhteşem Boğaz manzarası, trend kafeler ve canlı yabancı topluluğu ile tanınır.',
  },
  balat: {
    slug: 'balat',
    nameEn: 'Balat',
    nameTr: 'Balat',
    district: 'Fatih',
    descriptionEn: 'One of Istanbul\'s oldest and most colorful neighborhoods, known for its vibrant painted houses, historic churches and synagogues, and a growing art scene.',
    descriptionTr: 'İstanbul\'un en eski ve en renkli mahallelerinden biri, canlı boyalı evleri, tarihi kiliseleri ve sinagogları ile tanınır.',
  },
  taksim: {
    slug: 'taksim',
    nameEn: 'Taksim',
    nameTr: 'Taksim',
    district: 'Beyoğlu',
    descriptionEn: 'The beating heart of modern Istanbul, centered around the iconic Taksim Square and İstiklal Avenue. A hub for culture, entertainment, and city life.',
    descriptionTr: 'Modern İstanbul\'un kalbi, ikonik Taksim Meydanı ve İstiklal Caddesi etrafında konumlanır.',
  },
  galatasaray: {
    slug: 'galatasaray',
    nameEn: 'Galatasaray',
    nameTr: 'Galatasaray',
    district: 'Beyoğlu',
    descriptionEn: 'A prestigious area along İstiklal Avenue, home to the historic Galatasaray High School, upscale boutiques, and some of the finest dining in Istanbul.',
    descriptionTr: 'İstiklal Caddesi üzerinde prestijli bir bölge, tarihi Galatasaray Lisesi ve seçkin butiklerle tanınır.',
  },
  levent: {
    slug: 'levent',
    nameEn: 'Levent',
    nameTr: 'Levent',
    district: 'Beşiktaş',
    descriptionEn: 'Istanbul\'s premier business district and luxury residential area, home to major corporate headquarters, upscale shopping malls, and modern residences.',
    descriptionTr: 'İstanbul\'un önde gelen iş merkezi ve lüks konut bölgesi.',
  },
  akaretler: {
    slug: 'akaretler',
    nameEn: 'Akaretler',
    nameTr: 'Akaretler',
    district: 'Beşiktaş',
    descriptionEn: 'One of Istanbul\'s most exclusive addresses, featuring the famous Akaretler Row Houses — historic terraced residences near Beşiktaş and the Bosphorus.',
    descriptionTr: 'İstanbul\'un en prestijli adreslerinden biri, ünlü Akaretler Sıra Evleri ile tanınır.',
  },
  sisli: {
    slug: 'sisli',
    nameEn: 'Şişli',
    nameTr: 'Şişli',
    district: 'Şişli',
    descriptionEn: 'A major commercial and residential district known for its shopping centers, business offices, and diverse cultural landscape.',
    descriptionTr: 'Alışveriş merkezleri, iş ofisleri ve çeşitli kültürel yapısıyla bilinen büyük bir ticari ve konut bölgesi.',
  },
  macka: {
    slug: 'macka',
    nameEn: 'Maçka',
    nameTr: 'Maçka',
    district: 'Beşiktaş',
    descriptionEn: 'An upscale residential neighborhood nestled between Nişantaşı and the Bosphorus, featuring the beautiful Maçka Park and quiet, tree-lined streets.',
    descriptionTr: 'Nişantaşı ile Boğaz arasında yer alan üst düzey bir konut mahallesi, güzel Maçka Parkı ve sakin, ağaçlı sokakları ile tanınır.',
  },
  tunel: {
    slug: 'tunel',
    nameEn: 'Tünel',
    nameTr: 'Tünel',
    district: 'Beyoğlu',
    descriptionEn: 'Named after the world\'s second-oldest underground railway, Tünel connects Karaköy to Beyoğlu and is known for its antique shops, art galleries, and vibrant nightlife.',
    descriptionTr: 'Dünyanın ikinci en eski yeraltı demiryolunun adını taşıyan Tünel, antika dükkanları ve sanat galerileri ile tanınır.',
  },
  'aynali-cesme': {
    slug: 'aynali-cesme',
    nameEn: 'Aynalı Çeşme',
    nameTr: 'Aynalı Çeşme',
    district: 'Beyoğlu',
    descriptionEn: 'A quiet residential pocket near Taksim with historic homes and a village-like atmosphere in the heart of the city.',
    descriptionTr: 'Taksim yakınında, tarihi evleri ve şehrin kalbinde köy benzeri atmosferi ile sakin bir konut bölgesi.',
  },
  sishane: {
    slug: 'sishane',
    nameEn: 'Şişhane',
    nameTr: 'Şişhane',
    district: 'Beyoğlu',
    descriptionEn: 'A transit hub and rapidly developing area at the start of İstiklal Avenue, connecting Karaköy, Galata, and Beyoğlu.',
    descriptionTr: 'İstiklal Caddesi\'nin başlangıcında hızla gelişen bir bölge.',
  },
  istiklal: {
    slug: 'istiklal',
    nameEn: 'İstiklal Avenue',
    nameTr: 'İstiklal Caddesi',
    district: 'Beyoğlu',
    descriptionEn: 'Istanbul\'s most famous pedestrian street, stretching from Taksim to Tünel. Lined with historic buildings, shops, cafes, and cultural institutions.',
    descriptionTr: 'İstanbul\'un en ünlü yaya caddesi, Taksim\'den Tünel\'e uzanır.',
  },
  tesvikiye: {
    slug: 'tesvikiye',
    nameEn: 'Teşvikiye',
    nameTr: 'Teşvikiye',
    district: 'Şişli',
    descriptionEn: 'An elegant neighborhood adjacent to Nişantaşı, known for its luxury residences, designer boutiques, and the landmark Teşvikiye Mosque.',
    descriptionTr: 'Nişantaşı\'na bitişik şık bir mahalle, lüks konutları ve tasarımcı butikleri ile tanınır.',
  },
  tomtom: {
    slug: 'tomtom',
    nameEn: 'Tomtom',
    nameTr: 'Tomtom',
    district: 'Beyoğlu',
    descriptionEn: 'A charming residential enclave between Galatasaray and Cihangir, featuring the iconic Tomtom Gardens and views of the Bosphorus. Home to several consulates and boutique hotels.',
    descriptionTr: 'Galatasaray ile Cihangir arasında şirin bir konut bölgesi, ikonik Tomtom Gardens ve Boğaz manzarası ile tanınır.',
  },
  gumussuyu: {
    slug: 'gumussuyu',
    nameEn: 'Gümüşsuyu',
    nameTr: 'Gümüşsuyu',
    district: 'Beyoğlu',
    descriptionEn: 'A prestigious hillside neighborhood near Taksim with panoramic Bosphorus views, historic mansions, and quiet tree-lined streets.',
    descriptionTr: 'Taksim yakınında prestijli bir yamaç mahallesi, panoramik Boğaz manzarası ve tarihi konakları ile tanınır.',
  },
  cukurcuma: {
    slug: 'cukurcuma',
    nameEn: 'Çukurcuma',
    nameTr: 'Çukurcuma',
    district: 'Beyoğlu',
    descriptionEn: 'Istanbul\'s antiques district, a bohemian quarter known for its antique shops, art studios, and the Museum of Innocence by Orhan Pamuk.',
    descriptionTr: 'İstanbul\'un antikacılar semti, antika dükkanları, sanat atölyeleri ve Orhan Pamuk\'un Masumiyet Müzesi ile tanınır.',
  },
  tarabya: {
    slug: 'tarabya',
    nameEn: 'Tarabya',
    nameTr: 'Tarabya',
    district: 'Sarıyer',
    descriptionEn: 'A historic waterfront neighborhood on the European side of the Bosphorus, famous for its bay, seafood restaurants, and the Grand Tarabya Hotel.',
    descriptionTr: 'Boğaz\'ın Avrupa yakasında tarihi bir sahil mahallesi, koyu ve deniz ürünleri restoranları ile ünlüdür.',
  },
  ulus: {
    slug: 'ulus',
    nameEn: 'Ulus',
    nameTr: 'Ulus',
    district: 'Beşiktaş',
    descriptionEn: 'An exclusive residential area on the hills above the Bosphorus, home to the Ulus 29 restaurant and some of Istanbul\'s most prestigious addresses.',
    descriptionTr: 'Boğaz\'ın tepelerinde özel bir konut bölgesi, İstanbul\'un en prestijli adreslerinden bazılarına ev sahipliği yapar.',
  },
  acibadem: {
    slug: 'acibadem',
    nameEn: 'Acıbadem',
    nameTr: 'Acıbadem',
    district: 'Kadıköy',
    descriptionEn: 'A well-established residential district on the Asian side of Istanbul, known for its quiet streets, parks, and proximity to the Acıbadem hospital complex.',
    descriptionTr: 'İstanbul\'un Anadolu yakasında köklü bir konut bölgesi, sakin sokakları ve parkları ile tanınır.',
  },
  buyukada: {
    slug: 'buyukada',
    nameEn: 'Büyükada',
    nameTr: 'Büyükada',
    district: 'Adalar',
    descriptionEn: 'The largest of the Princes\' Islands in the Sea of Marmara, a car-free paradise known for its Victorian mansions, pine forests, and horse-drawn carriages.',
    descriptionTr: 'Marmara Denizi\'ndeki Prens Adaları\'nın en büyüğü, Viktorya dönemi konakları ve çam ormanları ile tanınır.',
  },
  kurucesme: {
    slug: 'kurucesme',
    nameEn: 'Kuruçeşme',
    nameTr: 'Kuruçeşme',
    district: 'Beşiktaş',
    descriptionEn: 'A waterfront neighborhood on the Bosphorus between Ortaköy and Arnavutköy, known for its summer venues, upscale dining, and stunning sea views.',
    descriptionTr: 'Ortaköy ile Arnavutköy arasında Boğaz kıyısında bir mahalle, yaz mekanları ve deniz manzarası ile tanınır.',
  },
  besiktas: {
    slug: 'besiktas',
    nameEn: 'Beşiktaş',
    nameTr: 'Beşiktaş',
    district: 'Beşiktaş',
    descriptionEn: 'A vibrant district on the European shore of the Bosphorus, centered around its lively fish market, ferry terminal, and football stadium.',
    descriptionTr: 'Boğaz\'ın Avrupa yakasında canlı bir ilçe, balık pazarı ve vapur iskelesi ile tanınır.',
  },
  firuzaga: {
    slug: 'firuzaga',
    nameEn: 'Firuzağa',
    nameTr: 'Firuzağa',
    district: 'Beyoğlu',
    descriptionEn: 'A hip, village-like neighborhood in the heart of Cihangir/Beyoğlu, centered around a small square with cafes and a vibrant local community.',
    descriptionTr: 'Cihangir/Beyoğlu\'nun kalbinde köy benzeri bir mahalle, küçük meydanı ve canlı yerel topluluğu ile tanınır.',
  },
  emirgan: {
    slug: 'emirgan',
    nameEn: 'Emirgan',
    nameTr: 'Emirgan',
    district: 'Sarıyer',
    descriptionEn: 'A prestigious Bosphorus-side neighborhood famous for its tulip gardens, the historic Emirgan Park, and elegant waterside mansions (yalıs).',
    descriptionTr: 'Lale bahçeleri, tarihi Emirgan Korusu ve zarif yalıları ile ünlü prestijli bir Boğaz mahallesi.',
  },
  'rumeli-hisari': {
    slug: 'rumeli-hisari',
    nameEn: 'Rumeli Hisarı',
    nameTr: 'Rumeli Hisarı',
    district: 'Sarıyer',
    descriptionEn: 'Home to the iconic Rumeli Fortress overlooking the Bosphorus, this exclusive neighborhood offers stunning views and proximity to Boğaziçi University.',
    descriptionTr: 'Boğaz\'a bakan ikonik Rumeli Hisarı\'na ev sahipliği yapan bu özel mahalle, muhteşem manzaralar sunar.',
  },
  beyoglu: {
    slug: 'beyoglu',
    nameEn: 'Beyoğlu',
    nameTr: 'Beyoğlu',
    district: 'Beyoğlu',
    descriptionEn: 'Istanbul\'s cultural and entertainment heart, encompassing iconic areas like İstiklal Avenue, Galata, and Taksim. A melting pot of history, art, nightlife, and cosmopolitan energy.',
    descriptionTr: 'İstanbul\'un kültür ve eğlence kalbi, İstiklal Caddesi, Galata ve Taksim gibi ikonik bölgeleri kapsar.',
  },
  kumbaraci: {
    slug: 'kumbaraci',
    nameEn: 'Kumbaracı',
    nameTr: 'Kumbaracı',
    district: 'Beyoğlu',
    descriptionEn: 'A steep, atmospheric street connecting Tünel to Cihangir, lined with art studios, small galleries, and colorful apartment buildings.',
    descriptionTr: 'Tünel\'i Cihangir\'e bağlayan atmosferik bir sokak, sanat atölyeleri ve renkli apartmanlarla çevrili.',
  },
  mesrutiyet: {
    slug: 'mesrutiyet',
    nameEn: 'Meşrutiyet',
    nameTr: 'Meşrutiyet',
    district: 'Beyoğlu',
    descriptionEn: 'A historic avenue in Pera/Tepebaşı, home to the Pera Palace Hotel, consulates, and grand 19th-century buildings.',
    descriptionTr: 'Pera/Tepebaşı\'nda tarihi bir cadde, Pera Palas Oteli ve konsolosluklara ev sahipliği yapar.',
  },
  resitpasa: {
    slug: 'resitpasa',
    nameEn: 'Reşitpaşa',
    nameTr: 'Reşitpaşa',
    district: 'Sarıyer',
    descriptionEn: 'A developing neighborhood near the Maslak business district, offering modern residential projects and green spaces.',
    descriptionTr: 'Maslak iş bölgesine yakın gelişen bir mahalle, modern konut projeleri ve yeşil alanlar sunar.',
  },
  fethiye: {
    slug: 'fethiye',
    nameEn: 'Fethiye',
    nameTr: 'Fethiye',
    district: 'Muğla',
    descriptionEn: 'A stunning coastal town on the Turkish Riviera, famous for the Blue Lagoon at Ölüdeniz, ancient Lycian ruins, and turquoise waters.',
    descriptionTr: 'Türk Rivierası\'nda muhteşem bir sahil kasabası, Ölüdeniz\'deki Mavi Lagün ve antik Likya kalıntıları ile ünlüdür.',
  },
};

// Title-to-neighborhood keyword matching (order matters — more specific first)
const NEIGHBORHOOD_KEYWORDS: [string, string][] = [
  ['Asmalı Mescit', 'asmali-mescit'],
  ['Asmalimescit', 'asmali-mescit'],
  ['Aynalı Çeşme', 'aynali-cesme'],
  ['Rumeli Hisari', 'rumeli-hisari'],
  ['Rumeli Hisarı', 'rumeli-hisari'],
  ['Kumbaracı', 'kumbaraci'],
  ['Meşrutiyet', 'mesrutiyet'],
  ['Galatasaray', 'galatasaray'],
  ['Gümüşsuyu', 'gumussuyu'],
  ['Gumussuyu', 'gumussuyu'],
  ['Kuruçeşme', 'kurucesme'],
  ['Tesvikiye', 'tesvikiye'],
  ['Teşvikiye', 'tesvikiye'],
  ['Çukurcuma', 'cukurcuma'],
  ['Cukurcuma', 'cukurcuma'],
  ['Büyükada', 'buyukada'],
  ['Acıbadem', 'acibadem'],
  ['Acibadem', 'acibadem'],
  ['Reşitpaşa', 'resitpasa'],
  ['Resitpasa', 'resitpasa'],
  ['Firuzağa', 'firuzaga'],
  ['Firuzaga', 'firuzaga'],
  ['Nişantaşı', 'nisantasi'],
  ['Nisantasi', 'nisantasi'],
  ['Cihangir', 'cihangir'],
  ['Akaretler', 'akaretler'],
  ['Beşiktaş', 'besiktas'],
  ['Besiktas', 'besiktas'],
  ['Emirgan', 'emirgan'],
  ['Tarabya', 'tarabya'],
  ['Şişhane', 'sishane'],
  ['Galata', 'galata'],
  ['Tomtom', 'tomtom'],
  ['Taksim', 'taksim'],
  ['Levent', 'levent'],
  ['Balat', 'balat'],
  ['Maçka', 'macka'],
  ['Macka', 'macka'],
  ['Pera', 'pera'],
  ['Ulus', 'ulus'],
  ['Tunel', 'tunel'],
  ['Tünel', 'tunel'],
  ['Tunnel', 'tunel'],
  ['İstiklal', 'istiklal'],
  ['Istiklal', 'istiklal'],
  ['Sarıyer', 'sariyer'],
  ['Beyoğlu', 'beyoglu'],
  ['Bebek', 'bebek'],
  ['Şişli', 'sisli'],
  ['Sisli', 'sisli'],
  ['Fethiye', 'fethiye'],
  ['Gocek', 'fethiye'],
  ['Göcek', 'fethiye'],
  ['Yıldız', 'besiktas'],
];

// ============================================================================
// TITLE PARSING HELPERS
// ============================================================================

function extractRooms(title: string): { bedrooms: number; bathrooms: number } {
  const match = title.match(/(\d)\+(\d)/);
  if (match) {
    return { bedrooms: parseInt(match[1]), bathrooms: parseInt(match[2]) };
  }
  // Studio
  if (title.toLowerCase().includes('studio')) {
    return { bedrooms: 0, bathrooms: 1 };
  }
  return { bedrooms: 0, bathrooms: 0 };
}

function extractSize(title: string): number | null {
  // "160sqm", "900sqm", "160 sqm", "150 sqm"
  const match = title.match(/(\d+)\s?sqm/i);
  if (match) return parseInt(match[1]);
  // "160sqm" pattern also in the middle
  const match2 = title.match(/(\d+)sqm/i);
  if (match2) return parseInt(match2[1]);
  return null;
}

function extractFloors(title: string): number | null {
  const match = title.match(/(\d+)[-\s]?[Ss]tore?y/);
  if (match) return parseInt(match[1]);
  return null;
}

function extractPropertyType(title: string): PropertyType {
  const t = title.toLowerCase();
  if (t.includes('villa')) return 'VILLA';
  if (t.includes('penthouse')) return 'PENTHOUSE';
  if (t.includes('duplex') && t.includes('office')) return 'OFFICE';
  if (t.includes('duplex')) return 'DUPLEX';
  if (t.includes('triplex') && !t.includes('villa')) return 'DUPLEX';
  if (t.includes('fourlex')) return 'BUILDING';
  if (t.includes('mansion')) return 'YALI';
  if (t.includes('storey') || t.includes('story') || t.includes('storeys')) {
    if (t.includes('building')) return 'BUILDING';
  }
  if (t.includes('building for sale') || t.includes('building for rent') || t.includes('rental building') || t.includes('building in')) return 'BUILDING';
  if (t.includes('office')) return 'OFFICE';
  if (t.includes('store ') || t.includes('shop') || t.includes('bar/restaurant') || t.includes('workshop')) return 'RETAIL';
  if (t.includes('house')) return 'VILLA';
  if (t.includes('residence') && !t.includes('building')) return 'APARTMENT';
  if (t.includes('flat') || t.includes('apartment') || t.includes('aparment') || t.includes('rental in')) return 'APARTMENT';
  if (t.includes('building')) return 'BUILDING';
  if (t.includes('studio')) return 'APARTMENT';
  return 'OTHER';
}

function extractListingType(title: string, kategori: string): ListingType {
  // For Kapali, determine from title text
  if (kategori === 'Kapali') {
    const t = title.toLowerCase();
    if (t.includes('for rent') || t.includes('rental') || t.includes('for rent') || t.includes('kiralık')) return 'RENT';
    if (t.includes('for sale') || t.includes('satılık')) return 'SALE';
    // Default Kapali to SALE
    return 'SALE';
  }
  return kategori === 'Kiralik' ? 'RENT' : 'SALE';
}

function extractNeighborhood(title: string): string | null {
  for (const [keyword, slug] of NEIGHBORHOOD_KEYWORDS) {
    if (title.includes(keyword)) {
      return slug;
    }
  }
  return null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/İ/g, 'i')
    .replace(/Ş/g, 's')
    .replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

// ============================================================================
// CSV PARSING
// ============================================================================

interface CsvRow {
  ilan_id: string;
  ilan_baslik: string;
  kategori: string;
  gorsel_sira: string;
  gorsel_dosya: string;
  orijinal_dosya: string;
}

function parseCSV(filePath: string): CsvRow[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const firstComma = line.indexOf(',');
    const ilan_id = line.substring(0, firstComma);

    let kategori = '';
    let kategoriIdx = -1;

    for (const cat of ['Satilik', 'Kiralik', 'Kapali']) {
      const searchStr = ',' + cat + ',';
      const idx = line.indexOf(searchStr, firstComma);
      if (idx !== -1) {
        kategori = cat;
        kategoriIdx = idx;
        break;
      }
    }

    if (!kategori || kategoriIdx === -1) continue;

    const ilan_baslik = line.substring(firstComma + 1, kategoriIdx);
    const rest = line.substring(kategoriIdx + 1 + kategori.length + 1);
    const parts = rest.split(',');

    if (parts.length < 3) continue;

    rows.push({
      ilan_id,
      ilan_baslik,
      kategori,
      gorsel_sira: parts[0],
      gorsel_dosya: parts[1],
      orijinal_dosya: parts.slice(2).join(','),
    });
  }

  return rows;
}

// ============================================================================
// IMAGE COPY HELPER
// ============================================================================

function findAndCopyImage(filename: string): string | null {
  for (const folder of ALL_IMAGE_FOLDERS) {
    const srcPath = path.join(folder, filename);
    if (fs.existsSync(srcPath)) {
      const destPath = path.join(PUBLIC_UPLOADS, filename);
      if (!fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
      return `/uploads/properties/${filename}`;
    }
  }
  return null;
}

// ============================================================================
// MAIN IMPORT
// ============================================================================

async function main() {
  console.log('Starting FULL data import (ALL categories)...\n');

  // Ensure uploads directory exists
  if (!fs.existsSync(PUBLIC_UPLOADS)) {
    fs.mkdirSync(PUBLIC_UPLOADS, { recursive: true });
  }

  // 1. Parse CSV
  console.log('Parsing CSV...');
  const allRows = parseCSV(CSV_FILE);
  console.log(`  Total rows: ${allRows.length}`);

  // Count by category
  const catCounts: Record<string, number> = {};
  for (const r of allRows) {
    catCounts[r.kategori] = (catCounts[r.kategori] || 0) + 1;
  }
  for (const [cat, count] of Object.entries(catCounts)) {
    console.log(`    ${cat}: ${count} image rows`);
  }

  // 2. Group ALL rows by property ID (no filtering)
  const propertiesMap = new Map<string, { title: string; kategori: string; images: { filename: string; order: number }[] }>();

  for (const row of allRows) {
    if (!propertiesMap.has(row.ilan_id)) {
      propertiesMap.set(row.ilan_id, {
        title: row.ilan_baslik,
        kategori: row.kategori,
        images: [],
      });
    }
    propertiesMap.get(row.ilan_id)!.images.push({
      filename: row.gorsel_dosya,
      order: parseInt(row.gorsel_sira) || 0,
    });
  }

  console.log(`  Unique properties: ${propertiesMap.size}`);

  // Sort images by order
  for (const prop of propertiesMap.values()) {
    prop.images.sort((a, b) => a.order - b.order);
  }

  // 3. Get admin user
  const admin = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
  if (!admin) {
    console.error('No admin user found! Run seed first.');
    process.exit(1);
  }
  console.log(`  Using agent: ${admin.name} (${admin.email})`);

  // 4. Ensure all neighborhoods exist
  console.log('\nCreating neighborhoods...');
  const neighborhoodIds: Record<string, string> = {};

  const existingNeighborhoods = await prisma.neighborhood.findMany();
  for (const n of existingNeighborhoods) {
    neighborhoodIds[n.slug] = n.id;
  }
  console.log(`  Existing neighborhoods: ${existingNeighborhoods.length}`);

  for (const [slug, def] of Object.entries(NEIGHBORHOODS)) {
    if (neighborhoodIds[slug]) continue;

    const n = await prisma.neighborhood.create({
      data: {
        name: { en: def.nameEn, tr: def.nameTr },
        slug: def.slug,
        district: def.district,
        city: def.slug === 'fethiye' ? 'Fethiye' : 'Istanbul',
        description: { en: def.descriptionEn, tr: def.descriptionTr },
        shortDescription: { en: def.descriptionEn.split('.')[0] + '.', tr: def.descriptionTr.split('.')[0] + '.' },
        isActive: true,
        isFeatured: false,
        order: Object.keys(neighborhoodIds).length + 1,
      },
    });
    neighborhoodIds[slug] = n.id;
    console.log(`  Created: ${def.nameEn}`);
  }

  // 5. Import all properties
  console.log('\nImporting properties...');
  let created = 0;
  let skipped = 0;
  let imagesCopied = 0;
  let errors = 0;

  const sortedEntries = Array.from(propertiesMap.entries()).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

  for (const [ilanId, prop] of sortedEntries) {
    const title = prop.title;
    let slug = slugify(title);

    // Check if slug already exists (handle duplicates by appending ilanId)
    const existing = await prisma.property.findUnique({ where: { slug } });
    if (existing) {
      // Try with ID suffix
      slug = slug.substring(0, 70) + '-' + ilanId;
      const existing2 = await prisma.property.findUnique({ where: { slug } });
      if (existing2) {
        console.log(`  SKIP (exists): [${ilanId}] ${title}`);
        skipped++;
        continue;
      }
    }

    // Parse data from title
    const rooms = extractRooms(title);
    const size = extractSize(title);
    const floors = extractFloors(title);
    const propertyType = extractPropertyType(title);
    const neighborhoodSlug = extractNeighborhood(title);
    const listingType = extractListingType(title, prop.kategori);

    // Determine property status based on category
    let status: PropertyStatus;
    if (prop.kategori === 'Kapali') {
      status = listingType === 'RENT' ? 'RENTED' : 'SOLD';
    } else {
      status = 'PUBLISHED';
    }

    // Determine neighborhood name
    let neighborhoodName = 'Beyoğlu';
    if (neighborhoodSlug) {
      if (NEIGHBORHOODS[neighborhoodSlug]) {
        neighborhoodName = NEIGHBORHOODS[neighborhoodSlug].nameEn;
      } else {
        const existingN = existingNeighborhoods.find(n => n.slug === neighborhoodSlug);
        if (existingN) {
          neighborhoodName = (existingN.name as any).en;
        }
      }
    }

    // Determine district
    let district = 'Beyoğlu';
    if (neighborhoodSlug && NEIGHBORHOODS[neighborhoodSlug]) {
      district = NEIGHBORHOODS[neighborhoodSlug].district || 'Beyoğlu';
    }

    // Copy images
    const imagesToImport = prop.images.slice(0, MAX_IMAGES_PER_PROPERTY);
    const imageRecords: { url: string; order: number; isPrimary: boolean }[] = [];

    for (let i = 0; i < imagesToImport.length; i++) {
      const img = imagesToImport[i];
      const url = findAndCopyImage(img.filename);
      if (url) {
        imageRecords.push({ url, order: i, isPrimary: i === 0 });
        imagesCopied++;
      }
    }

    if (imageRecords.length === 0) {
      console.log(`  SKIP (no images found): [${ilanId}] ${title}`);
      skipped++;
      continue;
    }

    // Create property
    try {
      await prisma.property.create({
        data: {
          title: { en: title, tr: title },
          slug,
          description: {
            en: `${title}. Located in the prestigious ${neighborhoodName} area of Istanbul. Contact us for more details and to schedule a viewing.`,
            tr: `${title}. İstanbul'un prestijli ${neighborhoodName} bölgesinde yer almaktadır. Daha fazla bilgi ve randevu için bizimle iletişime geçin.`,
          },
          address: `${neighborhoodName}, ${district}, Istanbul`,
          neighborhood: neighborhoodName,
          neighborhoodId: neighborhoodSlug ? (neighborhoodIds[neighborhoodSlug] || null) : null,
          district,
          city: neighborhoodSlug === 'fethiye' ? 'Fethiye' : 'Istanbul',
          country: 'Turkey',
          price: 0,
          currency: 'EUR',
          showPrice: false,
          propertyType,
          listingType,
          status,
          bedrooms: rooms.bedrooms,
          bathrooms: rooms.bathrooms,
          size: size || 0,
          floors,
          features: [],
          isFeatured: false,
          isNew: prop.kategori !== 'Kapali',
          agentId: admin.id,
          publishedAt: new Date(),
          images: {
            create: imageRecords,
          },
        },
      });
      created++;
      const statusLabel = prop.kategori === 'Kapali' ? `[${status}]` : `[${status}]`;
      console.log(`  OK: [${ilanId}] ${title} (${imageRecords.length} imgs, ${propertyType}, ${listingType}, ${statusLabel})`);
    } catch (err: any) {
      console.error(`  ERROR: [${ilanId}] ${title}: ${err.message}`);
      errors++;
    }
  }

  // 6. Update neighborhood property counts (count all statuses)
  console.log('\nUpdating neighborhood property counts...');
  const allNeighborhoods = await prisma.neighborhood.findMany();
  for (const n of allNeighborhoods) {
    const count = await prisma.property.count({
      where: { neighborhoodId: n.id },
    });
    await prisma.neighborhood.update({
      where: { id: n.id },
      data: { propertyCount: count },
    });
    if (count > 0) {
      console.log(`  ${(n.name as any).en}: ${count} properties`);
    }
  }

  // 7. Update collections
  console.log('\nUpdating collections...');

  const collectionDefs = [
    {
      slug: 'for-sale',
      title: { en: 'Properties for Sale', tr: 'Satılık Mülkler' },
      description: { en: 'Browse our selection of properties for sale in Istanbul', tr: 'İstanbul\'da satılık mülklerimize göz atın' },
      link: '/properties?type=sale',
      countWhere: { listingType: 'SALE' as ListingType, status: 'PUBLISHED' as PropertyStatus },
    },
    {
      slug: 'for-rent',
      title: { en: 'Properties for Rent', tr: 'Kiralık Mülkler' },
      description: { en: 'Browse our selection of rental properties in Istanbul', tr: 'İstanbul\'da kiralık mülklerimize göz atın' },
      link: '/properties?type=rent',
      countWhere: { listingType: 'RENT' as ListingType, status: 'PUBLISHED' as PropertyStatus },
    },
    {
      slug: 'historical-buildings',
      title: { en: 'Historical Buildings', tr: 'Tarihi Binalar' },
      description: { en: 'Unique historical buildings and restored properties', tr: 'Eşsiz tarihi binalar ve restore edilmiş mülkler' },
      link: '/properties?type=BUILDING',
      countWhere: { propertyType: 'BUILDING' as PropertyType },
    },
    {
      slug: 'luxury-apartments',
      title: { en: 'Luxury Apartments', tr: 'Lüks Daireler' },
      description: { en: 'Premium apartments in Istanbul\'s finest neighborhoods', tr: 'İstanbul\'un en iyi mahallelerinde premium daireler' },
      link: '/properties?type=APARTMENT',
      countWhere: { propertyType: 'APARTMENT' as PropertyType },
    },
    {
      slug: 'sold-properties',
      title: { en: 'Sold Properties', tr: 'Satılmış Mülkler' },
      description: { en: 'Previously sold properties from our portfolio', tr: 'Portföyümüzden daha önce satılmış mülkler' },
      link: '/properties?status=sold',
      countWhere: { status: 'SOLD' as PropertyStatus },
    },
    {
      slug: 'rented-properties',
      title: { en: 'Rented Properties', tr: 'Kiralanmış Mülkler' },
      description: { en: 'Previously rented properties from our portfolio', tr: 'Portföyümüzden daha önce kiralanmış mülkler' },
      link: '/properties?status=rented',
      countWhere: { status: 'RENTED' as PropertyStatus },
    },
  ];

  for (const def of collectionDefs) {
    const count = await prisma.property.count({ where: def.countWhere });
    await prisma.collection.upsert({
      where: { slug: def.slug },
      update: { propertyCount: count },
      create: {
        title: def.title,
        slug: def.slug,
        description: def.description,
        link: def.link,
        propertyCount: count,
        isActive: true,
        isFeatured: true,
        order: collectionDefs.indexOf(def) + 10,
      },
    });
    console.log(`  ${(def.title as any).en}: ${count} properties`);
  }

  // 8. Stats summary
  const totalProperties = await prisma.property.count();
  const totalImages = await prisma.propertyImage.count();
  const totalNeighborhoods = await prisma.neighborhood.count();

  console.log('\n========================================');
  console.log('FULL IMPORT COMPLETE');
  console.log('========================================');
  console.log(`  New properties created: ${created}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Images copied this run: ${imagesCopied}`);
  console.log('----------------------------------------');
  console.log(`  Total properties in DB: ${totalProperties}`);
  console.log(`  Total images in DB: ${totalImages}`);
  console.log(`  Total neighborhoods: ${totalNeighborhoods}`);
  console.log('========================================\n');
}

main()
  .catch((e) => {
    console.error('Import error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
