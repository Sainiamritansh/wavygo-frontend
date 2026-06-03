// ============================================================
// WavyGo — Available Vehicles Page
// ============================================================
// Filterable vehicle card grid with skeleton loading,
// location banner, and booking CTA sections.

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getVehicles } from '../services/vehicleService'
import { createBooking } from '../services/bookingService'
import SkeletonCard from '../components/SkeletonCard'
import ScrollReveal from '../components/ScrollReveal'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  MapPin,
  Star,
  Bike,
  Zap,
  CircleDot,
  Calendar,
  Search,
  ArrowRight,
  X,
} from 'lucide-react'
import './VehiclesPage.css'

// ── Constants ────────────────────────────────────────────────
const FILTER_TAGS = ['All', 'For Commute', 'Electric Vehicles', 'Weekend Getaway']

const TYPE_ICON_MAP = {
  Motorcycle: Bike,
  Electric: Zap,
  Scooter: CircleDot,
}

const TYPE_GRADIENT_CLASS = {
  Scooter: 'vehicles-card__image-area--scooter',
  Electric: 'vehicles-card__image-area--electric',
  Motorcycle: 'vehicles-card__image-area--motorcycle',
}

const STEPS = [
  {
    icon: Search,
    number: 'Step 1',
    title: 'Search',
    desc: 'Browse vehicles near you and pick one that fits your ride.',
  },
  {
    icon: Calendar,
    number: 'Step 2',
    title: 'Book',
    desc: 'Select dates, confirm your booking instantly.',
  },
  {
    icon: Bike,
    number: 'Step 3',
    title: 'Ride',
    desc: 'Pick up your ride and hit the road — simple as that.',
  },
]

// ── Animation Variants ───────────────────────────────────────
const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, delay: i * 0.06, ease: 'easeOut' },
  }),
  exit: { opacity: 0, y: -12, scale: 0.96, transition: { duration: 0.25 } },
}

// ── Vehicle Card ─────────────────────────────────────────────
const VehicleCard = ({ vehicle, index, onBook }) => {
  const IconComponent = TYPE_ICON_MAP[vehicle.type] || CircleDot
  const gradientClass = TYPE_GRADIENT_CLASS[vehicle.type] || ''
  const isElectric = vehicle.type === 'Electric'

  return (
    <motion.div
      className={`vehicles-card ${!vehicle.available ? 'vehicles-card--unavailable' : ''}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      layout
    >
      {/* Unavailable Overlay */}
      {!vehicle.available && (
        <div className="vehicles-card__unavailable-overlay">
          <span className="badge badge-danger">Currently Unavailable</span>
        </div>
      )}

      {/* Wrapping the primary card content in a Link to Details page */}
      <Link to={`/vehicles/${vehicle.id}`} className="vehicles-card__link">
        {/* Image Area */}
        <div className={`vehicles-card__image-area ${gradientClass}`}>
          {vehicle.image ? (
            <img src={vehicle.image} alt={vehicle.name} className="vehicles-card__image" />
          ) : (
            <IconComponent size={64} strokeWidth={1.2} />
          )}
          <div className="vehicles-card__type-badge">
            {isElectric ? (
              <span className="badge badge-mint">
                <Zap size={12} /> Electric
              </span>
            ) : (
              <span className="vehicles-card__badge-grey">{vehicle.type}</span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="vehicles-card__body" style={{ paddingBottom: 8 }}>
          <h3 className="vehicles-card__name">{vehicle.name}</h3>

          <div className="vehicles-card__rating">
            <Star size={16} fill="#F59E0B" color="#F59E0B" />
            <span className="vehicles-card__rating-value">{vehicle.rating}</span>
            <span className="vehicles-card__rating-count">
              ({vehicle.reviews} reviews)
            </span>
          </div>
        </div>
      </Link>

      {/* Card Footer with action button */}
      <div className="vehicles-card__body" style={{ paddingTop: 0 }}>
        <div className="vehicles-card__footer">
          <div className="vehicles-card__price">
            ₹{vehicle.price}<span>/day</span>
          </div>
          <button
            className={`btn btn-primary btn-sm ${!vehicle.available ? 'btn-disabled' : ''}`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (vehicle.available) {
                onBook(vehicle)
              }
            }}
            disabled={!vehicle.available}
          >
            {vehicle.available ? 'Book Now' : 'Unavailable'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Vehicles Page ────────────────────────────────────────────
const VehiclesPage = () => {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')

  // Location auto-hide states
  const [showLocationBanner, setShowLocationBanner] = useState(true)
  const [bannerLoading, setBannerLoading] = useState(false)

  // Booking Modal States
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [bookingSubmitLoading, setBookingSubmitLoading] = useState(false)

  // Fetch vehicles on mount with 400ms skeleton delay
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getVehicles()
        // Show skeleton for at least 400ms
        await new Promise((resolve) => setTimeout(resolve, 400))
        setVehicles(data)
      } catch (err) {
        setError('Failed to load vehicles. Please try again.')
        toast.error('Could not fetch vehicles')
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [])

  // Date validation helper for input min values (prevent past dates)
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0]
  }

  // Calculate rental duration in days (inclusive of start day)
  const calculateDuration = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diff = end - start
    if (diff < 0) return 0
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
  }

  const duration = calculateDuration()
  const estimatedTotal = selectedVehicle ? duration * selectedVehicle.price : 0

  // Filter vehicles
  const filteredVehicles =
    activeFilter === 'All'
      ? vehicles
      : vehicles.filter((v) => v.tag === activeFilter)

  const handleFilterChange = (tag) => {
    setActiveFilter(tag)
  }

  const handleLocationAccess = async () => {
    setBannerLoading(true)
    // Simulate nearby vehicles loading state of 800ms
    await new Promise((resolve) => setTimeout(resolve, 800))
    toast.success('Nearby vehicles loaded! 📍')
    setBannerLoading(false)
    setShowLocationBanner(false) // Triggers Framer Motion collapse transition
  }

  // Submit booking (redirect to dedicated checkout booking page)
  const handleBookingSubmit = (e) => {
    e.preventDefault()

    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.')
      return
    }

    if (startDate < getTodayString()) {
      toast.error('Start date cannot be in the past.')
      return
    }

    if (endDate < startDate) {
      toast.error('End date cannot be before start date.')
      return
    }

    // Redirect to the dedicated Booking Page with prefilled query parameters
    navigate(`/booking/${selectedVehicle.id}?startDate=${startDate}&endDate=${endDate}`)
    setSelectedVehicle(null)
  }

  return (
    <div className="vehicles-page">
      {/* ── 1. Location Banner (with auto-hide and height collapse) ── */}
      <AnimatePresence>
        {showLocationBanner && (
          <motion.section
            className="vehicles-location-banner"
            initial={{ opacity: 1, height: 'auto' }}
            exit={{
              opacity: 0,
              height: 0,
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: 0,
              marginBottom: 0,
              transition: { duration: 0.3, ease: 'easeInOut' },
            }}
            style={{ overflow: 'hidden' }}
          >
            <div className="container vehicles-location-inner">
              <div className="vehicles-location-info">
                <MapPin size={18} />
                <span>Showing vehicles near your location</span>
              </div>
              <button
                className={`btn btn-ghost btn-sm ${bannerLoading ? 'btn-disabled' : ''}`}
                onClick={handleLocationAccess}
                disabled={bannerLoading}
              >
                {bannerLoading ? (
                  <>
                    <span className="spinner" style={{ marginRight: '6px' }} />
                    Loading...
                  </>
                ) : (
                  'Show Vehicles Near Me'
                )}
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── 2. Filter Tags ──────────────────────────────── */}
      <section className="vehicles-filters">
        <div className="container">
          <div className="vehicles-filters-row">
            {FILTER_TAGS.map((tag) => (
              <button
                key={tag}
                className={`vehicles-filter-tag ${
                  activeFilter === tag ? 'vehicles-filter-tag--active' : ''
                }`}
                onClick={() => handleFilterChange(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Vehicle Cards Grid ───────────────────────── */}
      <section className="vehicles-grid-section">
        <div className="container">
          <div className="vehicles-grid">
            <AnimatePresence mode="wait">
              {loading ? (
                // Skeleton loading state
                Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={`skeleton-${i}`} />
                ))
              ) : error ? (
                // Error state
                <motion.div
                  className="vehicles-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key="error"
                >
                  <Search className="vehicles-empty__icon" />
                  <h3>Oops, something went wrong</h3>
                  <p>{error}</p>
                </motion.div>
              ) : filteredVehicles.length === 0 ? (
                // Empty state
                <motion.div
                  className="vehicles-empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key="empty"
                >
                  <Search className="vehicles-empty__icon" />
                  <h3>No vehicles found</h3>
                  <p>Try selecting a different filter to see more rides.</p>
                </motion.div>
              ) : (
                // Vehicle cards
                filteredVehicles.map((vehicle, i) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    index={i}
                    onBook={setSelectedVehicle}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── 4. Booking Flow Modal (Framer Motion scale-in overlay) ── */}
      <AnimatePresence>
        {selectedVehicle && (
          <div className="booking-modal-overlay">
            <motion.div
              className="booking-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="booking-modal__header">
                <h2>Book Your Ride</h2>
                <button
                  className="booking-modal__close"
                  onClick={() => setSelectedVehicle(null)}
                  aria-label="Close booking modal"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="booking-modal__body">
                {/* Vehicle Mini-Preview */}
                <div className="booking-modal__preview">
                  {selectedVehicle.image ? (
                    <img
                      src={selectedVehicle.image}
                      alt={selectedVehicle.name}
                      className="booking-modal__preview-img"
                    />
                  ) : (
                    <div className="booking-modal__preview-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ccc' }}>
                      <Bike size={32} />
                    </div>
                  )}
                  <div className="booking-modal__preview-info">
                    <h3>{selectedVehicle.name}</h3>
                    <div className="booking-modal__preview-price">
                      ₹{selectedVehicle.price} <span style={{ fontWeight: 400, fontSize: '13px', color: 'var(--color-text-muted)' }}>/ day</span>
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <form className="booking-modal__form" onSubmit={handleBookingSubmit}>
                  <div className="booking-modal__form-row">
                    <div className="booking-modal__input-group">
                      <label htmlFor="startDate">Start Date</label>
                      <input
                        type="date"
                        id="startDate"
                        className="booking-modal__input"
                        value={startDate}
                        min={getTodayString()}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="booking-modal__input-group">
                      <label htmlFor="endDate">End Date</label>
                      <input
                        type="date"
                        id="endDate"
                        className="booking-modal__input"
                        value={endDate}
                        min={startDate || getTodayString()}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Summary Box */}
                  {duration > 0 && (
                    <div className="booking-modal__summary">
                      <div className="booking-modal__summary-row">
                        <span>Daily Rate</span>
                        <span>₹{selectedVehicle.price}</span>
                      </div>
                      <div className="booking-modal__summary-row">
                        <span>Duration</span>
                        <span>{duration} days</span>
                      </div>
                      <div className="booking-modal__summary-row booking-modal__summary-row--total">
                        <span>Estimated Total</span>
                        <span>₹{estimatedTotal}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="booking-modal__actions">
                    <button
                      type="button"
                      className="btn booking-modal__btn-cancel"
                      onClick={() => setSelectedVehicle(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`btn btn-primary booking-modal__btn-submit ${
                        bookingSubmitLoading ? 'btn-disabled' : ''
                      }`}
                      disabled={bookingSubmitLoading}
                    >
                      {bookingSubmitLoading ? <span className="spinner" /> : 'Confirm Booking'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── 6. Book in 3 Simple Steps ───────────────────── */}
      <section className="vehicles-steps">
        <div className="container">
          <ScrollReveal>
            <div className="section-header">
              <h2>Book in 3 Simple Steps</h2>
              <p>Getting on the road has never been easier</p>
            </div>
          </ScrollReveal>

          <div className="vehicles-steps-grid">
            {STEPS.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 0.15}>
                <div className="vehicles-step-card">
                  <div className="vehicles-step-icon">
                    <step.icon size={24} />
                  </div>
                  <div className="vehicles-step-number">{step.number}</div>
                  <h3 className="vehicles-step-title">{step.title}</h3>
                  <p className="vehicles-step-desc">{step.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA Banner ───────────────────────────────── */}
      <section className="vehicles-cta">
        <div className="container">
          <ScrollReveal>
            <div className="vehicles-cta-inner">
              <h2>Own a bike? List it on WavyGo</h2>
              <p>
                Turn your idle bike into income. Join our growing host community today.
              </p>
              <Link to="/dashboard" className="btn btn-white btn-lg">
                Become a Host <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

export default VehiclesPage
