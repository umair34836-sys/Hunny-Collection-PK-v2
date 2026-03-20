// SEO Configuration - Static Frontend SEO
// This file contains all SEO meta tags for every page
// Edit this file OR use Admin Panel SEO Dashboard to update

export const SEO_DATA = {
  // Home Page
  index: {
    title: "Hunny Collection PK - Premium Female Fashion Store in Pakistan",
    description: "Shop premium female fashion at Hunny Collection PK. Dresses, Kurtis, Jewelry, Bags & more. Cash on Delivery available. Fast shipping across Pakistan.",
    keywords: "female fashion, dresses, kurtis, jewelry, bags, shoes, pakistan, online shopping, cash on delivery, hunny collection",
    ogImage: "https://via.placeholder.com/1200x630/FFB6C1/333?text=Hunny+Collection+PK",
    canonical: "https://umair34836-sys.github.io/Hunny-Collection-PK-v2/index.html",
    robots: "index, follow"
  },

  // Shop Page
  shop: {
    title: "Shop All Products - Hunny Collection PK | Dresses, Kurtis, Jewelry & More",
    description: "Browse our complete collection of premium female fashion. Dresses, Kurtis, Jewelry, Bags, Shoes with Cash on Delivery. Fast shipping across Pakistan.",
    keywords: "shop dresses, kurtis online, jewelry pakistan, bags for women, shoes online, fashion store, cash on delivery",
    ogImage: "https://via.placeholder.com/1200x630/FFB6C1/333?text=Shop+Now",
    canonical: "https://umair34836-sys.github.io/Hunny-Collection-PK-v2/shop.html",
    robots: "index, follow"
  },

  // Product Detail Page
  product: {
    title: "Product Details - Hunny Collection PK",
    description: "View product details, prices and order online. Cash on Delivery available. Fast shipping across Pakistan.",
    keywords: "product details, buy online, fashion products, pakistan",
    ogImage: "https://via.placeholder.com/1200x630/FFB6C1/333?text=Product",
    canonical: "https://umair34836-sys.github.io/Hunny-Collection-PK-v2/product.html",
    robots: "index, follow"
  },

  // Cart Page
  cart: {
    title: "Shopping Cart - Hunny Collection PK",
    description: "Review your shopping cart and proceed to checkout. Cash on Delivery available. Fast shipping across Pakistan.",
    keywords: "shopping cart, checkout, online shopping, pakistan",
    ogImage: "https://via.placeholder.com/1200x630/FFB6C1/333?text=Cart",
    canonical: "https://umair34836-sys.github.io/Hunny-Collection-PK-v2/cart.html",
    robots: "noindex, follow"
  },

  // Checkout Page
  checkout: {
    title: "Checkout - Hunny Collection PK",
    description: "Complete your order securely. Cash on Delivery available. Fast shipping across Pakistan.",
    keywords: "checkout, order now, secure payment, pakistan",
    ogImage: "https://via.placeholder.com/1200x630/FFB6C1/333?text=Checkout",
    canonical: "https://umair34836-sys.github.io/Hunny-Collection-PK-v2/checkout.html",
    robots: "noindex, nofollow"
  },

  // Contact Page
  contact: {
    title: "Contact Us - Hunny Collection PK | WhatsApp +92 301 8858303",
    description: "Get in touch with Hunny Collection PK. WhatsApp: +92 301 8858303. Email: MrCopper804@gmail.com. Fast response guaranteed.",
    keywords: "contact us, whatsapp, email, customer support, pakistan, hunny collection contact",
    ogImage: "https://via.placeholder.com/1200x630/FFB6C1/333?text=Contact+Us",
    canonical: "https://umair34836-sys.github.io/Hunny-Collection-PK-v2/contact.html",
    robots: "index, follow"
  },

  // Account/Login Page
  account: {
    title: "My Account - Hunny Collection PK",
    description: "Manage your account, view orders and track deliveries. Hunny Collection PK customer portal.",
    keywords: "my account, login, order history, track order, pakistan",
    ogImage: "https://via.placeholder.com/1200x630/FFB6C1/333?text=My+Account",
    canonical: "https://umair34836-sys.github.io/Hunny-Collection-PK-v2/account.html",
    robots: "noindex, follow"
  },

  // Login Page
  login: {
    title: "Login - Hunny Collection PK",
    description: "Login to your Hunny Collection PK account. Access your orders and wishlist.",
    keywords: "login, sign in, account access, pakistan",
    ogImage: "https://via.placeholder.com/1200x630/FFB6C1/333?text=Login",
    canonical: "https://umair34836-sys.github.io/Hunny-Collection-PK-v2/login.html",
    robots: "noindex, follow"
  },

  // Signup Page
  signup: {
    title: "Sign Up - Hunny Collection PK",
    description: "Create your Hunny Collection PK account. Get exclusive deals and offers.",
    keywords: "sign up, register, create account, pakistan",
    ogImage: "https://via.placeholder.com/1200x630/FFB6C1/333?text=Sign+Up",
    canonical: "https://umair34836-sys.github.io/Hunny-Collection-PK-v2/signup.html",
    robots: "noindex, follow"
  },

  // Admin Page
  admin: {
    title: "Admin Panel - Hunny Collection PK",
    description: "Admin dashboard for managing products, orders, and settings.",
    keywords: "admin, dashboard, manage products, orders",
    ogImage: "https://via.placeholder.com/1200x630/FFB6C1/333?text=Admin",
    canonical: "https://umair34836-sys.github.io/Hunny-Collection-PK-v2/admin.html",
    robots: "noindex, nofollow"
  },

  // Orders Page
  orders: {
    title: "My Orders - Hunny Collection PK",
    description: "View and track your orders from Hunny Collection PK.",
    keywords: "my orders, order history, track delivery, pakistan",
    ogImage: "https://via.placeholder.com/1200x630/FFB6C1/333?text=My+Orders",
    canonical: "https://umair34836-sys.github.io/Hunny-Collection-PK-v2/orders.html",
    robots: "noindex, follow"
  },

  // Settings Page
  settings: {
    title: "Site Settings - Hunny Collection PK",
    description: "Manage site settings, SEO, contact info, and more.",
    keywords: "settings, admin, configuration",
    ogImage: "https://via.placeholder.com/1200x630/FFB6C1/333?text=Settings",
    canonical: "https://umair34836-sys.github.io/Hunny-Collection-PK-v2/settings.html",
    robots: "noindex, nofollow"
  }
};

// Page mapping for UI
export const PAGE_NAMES = {
  index: "🏠 Home Page",
  shop: "🛍️ Shop Page",
  product: "📦 Product Page",
  cart: "🛒 Cart Page",
  checkout: "💳 Checkout Page",
  contact: "📞 Contact Page",
  account: "👤 Account Page",
  login: "🔐 Login Page",
  signup: "📝 Signup Page",
  admin: "⚙️ Admin Panel",
  orders: "📋 Orders Page",
  settings: "🔧 Settings Page"
};

// Helper function to get SEO data for a page
export function getSEOForPage(pageName) {
  return SEO_DATA[pageName] || SEO_DATA.index;
}

// Helper function to update SEO data
export function updateSEOForPage(pageName, seoData) {
  if (SEO_DATA[pageName]) {
    SEO_DATA[pageName] = { ...SEO_DATA[pageName], ...seoData };
    return true;
  }
  return false;
}
