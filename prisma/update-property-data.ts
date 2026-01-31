import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const DATA_DIR = path.resolve(__dirname, '../data');
const CSV_FILE = path.join(DATA_DIR, 'ilanlar_tumu.csv');

// ============================================================================
// CSV PARSING (handles commas in quoted fields and prices like "$2,500,000")
// ============================================================================

interface PropertyData {
  title: string;
  price: number;
  currency: string;
  isRental: boolean;
  size: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  status: string;
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parsePrice(priceStr: string): { price: number; currency: string; isRental: boolean } {
  if (!priceStr) return { price: 0, currency: 'USD', isRental: false };

  const isRental = priceStr.toLowerCase().includes('/mo') || priceStr.toLowerCase().includes('/month');
  const currency = priceStr.includes('€') ? 'EUR' : 'USD';

  // Remove currency symbol, commas, and /mo or /Month
  const cleaned = priceStr
    .replace(/[$€£]/g, '')
    .replace(/,/g, '')
    .replace(/\/mo(nth)?/gi, '')
    .replace(/\/Month/gi, '')
    .trim();

  const price = parseInt(cleaned) || 0;
  return { price, currency, isRental };
}

function parseRooms(roomStr: string): { bedrooms: number; bathrooms: number } | null {
  if (!roomStr) return null;
  // Handle "2+1", "3+2", "Studio", plain numbers
  const match = roomStr.match(/(\d)\+(\d)/);
  if (match) {
    return { bedrooms: parseInt(match[1]), bathrooms: parseInt(match[2]) > 2 ? parseInt(match[2]) : 0 };
  }
  if (roomStr.toLowerCase() === 'studio') {
    return { bedrooms: 0, bathrooms: 0 };
  }
  // Plain number (like "5" for rooms in an office)
  const num = parseInt(roomStr);
  if (!isNaN(num)) {
    return { bedrooms: num, bathrooms: 0 };
  }
  return null;
}

function parseAllData(): PropertyData[] {
  const content = fs.readFileSync(CSV_FILE, 'utf-8');
  const lines = content.split('\n');
  const data: PropertyData[] = [];

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const fields = parseCSVLine(line);
    // Baslik,Fiyat,Alan_m2,Oda_Sayisi,Banyo_Sayisi,Konum,Durum,URL
    if (fields.length < 7) continue;

    const title = fields[0];
    const { price, currency, isRental } = parsePrice(fields[1]);
    const size = parseInt(fields[2]) || 0;
    const rooms = parseRooms(fields[3]);
    const bathrooms = parseInt(fields[4]) || 0;
    const location = fields[5];
    const status = fields[6];

    data.push({
      title,
      price,
      currency,
      isRental,
      size,
      bedrooms: rooms?.bedrooms ?? 0,
      bathrooms: bathrooms || (rooms?.bathrooms ?? 0),
      location,
      status,
    });
  }

  return data;
}

// ============================================================================
// FUZZY TITLE MATCHING
// ============================================================================

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[""]/g, '')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================================================
// MAIN UPDATE
// ============================================================================

async function main() {
  console.log('Updating properties with data from ilanlar_tumu.csv...\n');

  // 1. Parse CSV data
  const csvData = parseAllData();
  console.log(`Parsed ${csvData.length} entries from CSV`);

  // 2. Get all properties from DB
  const properties = await prisma.property.findMany({
    select: { id: true, title: true, price: true, size: true, bedrooms: true, bathrooms: true },
  });
  console.log(`Found ${properties.length} properties in database`);

  // 3. Build lookup map (normalized title -> CSV data)
  const csvLookup = new Map<string, PropertyData>();
  for (const entry of csvData) {
    csvLookup.set(normalizeTitle(entry.title), entry);
  }

  // 4. Match and update
  let updated = 0;
  let notFound = 0;

  for (const prop of properties) {
    const dbTitle = (prop.title as any)?.en || (prop.title as any)?.tr || '';
    const normalizedDbTitle = normalizeTitle(dbTitle);

    // Try exact match first
    let csvEntry = csvLookup.get(normalizedDbTitle);

    // Try substring match if no exact match
    if (!csvEntry) {
      for (const [csvTitle, data] of csvLookup) {
        if (normalizedDbTitle.includes(csvTitle) || csvTitle.includes(normalizedDbTitle)) {
          csvEntry = data;
          break;
        }
      }
    }

    // Try matching with first N words
    if (!csvEntry) {
      const dbWords = normalizedDbTitle.split(' ').slice(0, 5).join(' ');
      for (const [csvTitle, data] of csvLookup) {
        const csvWords = csvTitle.split(' ').slice(0, 5).join(' ');
        if (dbWords === csvWords && dbWords.length > 10) {
          csvEntry = data;
          break;
        }
      }
    }

    if (!csvEntry) {
      notFound++;
      continue;
    }

    // Build update data
    const updateData: any = {};
    let changes: string[] = [];

    if (csvEntry.price > 0 && prop.price === 0) {
      updateData.price = csvEntry.price;
      updateData.currency = csvEntry.currency;
      updateData.showPrice = true;
      changes.push(`price=$${csvEntry.price.toLocaleString()}`);
    }

    if (csvEntry.size > 0 && (prop.size === 0 || !prop.size)) {
      updateData.size = csvEntry.size;
      changes.push(`size=${csvEntry.size}sqm`);
    }

    if (csvEntry.bedrooms > 0 && (prop.bedrooms === 0)) {
      updateData.bedrooms = csvEntry.bedrooms;
      changes.push(`beds=${csvEntry.bedrooms}`);
    }

    if (csvEntry.bathrooms > 0 && (prop.bathrooms === 0)) {
      updateData.bathrooms = csvEntry.bathrooms;
      changes.push(`baths=${csvEntry.bathrooms}`);
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.property.update({
        where: { id: prop.id },
        data: updateData,
      });
      updated++;
      console.log(`  Updated: ${dbTitle.substring(0, 60)}... [${changes.join(', ')}]`);
    }
  }

  console.log(`\n========================================`);
  console.log(`UPDATE COMPLETE`);
  console.log(`========================================`);
  console.log(`  Properties updated: ${updated}`);
  console.log(`  Not matched: ${notFound}`);
  console.log(`  Total in DB: ${properties.length}`);
  console.log(`========================================\n`);
}

main()
  .catch((e) => {
    console.error('Update error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
