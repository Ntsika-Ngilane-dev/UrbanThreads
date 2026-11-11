const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!keyPath) throw new Error('Set FIREBASE_SERVICE_ACCOUNT to an external service-account JSON path.');
const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

admin.initializeApp({
  credential: admin.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = getFirestore();

const catalogUpdates = {
  'Apex Oversized Hoodie': { price: 899, imageURL: 'https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg' },
  'Metro Pullover': { price: 849, imageURL: 'https://images.pexels.com/photos/3622621/pexels-photo-3622621.jpeg' },
  'After Dark Zip Hoodie': { price: 1099, imageURL: 'https://images.pexels.com/photos/1157026/pexels-photo-1157026.jpeg' },
  'Signal Crew Hoodie': { price: 949, imageURL: 'https://images.pexels.com/photos/3622623/pexels-photo-3622623.jpeg' },
  'Urban Echo Hoodie': { price: 999, imageURL: 'https://images.pexels.com/photos/4194857/pexels-photo-4194857.jpeg' },
  'Grid Fleece Hoodie': { price: 1049, imageURL: 'https://images.pexels.com/photos/7217550/pexels-photo-7217550.jpeg' },
  'Night Stripe Hoodie': { price: 999, imageURL: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg' },
  'Noir Crew Hoodie': { price: 1099, imageURL: 'https://images.pexels.com/photos/5825530/pexels-photo-5825530.jpeg' },
  'Streetline Tee': { price: 399, imageURL: 'https://images.pexels.com/photos/991831/pexels-photo-991831.jpeg' },
  'Monochrome Graphic Tee': { price: 499, imageURL: 'https://images.pexels.com/photos/2769274/pexels-photo-2769274.jpeg' },
  'Drift Tee': { price: 449, imageURL: 'https://images.pexels.com/photos/3622579/pexels-photo-3622579.jpeg' },
  'Basecamp Tee': { price: 529, imageURL: 'https://images.pexels.com/photos/3945681/pexels-photo-3945681.jpeg' },
  'Horizon Long Sleeve': { price: 649, imageURL: 'https://images.pexels.com/photos/3965987/pexels-photo-3965987.jpeg' },
  'Minimal Wave Tee': { price: 429, imageURL: 'https://images.pexels.com/photos/3945682/pexels-photo-3945682.jpeg' },
  'Oversized Block Tee': { price: 499, imageURL: 'https://images.pexels.com/photos/3622620/pexels-photo-3622620.jpeg' },
  'Shell Layer Tee': { price: 469, imageURL: 'https://images.pexels.com/photos/5825529/pexels-photo-5825529.jpeg' },
  'Concrete Runner': { price: 1899, imageURL: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg' },
  'Night Shift Low': { price: 1699, imageURL: 'https://images.pexels.com/photos/1407622/pexels-photo-1407622.jpeg' },
  'Court Fade': { price: 1999, imageURL: 'https://images.pexels.com/photos/3560167/pexels-photo-3560167.jpeg' },
  'Velocity Pace': { price: 1799, imageURL: 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg' },
  'Dockside Trainer': { price: 1749, imageURL: 'https://images.pexels.com/photos/1261622/pexels-photo-1261622.jpeg' },
  'Ridge Runner': { price: 2199, imageURL: 'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg' },
  'Trackloop Sneaker': { price: 2299, imageURL: 'https://images.pexels.com/photos/3560166/pexels-photo-3560166.jpeg' },
  'Mosaic Court': { price: 1999, imageURL: 'https://images.pexels.com/photos/4530340/pexels-photo-4530340.jpeg' },
  'Pilot Cap': { price: 399, imageURL: 'https://images.pexels.com/photos/3622626/pexels-photo-3622626.jpeg' },
  'Street Sling': { price: 649, imageURL: 'https://images.pexels.com/photos/3622627/pexels-photo-3622627.jpeg' },
  'Threaded Beanie': { price: 329, imageURL: 'https://images.pexels.com/photos/5632400/pexels-photo-5632400.jpeg' },
  'Union Tote': { price: 599, imageURL: 'https://images.pexels.com/photos/3622625/pexels-photo-3622625.jpeg' },
  'Canvas Crossbody': { price: 699, imageURL: 'https://images.unsplash.com/photo-1524368532754-9996e7d4d5f7?auto=format&fit=crop&w=900&q=85' },
  'Rooftop Buckle': { price: 449, imageURL: 'https://images.pexels.com/photos/4531619/pexels-photo-4531619.jpeg' },
  'Peak Knit Cap': { price: 399, imageURL: 'https://images.pexels.com/photos/3945680/pexels-photo-3945680.jpeg' },
  'Transit Pouch': { price: 349, imageURL: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=85' },
};

(async () => {
  const snapshot = await db.collection('products').get();
  const batch = db.batch();
  let updated = 0;

  snapshot.forEach((productDoc) => {
    const product = productDoc.data();
    const update = catalogUpdates[product.name];
    if (!update) return;
    batch.update(productDoc.ref, update);
    updated += 1;
  });

  if (updated) await batch.commit();
  console.log(`Refreshed ${updated} product records in ${serviceAccount.project_id}`);
  process.exit(0);
})().catch((error) => {
  console.error('Could not refresh catalogue:', error.message);
  process.exit(1);
});