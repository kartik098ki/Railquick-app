import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Search, ChevronDown, ChevronRight, User, Clock, Zap, X, Package, Truck, CheckCircle2, MapPin, Star, Shield, ArrowRight, Hash, UserCircle, Receipt, IndianRupee, CreditCard, Smartphone, Wallet } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

// ============================================================
// PNR MOCK LOOKUP
// ============================================================
function lookupPNR(pnr) {
  const coaches = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8']
  const seats = ['A', 'B', 'C', 'D']
  if (pnr.length < 6) return null
  return {
    train: 'Vande Bharat Express',
    trainNo: '22436',
    route: 'New Delhi → Varanasi',
    coach: coaches[parseInt(pnr[2] || '3') % 8],
    seat: (parseInt(pnr.slice(-2)) || 24) + seats[parseInt(pnr[3] || '0') % 4],
    date: '01 Mar 2026',
    departure: '06:00 AM',
  }
}

// ============================================================
// CATEGORIES
// ============================================================
const CATEGORIES = [
  { name: 'Essentials', icon: '📦', bg: '#FFF3E0' },
  { name: 'Snacks', icon: '🍿', bg: '#FFF8E1' },
  { name: 'Drinks', icon: '🥤', bg: '#E8F5E9' },
  { name: 'Pharma', icon: '💊', bg: '#E3F2FD' },
  { name: 'Hygiene', icon: '🧴', bg: '#FCE4EC' },
  { name: 'Instant Food', icon: '🍜', bg: '#FFF3E0' },
  { name: 'Sweets', icon: '🍫', bg: '#F3E5F5' },
  { name: 'Stationery', icon: '✏️', bg: '#E0F7FA' },
]

// ============================================================
// PRODUCTS — real CDN images
// ============================================================
const PRODUCTS = {
  best: [
    { id: 1, name: 'Bisleri Water', variant: '1 L', price: 20, mrp: 20, cat: 'Drinks', color: '#1565C0', bg: '#E3F2FD', rating: 4.8, img: 'https://www.bisleri.com/cdn/shop/files/Bisleri_1L_1.jpg?v=1716872993&width=600' },
    { id: 2, name: "Lay's Classic Salted", variant: '52 g', price: 20, mrp: 20, cat: 'Snacks', color: '#E65100', bg: '#FFF8E1', rating: 4.5, img: 'https://www.lays.in/sites/g/files/fnmzdf1071/files/2022-08/lays_classic_salted.png' },
    { id: 3, name: 'Dolo 650 Tablet', variant: '15 Tabs', price: 30, mrp: 35, cat: 'Pharma', color: '#C62828', bg: '#FFEBEE', rating: 4.9, img: 'https://www.netmeds.com/images/product-v1/600x600/902498/dolo_650mg_tablet_15s_0.jpg' },
    { id: 4, name: 'Chai Point Masala Chai', variant: '200 ml', price: 40, mrp: 50, cat: 'Drinks', color: '#4E342E', bg: '#EFEBE9', rating: 4.7, img: 'https://images.jdmagicbox.com/comp/def_content/tea-and-coffee-shop/default-tea-and-coffee-shop-14.jpg' },
    { id: 5, name: 'Maggi 2-Minute Noodles', variant: '70 g', price: 14, mrp: 14, cat: 'Instant Food', color: '#F9A825', bg: '#FFF8E1', rating: 4.6, img: 'https://www.maggi.in/sites/default/files/styles/transparent_png_product_detail/public/2022-04/MAGGI%202-Min-MasalaNoodles_70g_Front.png' },
    { id: 6, name: 'Dettol Hand Sanitizer', variant: '50 ml', price: 29, mrp: 29, cat: 'Hygiene', color: '#2E7D32', bg: '#E8F5E9', rating: 4.4, img: 'https://www.dettol.co.in/images/dettol-hand-sanitizer-50ml.jpg' },
  ],
  snacks: [
    { id: 7, name: 'Kurkure Masala Munch', variant: '75 g', price: 20, mrp: 20, cat: 'Snacks', color: '#BF360C', bg: '#FBE9E7', rating: 4.3, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40111456_4-kurkure-masala-munch.jpg' },
    { id: 8, name: 'Cadbury Dairy Milk Silk', variant: '60 g', price: 80, mrp: 90, cat: 'Sweets', color: '#4A148C', bg: '#F3E5F5', rating: 4.8, img: 'https://www.cadbury.co.in/wp-content/uploads/2020/12/CDMS-60g-Front.png' },
    { id: 9, name: 'Parle-G Gold Biscuits', variant: '100 g', price: 20, mrp: 20, cat: 'Snacks', color: '#F57F17', bg: '#FFF8E1', rating: 4.5, img: 'https://www.parleproducts.com/storage/uploads/product/Parle-G_Gold_100g_pack.png' },
    { id: 10, name: 'Oreo Original Cream', variant: '120 g', price: 30, mrp: 35, cat: 'Snacks', color: '#1A237E', bg: '#E8EAF6', rating: 4.6, img: 'https://www.oreo.in/sites/g/files/fnmzdf706/files/2020-08/Oreo-Original-Cream-120g.png' },
    { id: 11, name: "Haldiram's Aloo Bhujia", variant: '200 g', price: 55, mrp: 60, cat: 'Snacks', color: '#E65100', bg: '#FFF3E0', rating: 4.7, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40168055_3-haldirams-aloo-bhujia.jpg' },
    { id: 12, name: 'Dark Fantasy Choco Fills', variant: '75 g', price: 40, mrp: 40, cat: 'Snacks', color: '#3E2723', bg: '#EFEBE9', rating: 4.4, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40234156_2-sunfeast-dark-fantasy-choco-fills.jpg' },
    { id: 27, name: "Haldiram's Soan Papdi", variant: '250 g', price: 75, mrp: 85, cat: 'Sweets', color: '#FF8F00', bg: '#FFF8E1', rating: 4.5, img: 'https://www.bigbasket.com/media/uploads/p/xxl/267065_3-haldirams-soan-papdi.jpg' },
    { id: 28, name: 'Balaji Wafers', variant: '60 g', price: 15, mrp: 15, cat: 'Snacks', color: '#558B2F', bg: '#F1F8E9', rating: 4.3, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40088960_3-balaji-simply-salted-wafers.jpg' },
  ],
  drinks: [
    { id: 13, name: 'Amul Taaza Milk', variant: '500 ml', price: 30, mrp: 30, cat: 'Drinks', color: '#D84315', bg: '#FBE9E7', rating: 4.4, img: 'https://www.amul.com/m/uploads/taaza-500ml.jpg' },
    { id: 14, name: 'Red Bull Energy Drink', variant: '250 ml', price: 115, mrp: 125, cat: 'Drinks', color: '#1565C0', bg: '#E3F2FD', rating: 4.6, img: 'https://assets.redbull.com/images/upload/f_auto,q_auto/redbull-energy-drink-250ml-can.png' },
    { id: 15, name: 'Paper Boat Aamras', variant: '200 ml', price: 30, mrp: 30, cat: 'Drinks', color: '#F57F17', bg: '#FFF8E1', rating: 4.7, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40186073-1-paper-boat-aamras.jpg' },
    { id: 16, name: 'Coca-Cola', variant: '300 ml', price: 35, mrp: 40, cat: 'Drinks', color: '#B71C1C', bg: '#FFEBEE', rating: 4.5, img: 'https://www.coca-cola.com/content/dam/one/us/en/articles/2022/09/coca-cola-can.png' },
    { id: 17, name: 'Frooti Mango', variant: '200 ml', price: 10, mrp: 10, cat: 'Drinks', color: '#F9A825', bg: '#FFFDE7', rating: 4.3, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40050613_3-parle-agro-frooti-mango-fresh-n-juicy.jpg' },
    { id: 29, name: 'Thums Up', variant: '300 ml', price: 35, mrp: 40, cat: 'Drinks', color: '#1B5E20', bg: '#E8F5E9', rating: 4.5, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40046786_4-thums-up.jpg' },
    { id: 30, name: 'Appy Fizz', variant: '250 ml', price: 25, mrp: 30, cat: 'Drinks', color: '#BF360C', bg: '#FBE9E7', rating: 4.4, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40069985_4-parle-agro-appy-fizz.jpg' },
    { id: 31, name: 'Real Guava Juice', variant: '200 ml', price: 20, mrp: 25, cat: 'Drinks', color: '#2E7D32', bg: '#E8F5E9', rating: 4.3, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40003064_7-dabur-real-juice-guava.jpg' },
  ],
  instantfood: [
    { id: 32, name: 'Cup Noodles Masala', variant: '70 g', price: 45, mrp: 50, cat: 'Instant Food', color: '#D84315', bg: '#FBE9E7', rating: 4.4, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40099765_4-nissin-cup-noodles-masala.jpg' },
    { id: 33, name: 'MTR Ready Poha', variant: '180 g', price: 60, mrp: 70, cat: 'Instant Food', color: '#388E3C', bg: '#E8F5E9', rating: 4.6, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40223710_3-mtr-ready-to-eat-poha.jpg' },
    { id: 34, name: 'MTR Upma Mix', variant: '170 g', price: 55, mrp: 60, cat: 'Instant Food', color: '#F57F17', bg: '#FFF8E1', rating: 4.5, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40069888_3-mtr-upma-mix.jpg' },
    { id: 35, name: 'Knorr Tomato Soup', variant: '12 g', price: 10, mrp: 10, cat: 'Instant Food', color: '#C62828', bg: '#FFEBEE', rating: 4.2, img: 'https://www.bigbasket.com/media/uploads/p/xxl/221568_7-knorr-classic-tomato-soup.jpg' },
    { id: 36, name: 'Top Ramen Curry', variant: '70 g', price: 12, mrp: 14, cat: 'Instant Food', color: '#E65100', bg: '#FFF3E0', rating: 4.3, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40087977_5-nissin-top-ramen-curry.jpg' },
    { id: 37, name: 'Wai Wai Noodles', variant: '75 g', price: 15, mrp: 15, cat: 'Instant Food', color: '#AD1457', bg: '#FCE4EC', rating: 4.5, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40218870_4-wai-wai-noodles-chicken-flavour.jpg' },
  ],
  pharma: [
    { id: 19, name: 'Crocin Advance', variant: '10 Tabs', price: 18, mrp: 22, cat: 'Pharma', color: '#1565C0', bg: '#E3F2FD', rating: 4.8, img: 'https://www.netmeds.com/images/product-v1/600x600/386793/crocin_advance_tablet_10s_0.jpg' },
    { id: 20, name: 'Volini Pain Spray', variant: '15 g', price: 72, mrp: 80, cat: 'Pharma', color: '#2E7D32', bg: '#E8F5E9', rating: 4.6, img: 'https://www.netmeds.com/images/product-v1/600x600/11399/volini_spray_40g_0.jpg' },
    { id: 21, name: 'Band-Aid Flexible', variant: '10 Strips', price: 25, mrp: 25, cat: 'Pharma', color: '#C62828', bg: '#FFEBEE', rating: 4.5, img: 'https://www.netmeds.com/images/product-v1/600x600/436302/band_aid_flexible_fabric_10s_0.jpg' },
    { id: 22, name: 'ENO Antacid', variant: '5g × 6', price: 30, mrp: 30, cat: 'Pharma', color: '#1565C0', bg: '#E3F2FD', rating: 4.7, img: 'https://www.netmeds.com/images/product-v1/600x600/8393/eno_fruit_salt_sachets_5g_x_6s_0.jpg' },
    { id: 38, name: 'Digene Tablet', variant: '15 Tabs', price: 25, mrp: 30, cat: 'Pharma', color: '#6A1B9A', bg: '#F3E5F5', rating: 4.4, img: 'https://www.netmeds.com/images/product-v1/600x600/15965/digene_tablet_15_0.jpg' },
    { id: 39, name: 'Vicks VapoRub', variant: '10 ml', price: 32, mrp: 35, cat: 'Pharma', color: '#00695C', bg: '#E0F2F1', rating: 4.5, img: 'https://www.netmeds.com/images/product-v1/600x600/8234/vicks_vaporub_10_ml_0.jpg' },
  ],
  hygiene: [
    { id: 24, name: 'Colgate MaxFresh', variant: '80 g', price: 65, mrp: 72, cat: 'Hygiene', color: '#C62828', bg: '#FFEBEE', rating: 4.5, img: 'https://www.colgate.com/content/dam/cp-sites/oral-care/oral-care-center/en-in/brand/colgate-max-fresh/colgate-max-fresh-toothpaste-spicy-fresh.png' },
    { id: 40, name: 'Nivea Face Cream', variant: '20 ml', price: 35, mrp: 40, cat: 'Hygiene', color: '#1565C0', bg: '#E3F2FD', rating: 4.3, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40023786_12-nivea-soft-moisturising-creme.jpg' },
    { id: 41, name: 'Head & Shoulders', variant: '7.5ml×4', price: 16, mrp: 16, cat: 'Hygiene', color: '#00695C', bg: '#E0F2F1', rating: 4.2, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40040065_7-head-shoulders-cool-menthol-shampoo.jpg' },
    { id: 42, name: 'Closeup Toothpaste', variant: '50 g', price: 38, mrp: 42, cat: 'Hygiene', color: '#C62828', bg: '#FFEBEE', rating: 4.4, img: 'https://www.bigbasket.com/media/uploads/p/xxl/267056_7-close-up-deep-action-red-hot-toothpaste.jpg' },
    { id: 43, name: 'Lifebuoy Hand Wash', variant: '50 ml', price: 20, mrp: 22, cat: 'Hygiene', color: '#C62828', bg: '#FFCDD2', rating: 4.3, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40182099_3-lifebuoy-total-10-hand-wash.jpg' },
  ],
  essentials: [
    { id: 23, name: 'Tissues Travel Pack', variant: '10 Sheets', price: 10, mrp: 10, cat: 'Essentials', color: '#5D4037', bg: '#EFEBE9', rating: 4.2, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40037012_3-kleenex-travel-soft-tissues.jpg' },
    { id: 25, name: 'N95 Face Mask', variant: 'Pack of 3', price: 45, mrp: 60, cat: 'Essentials', color: '#1565C0', bg: '#E3F2FD', rating: 4.6, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40175956_2-3m-n95-air-pollution-mask.jpg' },
    { id: 26, name: 'Sleep Eye Mask', variant: '1 Piece', price: 35, mrp: 50, cat: 'Essentials', color: '#311B92', bg: '#EDE7F6', rating: 4.4, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40060025_4-strauss-eye-mask.jpg' },
    { id: 45, name: 'Earplugs Pair', variant: '1 Pair', price: 15, mrp: 20, cat: 'Essentials', color: '#F57F17', bg: '#FFF8E1', rating: 4.3, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40093060_3-3m-ear-classic-earplugs.jpg' },
    { id: 46, name: 'Type-C Charger Cable', variant: '1 m', price: 99, mrp: 149, cat: 'Essentials', color: '#37474F', bg: '#ECEFF1', rating: 4.5, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40220380_4-ambrane-rb-11s-usb-type-c-cable.jpg' },
    { id: 47, name: 'Travel Neck Pillow', variant: '1 Piece', price: 120, mrp: 199, cat: 'Essentials', color: '#6A1B9A', bg: '#F3E5F5', rating: 4.7, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40092618_4-house-of-quirk-memory-foam-neck-pillow.jpg' },
    { id: 48, name: 'Wet Wipes Pack', variant: '10 Wipes', price: 20, mrp: 25, cat: 'Essentials', color: '#00695C', bg: '#E0F2F1', rating: 4.3, img: 'https://www.bigbasket.com/media/uploads/p/xxl/40161714_3-himalaya-baby-wipes.jpg' },
  ],
}

const allProducts = Object.values(PRODUCTS).flat()

// ============================================================
// PNR LOGIN SCREEN
// ============================================================
function PNRScreen({ onLogin }) {
  const [name, setName] = useState('')
  const [pnr, setPnr] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!name.trim()) { setError('Please enter your name'); return }
    if (pnr.length < 6) { setError('Enter a valid PNR (min 6 digits)'); return }
    setError('')
    setLoading(true)
    setTimeout(() => {
      const data = lookupPNR(pnr)
      if (data) onLogin({ ...data, passengerName: name.trim() })
      else { setError('PNR not found. Try again.'); setLoading(false) }
    }, 1800)
  }

  return (
    <div className="pnr-screen">
      <div className="pnr-train-img">
        <img src="/vande-bharat.png" alt="Vande Bharat Express" />
        <div className="pnr-train-overlay" />
      </div>
      <motion.div className="pnr-card"
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="pnr-logo">
          <span className="pnr-logo-icon">🚄</span>
          <h1 className="pnr-brand">Rail<span>Quick</span></h1>
          <p className="pnr-tagline">Essentials delivered to your train seat</p>
        </div>

        <div className="pnr-form">
          <div className="pnr-input-group">
            <UserCircle size={18} className="pnr-input-icon" />
            <input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="pnr-input-group">
            <Hash size={18} className="pnr-input-icon" />
            <input placeholder="PNR Number" value={pnr} maxLength={10}
              onChange={e => setPnr(e.target.value.replace(/\D/g, ''))} inputMode="numeric" />
          </div>
          {error && <motion.div className="pnr-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.div>}
          <motion.button className="pnr-submit" onClick={handleSubmit} disabled={loading}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? (
              <div className="pnr-loading"><div className="pnr-spinner" /> Finding your train...</div>
            ) : (
              <>Find My Train <ArrowRight size={18} /></>
            )}
          </motion.button>
        </div>

        <div className="pnr-features">
          <div className="pnr-feat"><Shield size={14} /> Verified Products</div>
          <div className="pnr-feat"><Zap size={14} /> Seat Delivery</div>
          <div className="pnr-feat"><Star size={14} /> 4.8★ Rated</div>
        </div>
      </motion.div>
    </div>
  )
}

// ============================================================
// PRODUCT CARD — real product images
// ============================================================
function ProductCard({ product, qty, onAdd, onRemove }) {
  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0
  const [imgFailed, setImgFailed] = useState(false)

  return (
    <motion.div className="bk-product-card"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
    >
      <div className="bk-img-wrap" style={{ background: product.bg || '#f5f5f5' }}>
        {!imgFailed && product.img ? (
          <img
            className="product-real-img"
            src={product.img}
            alt={product.name}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="product-tile-inner">
            <span className="product-tile-brand" style={{ color: product.color, fontSize: 13, fontWeight: 800, textAlign: 'center' }}>{product.name}</span>
            <span className="product-tile-variant">{product.variant}</span>
          </div>
        )}
        {discount > 0 && <div className="bk-discount">{discount}% OFF</div>}
      </div>

      <div className="bk-product-details">
        <div className="bk-timer-rating-row">
          <div className="bk-timer"><Clock size={9} /> SEAT DEL.</div>
          {product.rating && (
            <div className="bk-rating"><Star size={9} fill="#FF9800" color="#FF9800" /> {product.rating}</div>
          )}
        </div>
        <div className="bk-product-name">{product.name}</div>
        <div className="bk-product-variant">{product.variant}</div>
        <div className="bk-product-footer">
          <div className="bk-price-group">
            <span className="bk-price">₹{product.price}</span>
            {discount > 0 && <span className="bk-mrp">₹{product.mrp}</span>}
          </div>
          {qty === 0 ? (
            <motion.button className="bk-add-btn" whileTap={{ scale: 0.92 }}
              onClick={(e) => { e.stopPropagation(); onAdd(product) }}>ADD</motion.button>
          ) : (
            <div className="bk-qty-control">
              <button className="bk-qty-btn" onClick={(e) => { e.stopPropagation(); onRemove(product.id) }}>−</button>
              <span className="bk-qty-num">{qty}</span>
              <button className="bk-qty-btn" onClick={(e) => { e.stopPropagation(); onAdd(product) }}>+</button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================
// TOAST
// ============================================================
function Toast({ message }) {
  return (
    <motion.div className="bk-toast"
      initial={{ y: 20, opacity: 0, x: '-50%' }} animate={{ y: 0, opacity: 1, x: '-50%' }}
      exit={{ y: 20, opacity: 0, x: '-50%' }}
    >{message}</motion.div>
  )
}

// ============================================================
// CART DRAWER (inline)
// ============================================================
function CartDrawer({ cart, pnrData, onClose, onCheckout, onAdd, onRemove }) {
  const items = Object.values(cart)
  const totalItems = items.reduce((s, i) => s + i.qty, 0)
  const itemTotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const mrpTotal = items.reduce((s, i) => s + i.mrp * i.qty, 0)
  const savings = mrpTotal - itemTotal
  const handling = 5
  const grand = itemTotal + handling

  return (
    <motion.div className="bk-drawer-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
    >
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />
      <motion.div className="bk-drawer-sheet"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
      >
        <div className="bk-drawer-handle" />
        <div className="bk-drawer-head">
          <div className="bk-drawer-title">Your Cart ({totalItems})</div>
          <button className="bk-drawer-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="bk-drawer-body">
          <div className="bk-delivery-card">
            <div className="bk-delivery-icon"><Zap size={18} /></div>
            <div className="bk-delivery-info">
              <h4>Delivery to your seat</h4>
              <p>Coach {pnrData?.coach} · Seat {pnrData?.seat} · {pnrData?.train}</p>
            </div>
          </div>

          {items.map(item => (
            <div className="bk-cart-item" key={item.id}>
              <div className="bk-cart-item-img" style={{ background: item.bg || '#f5f5f5' }}>
                {item.img
                  ? <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 8 }}
                    onError={e => { e.target.style.display = 'none' }} />
                  : <span style={{ fontSize: 22 }}>{item.name[0]}</span>
                }
              </div>
              <div className="bk-cart-item-info">
                <div className="bk-cart-item-name">{item.name}</div>
                <div className="bk-cart-item-variant">{item.variant}</div>
                <div className="bk-cart-item-row">
                  <span className="bk-cart-item-price">₹{item.price * item.qty}</span>
                  <div className="bk-cart-item-qty">
                    <button onClick={() => onRemove(item.id)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => onAdd(item)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="bk-bill">
            <div className="bk-bill-title">Bill Details</div>
            <div className="bk-bill-row"><span>MRP Total</span><span>₹{mrpTotal}</span></div>
            {savings > 0 && <div className="bk-bill-row green"><span>Product Discount</span><span>-₹{savings}</span></div>}
            <div className="bk-bill-row"><span>Handling Charge</span><span>₹{handling}</span></div>
            <div className="bk-bill-row green"><span>Delivery Charge</span><span>FREE</span></div>
            <hr className="bk-bill-divider" />
            <div className="bk-bill-total"><span>Bill Total</span><span>₹{grand}</span></div>
            {savings > 0 && <div className="bk-savings-strip">🎉 You saved ₹{savings} on this order!</div>}
          </div>
        </div>

        <div className="bk-drawer-footer">
          <button className="bk-checkout-btn" onClick={onCheckout}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 10, opacity: 0.8, fontWeight: 600 }}>TOTAL</div>
              <div style={{ fontSize: 16 }}>₹{grand}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              Place Order <ChevronRight size={18} />
            </div>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================================
// PAYMENT MODAL
// ============================================================
function PaymentModal({ grand, onPay, onClose }) {
  const [selected, setSelected] = useState('upi')
  const [paying, setPaying] = useState(false)

  const methods = [
    { id: 'upi', label: 'UPI / GPay / PhonePe', icon: <Smartphone size={20} />, sub: 'Instant & secure' },
    { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={20} />, sub: 'Visa · Mastercard · RuPay' },
    { id: 'cash', label: 'Pay at Delivery', icon: <IndianRupee size={20} />, sub: 'Pay when delivered to seat' },
  ]

  const handlePay = () => {
    setPaying(true)
    setTimeout(() => { onPay() }, 1400)
  }

  return (
    <motion.div className="pay-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />
      <motion.div className="pay-sheet"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
      >
        <div className="bk-drawer-handle" />
        <div className="pay-header">
          <div className="pay-title">Choose Payment</div>
          <button className="bk-drawer-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="pay-amount-chip">
          <IndianRupee size={16} /> Total: <strong>₹{grand}</strong>
        </div>

        <div className="pay-methods">
          {methods.map(m => (
            <div key={m.id} className={`pay-method ${selected === m.id ? 'active' : ''}`}
              onClick={() => setSelected(m.id)}
            >
              <div className="pay-method-icon">{m.icon}</div>
              <div className="pay-method-info">
                <div className="pay-method-label">{m.label}</div>
                <div className="pay-method-sub">{m.sub}</div>
              </div>
              <div className={`pay-radio ${selected === m.id ? 'on' : ''}`} />
            </div>
          ))}
        </div>

        <div className="pay-footer">
          <motion.button className="pay-now-btn" onClick={handlePay} disabled={paying}
            whileTap={{ scale: 0.97 }}
          >
            {paying
              ? <><div className="pnr-spinner" style={{ width: 18, height: 18, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> Processing...</>
              : <>{selected === 'cash' ? 'Confirm Order' : `Pay ₹${grand}`} <ChevronRight size={18} /></>
            }
          </motion.button>
          <p className="pay-secure-note">🔒 100% Secure Payment</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============================================================
// ORDER TRACKING
// ============================================================
function OrderTracking({ onComplete, pnrData, orderInfo }) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 2500)
    const t2 = setTimeout(() => setStep(2), 5500)
    const t3 = setTimeout(() => setStep(3), 9000)
    const t4 = setTimeout(() => onComplete(), 12000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [onComplete])

  const steps = [
    { title: 'Order Confirmed! ✅', sub: `Order #${orderInfo?.orderId} placed successfully`, icon: <CheckCircle2 size={42} />, bg: '#E8F5E9' },
    { title: 'Being Prepared 📦', sub: `${orderInfo?.totalItems} item${orderInfo?.totalItems > 1 ? 's' : ''} being packed by our vendor`, icon: <Package size={42} />, bg: '#FFF8E1' },
    { title: 'On the Way! 🚶', sub: `Heading to Coach ${pnrData?.coach}, Seat ${pnrData?.seat}`, icon: <Truck size={42} />, bg: '#E3F2FD' },
    { title: 'Delivered! 🎉', sub: 'Please keep your PNR ticket ready for verification', icon: <Zap size={42} />, bg: '#E8F5E9' },
  ]

  return (
    <motion.div className="bk-anim-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <AnimatePresence mode="wait">
        <motion.div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
        >
          <div className="bk-anim-icon" style={{ background: steps[step].bg, color: '#0C831F' }}>{steps[step].icon}</div>
          <h2 className="bk-anim-title">{steps[step].title}</h2>
          <p className="bk-anim-sub">{steps[step].sub}</p>
          {step === 0 && orderInfo && (
            <motion.div className="order-id-chip" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Receipt size={14} /> Order #{orderInfo.orderId}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="bk-progress">{[0, 1, 2, 3].map(i => <div key={i} className={`bk-progress-seg ${i <= step ? 'on' : ''}`} />)}</div>
    </motion.div>
  )
}

// ============================================================
// PRODUCT SECTION
// ============================================================
function ProductSection({ title, products, cart, onAdd, onRemove, scrollable = false }) {
  return (
    <div className="bk-section">
      <div className="bk-section-header">
        <h3 className="bk-section-title">{title}</h3>
        <span className="bk-see-all">see all →</span>
      </div>
      {scrollable ? (
        <div className="bk-product-scroll">
          {products.map(p => <ProductCard key={p.id} product={p} qty={cart[p.id]?.qty || 0} onAdd={onAdd} onRemove={onRemove} />)}
        </div>
      ) : (
        <div className="bk-product-grid">
          {products.map(p => <ProductCard key={p.id} product={p} qty={cart[p.id]?.qty || 0} onAdd={onAdd} onRemove={onRemove} />)}
        </div>
      )}
    </div>
  )
}

// ============================================================
// MAIN APP
// ============================================================
function App() {
  const [pnrData, setPnrData] = useState(null)
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [ordering, setOrdering] = useState(false)
  const [orderDone, setOrderDone] = useState(false)
  const [orderInfo, setOrderInfo] = useState(null)
  const [activeCat, setActiveCat] = useState(null)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const showToast = (msg) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 1500)
  }

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const e = prev[product.id]
      return { ...prev, [product.id]: { ...product, qty: e ? e.qty + 1 : 1 } }
    })
    showToast(`Added ${product.name}`)
  }, [])

  const removeFromCart = useCallback((id) => {
    setCart(prev => {
      const e = prev[id]
      if (!e) return prev
      if (e.qty <= 1) { const { [id]: _, ...rest } = prev; return rest }
      return { ...prev, [id]: { ...e, qty: e.qty - 1 } }
    })
  }, [])

  const totalItems = Object.values(cart).reduce((s, i) => s + i.qty, 0)
  const totalPrice = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0)

  const searching = search.trim() !== '' || activeCat !== null
  const filteredProducts = allProducts.filter(p => {
    const mc = !activeCat || p.cat === activeCat
    const ms = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return mc && ms
  })

  // "Place Order" in cart drawer → open payment modal
  const handleOpenPayment = () => {
    setCartOpen(false)
    setTimeout(() => setPaymentOpen(true), 300)
  }

  // After payment confirmed → build orderInfo → start animation
  const handleConfirmPayment = () => {
    const items = Object.values(cart)
    const totalItemsCount = items.reduce((s, i) => s + i.qty, 0)
    const itemTotal = items.reduce((s, i) => s + i.price * i.qty, 0)
    const mrpTotal = items.reduce((s, i) => s + i.mrp * i.qty, 0)
    const savings = mrpTotal - itemTotal
    const handling = 5
    const orderId = 'RQ-' + String(Math.floor(10000 + Math.random() * 90000))
    const placedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setOrderInfo({
      orderId,
      items: items.map(i => ({ name: i.name, variant: i.variant, qty: i.qty, price: i.price, img: i.img, bg: i.bg })),
      totalItems: totalItemsCount,
      itemTotal,
      mrpTotal,
      savings,
      grand: itemTotal + handling,
      handling,
      placedAt,
    })
    setPaymentOpen(false)
    setTimeout(() => setOrdering(true), 200)
  }

  const handleComplete = useCallback(() => { setOrdering(false); setOrderDone(true) }, [])

  // ===== PNR LOGIN =====
  if (!pnrData) return <PNRScreen onLogin={setPnrData} />

  // ===== SUCCESS SCREEN =====
  if (orderDone && orderInfo) {
    return (
      <div className="app-shell">
        <motion.div className="bk-success-screen receipt-screen"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        >
          <motion.div className="bk-success-badge"
            initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', delay: 0.15 }}
          ><CheckCircle2 size={44} /></motion.div>

          <motion.h1 className="bk-success-title"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >Order Delivered! 🎉</motion.h1>

          <motion.div className="receipt-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="receipt-header">
              <div className="receipt-order-id">Order #{orderInfo.orderId}</div>
              <div className="receipt-time">Placed at {orderInfo.placedAt}</div>
            </div>

            <div className="receipt-delivery">
              <MapPin size={14} />
              <div>
                <div className="receipt-delivery-title">Delivered to seat</div>
                <div className="receipt-delivery-info">Coach {pnrData.coach}, Seat {pnrData.seat} · {pnrData.train}</div>
              </div>
            </div>

            <div className="receipt-items">
              <div className="receipt-section-title">Items Ordered</div>
              {orderInfo.items.map((item, i) => (
                <div className="receipt-item" key={i}>
                  <div className="receipt-item-img" style={{ background: item.bg || '#f5f5f5' }}>
                    {item.img
                      ? <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={e => { e.target.style.display = 'none' }} />
                      : <span style={{ fontSize: 14, fontWeight: 800 }}>{item.name[0]}</span>
                    }
                  </div>
                  <div className="receipt-item-info">
                    <span className="receipt-item-name">{item.name}</span>
                    <span className="receipt-item-variant">{item.variant} × {item.qty}</span>
                  </div>
                  <span className="receipt-item-price">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="receipt-bill">
              <div className="receipt-bill-row"><span>Item Total</span><span>₹{orderInfo.itemTotal}</span></div>
              {orderInfo.savings > 0 && <div className="receipt-bill-row green"><span>Discount</span><span>-₹{orderInfo.savings}</span></div>}
              <div className="receipt-bill-row"><span>Handling</span><span>₹{orderInfo.handling}</span></div>
              <div className="receipt-bill-row"><span>Delivery</span><span className="green">FREE</span></div>
              <div className="receipt-bill-total"><span>Total Paid</span><span>₹{orderInfo.grand}</span></div>
              {orderInfo.savings > 0 && <div className="receipt-savings">🎉 You saved ₹{orderInfo.savings}!</div>}
            </div>
          </motion.div>

          <motion.button className="bk-primary-btn"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            onClick={() => { setCart({}); setOrderDone(false); setOrderInfo(null) }}
          >Order More</motion.button>
        </motion.div>
      </div>
    )
  }

  // ===== MAIN APP =====
  return (
    <div className="app-shell">
      <AnimatePresence>{ordering && <OrderTracking onComplete={handleComplete} pnrData={pnrData} orderInfo={orderInfo} />}</AnimatePresence>
      <AnimatePresence>{cartOpen && <CartDrawer cart={cart} pnrData={pnrData} onClose={() => setCartOpen(false)} onCheckout={handleOpenPayment} onAdd={addToCart} onRemove={removeFromCart} />}</AnimatePresence>
      <AnimatePresence>{paymentOpen && <PaymentModal grand={Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0) + 5} onPay={handleConfirmPayment} onClose={() => setPaymentOpen(false)} />}</AnimatePresence>
      <AnimatePresence>{toast && <Toast message={toast} />}</AnimatePresence>

      {/* HEADER */}
      <header className="bk-header">
        <div className="bk-header-top">
          <div className="bk-header-left">
            <div className="bk-delivery-label">🚄 {pnrData.train}</div>
            <div className="bk-address-row">
              <MapPin size={12} />
              <span className="bk-address-text">Coach {pnrData.coach}, Seat {pnrData.seat} · {pnrData.route}</span>
              <ChevronDown size={13} />
            </div>
          </div>
          <div className="bk-passenger-badge">{pnrData.passengerName?.[0]?.toUpperCase()}</div>
        </div>
        <div className="bk-search-wrap">
          <div className="bk-search-bar">
            <Search size={18} color="#9E9E9E" />
            <input type="text" placeholder='Search "chips, water, medicine"'
              value={search} onChange={(e) => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch('')} style={{ display: 'flex' }}><X size={16} color="#9E9E9E" /></button>}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ paddingBottom: totalItems > 0 ? 90 : 20 }}>
        <div className="bk-categories">
          <div className="bk-cat-grid">
            {CATEGORIES.map(cat => (
              <div className="bk-cat-item" key={cat.name}
                onClick={() => { setActiveCat(activeCat === cat.name ? null : cat.name); setSearch('') }}
              >
                <div className={`bk-cat-icon ${activeCat === cat.name ? 'active' : ''}`} style={{ background: cat.bg }}>
                  {cat.icon}
                </div>
                <span className={`bk-cat-name ${activeCat === cat.name ? 'active' : ''}`}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {searching ? (
          <div className="bk-section">
            <div className="bk-section-header">
              <h3 className="bk-section-title">{activeCat || 'Search Results'}</h3>
              <span className="bk-see-all">{filteredProducts.length} items</span>
            </div>
            {filteredProducts.length > 0 ? (
              <div className="bk-product-grid">
                {filteredProducts.map(p => <ProductCard key={p.id} product={p} qty={cart[p.id]?.qty || 0} onAdd={addToCart} onRemove={removeFromCart} />)}
              </div>
            ) : (
              <div className="bk-empty">
                <div className="bk-empty-icon">🔍</div>
                <div className="bk-empty-text">No products found</div>
                <div className="bk-empty-sub">Try a different search or category</div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Welcome Banner */}
            <div className="bk-welcome-banner">
              <div className="bk-welcome-text">
                <div className="bk-welcome-hi">Hi {pnrData.passengerName} 👋</div>
                <div className="bk-welcome-sub">What would you like to order on your {pnrData.train} journey?</div>
              </div>
            </div>

            {/* Offer Banners */}
            <div className="bk-offers-scroll">
              <div className="bk-offer-card" style={{ background: 'linear-gradient(135deg, #0C831F 0%, #1aaa3a 100%)' }}>
                <div>
                  <div className="bk-offer-title">Everything at your seat!</div>
                  <div className="bk-offer-sub">Delivered on Vande Bharat</div>
                </div>
                <span className="bk-offer-emoji">🚄</span>
              </div>
              <div className="bk-offer-card" style={{ background: 'linear-gradient(135deg, #2479BD 0%, #4ba3e8 100%)' }}>
                <div>
                  <div className="bk-offer-title">Flat ₹20 OFF first order</div>
                  <div className="bk-offer-sub">Use code: RAILFIRST</div>
                </div>
                <span className="bk-offer-emoji">🎁</span>
              </div>
              <div className="bk-offer-card" style={{ background: 'linear-gradient(135deg, #e65100 0%, #ff8a50 100%)' }}>
                <div>
                  <div className="bk-offer-title">Snacks from just ₹10</div>
                  <div className="bk-offer-sub">Bestseller collection</div>
                </div>
                <span className="bk-offer-emoji">🍿</span>
              </div>
              <div className="bk-offer-card" style={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #ab47bc 100%)' }}>
                <div>
                  <div className="bk-offer-title">Instant Food — Hot &amp; Ready</div>
                  <div className="bk-offer-sub">Maggi, MTR Poha &amp; more</div>
                </div>
                <span className="bk-offer-emoji">🍜</span>
              </div>
            </div>

            {/* Trust Bar */}
            <div className="bk-info-bar">
              <div className="bk-info-item"><div className="bk-info-val">🛡️ Verified</div><div className="bk-info-label">Products</div></div>
              <div className="bk-info-item"><div className="bk-info-val">🪑 Seat</div><div className="bk-info-label">Delivery</div></div>
              <div className="bk-info-item"><div className="bk-info-val">🥇 50+</div><div className="bk-info-label">Items</div></div>
            </div>

            <ProductSection title="🔥 Bestsellers" products={PRODUCTS.best} cart={cart} onAdd={addToCart} onRemove={removeFromCart} />
            <ProductSection title="🍿 Snacks & Munchies" products={PRODUCTS.snacks} cart={cart} onAdd={addToCart} onRemove={removeFromCart} scrollable />
            <ProductSection title="🍜 Instant Food" products={PRODUCTS.instantfood} cart={cart} onAdd={addToCart} onRemove={removeFromCart} />
            <ProductSection title="🥤 Beverages" products={PRODUCTS.drinks} cart={cart} onAdd={addToCart} onRemove={removeFromCart} scrollable />
            <ProductSection title="💊 Pharma & Wellness" products={PRODUCTS.pharma} cart={cart} onAdd={addToCart} onRemove={removeFromCart} />
            <ProductSection title="🧴 Hygiene & Care" products={PRODUCTS.hygiene} cart={cart} onAdd={addToCart} onRemove={removeFromCart} scrollable />
            <ProductSection title="🎒 Travel Essentials" products={PRODUCTS.essentials} cart={cart} onAdd={addToCart} onRemove={removeFromCart} />
          </>
        )}
      </main>

      {/* CART BAR */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div className="bk-cart-bar"
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          >
            <div className="bk-cart-inner" onClick={() => setCartOpen(true)}>
              <div className="bk-cart-left">
                <span className="bk-cart-items">
                  {totalItems} item{totalItems > 1 ? 's' : ''}
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', display: 'inline-block' }} />
                  ₹{totalPrice + 5}
                </span>
                <span className="bk-cart-sub">Extra charges may apply</span>
              </div>
              <div className="bk-cart-action">View Cart <ChevronRight size={16} /></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
