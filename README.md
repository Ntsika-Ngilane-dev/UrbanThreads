# Urban Threads

Urban Threads is a modern streetwear storefront built with Firebase, JavaScript, HTML, and CSS. It showcases a premium clothing catalog, supports user authentication, cart management, and a demo checkout flow designed for a stylish ecommerce experience.

## Features

- 30-item streetwear catalog with category filters
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

## Demo Checkout

The checkout flow is a demo-only experience. It collects delivery information and generates a receipt email, but it does not process a real payment.

## Notes

- The app is designed as a premium streetwear storefront prototype.
- Google sign-in must be enabled in Firebase Authentication for the provider to work live.
- The design emphasizes a clean, modern, minimalist aesthetic with a strong urban edge.

## License

This project is for educational and demonstration use.
