import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin,
  Calendar,
  Bike,
  BadgeIndianRupee,
  ShieldCheck,
  Smartphone,
  Leaf,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import CountUp from '../components/CountUp'
import { stats } from '../data/mockData'
import './HomePage.css'

const heroStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const heroChild = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const howItWorks = [
  {
    step: 1,
    title: 'Search Location',
    desc: 'Enter your city or allow GPS to find bikes near you.',
    icon: MapPin,
  },
  {
    step: 2,
    title: 'Book Your Dates',
    desc: 'Pick your dates, compare prices, and confirm your booking.',
    icon: Calendar,
  },
  {
    step: 3,
    title: 'Ride & Return',
    desc: 'Pick up your ride, explore the city, and return it hassle-free.',
    icon: Bike,
  },
]

const whyCards = [
  {
    title: 'Transparent Pricing',
    desc: 'No hidden charges. What you see is what you pay.',
    icon: BadgeIndianRupee,
    highlight: false,
  },
  {
    title: 'Verified Vendors',
    desc: 'Every vendor is KYC-verified and rated by real riders.',
    icon: ShieldCheck,
    highlight: false,
  },
  {
    title: 'Digital-First',
    desc: 'Pay with UPI, cards, or wallets. No cash needed.',
    icon: Smartphone,
    highlight: false,
  },
  {
    title: 'Pan-India Presence',
    desc: 'Available in 10+ cities and expanding fast across India.',
    icon: MapPin,
    highlight: true,
  },
  {
    title: 'EV-Focused Ecosystem',
    desc: 'Leading the charge toward greener urban mobility.',
    icon: Leaf,
    highlight: false,
  },
]

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="home">
      {/* ── Hero Section ──────────────────────────── */}
      <section className="home-hero">
        <div className="home-hero-bg" />
        <div className="home-hero-pattern" />
        <div className="container home-hero-inner">
          <motion.div
            className="home-hero-content"
            variants={heroStagger}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={heroChild}>
              <span className="badge badge-mint home-hero-badge">
                <Sparkles size={14} />
                Connecting India's Streets
              </span>
            </motion.div>
            <motion.h1 variants={heroChild} className="home-hero-title">
              Book Bikes & EVs{' '}
              <span className="home-hero-title-accent">Instantly.</span>
            </motion.h1>
            <motion.p variants={heroChild} className="home-hero-subtitle">
              Discover affordable, eco-friendly rides near you. WavyGo connects
              riders with verified bike vendors across India.
            </motion.p>
            <motion.div variants={heroChild} className="home-hero-actions">
              <Link to="/vehicles" className="btn btn-primary btn-lg">
                For Riders
                <ArrowRight size={18} />
              </Link>
              <button
                className="btn btn-outline btn-lg"
                onClick={() => scrollToSection('why-wavygo')}
              >
                For Smart Cities
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            className="home-hero-visual"
            variants={heroChild}
            initial="hidden"
            animate="visible"
            style={{ translateY: scrollY * 0.08 }}
          >
            <div className="home-hero-glow" />
            <svg
              className="home-hero-scooter"
              viewBox="0 0 400 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Scooter body */}
              <ellipse cx="200" cy="280" rx="160" ry="12" fill="rgba(26,77,46,0.06)" />
              <path d="M90 230 C90 230, 110 160, 160 150 L280 150 C300 150, 320 170, 310 210 L300 230" stroke="#1A4D2E" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M160 150 L180 110 C185 100, 195 95, 205 95 L240 95 C250 95, 255 100, 252 110 L240 150" stroke="#1A4D2E" strokeWidth="5" strokeLinecap="round" fill="none" />
              {/* Handlebar */}
              <path d="M240 95 L260 75 M250 85 L270 80" stroke="#1A4D2E" strokeWidth="4" strokeLinecap="round" />
              {/* Seat */}
              <path d="M140 148 Q180 130 240 148" stroke="#4CAF7D" strokeWidth="8" strokeLinecap="round" fill="none" />
              {/* Wheels */}
              <circle cx="110" cy="240" r="34" stroke="#1A4D2E" strokeWidth="6" fill="none" />
              <circle cx="110" cy="240" r="12" fill="#4CAF7D" />
              <circle cx="300" cy="240" r="34" stroke="#1A4D2E" strokeWidth="6" fill="none" />
              <circle cx="300" cy="240" r="12" fill="#4CAF7D" />
              {/* Electric bolt */}
              <path d="M195 170 L185 195 L200 195 L190 220" stroke="#4CAF7D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {/* Fender */}
              <path d="M70 225 Q110 200 150 225" stroke="#1A4D2E" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M260 225 Q300 200 340 225" stroke="#1A4D2E" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Speed lines */}
              <line x1="50" y1="180" x2="25" y2="180" stroke="#4CAF7D" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              <line x1="55" y1="200" x2="20" y2="200" stroke="#4CAF7D" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
              <line x1="55" y1="160" x2="30" y2="160" stroke="#4CAF7D" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Strip ───────────────────────────── */}
      <ScrollReveal>
        <section className="home-stats">
          <div className="container home-stats-inner">
            {stats.map((stat, i) => (
              <div className="home-stat" key={stat.label}>
                <span className="home-stat-value">
                  <CountUp
                    end={stat.raw}
                    duration={1.5}
                    suffix={stat.label === 'App Rating' ? '★' : '+'}
                  />
                </span>
                <span className="home-stat-label">{stat.label}</span>
                {i < stats.length - 1 && <div className="home-stat-divider" />}
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ── How It Works ──────────────────────────── */}
      <section className="section home-how">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <h2>How It Works</h2>
              <p>Renting a bike has never been this easy</p>
            </div>
          </ScrollReveal>
          <div className="home-how-grid">
            {howItWorks.map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.15}>
                <div className="home-how-card">
                  <div className="home-how-number">{item.step}</div>
                  <div className="home-how-icon">
                    <item.icon size={28} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why WavyGo ────────────────────────────── */}
      <section className="section" id="why-wavygo">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <h2>Why WavyGo?</h2>
              <p>Built different from the ground up</p>
            </div>
          </ScrollReveal>
          <div className="home-why-grid">
            {whyCards.map((card, i) => (
              <ScrollReveal key={card.title} delay={i * 0.1}>
                <div
                  className={`home-why-card ${card.highlight ? 'home-why-card--highlight' : ''}`}
                >
                  <div className="home-why-icon">
                    <card.icon size={24} />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────── */}
      <ScrollReveal>
        <section className="home-cta">
          <div className="container home-cta-inner">
            <Bike size={48} className="home-cta-icon" />
            <h2>Own a bike? List it on WavyGo</h2>
            <p>Start earning passive income by listing your vehicle on our platform</p>
            <Link to="/dashboard" className="btn btn-white btn-lg">
              Become a Host
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
