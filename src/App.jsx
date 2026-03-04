import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Search, ChevronRight, Zap, X, Package, Truck, CheckCircle2,
  ArrowRight, Calendar, Lock, AlertCircle, ArrowLeft, Timer,
  Shield, Home, Grid3X3, ShoppingBag, Star, Gift, Tag, Flame,
  Bolt, TrendingUp, MessageCircle, Clock, User, LogOut, Mail,
  Phone, MapPin, ChevronDown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

// ──────────────────────────────────────────────────────────────
// GOOGLE CLIENT ID — replace with your own if needed
// ──────────────────────────────────────────────────────────────
const GOOGLE_CLIENT_ID = '748294123456-placeholder.apps.googleusercontent.com'

// ──────────────────────────────────────────────────────────────
// SHEETDB INTEGRATION
// ──────────────────────────────────────────────────────────────
const SHEETDB_URL = 'https://sheetdb.io/api/v1/6z3vh2kf9d5g5'

async function saveOrderToSheet(data) {
  try {
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    const items = data.items.map(i => `${i.name} x${i.qty}`).join(' | ')
    await fetch(SHEETDB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        data: [{
          'Timestamp': now,
          'Order ID': data.orderId,
          'Customer Name': data.name,
          'Seat/Berth': data.seat,
          'Mobile': data.contact,
          'Items Ordered': items,
          'Total (Rs)': data.grand,
          'Train No.': data.trainNo,
        }]
      }),
    })
  } catch (e) {
    console.warn('Sheet save failed (non-critical):', e)
  }
}

// ──────────────────────────────────────────────────────────────
// DATA
// ──────────────────────────────────────────────────────────────
const TRAINS = [
  {
    id: 'train-14662', trainNo: '14662', name: 'Shalimar Malani Express',
    from: 'Delhi', to: 'Jaipur', date: '5 March 2026',
    departure: '11:00 AM', arrival: '6:30 PM',
    serviceStart: new Date('2026-03-05T11:00:00+05:30'),
    serviceEnd: new Date('2026-03-05T18:30:00+05:30'),
  },
  {
    id: 'train-14661', trainNo: '14661', name: 'Shalimar Malani Express',
    from: 'Jaipur', to: 'Delhi', date: '6 March 2026',
    departure: '8:00 AM', arrival: '6:00 PM',
    serviceStart: new Date('2026-03-06T08:00:00+05:30'),
    serviceEnd: new Date('2026-03-06T18:00:00+05:30'),
  },
]

const CATEGORIES = [
  { name: 'All', icon: 'https://cdn-icons-png.flaticon.com/128/1170/1170678.png', type: 'products' },
  { name: 'Essentials', icon: 'https://cdn-icons-png.flaticon.com/128/2331/2331966.png', type: 'products' },
  { name: 'Snacks', icon: 'https://cdn-icons-png.flaticon.com/128/2553/2553691.png', type: 'products' },
  { name: 'Drinks', icon: 'https://cdn-icons-png.flaticon.com/128/3050/3050131.png', type: 'products' },
  { name: 'Hygiene', icon: 'https://cdn-icons-png.flaticon.com/128/2553/2553642.png', type: 'products' },
  { name: 'Pharma', icon: 'https://cdn-icons-png.flaticon.com/128/3140/3140343.png', type: 'soon' },
  { name: 'Instant', icon: 'https://cdn-icons-png.flaticon.com/128/1046/1046857.png', type: 'soon' },
  { name: 'Sweets', icon: 'https://cdn-icons-png.flaticon.com/128/3373/3373065.png', type: 'products' },
  { name: 'Travel', icon: 'https://cdn-icons-png.flaticon.com/128/3124/3124073.png', type: 'soon' },
]

const PRODUCTS = {
  best: [
    { id: 1, name: 'Bisleri Water', variant: '1 L', price: 20, mrp: 20, cat: 'Essentials', img: 'https://images.jdmagicbox.com/quickquotes/images_main/bisleri-water-bottle-1-litre-297413498-dlh4a.jpg' },
    { id: 2, name: "Lay's Classic Salted", variant: '52 g', price: 20, mrp: 20, cat: 'Snacks', img: 'https://m.media-amazon.com/images/I/81aF2UPFPUL._SL1500_.jpg' },
    { id: 3, name: 'Dolo 650 Tablet', variant: '15 Tabs', price: 30, mrp: 35, cat: 'Essentials', img: 'https://www.netmeds.com/images/product-v1/600x600/902498/dolo_650mg_tablet_15s_0.jpg' },
    { id: 4, name: 'Masala Chai', variant: '200 ml', price: 40, mrp: 50, cat: 'Drinks', img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80' },
    { id: 5, name: 'Maggi 2-Min Noodles', variant: '70 g', price: 14, mrp: 14, cat: 'Snacks', img: 'https://m.media-amazon.com/images/I/71A4lZzwIAL._SL1500_.jpg' },
    { id: 6, name: 'Dettol Sanitizer', variant: '50 ml', price: 29, mrp: 35, cat: 'Hygiene', img: 'https://m.media-amazon.com/images/I/51iS-FsCv2L._SL1000_.jpg' },
  ],
  snacks: [
    { id: 7, name: 'Kurkure Masala', variant: '75 g', price: 20, mrp: 20, cat: 'Snacks', img: 'https://m.media-amazon.com/images/I/81X7baxhvBL._SL1500_.jpg' },
    { id: 8, name: 'Dairy Milk Silk', variant: '60 g', price: 80, mrp: 90, cat: 'Sweets', img: 'https://m.media-amazon.com/images/I/71hHVJIBFVL._SL1500_.jpg' },
    { id: 9, name: 'Parle-G Gold', variant: '100 g', price: 20, mrp: 20, cat: 'Snacks', img: 'https://m.media-amazon.com/images/I/61-+pBR9N-L._SL1200_.jpg' },
    { id: 10, name: 'Haldiram Bhujia', variant: '200 g', price: 55, mrp: 60, cat: 'Snacks', img: 'https://m.media-amazon.com/images/I/71EWvgmGv6L._SL1500_.jpg' },
    { id: 17, name: 'KitKat 4F', variant: '41.5 g', price: 60, mrp: 65, cat: 'Sweets', img: 'https://m.media-amazon.com/images/I/61oKH1tePbL._SL1500_.jpg' },
    { id: 18, name: 'Oreo Original', variant: '120 g', price: 35, mrp: 40, cat: 'Snacks', img: 'https://m.media-amazon.com/images/I/61w3JGh8d8L._SL1500_.jpg' },
  ],
  drinks: [
    { id: 11, name: 'Coca-Cola', variant: '300 ml', price: 35, mrp: 40, cat: 'Drinks', img: 'https://m.media-amazon.com/images/I/61eBPotEEAL._SL1200_.jpg' },
    { id: 12, name: 'Real Mango Juice', variant: '200 ml', price: 25, mrp: 30, cat: 'Drinks', img: 'https://m.media-amazon.com/images/I/61EB2K5KsoL._SL1500_.jpg' },
    { id: 13, name: 'Filter Coffee', variant: '150 ml', price: 45, mrp: 50, cat: 'Drinks', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80' },
    { id: 19, name: 'Sprite Can', variant: '300 ml', price: 30, mrp: 35, cat: 'Drinks', img: 'https://m.media-amazon.com/images/I/31wv9D3pXRL.jpg' },
    { id: 20, name: 'Nimbu Pani', variant: '200 ml', price: 20, mrp: 25, cat: 'Drinks', img: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&q=80' },
  ],
  hygiene: [
    { id: 6, name: 'Dettol Sanitizer', variant: '50 ml', price: 29, mrp: 35, cat: 'Hygiene', img: 'https://m.media-amazon.com/images/I/51iS-FsCv2L._SL1000_.jpg' },
    { id: 21, name: 'Hand Sanitizer', variant: '100 ml', price: 59, mrp: 75, cat: 'Hygiene', img: 'https://m.media-amazon.com/images/I/51iS-FsCv2L._SL1000_.jpg' },
  ],
}

// ALL products flat list for search + "All" category
const ALL_PRODUCTS = [
  ...PRODUCTS.best, ...PRODUCTS.snacks, ...PRODUCTS.drinks, ...PRODUCTS.hygiene
].reduce((acc, p) => acc.some(x => x.id === p.id) ? acc : [...acc, p], [])

// Category → products mapping
const CAT_PRODUCTS = {
  'All': ALL_PRODUCTS,
  'Essentials': ALL_PRODUCTS.filter(p => p.cat === 'Essentials'),
  'Snacks': ALL_PRODUCTS.filter(p => p.cat === 'Snacks'),
  'Drinks': ALL_PRODUCTS.filter(p => p.cat === 'Drinks'),
  'Hygiene': ALL_PRODUCTS.filter(p => p.cat === 'Hygiene'),
  'Sweets': ALL_PRODUCTS.filter(p => p.cat === 'Sweets'),
}

const PROMOS = [
  { id: 1, title: 'Flat 20% OFF', sub: 'On all Snacks & Beverages', bg: 'linear-gradient(135deg,#0C831F,#22c55e)', tag: 'LIMITED' },
  { id: 2, title: 'Free Delivery', sub: 'On orders above ₹99', bg: 'linear-gradient(135deg,#1a1a2e,#2d2d6d)', tag: 'TODAY' },
  { id: 3, title: 'Flash Sale 🔥', sub: 'Travel essentials at ½ price', bg: 'linear-gradient(135deg,#c73900,#f47b20)', tag: 'HOT' },
]

// ──────────────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────────────
const isActive = t => { const n = new Date(); return n >= t.serviceStart && n <= t.serviceEnd }
const isExpired = t => new Date() > t.serviceEnd
const disc = p => p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0

// ──────────────────────────────────────────────────────────────
// LOGO
// ──────────────────────────────────────────────────────────────
const Logo = ({ h = 46, className = '' }) => (
  <img src="/logo.png" alt="RailQuick" className={`rq-logo ${className}`} style={{ height: h, width: 'auto' }} />
)

// ──────────────────────────────────────────────────────────────
// PROMO CAROUSEL
// ──────────────────────────────────────────────────────────────
function PromoCarousel() {
  const ref = useRef(null)
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const iv = setInterval(() => {
      setIdx(i => {
        const next = (i + 1) % PROMOS.length
        const child = ref.current?.children[next]
        if (child) child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
        return next
      })
    }, 3400)
    return () => clearInterval(iv)
  }, [])
  return (
    <div className="promo-wrap">
      <div className="promo-scroll" ref={ref}>
        {PROMOS.map(p => (
          <motion.div key={p.id} className="promo-card" style={{ background: p.bg }} whileTap={{ scale: 0.96 }}>
            <div className="promo-tag">{p.tag}</div>
            <div><h4>{p.title}</h4><p>{p.sub}</p></div>
          </motion.div>
        ))}
      </div>
      <div className="promo-dots">
        {PROMOS.map((_, i) => (
          <div key={i} className={`promo-dot ${i === idx ? 'on' : ''}`}
            style={{ width: i === idx ? 18 : 6 }} onClick={() => setIdx(i)} />
        ))}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// TRUST STRIP (simplified — removed 10K+ Orders & 4.8★)
// ──────────────────────────────────────────────────────────────
function TrustStrip() {
  return (
    <div className="trust-strip">
      {[
        [<Zap size={12} />, '5-Min Delivery'],
        [<Shield size={12} />, 'Quality Checked'],
        [<Tag size={12} />, 'Best Prices'],
        [<Gift size={12} />, 'COD Available'],
      ].map(([ic, txt], i) => (
        <div key={i} className="trust-pill">{ic}<span>{txt}</span></div>
      ))}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// PRODUCT CARD
// ──────────────────────────────────────────────────────────────
function ProductCard({ product, qty, onAdd, onRemove }) {
  const [imgErr, setImgErr] = useState(false)
  const d = disc(product)
  return (
    <motion.div className="pc" whileHover={{ y: -2 }} transition={{ duration: 0.16 }}>
      <div className="pc-img-box">
        {!imgErr && product.img
          ? <img className="pc-img" src={product.img} alt={product.name} onError={() => setImgErr(true)} />
          : <div className="pc-img-fallback">{product.name[0]}</div>}
        {d > 0 && <div className="pc-disc-badge">{d}% OFF</div>}
      </div>
      <div className="pc-body">
        <div className="pc-time"><Timer size={9} />5 MINS</div>
        <div className="pc-name" title={product.name}>{product.name}</div>
        <div className="pc-var">{product.variant}</div>
        <div className="pc-foot">
          <div>
            <span className="pc-price">₹{product.price}</span>
            {d > 0 && <span className="pc-mrp">₹{product.mrp}</span>}
          </div>
          {qty === 0
            ? <button className="pc-add" onClick={() => onAdd(product)}>ADD</button>
            : <div className="pc-stepper">
              <button onClick={() => onRemove(product.id)}>−</button>
              <span>{qty}</span>
              <button onClick={() => onAdd(product)}>+</button>
            </div>}
        </div>
      </div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────────────────────
// SECTION (for home screen)
// ──────────────────────────────────────────────────────────────
function Section({ title, icon, products, cart, onAdd, onRemove }) {
  if (!products.length) return null
  return (
    <div className="sec">
      <div className="sec-head">
        <h3>{icon}<span style={{ marginLeft: 4 }}>{title}</span></h3>
        <span className="sec-see">See all <ChevronRight size={14} /></span>
      </div>
      <div className="sec-grid">
        {products.map(p => (
          <ProductCard key={p.id} product={p} qty={cart[p.id]?.qty || 0} onAdd={onAdd} onRemove={onRemove} />
        ))}
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// CATEGORY VIEW (filtered products or coming soon)
// ──────────────────────────────────────────────────────────────
function CategoryView({ cat, cart, onAdd, onRemove }) {
  const catObj = CATEGORIES.find(c => c.name === cat)
  if (catObj?.type === 'soon') {
    return (
      <motion.div className="coming-soon" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="coming-soon-icon">🚀</div>
        <h2>{cat}</h2>
        <p>We're working hard to bring <strong>{cat}</strong> products on board!</p>
        <div className="coming-soon-tag"><Clock size={14} />Coming Soon</div>
      </motion.div>
    )
  }
  const products = CAT_PRODUCTS[cat] || []
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="sec-head" style={{ marginBottom: 14 }}>
        <h3>
          <img src={catObj?.icon} alt={cat} style={{ width: 22, height: 22, objectFit: 'contain', marginRight: 6 }} />
          {cat === 'All' ? 'All Products' : cat}
        </h3>
        <span style={{ fontSize: 12, color: 'var(--txt3)', fontWeight: 600 }}>{products.length} items</span>
      </div>
      {products.length === 0
        ? <div className="coming-soon">
          <div className="coming-soon-icon">📦</div>
          <h2>No items found</h2>
          <p>We're stocking up on {cat} products soon!</p>
        </div>
        : <div className="sec-grid">
          {products.map(p => (
            <ProductCard key={p.id} product={p} qty={cart[p.id]?.qty || 0} onAdd={onAdd} onRemove={onRemove} />
          ))}
        </div>}
    </motion.div>
  )
}

// ──────────────────────────────────────────────────────────────
// DESKTOP SIDEBAR
// ──────────────────────────────────────────────────────────────
function DesktopSidebar({ active, onSelect }) {
  return (
    <aside className="d-sidebar">
      {CATEGORIES.map(c => (
        <div key={c.name}
          className={`sidebar-cat ${active === c.name ? 'active' : ''}`}
          onClick={() => onSelect(c.name)}>
          <img className="sidebar-cat-img" src={c.icon} alt={c.name} />
          <span className="sidebar-cat-name">{c.name}</span>
          {c.type === 'soon' && <span className="sidebar-cat-soon">Soon</span>}
        </div>
      ))}
    </aside>
  )
}

// ──────────────────────────────────────────────────────────────
// PROFILE SCREEN — Google Sign-In
// ──────────────────────────────────────────────────────────────
function ProfileScreen() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rq_user') || 'null') } catch { return null }
  })
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleSendOtp = () => {
    if (phone.length === 10) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setStep(2)
      }, 800)
    }
  }

  const handleVerifyOtp = () => {
    if (otp.length === 4) {
      setLoading(true)
      setTimeout(() => {
        const u = { name: 'Train Traveller', phone: '+91 ' + phone, picture: null }
        setUser(u)
        localStorage.setItem('rq_user', JSON.stringify(u))
        setLoading(false)
      }, 1200)
    }
  }

  const signOut = () => {
    setUser(null)
    setStep(1)
    setPhone('')
    setOtp('')
    localStorage.removeItem('rq_user')
  }

  if (user) {
    return (
      <motion.div className="profile-screen" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <div className="profile-avatar-wrap">
          {user.picture
            ? <img className="profile-avatar" src={user.picture} alt={user.name} referrerPolicy="no-referrer" />
            : <div className="profile-avatar-fallback">{user.name?.[0] || 'U'}</div>}
          <div className="profile-online-dot" />
        </div>
        <div className="profile-name">{user.name}</div>
        <div className="profile-email">{user.phone}</div>
        <div className="profile-card">
          <div className="profile-card-row"><Phone size={16} /><span>Verified Mobile Number</span></div>
          <div className="profile-card-row"><Shield size={16} /><span>Your data is safe with us</span></div>
          <div className="profile-card-row"><Zap size={16} /><span>Delivery in 5 minutes guaranteed</span></div>
        </div>
        <div className="profile-orders-hd">Your Recent Orders</div>
        <div className="profile-orders-empty">
          <ShoppingBag size={36} />
          <p>No orders yet on this device.</p>
          <span>Place your first order to see it here!</span>
        </div>
        <button className="profile-signout" onClick={signOut}>
          <LogOut size={16} />Sign Out
        </button>
        <div className="profile-powered">RailQuick · On-Train Delivery</div>
      </motion.div>
    )
  }

  return (
    <motion.div className="profile-screen profile-login" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      {step === 1 ? (
        <>
          <div className="profile-login-icon">🚀</div>
          <h2 className="profile-login-title">Sign in to RailQuick</h2>
          <p className="profile-login-sub">Track your orders, get personalised deals, and enjoy a seamless experience.</p>
          <div className="mock-login-box">
            <div className="mock-login-input-wrap">
              <span>+91</span>
              <input type="tel" placeholder="Enter mobile number" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} />
            </div>
            <button className="mock-login-btn" disabled={phone.length < 10 || loading} onClick={handleSendOtp}>
              {loading ? 'Sending OTP...' : 'Continue'}
            </button>
          </div>
          <div className="profile-login-note">By continuing, you agree to our Terms & Conditions</div>
        </>
      ) : (
        <>
          <h2 className="profile-login-title" style={{ marginTop: 40 }}>Verify Details</h2>
          <p className="profile-login-sub">OTP sent to +91 {phone}</p>
          <div className="mock-login-box">
            <input type="tel" className="mock-otp-input" placeholder="Enter 4-digit OTP" maxLength={4} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} />
            <button className="mock-login-btn" disabled={otp.length < 4 || loading} onClick={handleVerifyOtp}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </>
      )}
      <div className="profile-powered" style={{ marginTop: 'auto' }}>RailQuick · On-Train Delivery</div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────────────────────
// BOTTOM NAV (mobile) — Home / Categories / Cart / Profile
// ──────────────────────────────────────────────────────────────
function BottomNav({ tab, onTab, cartCount }) {
  return (
    <nav className="btm-nav">
      {[
        { key: 'home', icon: <Home size={22} />, label: 'Home' },
        { key: 'cats', icon: <Grid3X3 size={22} />, label: 'Categories' },
        { key: 'cart', icon: null, label: 'Cart', isCart: true },
        { key: 'me', icon: <User size={22} />, label: 'Profile' },
      ].map(it => (
        <motion.button key={it.key}
          className={`btm-btn ${tab === it.key ? 'active' : ''}`}
          onClick={() => onTab(it.key)}
          whileTap={{ scale: 0.9 }}>
          {it.isCart
            ? <div className="btm-btn-icon btm-cart-wrap">
              <ShoppingBag size={22} />
              {cartCount > 0 && <span className="btm-badge">{cartCount}</span>}
            </div>
            : <div className="btm-btn-icon">{it.icon}</div>}
          <span>{it.label}</span>
        </motion.button>
      ))}
    </nav>
  )
}

// ──────────────────────────────────────────────────────────────
// MOBILE CATEGORIES SCREEN (full-page grid)
// ──────────────────────────────────────────────────────────────
function MobileCategoriesScreen({ onSelect }) {
  return (
    <motion.div className="mob-cat-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mob-cat-header">
        <h2>Shop by Category</h2>
        <p>What are you looking for?</p>
      </div>
      <div className="mob-cat-grid">
        {CATEGORIES.map(c => (
          <motion.div key={c.name} className="mob-cat-card" whileTap={{ scale: 0.94 }} onClick={() => onSelect(c.name)}>
            <div className="mob-cat-card-ico">
              <img src={c.icon} alt={c.name} />
            </div>
            <span className="mob-cat-card-name">{c.name}</span>
            {c.type === 'soon' && <span className="mob-cat-soon-pill">Soon</span>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────────────────────
// DESKTOP TOP NAV
// ──────────────────────────────────────────────────────────────
function DesktopNav({ train, search, onSearch, cartCount, onCart, onProfile, onBack }) {
  return (
    <nav className="d-nav">
      <div className="d-nav-inner">
        <div className="d-nav-logo" onClick={onBack} style={{ cursor: 'pointer' }}><Logo h={52} /></div>
        <div className="d-nav-train" onClick={onBack}>
          <ArrowLeft size={14} />
          <div>
            <div className="d-nav-train-no">Train {train.trainNo}</div>
            <div className="d-nav-train-route">{train.from} → {train.to}</div>
          </div>
        </div>
        <div className="d-nav-search">
          <Search size={18} />
          <input
            placeholder="Search for snacks, drinks, medicines…"
            value={search}
            onChange={e => onSearch(e.target.value)}
          />
        </div>
        <div className="d-nav-actions" style={{ display: 'flex', gap: 12 }}>
          <button className="d-nav-profile-btn" onClick={onProfile} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 18px', borderRadius: 100, border: '1.5px solid var(--border)', background: 'white', fontWeight: 800, fontSize: 13, cursor: 'pointer', transition: 'all .2s' }}>
            <User size={18} />
            Profile
          </button>
          <button className="d-nav-cart" onClick={onCart}>
            <ShoppingBag size={20} />
            My Cart
            {cartCount > 0 && <span className="d-nav-cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  )
}

// ──────────────────────────────────────────────────────────────
// CART DRAWER
// ──────────────────────────────────────────────────────────────
function CartDrawer({ cart, onClose, onCheckout, onAdd, onRemove }) {
  const items = Object.values(cart)
  const itemTotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const handling = 5
  const grand = itemTotal + handling

  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="overlay-tap" onClick={onClose} />
      <motion.div className="cart-sheet"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 340 }}>
        <div className="cart-handle" />
        <div className="cart-hd">
          <div>
            <span className="cart-hd-title">My Cart</span>
            <span className="cart-hd-count">• {items.length} item{items.length !== 1 ? 's' : ''}</span>
          </div>
          <button className="cart-x" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="cart-body">
          <div className="cart-eta"><Zap size={14} /><span>Delivered to your seat in <strong>5 minutes</strong></span></div>
          {items.map(it => (
            <div key={it.id} className="cart-item">
              <div className="cart-item-img">
                <img src={it.img} alt={it.name} onError={e => e.target.style.display = 'none'} />
              </div>
              <div className="cart-item-info">
                <div className="cart-item-name">{it.name}</div>
                <div className="cart-item-var">{it.variant}</div>
                <div className="cart-item-row">
                  <span className="cart-item-price">₹{it.price * it.qty}</span>
                  <div className="cart-item-stepper">
                    <button onClick={() => onRemove(it.id)}>−</button>
                    <span>{it.qty}</span>
                    <button onClick={() => onAdd(it)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="cart-bill">
            <div className="cart-bill-title">Bill Summary</div>
            <div className="cart-bill-row"><span>Item Total</span><span>₹{itemTotal}</span></div>
            <div className="cart-bill-row"><span>Handling Fee</span><span>₹{handling}</span></div>
            <div className="cart-bill-row total"><span>Grand Total</span><span>₹{grand}</span></div>
          </div>
        </div>
        <div className="cart-foot">
          <button className="cart-cta" onClick={onCheckout}>Place Order · ₹{grand}</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────────────────────
// ORDER FORM
// ──────────────────────────────────────────────────────────────
function OrderForm({ cart, train, onClose, onConfirm }) {
  const [fd, setFd] = useState({ name: '', seat: '', contact: '' })
  const [placing, setPlacing] = useState(false)
  const [err, setErr] = useState('')
  const grand = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0) + 5

  const submit = async () => {
    if (!fd.name.trim()) { setErr('Please enter your name'); return }
    if (!fd.seat.trim()) { setErr('Please enter your seat / berth'); return }
    if (fd.contact.length < 10) { setErr('Enter a valid 10-digit mobile number'); return }
    setErr(''); setPlacing(true)
    const orderId = 'RQ' + Math.floor(100000 + Math.random() * 900000)
    const orderData = { orderId, name: fd.name, seat: fd.seat, contact: fd.contact, items: Object.values(cart), grand, trainNo: train.trainNo }
    saveOrderToSheet(orderData)
    setTimeout(() => onConfirm(orderData), 1400)
  }

  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ zIndex: 500 }}>
      <div className="overlay-tap" onClick={onClose} />
      <motion.div className="form-sheet"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 340 }}>
        <div className="form-logo"><Logo h={44} /></div>
        <div className="form-hd">
          <span className="form-hd-title">Delivery Details</span>
          <button className="cart-x" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="form-body">
          <div className="form-fields">
            {[
              { label: 'Full Name', key: 'name', ph: 'Your full name', type: 'text' },
              { label: 'Seat / Berth', key: 'seat', ph: 'e.g. B2-42 or S4-15', type: 'text' },
              { label: 'Mobile Number', key: 'contact', ph: '10-digit number', type: 'tel', max: 10 },
            ].map(f => (
              <div key={f.key} className="form-field">
                <label>{f.label}</label>
                <input
                  type={f.type} placeholder={f.ph} maxLength={f.max || 60}
                  value={fd[f.key]}
                  onChange={e => setFd({
                    ...fd,
                    [f.key]: f.key === 'seat' ? e.target.value.toUpperCase()
                      : f.key === 'contact' ? e.target.value.replace(/\D/g, '')
                        : e.target.value
                  })}
                />
              </div>
            ))}
          </div>
          {err && <div className="form-err"><AlertCircle size={14} />{err}</div>}
        </div>
        <div className="form-foot">
          <button className="form-cta" onClick={submit} disabled={placing}>
            {placing ? '⏳ Placing your order…' : `Confirm · Pay ₹${grand} on Delivery`}
          </button>
          <div className="form-secure"><Shield size={12} />Secured by RailQuick</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────────────────────
// ORDER TRACKING
// ──────────────────────────────────────────────────────────────
function OrderTracking({ orderInfo, onComplete }) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const ts = [1600, 3200, 4800].map((ms, i) => setTimeout(() => setStep(i + 1), ms))
    const fin = setTimeout(onComplete, 6800)
    return () => [...ts, fin].forEach(clearTimeout)
  }, [onComplete])

  const STEPS = [
    { title: 'Order Confirmed!', sub: 'Your order has been placed', icon: <CheckCircle2 size={60} /> },
    { title: 'Vendor Picking', sub: 'Getting your items ready', icon: <Package size={60} /> },
    { title: 'On the Way!', sub: 'Heading to your coach', icon: <Truck size={60} /> },
    { title: 'Almost There!', sub: `Arriving at Seat ${orderInfo.seat}`, icon: <Zap size={60} /> },
  ]
  const s = STEPS[step]

  return (
    <motion.div className="tracking-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="tracking-content">
        <div className="tracking-logo"><Logo h={50} /></div>
        <motion.div className="tracking-icon" key={step}
          initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 220 }}>
          {s.icon}
        </motion.div>
        <div>
          <div className="tracking-title">{s.title}</div>
          <div className="tracking-sub">{s.sub}</div>
        </div>
        <div className="tracking-bar">
          {[0, 1, 2, 3].map(i => <div key={i} className={`tracking-seg ${i <= step ? 'on' : ''}`} />)}
        </div>
        <div className="tracking-meta">
          <span>Order # {orderInfo.orderId}</span>
          <span>·</span>
          <span>Seat {orderInfo.seat}</span>
        </div>
      </div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────────────────────
// SUCCESS SCREEN
// ──────────────────────────────────────────────────────────────
function SuccessScreen({ orderInfo, onGoHome }) {
  const wpMsg = encodeURIComponent(`Hi! I placed Order #${orderInfo.orderId} for Seat ${orderInfo.seat}. Need help!`)
  const wpUrl = `https://wa.me/918882779769?text=${wpMsg}`

  return (
    <motion.div className="success-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="success-logo"><Logo h={54} /></div>
      <motion.div className="success-check"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}>
        <CheckCircle2 size={60} />
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        Order Placed! 🎉
      </motion.h1>
      <motion.p className="success-sub"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        Your vendor is on the way to <strong>Seat {orderInfo.seat}</strong>.
      </motion.p>
      <motion.div className="success-timer"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 }}>
        <Zap size={18} />
        <span>We will deliver in your seat in <strong>5 minutes!</strong></span>
      </motion.div>
      <motion.div className="success-card"
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="success-card-hdr">
          <Package size={20} color="white" />
          <div className="success-card-hdr-txt">
            <h4>Order #{orderInfo.orderId}</h4>
            <p>Cash on Delivery · ₹{orderInfo.grand}</p>
          </div>
        </div>
        {[
          ['Customer', orderInfo.name],
          ['Seat', orderInfo.seat],
          ['Mobile', orderInfo.contact],
          ['Amount', `₹${orderInfo.grand}`],
        ].map(([k, v]) => (
          <div key={k} className="receipt-row">
            <span>{k}</span>
            <span className={`receipt-val ${k === 'Amount' ? 'text-green' : ''}`}>{v}</span>
          </div>
        ))}
      </motion.div>
      <motion.div className="success-actions"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
        <a href={wpUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
          <MessageCircle size={20} />Contact Customer Support
        </a>
        <button className="btn-home" onClick={onGoHome}>
          <Home size={18} />Go to Home
        </button>
      </motion.div>
      <div className="success-powered">Powered by <strong>RailQuick</strong></div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────────────────────
// TRAIN SELECTION SCREEN
// ──────────────────────────────────────────────────────────────
function TrainScreen({ onSelect }) {
  return (
    <div className="ts-screen">
      <div className="ts-wrap">
        <nav className="ts-nav">
          <Logo h={56} />
          <div className="ts-nav-links">
            <span>Our Service</span>
            <span>Support</span>
          </div>
        </nav>

        <div className="ts-hero">
          <div className="ts-hero-left">
            <div className="ts-eyebrow"><Zap size={13} />India's fastest on-train delivery</div>
            <h1 className="ts-title">
              Delivered to<br />your seat in<br /><span className="text-green">5 minutes</span>
            </h1>
            <p className="ts-sub">On-board service delivering essentials, snacks &amp; medicines straight to your berth. Cash on delivery accepted.</p>
            <div className="ts-pills">
              <div className="ts-pill"><Timer size={14} />Ultra Fast</div>
              <div className="ts-pill"><Shield size={14} />Quality Assured</div>
              <div className="ts-pill"><Flame size={14} />10,000+ Orders</div>
            </div>
          </div>
          <div className="ts-hero-right">
            <img src="/vande-bharat.png" alt="Train delivery" className="ts-hero-img"
              onError={e => e.target.style.display = 'none'} />
            <div className="ts-hero-float">
              <div className="ts-hero-float-icon"><Zap size={22} /></div>
              <div className="ts-hero-float-txt">
                <strong>Live Tracking</strong>
                <span>Know exactly when it arrives</span>
              </div>
            </div>
          </div>
        </div>

        <div className="ts-features">
          {[
            { icon: <Timer size={22} />, title: '5-Min Delivery', sub: 'Vendor walks to your berth directly' },
            { icon: <Shield size={22} />, title: 'Quality Assured', sub: 'All products checked before delivery' },
            { icon: <Bolt size={22} />, title: 'Live Tracking', sub: 'Real-time status from dispatch to seat' },
          ].map(f => (
            <div key={f.title} className="ts-feat">
              <div className="ts-feat-icon">{f.icon}</div>
              <div className="ts-feat-title">{f.title}</div>
              <div className="ts-feat-sub">{f.sub}</div>
            </div>
          ))}
        </div>

        <div className="ts-select-hd">
          <h2>Select your train</h2>
          <p>Check service availability for your journey</p>
        </div>

        <div className="ts-train-grid">
          {TRAINS.map(train => {
            const active = isActive(train), expired = isExpired(train)
            return (
              <motion.div key={train.id}
                className={`ts-card ${active ? 'active' : ''} ${expired ? 'expired' : ''}`}
                whileHover={!expired ? { y: -4 } : {}}
                onClick={() => !expired && onSelect(train)}>
                <div className="ts-card-top">
                  <div>
                    <div className="ts-card-no">Train {train.trainNo}</div>
                    <div className="ts-card-name">{train.name}</div>
                  </div>
                  {active
                    ? <span className="badge badge-live"><Zap size={10} />LIVE</span>
                    : expired
                      ? <span className="badge badge-expired"><Lock size={10} />CLOSED</span>
                      : <span className="badge badge-upcoming"><Timer size={10} />UPCOMING</span>}
                </div>
                <div className="ts-card-route">
                  <div className="ts-city">
                    <div className="ts-city-name">{train.from}</div>
                    <div className="ts-city-time">{train.departure}</div>
                  </div>
                  <div className="ts-track">
                    <div className="ts-dot" /><div className="ts-line" />
                    <ArrowRight size={13} />
                    <div className="ts-line" /><div className="ts-dot" />
                  </div>
                  <div className="ts-city text-right">
                    <div className="ts-city-name">{train.to}</div>
                    <div className="ts-city-time">{train.arrival}</div>
                  </div>
                </div>
                <div className="ts-card-foot">
                  <div className="ts-card-date"><Calendar size={12} /><span>{train.date}</span></div>
                  <button className="ts-btn">
                    {active ? 'Order Now' : expired ? 'Closed' : 'Browse'} <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        <footer className="ts-footer">
          <Logo h={38} />
          <p>RailQuick — On-train delivery · All rights reserved © 2026</p>
        </footer>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// HOME CONTENT (all sections)
// ──────────────────────────────────────────────────────────────
function HomeContent({ search, cart, onAdd, onRemove, onCatClick }) {
  const filter = prods =>
    search ? prods.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : prods

  return (
    <>
      {/* Green spotlight */}
      <div className="spotlight">
        <div className="spotlight-txt">
          <h3>⚡ In-Train Delivery Active</h3>
          <p>Products delivered straight to your berth</p>
        </div>
        <div className="spotlight-ico"><Zap size={28} /></div>
      </div>

      {/* Flash banner */}
      <div className="flash-banner">
        <div className="flash-banner-txt">
          <h3>🔥 Flash Sale — Flat 20% OFF</h3>
          <p>On all Snacks &amp; Beverages today</p>
        </div>
        <div className="flash-banner-right">Shop <ChevronRight size={15} /></div>
      </div>

      {/* Category quick-access chips */}
      <div className="cats-wrap">
        <div className="cats-head">Shop by Category</div>
        <div className="cats-row">
          {CATEGORIES.map(c => (
            <motion.div key={c.name} className="cat-chip" whileTap={{ scale: 0.9 }} onClick={() => onCatClick(c.name)}>
              <div className="cat-chip-ico">
                <img src={c.icon} alt={c.name} />
              </div>
              <span className="cat-chip-name">{c.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <PromoCarousel />
      <TrustStrip />

      <Section title="Bestsellers" icon="🔥" products={filter(PRODUCTS.best)} cart={cart} onAdd={onAdd} onRemove={onRemove} />
      <Section title="Snacks & Sweets" icon="🍿" products={filter(PRODUCTS.snacks)} cart={cart} onAdd={onAdd} onRemove={onRemove} />
      <Section title="Beverages" icon="🥤" products={filter(PRODUCTS.drinks)} cart={cart} onAdd={onAdd} onRemove={onRemove} />
    </>
  )
}

// ──────────────────────────────────────────────────────────────
// APP
// ──────────────────────────────────────────────────────────────
export default function App() {
  const [train, setTrain] = useState(null)
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [tracking, setTracking] = useState(false)
  const [done, setDone] = useState(false)
  const [orderInfo, setOrderInfo] = useState(null)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('home')
  const [selectedCat, setSelectedCat] = useState(null)
  const [sidebarCat, setSidebarCat] = useState('All')
  const mainRef = useRef(null)

  // ── Scroll to top when order app opens ──
  useEffect(() => {
    if (train) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      mainRef.current?.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [train])

  // ── Scroll to top when tab changes ──
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [tab, selectedCat])

  const add = p => setCart(c => ({ ...c, [p.id]: { ...p, qty: (c[p.id]?.qty || 0) + 1 } }))
  const rem = id => setCart(c => {
    const e = c[id]; if (!e) return c
    if (e.qty <= 1) { const { [id]: _, ...r } = c; return r }
    return { ...c, [id]: { ...e, qty: e.qty - 1 } }
  })
  const reset = () => { setCart({}); setDone(false); setOrderInfo(null); setTrain(null); setSelectedCat(null) }

  const itemCount = Object.values(cart).reduce((s, i) => s + i.qty, 0)
  const totalVal = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0)

  const handleTab = t => {
    setTab(t)
    if (t === 'cart' && itemCount > 0) setCartOpen(true)
    if (t === 'home') setSelectedCat(null)
    if (t === 'cats') setSelectedCat(null)
  }

  const handleCatClick = catName => {
    setSelectedCat(catName)
    setSidebarCat(catName)
    setTab('home')
  }

  if (!train) return <TrainScreen onSelect={setTrain} />
  if (done && orderInfo) return <SuccessScreen orderInfo={orderInfo} onGoHome={reset} />

  // decide what to show in main content area
  const showCategoryPage = selectedCat !== null
  const showMobileCats = tab === 'cats' && !selectedCat

  return (
    <div className="app-shell">

      {/* ─ Tracking overlay ─ */}
      <AnimatePresence>
        {tracking && (
          <OrderTracking
            orderInfo={orderInfo}
            onComplete={() => { setTracking(false); setDone(true) }}
          />
        )}
      </AnimatePresence>

      {/* ─ Cart drawer ─ */}
      <AnimatePresence>
        {cartOpen && (
          <CartDrawer cart={cart} onClose={() => setCartOpen(false)}
            onCheckout={() => { setCartOpen(false); setFormOpen(true) }}
            onAdd={add} onRemove={rem} />
        )}
      </AnimatePresence>

      {/* ─ Order form ─ */}
      <AnimatePresence>
        {formOpen && (
          <OrderForm cart={cart} train={train} onClose={() => setFormOpen(false)}
            onConfirm={info => { setOrderInfo(info); setFormOpen(false); setTracking(true) }} />
        )}
      </AnimatePresence>

      {/* ─ Desktop nav ─ */}
      <DesktopNav
        train={train} search={search} onSearch={setSearch}
        cartCount={itemCount} onCart={() => setCartOpen(true)}
        onProfile={() => handleTab('me')}
        onBack={() => setTrain(null)}
      />

      {/* ─ Desktop layout ─ */}
      <div className="app-layout">
        <DesktopSidebar active={sidebarCat} onSelect={cat => { setSidebarCat(cat); setSelectedCat(cat); setTab('home') }} />

        <div className="app-main">

          {/* ─ Mobile header ─ */}
          <header className="mob-hdr">
            <div className="mob-hdr-row1">
              <div className="mob-hdr-logo-left">
                <Logo h={40} />
              </div>
              <div className="mob-hdr-back" onClick={() => setTrain(null)}>
                <ArrowLeft size={13} />
                <div className="mob-hdr-back-info">
                  <div className="mob-hdr-train">Train {train.trainNo}</div>
                  <div className="mob-hdr-route">{train.from} → {train.to}</div>
                </div>
              </div>
              <button className="mob-hdr-cart-btn" onClick={() => setCartOpen(true)}>
                <ShoppingBag size={20} />
                {itemCount > 0 && <span className="mob-hdr-cart-badge">{itemCount}</span>}
              </button>
            </div>
            <div className="mob-hdr-search">
              <Search size={16} />
              <input
                placeholder="Search snacks, drinks, essentials…"
                value={search}
                onChange={e => { setSearch(e.target.value); setSelectedCat(null); setTab('home') }}
              />
              {search && (
                <button style={{ color: 'var(--txt3)' }} onClick={() => setSearch('')}><X size={14} /></button>
              )}
            </div>
          </header>

          {/* ─ Mobile delivery bar ─ */}
          <div className="mob-delivery-bar">
            <div className="pulse-dot" />
            <Zap size={13} />
            <span>Delivering in <strong>5 mins</strong> · Train {train.trainNo}</span>
          </div>

          {/* ─ MOBILE content ─ */}
          <div className="main-inner" ref={mainRef} style={{ paddingBottom: itemCount > 0 ? 152 : 92 }}>
            <AnimatePresence mode="wait">
              {tab === 'me'
                ? <ProfileScreen key="profile" />
                : showMobileCats
                  ? <MobileCategoriesScreen key="cats-screen" onSelect={handleCatClick} />
                  : showCategoryPage
                    ? (
                      <motion.div key={`cat-${selectedCat}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                        <div className="cat-view-header">
                          <button className="cat-back-btn" onClick={() => { setSelectedCat(null); setTab('home') }}>
                            <ArrowLeft size={16} /> All Categories
                          </button>
                        </div>
                        <CategoryView cat={selectedCat} cart={cart} onAdd={add} onRemove={rem} />
                      </motion.div>
                    )
                    : <HomeContent key="home" search={search} cart={cart} onAdd={add} onRemove={rem} onCatClick={handleCatClick} />
              }
            </AnimatePresence>
          </div>

          {/* ─ DESKTOP content ─ */}
          <div className="d-main-inner" style={{ paddingBottom: itemCount > 0 ? 90 : 32 }}>
            <AnimatePresence mode="wait">
              {tab === 'me'
                ? <ProfileScreen key="profile" />
                : showCategoryPage
                  ? (
                    <motion.div key={`cat-${selectedCat}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="cat-view-header" style={{ marginBottom: 20 }}>
                        <button className="cat-back-btn" onClick={() => { setSelectedCat(null); setSidebarCat('All') }}>
                          <ArrowLeft size={16} /> Back
                        </button>
                      </div>
                      <CategoryView cat={selectedCat} cart={cart} onAdd={add} onRemove={rem} />
                    </motion.div>
                  )
                  : <HomeContent key="home" search={search} cart={cart} onAdd={add} onRemove={rem} onCatClick={handleCatClick} />
              }
            </AnimatePresence>
          </div>

          {/* ─ Bottom nav (mobile) ─ */}
          <BottomNav tab={tab} onTab={handleTab} cartCount={itemCount} />

          {/* ─ Floating cart bar ─ */}
          <AnimatePresence>
            {itemCount > 0 && (
              <motion.div className="cart-float"
                initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
                transition={{ type: 'spring', damping: 26, stiffness: 300 }}>
                <div className="cart-float-inner" onClick={() => setCartOpen(true)}>
                  <div className="cart-float-left">
                    <span className="cart-float-label">{itemCount} ITEM{itemCount > 1 ? 'S' : ''}</span>
                    <span className="cart-float-price">₹{totalVal + 5}</span>
                  </div>
                  <div className="cart-float-right">View Cart <ChevronRight size={15} /></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>{/* end app-main */}
      </div>{/* end app-layout */}
    </div>
  )
}
