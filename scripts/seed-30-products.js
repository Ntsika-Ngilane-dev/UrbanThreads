const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyDfwiOVQM16yk5uQLTik2zuQsuguye9Z7E',
  authDomain: 'urban-threads-f7d7f.firebaseapp.com',
  projectId: 'urban-threads-f7d7f',
  storageBucket: 'urban-threads-f7d7f.firebasestorage.app',
  messagingSenderId: '1039648458741',
  appId: '1:1039648458741:web:60efc14a2f8288d18e82bc'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  // Hoodies - 8 items
  { name: 'Apex Oversized Hoodie', price: 899, category: 'Hoodies', description: 'Heavyweight cotton fleece with an oversized drop-shoulder fit.', imageURL: 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg' },
  { name: 'Metro Pullover', price: 849, category: 'Hoodies', description: 'Soft brushed interior and clean front pocket for all-day wear.', imageURL: 'https://images.pexels.com/photos/3622621/pexels-photo-3622621.jpeg' },
  { name: 'After Dark Zip Hoodie', price: 999, category: 'Hoodies', description: 'Tinted zip closure with tonal trims and a relaxed city fit.', imageURL: 'https://images.pexels.com/photos/1157026/pexels-photo-1157026.jpeg' },
  { name: 'Signal Crew Hoodie', price: 939, category: 'Hoodies', description: 'Roomy body, structured hood, and premium brushed finish.', imageURL: 'https://images.pexels.com/photos/3622623/pexels-photo-3622623.jpeg' },
  { name: 'Urban Echo Hoodie', price: 919, category: 'Hoodies', description: 'Luxe fleece feel with a slightly tapered, fashion-first fit.', imageURL: 'https://images.pexels.com/photos/4194857/pexels-photo-4194857.jpeg' },
  { name: 'Grid Fleece Hoodie', price: 929, category: 'Hoodies', description: 'Cotton fleece hoodie with grid texture and laid-back volume.', imageURL: 'https://images.pexels.com/photos/7217550/pexels-photo-7217550.jpeg' },
  { name: 'Night Stripe Hoodie', price: 969, category: 'Hoodies', description: 'Two-tone stripe trim and a street-cut silhouette with deep pockets.', imageURL: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg' },
  { name: 'Noir Crew Hoodie', price: 949, category: 'Hoodies', description: 'Dark premium fleece with a quiet logo and wide drape.', imageURL: 'https://images.pexels.com/photos/5825530/pexels-photo-5825530.jpeg' },

  // T-shirts - 8 items
  { name: 'Streetline Tee', price: 459, category: 'T-shirts', description: 'Boxy tee with premium jersey weight and minimalist logo.', imageURL: 'https://images.pexels.com/photos/991831/pexels-photo-991831.jpeg' },
  { name: 'Monochrome Graphic Tee', price: 499, category: 'T-shirts', description: 'Clean front graphic with an oversized, laid-back silhouette.', imageURL: 'https://images.pexels.com/photos/2769274/pexels-photo-2769274.jpeg' },
  { name: 'Drift Tee', price: 429, category: 'T-shirts', description: 'Airy cotton feel built for warm afternoons and layered fits.', imageURL: 'https://images.pexels.com/photos/3622579/pexels-photo-3622579.jpeg' },
  { name: 'Basecamp Tee', price: 479, category: 'T-shirts', description: 'Everyday staple with a sharper neckline and soft hand feel.', imageURL: 'https://images.pexels.com/photos/3945681/pexels-photo-3945681.jpeg' },
  { name: 'Horizon Long Sleeve', price: 689, category: 'T-shirts', description: 'Long sleeve staple crafted for cooler evenings and layered styling.', imageURL: 'https://images.pexels.com/photos/3965987/pexels-photo-3965987.jpeg' },
  { name: 'Minimal Wave Tee', price: 449, category: 'T-shirts', description: 'Soft touch tee with a slightly relaxed shape and premium drape.', imageURL: 'https://images.pexels.com/photos/3945682/pexels-photo-3945682.jpeg' },
  { name: 'Oversized Block Tee', price: 519, category: 'T-shirts', description: 'Roomy fit with a slightly wider body and clean neckline.', imageURL: 'https://images.pexels.com/photos/3622620/pexels-photo-3622620.jpeg' },
  { name: 'Shell Layer Tee', price: 469, category: 'T-shirts', description: 'Tighter fit in a light premium knit built for warmer layers.', imageURL: 'https://images.pexels.com/photos/5825529/pexels-photo-5825529.jpeg' },

  // Sneakers - 8 items
  { name: 'Concrete Runner', price: 1699, category: 'Sneakers', description: 'Cushioned daily runner built for city movement and comfort.', imageURL: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg' },
  { name: 'Night Shift Low', price: 1599, category: 'Sneakers', description: 'Low-profile silhouette with durable rubber grip and all-day comfort.', imageURL: 'https://images.pexels.com/photos/1407622/pexels-photo-1407622.jpeg' },
  { name: 'Court Fade', price: 1799, category: 'Sneakers', description: 'Structured leather upper with clean lines and tonal contrast.', imageURL: 'https://images.pexels.com/photos/3560167/pexels-photo-3560167.jpeg' },
  { name: 'Velocity Pace', price: 1749, category: 'Sneakers', description: 'Responsive sole and premium streetwear finish that stands out.', imageURL: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg' },
  { name: 'Dockside Trainer', price: 1649, category: 'Sneakers', description: 'Low-cut runner with textured balance and everyday traction.', imageURL: 'https://images.pexels.com/photos/1261622/pexels-photo-1261622.jpeg' },
  { name: 'Ridge Runner', price: 1889, category: 'Sneakers', description: 'A premium runner balancing cushioning, grip, and street style.', imageURL: 'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg' },
  { name: 'Trackloop Sneaker', price: 1849, category: 'Sneakers', description: 'Chunky sole with comfort-first cushioning and textured finish.', imageURL: 'https://images.pexels.com/photos/3560166/pexels-photo-3560166.jpeg' },
  { name: 'Mosaic Court', price: 1769, category: 'Sneakers', description: 'Modern court sneaker with elevated cushioning and clean finish.', imageURL: 'https://images.pexels.com/photos/4530340/pexels-photo-4530340.jpeg' },

  // Accessories - 6 items
  { name: 'Pilot Cap', price: 349, category: 'Accessories', description: 'Structured fit cap in a tonal finish to round out your outfit.', imageURL: 'https://images.pexels.com/photos/3622626/pexels-photo-3622626.jpeg' },
  { name: 'Street Sling', price: 599, category: 'Accessories', description: 'Compact crossbody bag built with utility pockets and a matte finish.', imageURL: 'https://images.pexels.com/photos/3622627/pexels-photo-3622627.jpeg' },
  { name: 'Threaded Beanie', price: 299, category: 'Accessories', description: 'Woven beanie with soft inner lining and washed black finish.', imageURL: 'https://images.pexels.com/photos/5632400/pexels-photo-5632400.jpeg' },
  { name: 'Union Tote', price: 549, category: 'Accessories', description: 'Minimal everyday tote for quick errands, gym runs, and commute days.', imageURL: 'https://images.pexels.com/photos/3622625/pexels-photo-3622625.jpeg' },
  { name: 'Rooftop Buckle', price: 579, category: 'Accessories', description: 'Minimal leather belt styled to finish clean casual outfits.', imageURL: 'https://images.pexels.com/photos/4531619/pexels-photo-4531619.jpeg' },
  { name: 'Peak Knit Cap', price: 389, category: 'Accessories', description: 'Clean knit cap in a soft brushed finish with subtle logo detail.', imageURL: 'https://images.pexels.com/photos/3945680/pexels-photo-3945680.jpeg' }
];

(async () => {
  try {
    for (const product of products) {
      await addDoc(collection(db, 'products'), product);
    }
    console.log(`✓ Seeded ${products.length} products with unique images`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error.message);
    process.exit(1);
  }
})();
