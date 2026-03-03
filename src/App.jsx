import React, { useState, useEffect, useRef } from 'react'
import {
  Search, ChevronRight, Zap, X, Package, Truck, CheckCircle2,
  ArrowRight, Calendar, Lock, AlertCircle, ArrowLeft, Timer,
  Shield, Home, Grid3X3, ShoppingBag, Star, Gift, Tag, Flame,
  Bolt, TrendingUp, MessageCircle, Phone
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

// ──────────────────────────────────────────────────────────────
// SHEETDB INTEGRATION
// Orders are automatically saved to Google Sheets via SheetDB API
// ──────────────────────────────────────────────────────────────
const SHEETDB_URL = 'https://sheetdb.io/api/v1/6z3vh2kf9d5g5'

async function saveOrderToSheet(data) {
  try {
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    const items = data.items.map(i => `${i.name} x${i.qty}`).join(' | ')

    const payload = {
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
    }

    const res = await fetch(SHEETDB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      console.log('✅ Order saved to Google Sheet')
    }
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
  { name: 'Essentials', icon: 'https://cdn-icons-png.flaticon.com/128/2331/2331966.png' },
  { name: 'Snacks', icon: 'https://cdn-icons-png.flaticon.com/128/2553/2553691.png' },
  { name: 'Drinks', icon: 'https://cdn-icons-png.flaticon.com/128/3050/3050131.png' },
  { name: 'Pharma', icon: 'https://cdn-icons-png.flaticon.com/128/3140/3140343.png' },
  { name: 'Hygiene', icon: 'https://cdn-icons-png.flaticon.com/128/2553/2553642.png' },
  { name: 'Instant', icon: 'https://cdn-icons-png.flaticon.com/128/1046/1046857.png' },
  { name: 'Sweets', icon: 'https://cdn-icons-png.flaticon.com/128/3373/3373065.png' },
  { name: 'Travel', icon: 'https://cdn-icons-png.flaticon.com/128/3124/3124073.png' },
]

const PRODUCTS = {
  best: [
    { id: 1, name: 'Bisleri Water', variant: '1 L', price: 20, mrp: 20, img: 'https://images.jdmagicbox.com/quickquotes/images_main/bisleri-water-bottle-1-litre-297413498-dlh4a.jpg' },
    { id: 2, name: "Lay's Classic Salted", variant: '52 g', price: 20, mrp: 20, img: 'https://m.media-amazon.com/images/I/81aF2UPFPUL._SL1500_.jpg' },
    { id: 3, name: 'Dolo 650 Tablet', variant: '15 Tabs', price: 30, mrp: 35, img: 'https://www.netmeds.com/images/product-v1/600x600/902498/dolo_650mg_tablet_15s_0.jpg' },
    { id: 4, name: 'Masala Chai', variant: '200 ml', price: 40, mrp: 50, img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80' },
    { id: 5, name: 'Maggi 2-Min Noodles', variant: '70 g', price: 14, mrp: 14, img: 'https://m.media-amazon.com/images/I/71A4lZzwIAL._SL1500_.jpg' },
    { id: 6, name: 'Dettol Sanitizer', variant: '50 ml', price: 29, mrp: 35, img: 'https://m.media-amazon.com/images/I/51iS-FsCv2L._SL1000_.jpg' },
  ],
  snacks: [
    { id: 7, name: 'Kurkure Masala', variant: '75 g', price: 20, mrp: 20, img: 'https://m.media-amazon.com/images/I/81X7baxhvBL._SL1500_.jpg' },
    { id: 8, name: 'Dairy Milk Silk', variant: '60 g', price: 80, mrp: 90, img: 'https://m.media-amazon.com/images/I/71hHVJIBFVL._SL1500_.jpg' },
    { id: 9, name: 'Parle-G Gold', variant: '100 g', price: 20, mrp: 20, img: 'https://m.media-amazon.com/images/I/61-+pBR9N-L._SL1200_.jpg' },
    { id: 10, name: 'Haldiram Bhujia', variant: '200 g', price: 55, mrp: 60, img: 'https://m.media-amazon.com/images/I/71EWvgmGv6L._SL1500_.jpg' },
    { id: 17, name: 'KitKat 4F', variant: '41.5 g', price: 60, mrp: 65, img: 'https://m.media-amazon.com/images/I/61oKH1tePbL._SL1500_.jpg' },
    { id: 18, name: 'Oreo Original', variant: '120 g', price: 35, mrp: 40, img: 'https://m.media-amazon.com/images/I/61w3JGh8d8L._SL1500_.jpg' },
  ],
  drinks: [
    { id: 11, name: 'Coca-Cola', variant: '300 ml', price: 35, mrp: 40, img: 'https://m.media-amazon.com/images/I/61eBPotEEAL._SL1200_.jpg' },
    { id: 12, name: 'Real Mango Juice', variant: '200 ml', price: 25, mrp: 30, img: 'https://m.media-amazon.com/images/I/61EB2K5KsoL._SL1500_.jpg' },
    { id: 13, name: 'Filter Coffee', variant: '150 ml', price: 45, mrp: 50, img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80' },
    { id: 19, name: 'Sprite Can', variant: '300 ml', price: 30, mrp: 35, img: 'https://m.media-amazon.com/images/I/31wv9D3pXRL.jpg' },
    { id: 20, name: 'Nimbu Pani', variant: '200 ml', price: 20, mrp: 25, img: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&q=80' },
  ],
  travel: [
    { id: 14, name: 'Neck Pillow', variant: '1 pc', price: 120, mrp: 150, img: 'https://m.media-amazon.com/images/I/71snOPiUrFL._AC_SL1500_.jpg' },
    { id: 15, name: 'Eye Mask', variant: '1 pc', price: 50, mrp: 70, img: 'https://m.media-amazon.com/images/I/71Hj1iHIuQL._AC_SL1500_.jpg' },
    { id: 16, name: 'Ear Plugs', variant: '1 pair', price: 30, mrp: 40, img: 'https://m.media-amazon.com/images/I/61XoO4nVpwL._AC_SL1500_.jpg' },
    { id: 21, name: 'Hand Sanitizer', variant: '100 ml', price: 59, mrp: 75, img: 'https://m.media-amazon.com/images/I/51iS-FsCv2L._SL1000_.jpg' },
  ],
}

const PROMOS = [
  { id: 1, title: 'Flat 20% OFF', sub: 'On all Snacks & Beverages', bg: 'linear-gradient(135deg,#0C831F,#22c55e)', tag: 'LIMITED' },
  { id: 2, title: 'Free Delivery', sub: 'On orders above ₹99', bg: 'linear-gradient(135deg,#1a1a2e,#2d2d6d)', tag: 'TODAY' },
  { id: 3, title: 'Flash Sale 🔥', sub: 'Travel essentials at ½ price', bg: 'linear-gradient(135deg,#c73900,#f47b20)', tag: 'HOT' },
  { id: 4, title: 'New Arrivals', sub: 'Pharma & hygiene range', bg: 'linear-gradient(135deg,#4c1d95,#8b5cf6)', tag: 'NEW' },
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
const Logo = ({ h = 46 }) => (
  <img src="/logo.png" alt="RailQuick" className="rq-logo" style={{ height: h, width: 'auto' }} />
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
// TRUST STRIP
// ──────────────────────────────────────────────────────────────
function TrustStrip() {
  return (
    <div className="trust-strip">
      {[
        [<Zap size={12} />, '5-Min Delivery'],
        [<Shield size={12} />, 'Quality Checked'],
        [<Star size={12} />, '4.8★ Rated'],
        [<Tag size={12} />, 'Best Prices'],
        [<Gift size={12} />, 'COD Available'],
        [<TrendingUp size={12} />, '10K+ Orders'],
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
// SECTION
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
// DESKTOP SIDEBAR (categories)
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
        </div>
      ))}
    </aside>
  )
}

// ──────────────────────────────────────────────────────────────
// BOTTOM NAV (mobile)
// ──────────────────────────────────────────────────────────────
function BottomNav({ tab, onTab, cartCount }) {
  return (
    <nav className="btm-nav">
      {[
        { key: 'home', icon: <Home size={22} />, label: 'Home' },
        { key: 'cats', icon: <Grid3X3 size={22} />, label: 'Categories' },
        { key: 'cart', icon: null, label: 'Cart', isCart: true },
        { key: 'offers', icon: <Tag size={22} />, label: 'Offers' },
      ].map(it => (
        <button key={it.key} className={`btm-btn ${tab === it.key ? 'active' : ''}`} onClick={() => onTab(it.key)}>
          {it.isCart
            ? <div className="btm-btn-icon btm-cart-wrap">
              <ShoppingBag size={22} />
              {cartCount > 0 && <span className="btm-badge">{cartCount}</span>}
            </div>
            : <div className="btm-btn-icon">{it.icon}</div>}
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  )
}

// ──────────────────────────────────────────────────────────────
// DESKTOP TOP NAV
// ──────────────────────────────────────────────────────────────
function DesktopNav({ train, search, onSearch, cartCount, onCart, onBack }) {
  return (
    <nav className="d-nav">
      <div className="d-nav-inner">
        <div className="d-nav-logo"><Logo h={50} /></div>

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

        <button className="d-nav-cart" onClick={onCart}>
          <ShoppingBag size={20} />
          My Cart
          {cartCount > 0 && <span className="d-nav-cart-badge">{cartCount}</span>}
        </button>
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
          <div className="cart-eta">
            <Zap size={14} />
            <span>Delivered to your seat in <strong>5 minutes</strong></span>
          </div>
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
// ORDER FORM  (name, seat, contact — no PNR)
// ──────────────────────────────────────────────────────────────
function OrderForm({ cart, train, onClose, onConfirm }) {
  const [fd, setFd] = useState({ name: '', seat: '', contact: '' })
  const [placing, setPlacing] = useState(false)
  const [err, setErr] = useState('')
  const grand = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0) + 5

  const submit = async () => {
    if (!fd.name.trim()) { setErr('Please enter your name'); return }
    if (!fd.seat.trim()) { setErr('Please enter your seat / berth number'); return }
    if (!fd.contact || fd.contact.length < 10) { setErr('Enter a valid 10-digit mobile number'); return }
    setErr('')
    setPlacing(true)

    const orderId = 'RQ' + Math.floor(100000 + Math.random() * 900000)
    const orderData = {
      orderId,
      name: fd.name,
      seat: fd.seat,
      contact: fd.contact,
      items: Object.values(cart),
      grand,
      trainNo: train.trainNo,
    }

    // Save to Google Sheet (non-blocking)
    saveOrderToSheet(orderData)

    setTimeout(() => onConfirm(orderData), 1500)
  }

  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ zIndex: 500 }}>
      <div className="overlay-tap" onClick={onClose} />
      <motion.div className="form-sheet"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 32, stiffness: 340 }}>
        <div className="form-logo"><Logo h={42} /></div>
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
        <div className="tracking-logo"><Logo h={48} /></div>
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
  const wpMsg = encodeURIComponent(
    `Hi! I placed Order #${orderInfo.orderId} for Seat ${orderInfo.seat}. Need help!`
  )
  const wpUrl = `https://wa.me/918882779769?text=${wpMsg}`

  return (
    <motion.div className="success-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="success-logo"><Logo h={52} /></div>

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
        <a
          href={wpUrl} target="_blank" rel="noopener noreferrer"
          className="btn-whatsapp">
          <MessageCircle size={20} />
          Contact Customer Support
        </a>
        <button className="btn-home" onClick={onGoHome}>
          <Home size={18} />
          Go to Home
        </button>
      </motion.div>

      <div className="success-powered">Powered by <strong>RailQuick</strong></div>
    </motion.div>
  )
}

// ──────────────────────────────────────────────────────────────
// TRAIN SELECTION SCREEN (landing)
// ──────────────────────────────────────────────────────────────
function TrainScreen({ onSelect }) {
  return (
    <div className="ts-screen">
      <div className="ts-wrap">
        <nav className="ts-nav">
          <Logo h={54} />
          <div className="ts-nav-right">
            <div className="ts-nav-links">
              <span>Our Service</span>
              <span>Support</span>
            </div>
          </div>
        </nav>

        <div className="ts-hero">
          <div className="ts-hero-left">
            <div className="ts-eyebrow"><Zap size={13} />India's fastest on-train delivery</div>
            <h1 className="ts-title">
              Delivered to<br />your seat in<br /><span className="text-green">5 minutes</span>
            </h1>
            <p className="ts-sub">
              On-board service delivering essentials, snacks &amp; medicines right to your berth. Cash on delivery accepted.
            </p>
            <div className="ts-pills">
              <div className="ts-pill"><Timer size={14} />Ultra Fast</div>
              <div className="ts-pill"><Shield size={14} />Quality Assured</div>
              <div className="ts-pill"><Star size={14} />4.8★ Rated</div>
              <div className="ts-pill"><Flame size={14} />10,000+ Orders</div>
            </div>
          </div>
          <div className="ts-hero-right">
            <img src="/vande-bharat.png" alt="Train delivery" className="ts-hero-img" />
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
                      : <span className="badge badge-upcoming" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Timer size={10} />UPCOMING
                      </span>}
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
          <Logo h={36} />
          <p>RailQuick — On-train delivery · All rights reserved © 2026</p>
        </footer>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// SHOPPING CONTENT (shared between mobile & desktop)
// ──────────────────────────────────────────────────────────────
function ShoppingContent({ search, cart, onAdd, onRemove }) {
  const filter = prods =>
    search ? prods.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : prods

  return (
    <>
      <div className="spotlight">
        <div className="spotlight-txt">
          <h3>⚡ In-Train Delivery Active</h3>
          <p>Products delivered straight to your berth</p>
        </div>
        <div className="spotlight-ico"><Zap size={28} /></div>
      </div>

      {/* Flash deals banner */}
      <div className="flash-banner">
        <div className="flash-banner-txt">
          <h3>🔥 Flash Sale — Flat 20% OFF</h3>
          <p>On all Snacks & Beverages today</p>
        </div>
        <div className="flash-banner-right">Shop <ChevronRight size={15} /></div>
      </div>

      {/* Mobile category chips */}
      <div className="cats-wrap">
        <div className="cats-head">Shop by Category</div>
        <div className="cats-row">
          {CATEGORIES.map(c => (
            <div key={c.name} className="cat-chip">
              <div className="cat-chip-ico"><img src={c.icon} alt={c.name} /></div>
              <span className="cat-chip-name">{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      <PromoCarousel />
      <TrustStrip />

      <Section title="Bestsellers" icon="🔥" products={filter(PRODUCTS.best)} cart={cart} onAdd={onAdd} onRemove={onRemove} />
      <Section title="Snacks & Sweets" icon="🍿" products={filter(PRODUCTS.snacks)} cart={cart} onAdd={onAdd} onRemove={onRemove} />
      <Section title="Beverages" icon="🥤" products={filter(PRODUCTS.drinks)} cart={cart} onAdd={onAdd} onRemove={onRemove} />
      <Section title="Travel Essentials" icon="🎒" products={filter(PRODUCTS.travel)} cart={cart} onAdd={onAdd} onRemove={onRemove} />
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
  const [sidebarCat, setSidebarCat] = useState(CATEGORIES[0].name)

  const add = p => setCart(c => ({ ...c, [p.id]: { ...p, qty: (c[p.id]?.qty || 0) + 1 } }))
  const rem = id => setCart(c => {
    const e = c[id]; if (!e) return c
    if (e.qty <= 1) { const { [id]: _, ...r } = c; return r }
    return { ...c, [id]: { ...e, qty: e.qty - 1 } }
  })
  const reset = () => { setCart({}); setDone(false); setOrderInfo(null); setTrain(null) }

  const itemCount = Object.values(cart).reduce((s, i) => s + i.qty, 0)
  const totalVal = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0)

  const handleTab = t => {
    setTab(t)
    if (t === 'cart' && itemCount > 0) setCartOpen(true)
  }

  // ── Screens ──
  if (!train) return <TrainScreen onSelect={setTrain} />

  if (done && orderInfo) return (
    <SuccessScreen orderInfo={orderInfo} onGoHome={reset} />
  )

  return (
    <div className="app-shell">

      {/* ── Tracking overlay ── */}
      <AnimatePresence>
        {tracking && (
          <OrderTracking
            orderInfo={orderInfo}
            onComplete={() => { setTracking(false); setDone(true) }}
          />
        )}
      </AnimatePresence>

      {/* ── Cart drawer ── */}
      <AnimatePresence>
        {cartOpen && (
          <CartDrawer cart={cart} onClose={() => setCartOpen(false)}
            onCheckout={() => { setCartOpen(false); setFormOpen(true) }}
            onAdd={add} onRemove={rem} />
        )}
      </AnimatePresence>

      {/* ── Order form ── */}
      <AnimatePresence>
        {formOpen && (
          <OrderForm cart={cart} train={train} onClose={() => setFormOpen(false)}
            onConfirm={info => { setOrderInfo(info); setFormOpen(false); setTracking(true) }} />
        )}
      </AnimatePresence>

      {/* ── Desktop nav ── */}
      <DesktopNav
        train={train} search={search} onSearch={setSearch}
        cartCount={itemCount} onCart={() => setCartOpen(true)}
        onBack={() => setTrain(null)}
      />

      {/* ── Desktop layout: sidebar + main ── */}
      <div className="app-layout">
        <DesktopSidebar active={sidebarCat} onSelect={setSidebarCat} />

        <div className="app-main">

          {/* ── Mobile header ── */}
          <header className="mob-hdr">
            <div className="mob-hdr-row1">
              <div className="mob-hdr-back" onClick={() => setTrain(null)}>
                <ArrowLeft size={16} />
                <div className="mob-hdr-back-info">
                  <div className="mob-hdr-train">Train {train.trainNo}</div>
                  <div className="mob-hdr-route">{train.from} → {train.to}</div>
                </div>
              </div>
              <div className="mob-hdr-logo"><Logo h={40} /></div>
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
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </header>

          {/* ── Mobile delivery bar ── */}
          <div className="mob-delivery-bar">
            <div className="pulse-dot" />
            <Zap size={13} />
            <span>Delivering in <strong>5 mins</strong> · Train {train.trainNo}</span>
          </div>

          {/* ── Mobile content ── */}
          <div className="main-inner" style={{ paddingBottom: itemCount > 0 ? 148 : 88 }}>
            <ShoppingContent search={search} cart={cart} onAdd={add} onRemove={rem} />
          </div>

          {/* ── Desktop content ── */}
          <div className="d-main-inner" style={{ paddingBottom: itemCount > 0 ? 90 : 32 }}>
            <ShoppingContent search={search} cart={cart} onAdd={add} onRemove={rem} />
          </div>

          {/* ── Bottom nav (mobile) ── */}
          <BottomNav tab={tab} onTab={handleTab} cartCount={itemCount} />

          {/* ── Float cart bar ── */}
          <AnimatePresence>
            {itemCount > 0 && (
              <motion.div className="cart-float"
                initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
                transition={{ type: 'spring', damping: 26, stiffness: 300 }}>
                <div className="cart-float-inner" onClick={() => setCartOpen(true)}>
                  <div className="cart-float-left">
                    <span className="cart-float-label">{itemCount} ITEM{itemCount > 1 ? 'S' : ''} ADDED</span>
                    <span className="cart-float-price">₹{totalVal + 5}</span>
                  </div>
                  <div className="cart-float-right">View Cart <ChevronRight size={16} /></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>{/* end app-main */}
      </div>{/* end app-layout */}
    </div>
  )
}
