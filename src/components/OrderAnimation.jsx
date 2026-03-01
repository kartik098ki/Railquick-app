import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Package, Truck, Utensils } from 'lucide-react'

const OrderAnimation = ({ onComplete }) => {
    const [step, setStep] = useState(0)

    useEffect(() => {
        const timer1 = setTimeout(() => setStep(1), 2500)
        const timer2 = setTimeout(() => setStep(2), 5000)
        const timer3 = setTimeout(() => setStep(3), 7500)
        const timer4 = setTimeout(() => onComplete(), 10000)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
            clearTimeout(timer3)
            clearTimeout(timer4)
        }
    }, [onComplete])

    const steps = [
        { label: 'Payment Successful', sub: 'Your order has been placed', icon: <CheckCircle2 size={40} />, color: '#0C831F' },
        { label: 'Essentials being packed', sub: 'Our partner is picking your items', icon: <Package size={40} />, color: '#FFD203' },
        { label: 'Partner is on the way', sub: 'Rushing to Coach B4, Seat 24', icon: <Truck size={40} />, color: '#0C831F' },
        { label: 'Arriving at your seat', sub: 'Please keep your PNR ready', icon: <Utensils size={40} />, color: '#0C831F' }
    ]

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'white',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            textAlign: 'center'
        }}>
            <motion.div
                key={step}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    width: '140px',
                    height: '140px',
                    borderRadius: '70px',
                    background: steps[step].color === '#FFD203' ? '#FFFBEB' : '#EBF7EE',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: steps[step].color,
                    marginBottom: '40px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                }}
            >
                {steps[step].icon}
            </motion.div>

            <motion.div
                key={`text-${step}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1C1C1C', marginBottom: '8px' }}>
                    {steps[step].label}
                </h2>
                <p style={{ fontSize: '15px', color: '#666', marginBottom: '32px' }}>
                    {steps[step].sub}
                </p>
            </motion.div>

            <div style={{ display: 'flex', gap: '6px', width: '100%', maxWidth: '240px' }}>
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: '4px',
                            borderRadius: '2px',
                            background: i <= step ? '#0C831F' : '#EEE',
                            transition: 'background 0.4s ease'
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default OrderAnimation
