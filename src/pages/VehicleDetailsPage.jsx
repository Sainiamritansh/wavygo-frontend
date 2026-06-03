// ============================================================
// WavyGo — Vehicle Details Page
// ============================================================

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Star,
  MapPin,
  Shield,
  Zap,
  Navigation,
  CheckCircle,
  Clock,
  ArrowLeft,
  Calendar,
  AlertCircle,
  ChevronRight,
  MessageSquare,
} from 'lucide-react'
import { getVehicleById } from '../services/vehicleService'
import { createBooking } from '../services/bookingService'
import './VehicleDetailsPage.css'

const MOCK_REVIEWS = [
  {
    id: 1,
    name: 'Amit Patel',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
    rating: 5,
    date: 'May 28, 2026',
    comment: 'Vehicle was in perfect condition. Extremely clean, fully charged battery, and the pickup host was very polite. Absolute value for money!',
  },
  {
    id: 2,
    name: 'Sneha Rao',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
    rating: 4,
    date: 'May 15, 2026',
    comment: 'Great mileage and very comfortable for city rides. The helmet provided was clean too. Minor scratches on the side panel but ran smoothly.',
  },
  {
    id: 3,
    name: 'Vikram Singh',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    rating: 5,
    date: 'April 30, 2026',
    comment: 'Super easy pickup and return flow. The electric charging was super fast. Saved so much on my daily commute in Bangalore!',
  },
]

export default function VehicleDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Booking Card States
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  // Gallery active index state
  const [activeImgIdx, setActiveImgIdx] = useState(0)

  // Mobile drawer booking state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getVehicleById(id)
        if (!data) {
          setError('Vehicle not found')
        } else {
          setVehicle(data)
        }
      } catch {
        setError('Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchVehicle()
  }, [id])

  if (loading) {
    return (
      <div className="details-loading">
        <div className="spinner spinner-dark" />
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="details-error-container">
        <div className="container text-center">
          <AlertCircle size={48} className="details-error-icon" />
          <h2>{error || 'Vehicle not found'}</h2>
          <p>We couldn't retrieve the details for this ride. It might be rented out or unavailable.</p>
          <Link to="/vehicles" className="btn btn-primary mt-lg">
            <ArrowLeft size={16} /> Back to Vehicles
          </Link>
        </div>
      </div>
    )
  }

  // Create sub-gallery images from the main one
  const galleryImages = [
    vehicle.image || '/images/activa-6g.webp',
    vehicle.image || '/images/activa-6g.webp',
    vehicle.image || '/images/activa-6g.webp',
  ]

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0]
  }

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diff = end - start
    if (diff < 0) return 0
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
  }

  const duration = calculateDuration()
  const estimatedTotal = duration * vehicle.price

  const handleBookingSubmit = (e) => {
    if (e) e.preventDefault()

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

    setMobileDrawerOpen(false)
    navigate(`/booking/${vehicle.id}?startDate=${startDate}&endDate=${endDate}`)
  }

  const isElectric = vehicle.type === 'Electric'

  return (
    <div className="vehicle-details-page">
      <div className="container">
        {/* Navigation Breadcrumbs */}
        <div className="details-breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <ChevronRight size={14} />
          <Link to="/vehicles" className="breadcrumb-link">Vehicles</Link>
          <ChevronRight size={14} />
          <span className="breadcrumb-active">{vehicle.name}</span>
        </div>

        {/* ── Main Layout (Details on left, Sticky Booking on right) ── */}
        <div className="details-layout">
          {/* Left Area */}
          <div className="details-main-content">
            {/* Gallery */}
            <div className="details-gallery">
              <div className="details-gallery-primary">
                <img
                  src={galleryImages[activeImgIdx]}
                  alt={`${vehicle.name} primary angle`}
                  className="details-gallery-img"
                />
              </div>
              <div className="details-gallery-thumbs">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImgIdx(index)}
                    className={`details-gallery-thumb-btn ${activeImgIdx === index ? 'active' : ''}`}
                  >
                    <img src={img} alt={`Angle ${index + 1}`} className="details-gallery-thumb-img" />
                    {index === 1 && <span className="details-thumb-label">Front</span>}
                    {index === 2 && <span className="details-thumb-label">Side</span>}
                    {index === 0 && <span className="details-thumb-label">Studio</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Header info */}
            <div className="details-header-card">
              <div className="details-badge-row">
                <span className={`badge ${isElectric ? 'badge-mint' : 'badge-primary'}`}>
                  {isElectric ? <Zap size={12} style={{ display: 'inline', marginRight: 4 }} /> : null}
                  {vehicle.type}
                </span>
                <span className={`badge ${vehicle.available ? 'badge-mint' : 'badge-danger'}`}>
                  {vehicle.available ? 'Available' : 'Rented Out'}
                </span>
              </div>
              <h1 className="details-vehicle-name">{vehicle.name}</h1>
              <div className="details-rating-row">
                <div className="details-rating-stars">
                  <Star size={18} fill="#F59E0B" color="#F59E0B" />
                  <span className="details-rating-value">{vehicle.rating}</span>
                </div>
                <span className="details-rating-count">({vehicle.reviews} customer reviews)</span>
              </div>
            </div>

            {/* About Section */}
            <section className="details-section">
              <h2 className="details-section-title">About this Ride</h2>
              <p className="details-description">
                Experience high-performance city commuting with the {vehicle.name}. Designed for peak efficiency and exceptional balance, it offers a whisper-quiet engine ride with zero emissions if you choose electric power, and stellar mileage for traditional scoots. Whether you are zipping through rush hour traffic, commuting to the office, or planning a weekend exploring local neighborhoods, this {vehicle.type} provides a hassle-free, comfortable journey.
              </p>
            </section>

            {/* Premium Features Checklist */}
            <section className="details-section">
              <h2 className="details-section-title">Key Specifications</h2>
              <div className="details-features-grid">
                <div className="details-feature-card">
                  <Zap size={22} className="details-feature-icon" />
                  <div>
                    <h3>{isElectric ? 'Eco Battery EV' : 'Fuel Efficient Engine'}</h3>
                    <p>{isElectric ? 'Fast-charging enabled EV battery' : 'Advanced 4-stroke engine standard'}</p>
                  </div>
                </div>
                <div className="details-feature-card">
                  <Navigation size={22} className="details-feature-icon" />
                  <div>
                    <h3>GPS Enabled</h3>
                    <p>Live active anti-theft satellite tracking</p>
                  </div>
                </div>
                <div className="details-feature-card">
                  <CheckCircle size={22} className="details-feature-icon" />
                  <div>
                    <h3>Helmet Included</h3>
                    <p>Clean sanitised safety helmet in boot</p>
                  </div>
                </div>
                <div className="details-feature-card">
                  <Shield size={22} className="details-feature-icon" />
                  <div>
                    <h3>KYC Checked</h3>
                    <p>Verified supplier and clean service record</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Customer Reviews Section */}
            <section className="details-section">
              <h2 className="details-section-title">Rider Reviews</h2>
              <div className="details-reviews-list">
                {MOCK_REVIEWS.map((review) => (
                  <div key={review.id} className="details-review-card">
                    <div className="details-review-header">
                      <div className="details-review-user">
                        <img src={review.avatar} alt={review.name} className="details-review-avatar" />
                        <div>
                          <h4>{review.name}</h4>
                          <span className="details-review-date">{review.date}</span>
                        </div>
                      </div>
                      <div className="details-review-stars">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                        ))}
                      </div>
                    </div>
                    <p className="details-review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Sidebar Booking Card (Desktop) */}
          <aside className="details-sidebar">
            <div className="details-booking-card">
              <div className="details-booking-card-price">
                <span>Price</span>
                <h2>₹{vehicle.price} <span className="details-price-day">/ day</span></h2>
              </div>

              {!vehicle.available ? (
                <div className="details-booking-card-unavailable">
                  <AlertCircle size={20} />
                  <span>Currently Rented Out</span>
                  <p>This ride is currently booked by another rider. Browse other options or check back later!</p>
                  <Link to="/vehicles" className="btn btn-outline btn-sm w-full text-center">
                    Browse Other Rides
                  </Link>
                </div>
              ) : (
                <form className="details-booking-form" onSubmit={handleBookingSubmit}>
                  <div className="details-booking-input-group">
                    <label htmlFor="sidebar-start">Pickup Date</label>
                    <div className="details-input-icon-wrapper">
                      <Calendar size={18} className="details-input-icon" />
                      <input
                        type="date"
                        id="sidebar-start"
                        value={startDate}
                        min={getTodayString()}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="details-booking-input-group">
                    <label htmlFor="sidebar-end">Return Date</label>
                    <div className="details-input-icon-wrapper">
                      <Calendar size={18} className="details-input-icon" />
                      <input
                        type="date"
                        id="sidebar-end"
                        value={endDate}
                        min={startDate || getTodayString()}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Summary cost */}
                  {duration > 0 && (
                    <div className="details-booking-cost-summary">
                      <div className="details-cost-row">
                        <span>Daily Rate</span>
                        <span>₹{vehicle.price}</span>
                      </div>
                      <div className="details-cost-row">
                        <span>Duration</span>
                        <span>{duration} days</span>
                      </div>
                      <div className="details-cost-row total">
                        <span>Estimated Total</span>
                        <span>₹{estimatedTotal}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className={`btn btn-primary w-full details-booking-btn ${bookingLoading ? 'btn-disabled' : ''}`}
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? <span className="spinner" /> : 'Book Now'}
                  </button>
                </form>
              )}

              <div className="details-booking-assurance">
                <Shield size={16} />
                <span>Free cancellation up to 24h prior.</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Mobile Sticky Footer Floating CTA ── */}
      {vehicle.available && (
        <div className="details-mobile-cta-footer">
          <div className="details-mobile-cta-left">
            <span>₹{vehicle.price}/day</span>
            <div className="details-rating-stars-mini">
              <Star size={12} fill="#F59E0B" color="#F59E0B" />
              <span>{vehicle.rating}</span>
            </div>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setMobileDrawerOpen(true)}>
            Book Ride
          </button>
        </div>
      )}

      {/* Mobile Booking Drawer (Slide up overlay) */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="details-mobile-drawer-overlay">
            <motion.div
              className="details-mobile-drawer"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            >
              <div className="details-mobile-drawer-header">
                <h3>Book {vehicle.name}</h3>
                <button className="details-drawer-close" onClick={() => setMobileDrawerOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="details-mobile-drawer-body">
                <form className="details-booking-form" onSubmit={handleBookingSubmit}>
                  <div className="details-booking-input-group">
                    <label htmlFor="drawer-start">Pickup Date</label>
                    <div className="details-input-icon-wrapper">
                      <Calendar size={18} className="details-input-icon" />
                      <input
                        type="date"
                        id="drawer-start"
                        value={startDate}
                        min={getTodayString()}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="details-booking-input-group">
                    <label htmlFor="drawer-end">Return Date</label>
                    <div className="details-input-icon-wrapper">
                      <Calendar size={18} className="details-input-icon" />
                      <input
                        type="date"
                        id="drawer-end"
                        value={endDate}
                        min={startDate || getTodayString()}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {duration > 0 && (
                    <div className="details-booking-cost-summary">
                      <div className="details-cost-row">
                        <span>Price/day</span>
                        <span>₹{vehicle.price}</span>
                      </div>
                      <div className="details-cost-row">
                        <span>Duration</span>
                        <span>{duration} days</span>
                      </div>
                      <div className="details-cost-row total">
                        <span>Estimated Total</span>
                        <span>₹{estimatedTotal}</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className={`btn btn-primary w-full details-booking-btn ${bookingLoading ? 'btn-disabled' : ''}`}
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? <span className="spinner" /> : 'Confirm Reservation'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
