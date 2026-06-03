import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Bike,
  PlusCircle,
  Leaf,
  Sparkles,
  Navigation,
  ArrowRight,
  Calendar,
} from 'lucide-react'
import CountUp from '../components/CountUp'
import { getUserProfile, getUserStats, getUserBookings } from '../services/userService'
import './DashboardPage.css'

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function DashboardPage() {
  // TODO: Connect to GET /api/user/profile — replace mock with apiClient.get('/user/profile')
  const [profile, setProfile] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [bookings, setBookings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([getUserProfile(), getUserStats(), getUserBookings()])
      .then(([p, s, b]) => {
        setProfile(p)
        setUserStats(s)
        setBookings(b)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner spinner-dark" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-loading">
        <p>Something went wrong. Please try again.</p>
      </div>
    )
  }

  const statCards = [
    { label: 'Total Rides', value: userStats?.totalRides || 0, icon: Bike, isNumber: true },
    { label: 'KM Driven', value: userStats?.kmDriven || 0, icon: Navigation, isNumber: true },
    { label: 'CO₂ Saved', value: userStats?.co2Saved || '0kg', icon: Leaf, isNumber: false },
    { label: 'Eco Points', value: userStats?.ecoPoints || 0, icon: Sparkles, isNumber: true },
  ]

  return (
    <div className="dashboard">
      <div className="container">
        {/* ── Welcome Banner ────────────────────────── */}
        <motion.div
          className="dashboard-welcome"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="dashboard-welcome-text">
            <h1>Welcome back, {profile?.name} 👋</h1>
            <p>Check your latest activity and upcoming rides</p>
          </div>
          <img
            src={profile?.avatar}
            alt={`${profile?.name}'s avatar`}
            className="dashboard-avatar"
          />
        </motion.div>

        {/* ── Action Cards ──────────────────────────── */}
        <motion.div
          className="dashboard-actions"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="dashboard-action-card dashboard-action-ride" variants={fadeUp}>
            <Bike size={48} strokeWidth={1.5} />
            <h3>Ready to Ride?</h3>
            <p>Find available bikes near you</p>
            <Link to="/vehicles" className="btn btn-white">
              Browse Bikes
              <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div className="dashboard-action-card dashboard-action-host" variants={fadeUp}>
            <PlusCircle size={48} strokeWidth={1.5} />
            <h3>List Your Vehicle</h3>
            <p>Start earning by listing your vehicle</p>
            <button
              className="btn btn-white"
              onClick={() => toast('Host onboarding coming soon! 🚀')}
            >
              Become a Host
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </motion.div>

        {/* ── My Bookings ───────────────────────────── */}
        <motion.section
          className="dashboard-bookings"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="dashboard-bookings-header">
            <h2>My Bookings</h2>
            <span className="dashboard-bookings-viewall">View all →</span>
          </div>

          {bookings && bookings.length > 0 ? (
            <div className="dashboard-bookings-grid">
              {bookings.map((booking) => (
                <div key={booking.id} className="dashboard-booking-card">
                  {booking.vehicleImage ? (
                    <img
                      src={booking.vehicleImage}
                      alt={booking.vehicleName}
                      className="dashboard-booking-img"
                    />
                  ) : (
                    <div className="dashboard-booking-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Bike size={32} />
                    </div>
                  )}
                  <div className="dashboard-booking-details">
                    <h3>{booking.vehicleName}</h3>
                    <div className="dashboard-booking-meta">
                      <span className="dashboard-booking-date">
                        <Calendar size={14} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
                        {booking.startDate} to {booking.endDate}
                      </span>
                      <span className="dashboard-booking-duration">
                        ({booking.duration} days)
                      </span>
                    </div>
                    <div className="dashboard-booking-price-row">
                      <span className="dashboard-booking-total-price">
                        Total Paid: <strong>₹{booking.totalPrice}</strong>
                      </span>
                      <span className="badge badge-mint">{booking.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              <svg
                className="dashboard-empty-illustration"
                viewBox="0 0 200 160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Simple bicycle illustration */}
                {/* Back wheel */}
                <circle cx="55" cy="120" r="30" stroke="#4CAF7D" strokeWidth="3" fill="none" />
                <circle cx="55" cy="120" r="4" fill="#4CAF7D" />
                {/* Front wheel */}
                <circle cx="145" cy="120" r="30" stroke="#4CAF7D" strokeWidth="3" fill="none" />
                <circle cx="145" cy="120" r="4" fill="#4CAF7D" />
                {/* Frame */}
                <path d="M55 120 L90 75 L130 75 L145 120" stroke="#1A4D2E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M90 75 L75 120" stroke="#1A4D2E" strokeWidth="3" strokeLinecap="round" fill="none" />
                <path d="M110 75 L145 120" stroke="#1A4D2E" strokeWidth="3" strokeLinecap="round" fill="none" />
                {/* Seat */}
                <path d="M85 72 L98 72" stroke="#1A4D2E" strokeWidth="4" strokeLinecap="round" />
                {/* Handlebar */}
                <path d="M128 70 L135 65 M130 75 L140 72" stroke="#1A4D2E" strokeWidth="3" strokeLinecap="round" />
                {/* Pedal */}
                <circle cx="110" cy="108" r="6" stroke="#4CAF7D" strokeWidth="2" fill="none" />
                {/* Spokes suggestion */}
                <line x1="55" y1="90" x2="55" y2="96" stroke="#4CAF7D" strokeWidth="1" opacity="0.5" />
                <line x1="55" y1="144" x2="55" y2="150" stroke="#4CAF7D" strokeWidth="1" opacity="0.5" />
                <line x1="25" y1="120" x2="31" y2="120" stroke="#4CAF7D" strokeWidth="1" opacity="0.5" />
                <line x1="79" y1="120" x2="85" y2="120" stroke="#4CAF7D" strokeWidth="1" opacity="0.5" />
                <line x1="145" y1="90" x2="145" y2="96" stroke="#4CAF7D" strokeWidth="1" opacity="0.5" />
                <line x1="145" y1="144" x2="145" y2="150" stroke="#4CAF7D" strokeWidth="1" opacity="0.5" />
                <line x1="115" y1="120" x2="121" y2="120" stroke="#4CAF7D" strokeWidth="1" opacity="0.5" />
                <line x1="169" y1="120" x2="175" y2="120" stroke="#4CAF7D" strokeWidth="1" opacity="0.5" />
              </svg>
              <h3>No rides yet</h3>
              <p>Your booking history will appear here once you complete your first ride.</p>
              <Link to="/vehicles" className="btn btn-primary">
                Browse Bikes
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </motion.section>

        {/* ── Stats Row ─────────────────────────────── */}
        <motion.div
          className="dashboard-stats"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {statCards.map((stat) => (
            <motion.div className="dashboard-stat-card" key={stat.label} variants={fadeUp}>
              <div className="dashboard-stat-icon">
                <stat.icon size={22} />
              </div>
              <span className="dashboard-stat-value">
                {stat.isNumber ? (
                  <CountUp end={stat.value} duration={1.2} />
                ) : (
                  stat.value
                )}
              </span>
              <span className="dashboard-stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
