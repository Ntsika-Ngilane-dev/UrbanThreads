const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

const keyPath = path.join(__dirname, '..', 'urbanclothes-1234-firebase-adminsdk-fbsvc-750ad8c31a.json');
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

admin.initializeApp({
  credential: admin.cert(serviceAccount),
  projectId: 'urbanclothes-1234'
});

const db = getFirestore();

const products = [
  // Hoodies - 8 items
  { name: 'Apex Oversized Hoodie', price: 899, category: 'Hoodies', description: 'Heavyweight cotton fleece with an oversized drop-shoulder fit.', imageURL: 'https://images.unsplash.com/photo-1556821552-7f41c5d440db?auto=format&fit=crop&w=900&q=80' },
  { name: 'Metro Pullover', price: 849, category: 'Hoodies', description: 'Soft brushed interior and clean front pocket for all-day wear.', imageURL: 'https://images.unsplash.com/photo-1552062407-291826ab63fd?auto=format&fit=crop&w=900&q=80' },
  { name: 'After Dark Zip Hoodie', price: 999, category: 'Hoodies', description: 'Tinted zip closure with tonal trims and a relaxed city fit.', imageURL: 'https://images.unsplash.com/photo-1544987859-e924c5e15c07?auto=format&fit=crop&w=900&q=80' },
  { name: 'Signal Crew Hoodie', price: 939, category: 'Hoodies', description: 'Roomy body, structured hood, and premium brushed finish.', imageURL: 'https://images.unsplash.com/photo-1551930820-330a71b99659?auto=format&fit=crop&w=900&q=80' },
  { name: 'Urban Echo Hoodie', price: 919, category: 'Hoodies', description: 'Luxe fleece feel with a slightly tapered, fashion-first fit.', imageURL: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80' },
  { name: 'Grid Fleece Hoodie', price: 929, category: 'Hoodies', description: 'Cotton fleece hoodie with grid texture and laid-back volume.', imageURL: 'https://images.unsplash.com/photo-1549622917-50a23e5a1cda?auto=format&fit=crop&w=900&q=80' },
  { name: 'Night Stripe Hoodie', price: 969, category: 'Hoodies', description: 'Two-tone stripe trim and a street-cut silhouette with deep pockets.', imageURL: 'https://images.unsplash.com/photo-1506529082632-69ba78d64245?auto=format&fit=crop&w=900&q=80' },
  { name: 'Noir Crew Hoodie', price: 949, category: 'Hoodies', description: 'Dark premium fleece with a quiet logo and wide drape.', imageURL: 'https://images.unsplash.com/photo-1525895917283-3a1c8aeb446e?auto=format&fit=crop&w=900&q=80' },

  // T-shirts - 8 items
  { name: 'Streetline Tee', price: 459, category: 'T-shirts', description: 'Boxy tee with premium jersey weight and minimalist logo.', imageURL: 'https://images.unsplash.com/photo-1503341338985-8a378ef08b8b?auto=format&fit=crop&w=900&q=80' },
  { name: 'Monochrome Graphic Tee', price: 499, category: 'T-shirts', description: 'Clean front graphic with an oversized, laid-back silhouette.', imageURL: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?auto=format&fit=crop&w=900&q=80' },
  { name: 'Drift Tee', price: 429, category: 'T-shirts', description: 'Airy cotton feel built for warm afternoons and layered fits.', imageURL: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80' },
  { name: 'Basecamp Tee', price: 479, category: 'T-shirts', description: 'Everyday staple with a sharper neckline and soft hand feel.', imageURL: 'https://images.unsplash.com/photo-1521392573388-8b28d648b4c1?auto=format&fit=crop&w=900&q=80' },
  { name: 'Horizon Long Sleeve', price: 689, category: 'T-shirts', description: 'Long sleeve staple crafted for cooler evenings and layered styling.', imageURL: 'https://images.unsplash.com/photo-1511614387149-abc4cecb108e?auto=format&fit=crop&w=900&q=80' },
  { name: 'Minimal Wave Tee', price: 449, category: 'T-shirts', description: 'Soft touch tee with a slightly relaxed shape and premium drape.', imageURL: 'https://images.unsplash.com/photo-1572307480616-40629fe7e2b0?auto=format&fit=crop&w=900&q=80' },
  { name: 'Oversized Block Tee', price: 519, category: 'T-shirts', description: 'Roomy fit with a slightly wider body and clean neckline.', imageURL: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80' },
  { name: 'Shell Layer Tee', price: 469, category: 'T-shirts', description: 'Tighter fit in a light premium knit built for warmer layers.', imageURL: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80' },

  // Sneakers - 8 items
  { name: 'Concrete Runner', price: 1699, category: 'Sneakers', description: 'Cushioned daily runner built for city movement and comfort.', imageURL: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80' },
  { name: 'Night Shift Low', price: 1599, category: 'Sneakers', description: 'Low-profile silhouette with durable rubber grip and all-day comfort.', imageURL: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80' },
  { name: 'Court Fade', price: 1799, category: 'Sneakers', description: 'Structured leather upper with clean lines and tonal contrast.', imageURL: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80' },
  { name: 'Velocity Pace', price: 1749, category: 'Sneakers', description: 'Responsive sole and premium streetwear finish that stands out.', imageURL: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=900&q=80' },
  { name: 'Dockside Trainer', price: 1649, category: 'Sneakers', description: 'Low-cut runner with textured balance and everyday traction.', imageURL: 'https://images.unsplash.com/photo-1519095f3364-8a83-e815-d0c4-c99f12fb3ce7?auto=format&fit=crop&w=900&q=80' },
  { name: 'Ridge Runner', price: 1889, category: 'Sneakers', description: 'A premium runner balancing cushioning, grip, and street style.', imageURL: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80' },
  { name: 'Trackloop Sneaker', price: 1849, category: 'Sneakers', description: 'Chunky sole with comfort-first cushioning and textured finish.', imageURL: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80' },
  { name: 'Mosaic Court', price: 1769, category: 'Sneakers', description: 'Modern court sneaker with elevated cushioning and clean finish.', imageURL: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80' },

  // Accessories - 6 items
  { name: 'Pilot Cap', price: 349, category: 'Accessories', description: 'Structured fit cap in a tonal finish to round out your outfit.', imageURL: 'https://images.unsplash.com/photo-1521369909026-2afc706d5d2a?auto=format&fit=crop&w=900&q=80' },
  { name: 'Street Sling', price: 599, category: 'Accessories', description: 'Compact crossbody bag built with utility pockets and a matte finish.', imageURL: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80' },
  { name: 'Threaded Beanie', price: 299, category: 'Accessories', description: 'Woven beanie with soft inner lining and washed black finish.', imageURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80' },
  { name: 'Union Tote', price: 549, category: 'Accessories', description: 'Minimal everyday tote for quick errands, gym runs, and commute days.', imageURL: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80' },
  { name: 'Rooftop Buckle', price: 579, category: 'Accessories', description: 'Minimal leather belt styled to finish clean casual outfits.', imageURL: 'https://images.unsplash.com/photo-1524368532754-9996e7d4d5f7?auto=format&fit=crop&w=900&q=80' },
  { name: 'Peak Knit Cap', price: 389, category: 'Accessories', description: 'Clean knit cap in a soft brushed finish with subtle logo detail.', imageURL: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80' },
  { name: 'Canvas Crossbody', price: 629, category: 'Accessories', description: 'Small crossbody bag with structured canvas and hidden zip pocket.', imageURL: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80' },
  { name: 'Transit Pouch', price: 329, category: 'Accessories', description: 'Mini utility pouch for essentials, cards, and daily carry.', imageURL: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80' }
];

(async () => {
  try {
    const batch = db.batch();
    const productsRef = db.collection('products');

    for (const product of products) {
      const docRef = productsRef.doc();
      batch.set(docRef, product);
    }

    await batch.commit();
    console.log(`✓ Seeded ${products.length} products to urbanclothes-1234`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error.message);
    process.exit(1);
  }
})();
