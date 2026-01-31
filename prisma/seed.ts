import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@maisondorient.com' },
    update: {},
    create: {
      email: 'admin@maisondorient.com',
      password: adminPassword,
      name: 'Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('Created admin user:', admin.email);

  // Create agent user
  const agentPassword = await bcrypt.hash('agent123', 12);
  const agent = await prisma.user.upsert({
    where: { email: 'agent@maisondorient.com' },
    update: {},
    create: {
      email: 'agent@maisondorient.com',
      password: agentPassword,
      name: 'Burak Yılmaz',
      role: 'AGENT',
      status: 'ACTIVE',
    },
  });
  console.log('Created agent user:', agent.email);

  // Create neighborhoods
  const bebek = await prisma.neighborhood.upsert({
    where: { slug: 'bebek' },
    update: {},
    create: {
      name: { en: 'Bebek', tr: 'Bebek' },
      slug: 'bebek',
      city: 'Istanbul',
      description: {
        en: 'Bebek is one of Istanbul\'s most affluent and picturesque neighborhoods, located on the European shores of the Bosphorus. Known for its deep, sheltered bay and sweeping views, it has been a favorite retreat for the Ottoman aristocracy for centuries.\n\nToday, Bebek retains its exclusive atmosphere with a vibrant social scene. The waterfront promenade is lined with high-end cafes, restaurants, and boutiques.',
        tr: 'Bebek, İstanbul\'un en zengin ve pitoresk mahallelerinden biridir. Avrupa yakasında Boğaz kıyısında yer alır.',
      },
      shortDescription: {
        en: 'The crown jewel of the Bosphorus, known for its historic mansions, trendy cafes, and vibrant promenade.',
        tr: 'Boğaz\'ın tacı, tarihi konakları, trend kafeleri ve canlı sahil yolu ile tanınır.',
      },
      image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2598&auto=format&fit=crop',
      highlights: [
        { icon: '☕', title: 'Lifestyle', description: 'Trendy cafes and fine dining' },
        { icon: '🎓', title: 'Education', description: 'Prestigious international schools' },
        { icon: '🌳', title: 'Nature', description: 'Bebek Park and waterfront promenade' },
        { icon: '📍', title: 'Location', description: 'Prime Bosphorus location' },
      ],
      isActive: true,
      isFeatured: true,
      order: 1,
    },
  });

  const nisantasi = await prisma.neighborhood.upsert({
    where: { slug: 'nisantasi' },
    update: {},
    create: {
      name: { en: 'Nişantaşı', tr: 'Nişantaşı' },
      slug: 'nisantasi',
      city: 'Istanbul',
      description: {
        en: 'Istanbul\'s fashion and luxury center, home to designer boutiques, fine dining, and elegant apartments. The neighborhood attracts those with refined taste and a desire for cosmopolitan living.',
        tr: 'İstanbul\'un moda ve lüks merkezi.',
      },
      shortDescription: {
        en: 'Istanbul\'s fashion and luxury center, home to designer boutiques, fine dining, and elegant apartments.',
        tr: 'İstanbul\'un moda ve lüks merkezi.',
      },
      image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2660&auto=format&fit=crop',
      isActive: true,
      isFeatured: true,
      order: 2,
    },
  });

  const galata = await prisma.neighborhood.upsert({
    where: { slug: 'galata' },
    update: {},
    create: {
      name: { en: 'Galata', tr: 'Galata' },
      slug: 'galata',
      city: 'Istanbul',
      description: {
        en: 'A historic district blending Genoese heritage with modern art, culture, and stunning Golden Horn views. Galata Tower stands as the iconic landmark of this vibrant neighborhood.',
        tr: 'Ceneviz mirasını modern sanat ve kültürle harmanlayan tarihi bir semt.',
      },
      shortDescription: {
        en: 'A historic district blending Genoese heritage with modern art, culture, and stunning Golden Horn views.',
        tr: 'Ceneviz mirasını modern sanat ve kültürle harmanlayan tarihi bir semt.',
      },
      image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2670&auto=format&fit=crop',
      isActive: true,
      order: 3,
    },
  });

  const sariyer = await prisma.neighborhood.upsert({
    where: { slug: 'sariyer' },
    update: {},
    create: {
      name: { en: 'Sarıyer', tr: 'Sarıyer' },
      slug: 'sariyer',
      city: 'Istanbul',
      description: {
        en: 'Where the Bosphorus meets the Black Sea, offering a peaceful retreat with lush nature and seafood restaurants.',
        tr: 'Boğaz\'ın Karadeniz ile buluştuğu yer.',
      },
      shortDescription: {
        en: 'Where the Bosphorus meets the Black Sea, offering a peaceful retreat with lush nature and seafood restaurants.',
        tr: 'Boğaz\'ın Karadeniz ile buluştuğu yer.',
      },
      image: 'https://images.unsplash.com/photo-1622587853578-dd1bf9608d26?q=80&w=2671&auto=format&fit=crop',
      isActive: true,
      order: 4,
    },
  });

  console.log('Created neighborhoods:', bebek.slug, nisantasi.slug, galata.slug, sariyer.slug);

  // Create properties
  const prop1 = await prisma.property.create({
    data: {
      title: { en: 'Historic Yalı Mansion on the Bosphorus', tr: 'Boğaz\'da Tarihi Yalı' },
      slug: 'historic-yali-mansion-bosphorus',
      description: {
        en: 'Experience the epitome of Istanbul luxury in this breathtaking historic Yalı mansion located directly on the Bosphorus waterfront in the prestigious Bebek neighborhood.\n\nOriginally built in 1905 and meticulously restored, this property seamlessly blends Ottoman architectural heritage with modern amenities. The mansion features high ceilings, original woodwork, and panoramic views of the Bosphorus from almost every room.\n\nThe property includes a private dock, a lush garden sanctuary, and separate staff quarters.',
        tr: 'Prestijli Bebek semtinde Boğaz kıyısında yer alan bu nefes kesen tarihi yalıda İstanbul lüksünün zirvesini yaşayın.',
      },
      address: 'Cevdet Paşa Caddesi No: 45, Bebek, Beşiktaş, Istanbul',
      neighborhood: 'Bebek',
      neighborhoodId: bebek.id,
      city: 'Istanbul',
      price: 12500000,
      currency: 'EUR',
      propertyType: 'YALI',
      listingType: 'SALE',
      status: 'PUBLISHED',
      bedrooms: 6,
      bathrooms: 5,
      size: 450,
      yearBuilt: 1905,
      features: ['Direct Bosphorus Access', 'Private Dock', 'Historic Architecture', 'Smart Home System', 'Private Garden', 'Staff Quarters', 'Security System', 'Underfloor Heating'],
      isFeatured: true,
      isNew: false,
      agentId: agent.id,
      publishedAt: new Date(),
      latitude: 41.0781,
      longitude: 29.0428,
      virtualTourUrl: 'https://my.matterport.com/show/?m=example',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2675&auto=format&fit=crop', order: 0, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop', order: 1 },
          { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2670&auto=format&fit=crop', order: 2 },
          { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2574&auto=format&fit=crop', order: 3 },
        ],
      },
    },
  });

  const prop2 = await prisma.property.create({
    data: {
      title: { en: 'Modern Penthouse in Nişantaşı', tr: 'Nişantaşı\'nda Modern Çatı Katı' },
      slug: 'modern-penthouse-nisantasi',
      description: {
        en: 'Stunning penthouse apartment in the heart of Nişantaşı with panoramic city views. Features floor-to-ceiling windows, a private rooftop terrace, and designer finishes throughout.',
        tr: 'Nişantaşı\'nın kalbinde panoramik şehir manzaralı muhteşem çatı katı dairesi.',
      },
      address: 'Teşvikiye Caddesi No: 120, Nişantaşı, Şişli, Istanbul',
      neighborhood: 'Nişantaşı',
      neighborhoodId: nisantasi.id,
      city: 'Istanbul',
      price: 2850000,
      currency: 'EUR',
      propertyType: 'PENTHOUSE',
      listingType: 'SALE',
      status: 'PUBLISHED',
      bedrooms: 4,
      bathrooms: 3,
      size: 280,
      yearBuilt: 2022,
      features: ['Panoramic Views', 'Rooftop Terrace', 'Designer Kitchen', 'Smart Home', 'Concierge Service', '2 Parking Spaces'],
      isFeatured: true,
      isNew: true,
      agentId: agent.id,
      publishedAt: new Date(),
      latitude: 41.0485,
      longitude: 28.9950,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1600596542815-9ad4dc7553e8?auto=format&fit=crop&w=800&q=80', order: 0, isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2574&auto=format&fit=crop', order: 1 },
        ],
      },
    },
  });

  const prop3 = await prisma.property.create({
    data: {
      title: { en: 'Luxury Apartment in Galata', tr: 'Galata\'da Lüks Daire' },
      slug: 'luxury-apartment-galata',
      description: {
        en: 'Beautifully renovated apartment in a historic Galata building with views of the Golden Horn. Walking distance to Galata Tower and İstiklal Avenue.',
        tr: 'Haliç manzaralı tarihi Galata binasında güzelce yenilenmiş daire.',
      },
      address: 'Galip Dede Caddesi No: 78, Galata, Beyoğlu, Istanbul',
      neighborhood: 'Galata',
      neighborhoodId: galata.id,
      city: 'Istanbul',
      price: 650000,
      currency: 'EUR',
      propertyType: 'APARTMENT',
      listingType: 'SALE',
      status: 'PUBLISHED',
      bedrooms: 2,
      bathrooms: 1,
      size: 120,
      yearBuilt: 1890,
      features: ['Golden Horn Views', 'Historic Building', 'Renovated', 'High Ceilings', 'Original Details'],
      isFeatured: false,
      isNew: true,
      agentId: agent.id,
      publishedAt: new Date(),
      latitude: 41.0256,
      longitude: 28.9744,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80', order: 0, isPrimary: true },
        ],
      },
    },
  });

  console.log('Created properties:', prop1.slug, prop2.slug, prop3.slug);

  // Create blog posts
  const post1 = await prisma.blogPost.create({
    data: {
      title: { en: 'Istanbul Real Estate Market Outlook 2024', tr: 'İstanbul Gayrimenkul Piyasası 2024 Görünümü' },
      slug: 'istanbul-real-estate-market-outlook-2024',
      excerpt: {
        en: 'An in-depth analysis of property trends, pricing, and investment opportunities in Istanbul for the upcoming year.',
        tr: 'İstanbul için önümüzdeki yıla ait emlak trendleri, fiyatlandırma ve yatırım fırsatlarının derinlemesine analizi.',
      },
      content: {
        en: 'The Istanbul real estate market continues to show resilience and growth potential as we head into 2024. With its unique position bridging Europe and Asia, the city remains a top destination for international investors.\n\n### Key Trends to Watch\n\n1. **Rise of Branded Residences:** Luxury branded residences are seeing increased demand, particularly in areas like Nişantaşı and the Bosphorus line.\n\n2. **Urban Regeneration:** The government\'s focus on urban transformation projects in older districts is creating new investment hotspots.\n\n3. **Sustainable Living:** There is a growing preference for eco-friendly developments.\n\n### Investment Hotspots\n\n- **Bosphorus Line:** Always the pinnacle of luxury, properties here retain value exceptionally well.\n- **Financial District (Ataşehir/Ümraniye):** Demand for residential and commercial units is surging.\n\n### Conclusion\n\nFor investors looking for long-term capital appreciation and solid rental yields, Istanbul remains a compelling choice.',
        tr: 'İstanbul gayrimenkul piyasası 2024\'e girerken dayanıklılık ve büyüme potansiyeli göstermeye devam ediyor.',
      },
      featuredImage: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?q=80&w=2660&auto=format&fit=crop',
      category: 'Market Analysis',
      tags: ['Investment', 'Market Trends', 'Istanbul'],
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date('2024-12-01'),
    },
  });

  const post2 = await prisma.blogPost.create({
    data: {
      title: { en: 'Complete Guide to Turkish Citizenship by Investment', tr: 'Yatırımla Türk Vatandaşlığı Rehberi' },
      slug: 'guide-to-turkish-citizenship-by-investment',
      excerpt: {
        en: 'Everything you need to know about the Citizenship by Investment program, requirements, and application process.',
        tr: 'Yatırımla Vatandaşlık programı hakkında bilmeniz gereken her şey.',
      },
      content: {
        en: 'Turkey\'s Citizenship by Investment program remains one of the most attractive in the world. With a minimum real estate investment of $400,000, foreign nationals can obtain Turkish citizenship.\n\n### Requirements\n\n- Minimum property investment of $400,000\n- Property must be held for at least 3 years\n- No criminal record\n\n### Process\n\n1. Select and purchase qualifying property\n2. Obtain valuation report\n3. Apply for residence permit\n4. Submit citizenship application\n5. Receive citizenship (typically 3-6 months)',
        tr: 'Türkiye\'nin Yatırımla Vatandaşlık programı dünyanın en cazip programlarından biridir.',
      },
      featuredImage: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2598&auto=format&fit=crop',
      category: 'Legal',
      tags: ['Citizenship', 'Investment', 'Legal'],
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date('2024-11-15'),
    },
  });

  const post3 = await prisma.blogPost.create({
    data: {
      title: { en: 'Best Neighborhoods for Families in Istanbul', tr: 'İstanbul\'da Aileler için En İyi Mahalleler' },
      slug: 'best-neighborhoods-for-families-in-istanbul',
      excerpt: {
        en: 'Discover the most family-friendly districts featuring top schools, parks, and safe communities.',
        tr: 'En iyi okulları, parkları ve güvenli toplulukları barındıran en aile dostu ilçeleri keşfedin.',
      },
      content: {
        en: 'Choosing the right neighborhood is crucial for families relocating to Istanbul. Here are our top picks.\n\n### Bebek\n\nWith Robert College and Boğaziçi University nearby, Bebek offers excellent educational options alongside a safe, walkable waterfront environment.\n\n### Etiler\n\nA quiet residential area with proximity to international schools and shopping centers.\n\n### Sarıyer\n\nFor families seeking a more suburban feel with forests, parks, and a slower pace of life while still being connected to the city.',
        tr: 'İstanbul\'a taşınan aileler için doğru mahalleyi seçmek çok önemlidir.',
      },
      featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2700&auto=format&fit=crop',
      category: 'Lifestyle',
      tags: ['Families', 'Neighborhoods', 'Lifestyle'],
      status: 'PUBLISHED',
      authorId: admin.id,
      publishedAt: new Date('2024-10-28'),
    },
  });

  console.log('Created blog posts:', post1.slug, post2.slug, post3.slug);

  // Create collections
  await prisma.collection.upsert({
    where: { slug: 'bosphorus-villas' },
    update: {},
    create: {
      title: { en: 'Bosphorus Villas', tr: 'Boğaz Villaları' },
      slug: 'bosphorus-villas',
      description: { en: 'Exclusive waterfront properties along the Bosphorus', tr: 'Boğaz boyunca özel su kenarı mülkler' },
      image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?q=80&w=2598&auto=format&fit=crop',
      link: '/properties?location=bosphorus',
      propertyCount: 1,
      isActive: true,
      isFeatured: true,
      order: 1,
    },
  });

  await prisma.collection.upsert({
    where: { slug: 'modern-penthouses' },
    update: {},
    create: {
      title: { en: 'Modern Penthouses', tr: 'Modern Çatı Katları' },
      slug: 'modern-penthouses',
      description: { en: 'Contemporary penthouse living with panoramic views', tr: 'Panoramik manzaralı çağdaş çatı katı yaşamı' },
      image: 'https://images.unsplash.com/photo-1600596542815-9ad4dc7553e8?auto=format&fit=crop&w=800&q=80',
      link: '/properties?type=PENTHOUSE',
      propertyCount: 1,
      isActive: true,
      isFeatured: true,
      order: 2,
    },
  });

  await prisma.collection.upsert({
    where: { slug: 'historic-residences' },
    update: {},
    create: {
      title: { en: 'Historic Residences', tr: 'Tarihi Konutlar' },
      slug: 'historic-residences',
      description: { en: 'Restored heritage properties with timeless character', tr: 'Zamansız karaktere sahip restore edilmiş tarihi mülkler' },
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2670&auto=format&fit=crop',
      link: '/properties?type=YALI',
      propertyCount: 1,
      isActive: true,
      isFeatured: true,
      order: 3,
    },
  });

  console.log('Created collections');

  // Create a sample lead
  await prisma.lead.create({
    data: {
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '+1 555 0100',
      subject: 'Interested in Bosphorus properties',
      message: 'I am looking for a waterfront property in the Bebek area. Budget around 5-10M EUR.',
      source: 'WEBSITE',
      status: 'NEW',
      priority: 'HIGH',
      propertyId: prop1.id,
    },
  });

  console.log('Created sample lead');
  console.log('\n✅ Database seeded successfully!');
  console.log('\n📋 Login credentials:');
  console.log('   Admin: admin@maisondorient.com / admin123');
  console.log('   Agent: agent@maisondorient.com / agent123');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
