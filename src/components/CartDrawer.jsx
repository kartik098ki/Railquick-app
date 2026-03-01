import React from 'react'
import { motion } from 'framer-motion'
import { X, ShoppingBag, CreditCard, ChevronRight, Package } from 'lucide-react'

const CartDrawer = ({ items, onClose, onCheckout }) => {
    const itemTotal = items.reduce((sum, item) => sum + item.price, 0)
    const savings = items.reduce((sum, item) => sum + (item.originalPrice - item.price), 0)
    const handlingCharge = 5
    const grandTotal = itemTotal + handlingCharge

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1500,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end'
            }}
        >
            <div onClick={onClose} style={{ position: 'absolute', inset: 0 }} />

            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{
                    background: '#F4F4F4',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px',
                    width: '100%',
                    maxWidth: '480px',
                    height: '90vh',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
            >
                <div style={{ background: 'white', padding: '16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 800 }}>My Cart</h2>
                    <button onClick={onClose} style={{ padding: '8px' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                    {/* Delivery Slot */}
                    <div style={{ background: 'white', borderRadius: '12px', padding: '12px', display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                        <div style={{ background: '#F3F4F6', padding: '8px', borderRadius: '8px' }}>
                            <Package size={20} color="#0C831F" />
                        </div>
                        <div>
                            <p style={{ fontSize: '13px', fontWeight: 700 }}>Delivering in 8 mins</p>
                            <p style={{ fontSize: '11px', color: '#666' }}>Coach B4, Seat 24</p>
                        </div>
                    </div>

                    {items.map((item, idx) => (
                        <div key={idx} style={{ background: 'white', borderRadius: '12px', padding: '12px', display: 'flex', gap: '12px', marginBottom: '12px' }}>
                            <div style={{ width: '60px', height: '60px', background: '#F8F8F8', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '28px' }}>
                                {item.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '13px', fontWeight: 600 }}>{item.name}</h4>
                                <p style={{ fontSize: '11px', color: '#666' }}>{item.variant}</p>
                                <div className="flex justify-between items-center" style={{ marginTop: '4px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 700 }}>₹{item.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Bill Details */}
                    <div style={{ background: 'white', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px' }}>Bill Details</h3>
                        <div className="flex justify-between" style={{ fontSize: '13px', marginBottom: '8px' }}>
                            <span style={{ color: '#444' }}>Item Total</span>
                            <span style={{ fontWeight: 600 }}>₹{itemTotal}</span>
                        </div>
                        <div className="flex justify-between" style={{ fontSize: '13px', marginBottom: '8px' }}>
                            <span style={{ color: '#444' }}>Handling Charge</span>
                            <span style={{ fontWeight: 600 }}>₹{handlingCharge}</span>
                        </div>
                        <div className="flex justify-between" style={{ fontSize: '13px', marginBottom: '12px' }}>
                            <span style={{ color: '#444' }}>Delivery Charge</span>
                            <span style={{ color: '#0C831F', fontWeight: 700 }}>FREE</span>
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '12px 0' }} />
                        <div className="flex justify-between" style={{ fontWeight: 800, fontSize: '16px' }}>
                            <span>Bill Total</span>
                            <span>₹{grandTotal}</span>
                        </div>

                        {savings > 0 && (
                            <div style={{ background: '#EBF7EE', color: '#0C831F', padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, marginTop: '16px', textAlign: 'center' }}>
                                YAY! You saved ₹{savings} on this order
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ padding: '16px', background: 'white', borderTop: '1px solid #eee' }}>
                    <button
                        onClick={onCheckout}
                        style={{
                            width: '100%',
                            background: '#0C831F',
                            color: 'white',
                            padding: '16px',
                            borderRadius: '12px',
                            fontWeight: 800,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div className="flex flex-col items-start">
                            <span>₹{grandTotal}</span>
                            <span style={{ fontSize: '10px', opacity: 0.8 }}>TOTAL</span>
                        </div>
                        <div className="flex items-center gap-1">
                            Proceed to Pay <ChevronRight size={20} />
                        </div>
                    </button>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default CartDrawer
