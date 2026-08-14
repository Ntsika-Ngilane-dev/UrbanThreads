import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  addDoc,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDfwiOVQM16yk5uQLTik2zuQsuguye9Z7E',
  authDomain: 'urban-threads-f7d7f.firebaseapp.com',
  projectId: 'urban-threads-f7d7f',
  storageBucket: 'urban-threads-f7d7f.firebasestorage.app',
  messagingSenderId: '1039648458741',
  appId: '1:1039648458741:web:60efc14a2f8288d18e82bc',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

const isAuthPage = document.body.dataset.page === 'login';
const isCartPage = document.body.dataset.page === 'cart';
const isShopPage = document.body.dataset.page === 'shop';

const cartKey = 'urbanThreadsCart';
let currentUser = null;
let products = [];
let filteredProducts = [];
let cart = [];
let cartListenerUnsubscribe = null;

const currency = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' });

const setMessage = (element, message, type = '') => {
  if (!element) return;
  element.textContent = message;
  element.classList.remove('success', 'error');
  if (type) element.classList.add(type);
};

const getLocalCart = () => {
  try {
    const saved = localStorage.getItem(cartKey);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
};

const updateLocalCart = () => {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartBadge();
};

const updateCartBadge = () => {
  const badge = document.getElementById('cart-count-badge');
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  if (badge) badge.textContent = String(count);
};

const addOrUpdateUserCart = async (userId, nextCart) => {
  if (!userId) return;

  try {
    const userDoc = doc(db, 'users', userId);
    await setDoc(userDoc, { cart: nextCart }, { merge: true });
  } catch (error) {
    console.warn('Could not sync cart to Firestore:', error);
  }
};

const syncCartToUser = async () => {
  if (!currentUser) return;
  await addOrUpdateUserCart(currentUser.uid, cart);
};

const getUserCartDoc = async (userId) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    return userDoc.exists() ? userDoc.data().cart || [] : [];
  } catch (error) {
    console.warn('Failed to fetch user cart:', error);
    return [];
  }
};

const loadCart = async () => {
  if (!currentUser) {
    cart = getLocalCart();
    updateLocalCart();
    return;
  }

  try {
    const userCart = await getUserCartDoc(currentUser.uid);
    cart = userCart.length ? userCart : getLocalCart();
    updateLocalCart();
    await syncCartToUser();
  } catch (error) {
    cart = getLocalCart();
  }

  updateCartBadge();
};

const addToCart = async (productId) => {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }

  updateLocalCart();
  await syncCartToUser();
  renderCartPage();
  renderShopPage();
};

const updateQuantity = async (productId, change) => {
  const item = cart.find((entry) => entry.productId === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    cart = cart.filter((entry) => entry.productId !== productId);
  }

  updateLocalCart();
  await syncCartToUser();
  renderCartPage();
  renderShopPage();
};

const removeFromCart = async (productId) => {
  cart = cart.filter((entry) => entry.productId !== productId);
  updateLocalCart();
  await syncCartToUser();
  renderCartPage();
  renderShopPage();
};

const productById = (id) => products.find((item) => item.id === id) || null;

const getCartItemsWithDetails = () => {
  return cart
    .map((entry) => {
      const product = productById(entry.productId);
      if (!product) return null;
      return { ...product, quantity: entry.quantity, lineTotal: product.price * entry.quantity };
    })
    .filter(Boolean);
};

const getCartSummary = () => {
  const items = getCartItemsWithDetails();
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shipping = subtotal > 1500 ? 0 : subtotal > 0 ? Math.min(120, subtotal * 0.08) : 0;
  const total = subtotal + shipping;

  return { items, subtotal, shipping, total };
};

const renderCartPage = () => {
  if (!isCartPage) return;

  const cartItems = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('subtotal-value');
  const shippingEl = document.getElementById('shipping-value');
  const totalEl = document.getElementById('total-value');
  const cartStatus = document.getElementById('cart-status');

  if (!cartItems || !subtotalEl || !shippingEl || !totalEl) return;

  const { items, subtotal, shipping, total } = getCartSummary();

  if (!items.length) {
    cartItems.innerHTML = `
      <div class="empty-state">
        <h3>Your cart is empty</h3>
        <p>Curate your drop and build your next street-ready fit.</p>
      </div>
    `;
    subtotalEl.textContent = currency.format(0);
    shippingEl.textContent = currency.format(0);
    totalEl.textContent = currency.format(0);
    if (cartStatus) cartStatus.textContent = 'Add a few essentials to continue.';
    return;
  }

  subtotalEl.textContent = currency.format(subtotal);
  shippingEl.textContent = shipping === 0 ? 'Free' : currency.format(shipping);
  totalEl.textContent = currency.format(total);

  cartItems.innerHTML = items
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${item.imageURL || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'}" alt="${item.name}" />
          <div class="item-details">
            <h3>${item.name}</h3>
            <p>${item.category}</p>
            <div class="item-actions">
              <div class="quantity-control" aria-label="Quantity controls">
                <button class="qty-button" type="button" data-action="decrease" data-product-id="${item.id}">−</button>
                <span>${item.quantity}</span>
                <button class="qty-button" type="button" data-action="increase" data-product-id="${item.id}">+</button>
              </div>
              <button class="remove-btn" type="button" data-action="remove" data-product-id="${item.id}">Remove</button>
            </div>
          </div>
          <div class="item-total">${currency.format(item.lineTotal)}</div>
        </div>
      `
    )
    .join('');

  if (cartStatus) {
    const note = subtotal > 1500 ? 'Free delivery unlocked.' : 'Spend over R1,500 for free delivery.';
    cartStatus.textContent = `${items.length} item${items.length > 1 ? 's' : ''} in your cart • ${note}`;
  }
};

const renderShopPage = () => {
  if (!isShopPage) return;

  const grid = document.getElementById('products-grid');
  const countEl = document.getElementById('products-count');

  if (!grid) return;

  const activeCategory = document.querySelector('.filter-button.active')?.dataset.category || 'all';
  filteredProducts =
    activeCategory === 'all'
      ? [...products]
      : products.filter((product) => product.category === activeCategory);

  if (countEl) countEl.textContent = `${filteredProducts.length} style${filteredProducts.length === 1 ? '' : 's'}`;

  grid.innerHTML = filteredProducts
    .map(
      (product) => `
        <article class="product-card">
          <div class="product-image-wrap">
            <img src="${product.imageURL || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'}" alt="${product.name}" />
          </div>
          <div class="product-info">
            <div class="product-meta">
              <span>${product.category}</span>
              <span>${product.stock ? `${product.stock} left` : 'In stock'}</span>
            </div>
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-row">
              <span class="price">${currency.format(product.price)}</span>
              <button class="add-to-cart-btn" type="button" data-product-id="${product.id}">Add to cart</button>
            </div>
          </div>
        </article>
      `
    )
    .join('');
};

const setupCategoryFilters = () => {
  document.querySelectorAll('.filter-button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      renderShopPage();
    });
  });
};

const handleShopInteractions = () => {
  if (!isShopPage) return;

  document.body.addEventListener('click', async (event) => {
    const target = event.target.closest('[data-product-id]');
    if (!target) return;

    const productId = target.dataset.productId;
    const action = target.dataset.action;

    if (target.classList.contains('add-to-cart-btn') || target.classList.contains('product-button')) {
      await addToCart(productId);
    }

    if (action === 'increase') {
      await updateQuantity(productId, 1);
    }
    if (action === 'decrease') {
      await updateQuantity(productId, -1);
    }
    if (action === 'remove') {
      await removeFromCart(productId);
    }
  });
};

const closeCheckoutModal = () => {
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;
  modal.remove();
};

const openCheckoutModal = () => {
  if (document.getElementById('checkout-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'checkout-modal';
  modal.className = 'checkout-modal';

  const summary = getCartSummary();
  const shippingText = summary.shipping === 0 ? 'Free delivery' : `${currency.format(summary.shipping)} delivery`;

  modal.innerHTML = `
    <div class="checkout-modal-card">
      <div class="checkout-modal-header">
        <div>
          <span class="eyebrow">Secure checkout</span>
          <h3>Delivery details</h3>
        </div>
        <button class="close-checkout" type="button" aria-label="Close checkout">×</button>
      </div>

      <form id="checkout-form" class="checkout-form">
        <div class="checkout-grid">
          <label>
            Full name
            <input type="text" name="fullName" placeholder="Your full name" required />
          </label>
          <label>
            Email address
            <input type="email" name="email" placeholder="you@example.com" required />
          </label>
          <label>
            Phone number
            <input type="tel" name="phone" placeholder="+27 82 555 1234" required />
          </label>
          <label>
            Delivery address
            <input type="text" name="addressLine1" placeholder="Street address" required />
          </label>
          <label>
            Suburb
            <input type="text" name="suburb" placeholder="Suburb" required />
          </label>
          <label>
            City
            <input type="text" name="city" placeholder="City" required />
          </label>
          <label>
            Province
            <input type="text" name="province" placeholder="Province" required />
          </label>
          <label>
            Postal code
            <input type="text" name="postalCode" placeholder="Postal code" required />
          </label>
        </div>

        <div class="checkout-summary-box">
          <div class="summary-row">
            <span>Subtotal</span>
            <strong>${currency.format(summary.subtotal)}</strong>
          </div>
          <div class="summary-row">
            <span>Delivery</span>
            <strong>${shippingText}</strong>
          </div>
          <div class="summary-row total-row">
            <span>Total</span>
            <strong>${currency.format(summary.total)}</strong>
          </div>
        </div>

        <div class="checkout-actions">
          <button type="button" class="ghost-btn close-checkout-trigger">Back</button>
          <button type="submit" class="primary-btn">Place demo order</button>
        </div>
        <p id="checkout-message" class="auth-message" aria-live="polite"></p>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeCheckoutModal();
  });

  const closeButtons = modal.querySelectorAll('.close-checkout, .close-checkout-trigger');
  closeButtons.forEach((button) => {
    button.addEventListener('click', closeCheckoutModal);
  });

  const form = modal.querySelector('#checkout-form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get('fullName') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      addressLine1: String(formData.get('addressLine1') || '').trim(),
      suburb: String(formData.get('suburb') || '').trim(),
      city: String(formData.get('city') || '').trim(),
      province: String(formData.get('province') || '').trim(),
      postalCode: String(formData.get('postalCode') || '').trim(),
    };

    const messageEl = document.getElementById('checkout-message');
    const missingFields = Object.values(payload).some((value) => !value);

    if (missingFields) {
      setMessage(messageEl, 'Please complete all delivery details before checkout.', 'error');
      return;
    }

    const orderSummary = getCartSummary();
    const orderLines = orderSummary.items
      .map((item) => `• ${item.name} x ${item.quantity} — ${currency.format(item.lineTotal)}`)
      .join('\n');

    const receiptBody = [
      'Thank you for shopping at Urban Threads.',
      '',
      'Customer details:',
      `Name: ${payload.fullName}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      '',
      'Delivery address:',
      `${payload.addressLine1}`,
      `${payload.suburb}, ${payload.city}`,
      `${payload.province} ${payload.postalCode}`,
      '',
      'Order summary:',
      orderLines,
      '',
      `Subtotal: ${currency.format(orderSummary.subtotal)}`,
      `Delivery: ${orderSummary.shipping === 0 ? 'Free' : currency.format(orderSummary.shipping)}`,
      `Total: ${currency.format(orderSummary.total)}`,
      '',
      'This is a demo checkout. No payment was processed.',
    ].join('\n');

    const mailtoLink = `mailto:${encodeURIComponent(payload.email)}?subject=${encodeURIComponent('Urban Threads receipt')}&body=${encodeURIComponent(receiptBody)}`;

    setMessage(messageEl, 'Sending your receipt and returning home...', 'success');

    const closeAndRedirect = () => {
      closeCheckoutModal();
      cart = [];
      updateLocalCart();
      if (currentUser) {
        syncCartToUser();
      }
      renderCartPage();
      renderShopPage();
      window.location.href = 'index.html';
    };

    window.location.href = mailtoLink;
    setTimeout(closeAndRedirect, 900);
  });
};

const setupCartPageHandlers = () => {
  if (!isCartPage) return;

  document.body.addEventListener('click', async (event) => {
    const checkoutButton = event.target.closest('.checkout-btn');
    if (checkoutButton) {
      if (!cart.length) {
        const cartStatus = document.getElementById('cart-status');
        if (cartStatus) setMessage(cartStatus, 'Add an item before checking out.', 'error');
        return;
      }
      openCheckoutModal();
      return;
    }

    const target = event.target.closest('[data-action]');
    if (!target) return;

    const productId = target.dataset.productId;
    const action = target.dataset.action;

    if (action === 'increase') {
      await updateQuantity(productId, 1);
    }
    if (action === 'decrease') {
      await updateQuantity(productId, -1);
    }
    if (action === 'remove') {
      await removeFromCart(productId);
    }
  });
};

const setupAuthPage = () => {
  if (!isAuthPage) return;

  const form = document.getElementById('auth-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const button = document.getElementById('submit-auth');
  const googleButton = document.getElementById('google-signin');
  const authMessage = document.getElementById('auth-message');
  const tabs = document.querySelectorAll('.mode-button');

  let mode = 'login';

  const updateButtonText = () => {
    button.textContent = mode === 'login' ? 'Sign In' : 'Create Account';
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      mode = tab.dataset.mode;
      tabs.forEach((item) => item.classList.toggle('active', item === tab));
      updateButtonText();
      setMessage(authMessage, '');
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      setMessage(authMessage, 'Please provide both email and password.', 'error');
      return;
    }

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage(authMessage, 'Welcome back — signed in successfully.', 'success');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage(authMessage, 'Account created! You are now signed in.', 'success');
      }

      form.reset();
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } catch (error) {
      setMessage(authMessage, error.message || 'Authentication failed.', 'error');
    }
  });

  googleButton.addEventListener('click', async () => {
    try {
      await signInWithPopup(auth, provider);
      setMessage(authMessage, 'Signed in with Google successfully.', 'success');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } catch (error) {
      const code = error?.code || '';

      if (code === 'auth/popup-blocked') {
        setMessage(authMessage, 'The Google popup was blocked. Please allow popups and try again.', 'error');
      } else if (code === 'auth/operation-not-allowed') {
        setMessage(
          authMessage,
          'Google sign-in is not enabled for this Firebase project yet. Enable it in Firebase Authentication > Sign-in method.',
          'error'
        );
      } else {
        setMessage(authMessage, error.message || 'Google sign-in failed.', 'error');
      }
    }
  });

  updateButtonText();
};

const updateAuthNavbar = () => {
  const profileLink = document.getElementById('profile-link');
  const logoutButton = document.getElementById('logout-button');
  const joinButton = document.getElementById('join-crew-button');
  if (!profileLink) return;

  if (currentUser) {
    const display = currentUser.displayName || currentUser.email || 'Account';
    profileLink.textContent = display.length > 18 ? `${display.slice(0, 15)}…` : display;
    profileLink.href = 'cart.html';
    if (logoutButton) {
      logoutButton.style.display = 'inline-flex';
    }
    if (joinButton) {
      joinButton.style.display = 'none';
    }
  } else {
    profileLink.textContent = 'Log In';
    profileLink.href = 'login.html';
    if (logoutButton) {
      logoutButton.style.display = 'none';
    }
    if (joinButton) {
      joinButton.style.display = 'inline-flex';
    }
  }
};

const renderSignedOutState = () => {
  const authMessage = document.getElementById('auth-message');
  if (authMessage && isAuthPage) {
    setMessage(authMessage, '');
  }
};

const setupAuthState = () => {
  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    updateAuthNavbar();

    if (user) {
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        email: user.email || '',
        displayName: user.displayName || user.email || 'Urban Threads user',
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      await loadCart();
    } else {
      cart = getLocalCart();
      updateLocalCart();
      renderSignedOutState();
    }

    renderCartPage();
    updateCartBadge();
  });
};

const initIntroAnimation = () => {
  const intro = document.getElementById('intro-screen');
  if (!intro) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      intro.classList.add('hidden');
    }, 1800);
  });
};

const seedProductsIfEmpty = async () => {
  const productSeed = [
    {
      name: 'Apex Oversized Hoodie',
      price: 899,
      category: 'Hoodies',
      description: 'Heavyweight cotton fleece with an oversized drop-shoulder fit.',
      imageURL: 'https://images.unsplash.com/photo-1556821552-7f41c5d440db?auto=format&fit=crop&w=900&q=80',
      stock: 12,
    },
    {
      name: 'Metro Pullover',
      price: 849,
      category: 'Hoodies',
      description: 'Soft brushed interior and clean front pocket for all-day wear.',
      imageURL: 'https://images.unsplash.com/photo-1552062407-291826ab63fd?auto=format&fit=crop&w=900&q=80',
      stock: 9,
    },
    {
      name: 'After Dark Zip Hoodie',
      price: 999,
      category: 'Hoodies',
      description: 'Tinted zip closure with tonal trims and a relaxed city fit.',
      imageURL: 'https://images.unsplash.com/photo-1544987859-e924c5e15c07?auto=format&fit=crop&w=900&q=80',
      stock: 7,
    },
    {
      name: 'Signal Crew Hoodie',
      price: 939,
      category: 'Hoodies',
      description: 'Roomy body, structured hood, and premium brushed finish.',
      imageURL: 'https://images.unsplash.com/photo-1551930820-330a71b99659?auto=format&fit=crop&w=900&q=80',
      stock: 10,
    },
    {
      name: 'Streetline Tee',
      price: 459,
      category: 'T-shirts',
      description: 'Boxy tee with premium jersey weight and minimalist logo.',
      imageURL: 'https://images.unsplash.com/photo-1503341338985-8a378ef08b8b?auto=format&fit=crop&w=900&q=80',
      stock: 15,
    },
    {
      name: 'Monochrome Graphic Tee',
      price: 499,
      category: 'T-shirts',
      description: 'Clean front graphic with an oversized, laid-back silhouette.',
      imageURL: 'https://images.unsplash.com/photo-1551028719-00167b16ebc5?auto=format&fit=crop&w=900&q=80',
      stock: 18,
    },
    {
      name: 'Drift Tee',
      price: 429,
      category: 'T-shirts',
      description: 'Airy cotton feel built for warm afternoons and layered fits.',
      imageURL: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
      stock: 14,
    },
    {
      name: 'Basecamp Tee',
      price: 479,
      category: 'T-shirts',
      description: 'Everyday staple with a sharper neckline and soft hand feel.',
      imageURL: 'https://images.unsplash.com/photo-1521392573388-8b28d648b4c1?auto=format&fit=crop&w=900&q=80',
      stock: 20,
    },
    {
      name: 'Concrete Runner',
      price: 1699,
      category: 'Sneakers',
      description: 'Cushioned daily runner built for city movement and comfort.',
      imageURL: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
      stock: 8,
    },
    {
      name: 'Night Shift Low',
      price: 1599,
      category: 'Sneakers',
      description: 'Low-profile silhouette with durable rubber grip and all-day comfort.',
      imageURL: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80',
      stock: 11,
    },
    {
      name: 'Court Fade',
      price: 1799,
      category: 'Sneakers',
      description: 'Structured leather upper with clean lines and tonal contrast.',
      imageURL: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80',
      stock: 6,
    },
    {
      name: 'Velocity Pace',
      price: 1749,
      category: 'Sneakers',
      description: 'Responsive sole and premium streetwear finish that stands out.',
      imageURL: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=900&q=80',
      stock: 5,
    },
    {
      name: 'Pilot Cap',
      price: 349,
      category: 'Accessories',
      description: 'Structured fit cap in a tonal finish to round out your outfit.',
      imageURL: 'https://images.unsplash.com/photo-1521369909026-2afc706d5d2a?auto=format&fit=crop&w=900&q=80',
      stock: 26,
    },
    {
      name: 'Street Sling',
      price: 599,
      category: 'Accessories',
      description: 'Compact crossbody bag built with utility pockets and a matte finish.',
      imageURL: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
      stock: 12,
    },
    {
      name: 'Threaded Beanie',
      price: 299,
      category: 'Accessories',
      description: 'Woven beanie with soft inner lining and washed black finish.',
      imageURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
      stock: 22,
    },
    {
      name: 'Union Tote',
      price: 549,
      category: 'Accessories',
      description: 'Minimal everyday tote for quick errands, gym runs, and commute days.',
      imageURL: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
      stock: 17,
    },
    {
      name: 'Night Stripe Hoodie',
      price: 969,
      category: 'Hoodies',
      description: 'Two-tone stripe trim and a street-cut silhouette with deep pockets.',
      imageURL: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
      stock: 9,
    },
    {
      name: 'Oversized Block Tee',
      price: 519,
      category: 'T-shirts',
      description: 'Roomy fit with a slightly wider body and clean neckline.',
      imageURL: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
      stock: 16,
    },
    {
      name: 'Dockside Trainer',
      price: 1649,
      category: 'Sneakers',
      description: 'Low-cut runner with textured balance and everyday traction.',
      imageURL: 'https://images.unsplash.com/photo-1519095f3364-8a83-e815-d0c4-c99f12fb3ce7?auto=format&fit=crop&w=900&q=80',
      stock: 10,
    },
    {
      name: 'Canvas Crossbody',
      price: 629,
      category: 'Accessories',
      description: 'Small crossbody bag with structured canvas and hidden zip pocket.',
      imageURL: 'https://images.unsplash.com/photo-1524368532754-9996e7d4d5f7?auto=format&fit=crop&w=900&q=80',
      stock: 14,
    },
    {
      name: 'Urban Echo Hoodie',
      price: 919,
      category: 'Hoodies',
      description: 'Luxe fleece feel with a slightly tapered, fashion-first fit.',
      imageURL: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
      stock: 8,
    },
    {
      name: 'Horizon Long Sleeve',
      price: 689,
      category: 'T-shirts',
      description: 'Long sleeve staple crafted for cooler evenings and layered styling.',
      imageURL: 'https://images.unsplash.com/photo-1506629082632-69ba78d64245?auto=format&fit=crop&w=900&q=80',
      stock: 13,
    },
    {
      name: 'Trackloop Sneaker',
      price: 1849,
      category: 'Sneakers',
      description: 'Chunky sole with comfort-first cushioning and textured finish.',
      imageURL: 'https://images.unsplash.com/photo-1511614387149-abc4cecb108e?auto=format&fit=crop&w=900&q=80',
      stock: 7,
    },
    {
      name: 'Rooftop Buckle',
      price: 579,
      category: 'Accessories',
      description: 'Minimal leather belt styled to finish clean casual outfits.',
      imageURL: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
      stock: 11,
    },
    {
      name: 'Grid Fleece Hoodie',
      price: 929,
      category: 'Hoodies',
      description: 'Cotton fleece hoodie with grid texture and laid-back volume.',
      imageURL: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
      stock: 12,
    },
    {
      name: 'Minimal Wave Tee',
      price: 449,
      category: 'T-shirts',
      description: 'Soft touch tee with a slightly relaxed shape and premium drape.',
      imageURL: 'https://images.unsplash.com/photo-1556821552-7f41c5d440db?auto=format&fit=crop&w=900&q=80',
      stock: 21,
    },
    {
      name: 'Ridge Runner',
      price: 1889,
      category: 'Sneakers',
      description: 'A premium runner balancing cushioning, grip, and street style.',
      imageURL: 'https://images.unsplash.com/photo-1549622917-50a23e5a1cda?auto=format&fit=crop&w=900&q=80',
      stock: 6,
    },
    {
      name: 'Peak Knit Cap',
      price: 389,
      category: 'Accessories',
      description: 'Clean knit cap in a soft brushed finish with subtle logo detail.',
      imageURL: 'https://images.unsplash.com/photo-1572307480616-40629fe7e2b0?auto=format&fit=crop&w=900&q=80',
      stock: 20,
    },
    {
      name: 'Noir Crew Hoodie',
      price: 949,
      category: 'Hoodies',
      description: 'Dark premium fleece with a quiet logo and wide drape.',
      imageURL: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
      stock: 10,
    },
    {
      name: 'Shell Layer Tee',
      price: 469,
      category: 'T-shirts',
      description: 'Tighter fit in a light premium knit built for warmer layers.',
      imageURL: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
      stock: 19,
    },
    {
      name: 'Mosaic Court',
      price: 1769,
      category: 'Sneakers',
      description: 'Modern court sneaker with elevated cushioning and clean finish.',
      imageURL: 'https://images.unsplash.com/photo-1525895917283-3a1c8aeb446e?auto=format&fit=crop&w=900&q=80',
      stock: 9,
    },
    {
      name: 'Transit Pouch',
      price: 329,
      category: 'Accessories',
      description: 'Mini utility pouch for essentials, cards, and daily carry.',
      imageURL: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
      stock: 22,
    },
  ];

  try {
    const snapshot = await getDocs(collection(db, 'products'));
    if (snapshot.docs.length > 0) return;

    for (const product of productSeed) {
      await addDoc(collection(db, 'products'), product);
    }
  } catch (error) {
    console.error('Could not seed Firestore catalogue:', error);
  }
};

const fetchProducts = async () => {
  try {
    await seedProductsIfEmpty();
    const snapshot = await getDocs(collection(db, 'products'));
    products = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
    if (products.length === 0) {
      console.warn('No products found in Firestore.');
    }
    renderShopPage();
    renderCartPage();
    updateCartBadge();
  } catch (error) {
    console.error('Failed to load products from Firestore:', error);
  }
};

const handleLogout = () => {
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
      await signOut(auth);
      currentUser = null;
      updateAuthNavbar();
      cart = getLocalCart();
      updateLocalCart();
      renderCartPage();
    });
  }
};

const initializeAppFlow = async () => {
  initIntroAnimation();
  setupCategoryFilters();
  setupAuthPage();
  setupCartPageHandlers();
  handleShopInteractions();
  handleLogout();
  await fetchProducts();
  setupAuthState();
  updateCartBadge();
};

initializeAppFlow();
