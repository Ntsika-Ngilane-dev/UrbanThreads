const photo = (id, format = 'jpeg') =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${format}?auto=compress&cs=tinysrgb&w=1200`;

const imagePools = {
  Hoodies: [
    photo('30257616'),
    photo('16982868'),
    photo('5825330'),
    photo('29996214'),
    photo('1094553'),
    photo('1706923'),
    photo('7479818'),
    photo('28701960'),
  ],
  'T-shirts': [
    photo('33222517'),
    photo('15258905', 'png'),
    photo('14745467'),
    photo('2315197'),
    photo('5995822'),
    photo('12922554'),
    photo('18856590'),
    photo('9985771'),
  ],
  Sneakers: [
    photo('6029226'), photo('4215840'), photo('38487263'), photo('9251961', 'png'),
    photo('12262101'), photo('8584705'), photo('18202585'), photo('4061385'),
    photo('1102776'), photo('4228203'), photo('30658997'), photo('16350687'),
    photo('18462136'), photo('11946030'), photo('28593086'), photo('11962269'),
    photo('18368099'), photo('5172731'), photo('6016953'), photo('36463721'),
    photo('9638823'), photo('8553860'), photo('18110858'), photo('11919823'),
  ],
  Caps: [
    photo('31162881'), photo('33820171'), photo('16648911'), photo('2479951'), photo('16648912'),
  ],
  Beanies: [
    photo('33258846'), photo('11630887'), photo('8133344'), photo('10157831'), photo('1734798'),
  ],
  Necklaces: [
    photo('16109310'), photo('16039231'), photo('16109261'), photo('25724432'), photo('15229992'),
  ],
  Belts: [
    photo('31367058'), photo('35392687'), photo('38053187'), photo('31959214'), photo('6654760'),
  ],
  Bags: [
    photo('27174548'), photo('6211599'), photo('10605356'), photo('13408246'), photo('7159432'),
  ],
};

const existingProductImages = {
  'Apex Oversized Hoodie': imagePools.Hoodies[0],
  'Metro Pullover': imagePools.Hoodies[1],
  'After Dark Zip Hoodie': imagePools.Hoodies[2],
  'Signal Crew Hoodie': imagePools.Hoodies[3],
  'Night Stripe Hoodie': imagePools.Hoodies[4],
  'Urban Echo Hoodie': imagePools.Hoodies[5],
  'Grid Fleece Hoodie': imagePools.Hoodies[6],
  'Noir Crew Hoodie': imagePools.Hoodies[7],
  'Streetline Tee': imagePools['T-shirts'][0],
  'Monochrome Graphic Tee': imagePools['T-shirts'][1],
  'Drift Tee': imagePools['T-shirts'][2],
  'Basecamp Tee': imagePools['T-shirts'][3],
  'Horizon Long Sleeve': imagePools['T-shirts'][4],
  'Minimal Wave Tee': imagePools['T-shirts'][5],
  'Oversized Block Tee': imagePools['T-shirts'][6],
  'Shell Layer Tee': imagePools['T-shirts'][7],
  'Concrete Runner': imagePools.Sneakers[0],
  'Night Shift Low': imagePools.Sneakers[1],
  'Court Fade': imagePools.Sneakers[2],
  'Velocity Pace': imagePools.Sneakers[3],
  'Dockside Trainer': imagePools.Sneakers[4],
  'Ridge Runner': imagePools.Sneakers[5],
  'Trackloop Sneaker': imagePools.Sneakers[6],
  'Mosaic Court': imagePools.Sneakers[7],
  'Pilot Cap': imagePools.Caps[0],
  'Peak Knit Cap': imagePools.Beanies[0],
  'Threaded Beanie': imagePools.Beanies[1],
  'Rooftop Buckle': imagePools.Belts[0],
  'Street Sling': imagePools.Bags[0],
  'Union Tote': imagePools.Bags[1],
  'Canvas Crossbody': imagePools.Bags[2],
  'Transit Pouch': imagePools.Bags[3],
};

const accessorySubcategory = (name) => {
  if (/beanie|knit cap/i.test(name)) return 'Beanies';
  if (/cap/i.test(name)) return 'Caps';
  if (/necklace|chain|pendant/i.test(name)) return 'Necklaces';
  if (/belt|buckle/i.test(name)) return 'Belts';
  return 'Bags';
};

const makeProducts = (names, category, subcategory, basePrice, description) => {
  const imageGroup = subcategory || category;
  return names.map((name, index) => ({
    name,
    category,
    ...(subcategory ? { subcategory } : {}),
    price: basePrice + (index % 5) * 45,
    description,
    imageURL: imagePools[imageGroup][index % imagePools[imageGroup].length],
    stock: 6 + (index % 15),
  }));
};

const additionalProducts = [
  ...makeProducts([
    'Riot Heavyweight Hoodie', 'Cinder Fleece Hoodie', 'Northside Box Hoodie',
    'District Zip Hoodie', 'Nocturne Pullover Hoodie', 'Concrete Zip Hoodie',
    'Lowkey Crew Hoodie', 'Transit Fleece Hoodie', 'Core Drop Hoodie',
    'Blockline Hoodie', 'Raw Edge Hoodie', 'After Hours Hoodie',
    'Canvas Pullover Hoodie', 'Ribbed Hem Hoodie', 'Studio Oversized Hoodie',
    'Washed Cotton Hoodie', 'Parkside Hooded Sweatshirt',
  ], 'Hoodies', null, 899, 'Street-weight fleece with a relaxed everyday fit.'),
  ...makeProducts([
    'Concrete Box Tee', 'After Hours Graphic Tee', 'Northside Heavy Tee',
    'Ribbed Core T-shirt', 'City Run T-shirt', 'Static Print Tee',
    'District Oversized Tee', 'Transit Pocket Tee', 'Heavy Cotton T-shirt',
    'Studio Crop Tee', 'Monochrome Long Sleeve Tee', 'Wide Frame Tee',
    'Utility Print T-shirt', 'Core Blank Tee', 'Washed Logo Tee',
    'Night Route Tee', 'Daily Uniform Tee',
  ], 'T-shirts', null, 399, 'Soft cotton jersey in an easy streetwear silhouette.'),
  ...makeProducts([
    'Parkline Low Sneaker', 'Signal High-Top Sneaker', 'Concrete Court Sneaker',
    'Nightshift Runner Sneaker', 'Transit Skate Sneaker', 'Rooftop Retro Sneaker',
    'District Cupsole Sneaker', 'Velocity Knit Sneaker', 'Stonewall High-Top Sneaker',
    'Metro Runner Sneaker', 'Trackline Trainer Sneaker', 'Court Fade Low Sneaker',
    'After Hours Skate Sneaker', 'Utility Trail Sneaker', 'Mono Classic Sneaker',
    'Redline Court Sneaker', 'Drift Pace Sneaker', 'Crestline Runner Sneaker',
    'Lattice Court Sneaker',
  ], 'Sneakers', null, 1499, 'Everyday street sneaker with a durable sole and cushioned step.'),
  ...makeProducts([
    'Canvas 6-Panel Cap', 'Washed Dad Cap', 'Court Snapback Cap',
  ], 'Accessories', 'Caps', 329, 'Structured cotton cap with an adjustable street-ready fit.'),
  ...makeProducts([
    'Rib Knit Beanie', 'Dockside Cuff Beanie', 'Waffle Knit Beanie', 'Night Watch Beanie',
  ], 'Accessories', 'Beanies', 279, 'Soft rib-knit beanie with a snug everyday fit.'),
  ...makeProducts([
    'Steel Link Necklace', 'Padlock Pendant Necklace', 'Double Chain Necklace',
    'Mini Tag Necklace', 'Rope Chain Necklace',
  ], 'Accessories', 'Necklaces', 399, 'Layer-ready metal necklace with a clean streetwear finish.'),
  ...makeProducts([
    'Blackline Leather Belt', 'Brass Loop Belt', 'Utility Web Belt',
  ], 'Accessories', 'Belts', 449, 'Durable belt with understated hardware and an adjustable fit.'),
  ...makeProducts([
    'Metro Crossbody Bag', 'Daily Carry Sling Bag',
  ], 'Accessories', 'Bags', 549, 'Compact carry bag with practical storage for daily essentials.'),
];

const getExistingProductImage = (product) => existingProductImages[product.name] || product.imageURL;

module.exports = {
  accessorySubcategory,
  additionalProducts,
  getExistingProductImage,
};