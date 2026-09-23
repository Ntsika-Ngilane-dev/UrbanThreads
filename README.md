# Urban Threads

Urban Threads is a modern streetwear storefront built with Firebase, JavaScript, HTML, and CSS. It showcases a premium clothing catalog, supports user authentication, cart management, and a demo checkout flow designed for a stylish ecommerce experience.

## Features

- 32-item streetwear catalog with category filters
- Firebase Firestore product catalog integration
- Email/password and Google sign-in support
- Cart with add, remove, and quantity controls
- South African pricing using ZAR formatting
- Free delivery over R1,500
- Demo checkout flow with delivery form and receipt email
- Responsive, minimalist streetwear UI

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Firebase Authentication
- Firebase Firestore
- Firebase Hosting

## Project Structure

- `index.html` — homepage
- `shop.html` — storefront listing and product filters
- `login.html` — authentication screen
- `cart.html` — cart and checkout summary
- `css/styles.css` — site styling
- `js/app.js` — app logic, Firebase integration, cart logic, UI behavior
- `scripts/seed-30-products.js` — script to populate the product catalog
- `firebase.json` — Firebase hosting config
- `firestore.rules` — Firestore access rules

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the app locally:
   ```bash
   firebase serve
   ```
   or open the project files in a browser with a local static server if preferred.

3. Ensure Firebase config is set in the app for your project.

### Seed Firestore Products

The browser only reads the public `products` collection. Product writes are restricted by `firestore.rules` and should be performed with the Admin SDK seed script:

Set `FIREBASE_SERVICE_ACCOUNT` to a service-account JSON file stored outside this project, then run:

```powershell
$env:FIREBASE_SERVICE_ACCOUNT = 'C:\secure\urbanthreads-service-account.json'
npm run seed:products
```

Keep the service-account JSON file private and never deploy it with the website.

To update an existing Firestore catalogue with the current Rand prices and image matches:

```bash
npm run refresh:catalog
```

## Firebase Setup

1. Create or select a Firebase project.
2. Enable Authentication and add the providers you want to use.
3. Enable Firestore.
4. Update your Firebase web config values in the app logic.
5. Deploy to Firebase Hosting when ready:
   ```bash
   firebase deploy
   ```

## Product Catalog

The storefront uses a Firestore `products` collection. Each product includes:

```js
{
  name: "Oversized Hoodie",
  price: 899,
  category: "Hoodies",
  description: "Heavyweight cotton fleece with an oversized drop-shoulder fit.",
  imageURL: "https://images.example.com/hoodie.jpg"
}
```

### Product Image Sources

Each storefront image is selected to match the product name, category, and description. The links below are the image sources used by the catalogue.

| Product | Image source |
| --- | --- |
| Apex Oversized Hoodie | [Pexels image](https://images.pexels.com/photos/3622622/pexels-photo-3622622.jpeg) |
| Metro Pullover | [Pexels image](https://images.pexels.com/photos/3622621/pexels-photo-3622621.jpeg) |
| After Dark Zip Hoodie | [Pexels image](https://images.pexels.com/photos/1157026/pexels-photo-1157026.jpeg) |
| Signal Crew Hoodie | [Pexels image](https://images.pexels.com/photos/3622623/pexels-photo-3622623.jpeg) |
| Streetline Tee | [Pexels image](https://images.pexels.com/photos/991831/pexels-photo-991831.jpeg) |
| Monochrome Graphic Tee | [Pexels image](https://images.pexels.com/photos/2769274/pexels-photo-2769274.jpeg) |
| Drift Tee | [Pexels image](https://images.pexels.com/photos/3622579/pexels-photo-3622579.jpeg) |
| Basecamp Tee | [Pexels image](https://images.pexels.com/photos/3945681/pexels-photo-3945681.jpeg) |
| Concrete Runner | [Pexels image](https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg) |
| Night Shift Low | [Pexels image](https://images.pexels.com/photos/1407622/pexels-photo-1407622.jpeg) |
| Court Fade | [Pexels image](https://images.pexels.com/photos/3560167/pexels-photo-3560167.jpeg) |
| Velocity Pace | [Pexels image](https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg) |
| Pilot Cap | [Pexels image](https://images.pexels.com/photos/3622626/pexels-photo-3622626.jpeg) |
| Street Sling | [Pexels image](https://images.pexels.com/photos/3622627/pexels-photo-3622627.jpeg) |
| Threaded Beanie | [Pexels image](https://images.pexels.com/photos/5632400/pexels-photo-5632400.jpeg) |
| Union Tote | [Pexels image](https://images.pexels.com/photos/3622625/pexels-photo-3622625.jpeg) |
| Night Stripe Hoodie | [Pexels image](https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg) |
| Oversized Block Tee | [Pexels image](https://images.pexels.com/photos/3622620/pexels-photo-3622620.jpeg) |
| Dockside Trainer | [Pexels image](https://images.pexels.com/photos/1261622/pexels-photo-1261622.jpeg) |
| Canvas Crossbody | [Unsplash image](https://images.unsplash.com/photo-1524368532754-9996e7d4d5f7?auto=format&fit=crop&w=900&q=80) |
| Urban Echo Hoodie | [Pexels image](https://images.pexels.com/photos/4194857/pexels-photo-4194857.jpeg) |
| Horizon Long Sleeve | [Pexels image](https://images.pexels.com/photos/3965987/pexels-photo-3965987.jpeg) |
| Trackloop Sneaker | [Pexels image](https://images.pexels.com/photos/3560166/pexels-photo-3560166.jpeg) |
| Rooftop Buckle | [Pexels image](https://images.pexels.com/photos/4531619/pexels-photo-4531619.jpeg) |
| Grid Fleece Hoodie | [Pexels image](https://images.pexels.com/photos/7217550/pexels-photo-7217550.jpeg) |
| Minimal Wave Tee | [Pexels image](https://images.pexels.com/photos/3945682/pexels-photo-3945682.jpeg) |
| Ridge Runner | [Pexels image](https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg) |
| Peak Knit Cap | [Pexels image](https://images.pexels.com/photos/3945680/pexels-photo-3945680.jpeg) |
| Noir Crew Hoodie | [Pexels image](https://images.pexels.com/photos/5825530/pexels-photo-5825530.jpeg) |
| Shell Layer Tee | [Pexels image](https://images.pexels.com/photos/5825529/pexels-photo-5825529.jpeg) |
| Mosaic Court | [Pexels image](https://images.pexels.com/photos/4530340/pexels-photo-4530340.jpeg) |
| Transit Pouch | [Unsplash image](https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80) |

Images are served through Pexels and Unsplash image CDNs. See [Pexels' license](https://www.pexels.com/license/) and [Unsplash's license](https://unsplash.com/license) for usage terms.

## Demo Checkout

The checkout flow is a demo-only experience. It collects delivery information and generates a receipt email, but it does not process a real payment.

## Notes

- The app is designed as a premium streetwear storefront prototype.
- Google sign-in must be enabled in Firebase Authentication for the provider to work live.
- The design emphasizes a clean, modern, minimalist aesthetic with a strong urban edge.

## License

This project is for educational and demonstration use.
