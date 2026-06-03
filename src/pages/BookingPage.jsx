// ============================================================
// WavyGo — Dedicated Booking Page
// ============================================================

import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  MapPin,
  Calendar,
  Clock,
  Shield,
  HelpCircle,
  CreditCard,
  Check,
  ChevronRight,
  ArrowLeft,
  Lock,
  Phone,
  Mail,
  FileText,
  Star,
  Activity,
} from 'lucide-react'
import { getVehicleById } from '../services/vehicleService'
import { createBooking } from '../services/bookingService'
import { cities } from '../data/mockData'
import './BookingPage.css'

export default function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Booking Form Inputs
  const [pickupCity, setPickupCity] = useState('Bangalore')
  const [startDate, setStartDate] = useState('')
  const [pickupTime, setPickupTime] = useState('10:00')
  const [endDate, setEndDate] = useState('')
  const [returnTime, setReturnTime] = useState('18:00')
  const [agreedToRequirements, setAgreedToRequirements] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [bookingSubmitLoading, setBookingSubmitLoading] = useState(false)

  // Tooltip State
  const [activeTooltip, setActiveTooltip] = useState(null)

  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(location.search)
    const qStart = params.get('startDate')
    const qEnd = params.get('endDate')

    if (qStart) setStartDate(qStart)
    if (qEnd) setEndDate(qEnd)

    const fetchVehicle = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getVehicleById(id)
        if (!data) {
          setError('Ride not found')
        } else {
          setVehicle(data)
        }
      } catch {
        setError('Failed to load ride details.')
      } finally {
        setLoading(false)
      }
    }
    fetchVehicle()
  }, [id, location.search])

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0]
  }

  // Duration computation
  const calculateDuration = () => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diff = end - start
    if (diff < 0) return 0
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
  }

  const duration = calculateDuration()

  // Fees Breakdown (Maximum ₹50)
  const FEES = {
    platform: 20,
    convenience: 15,
    service: 10,
    processing: 5,
  }
  const totalAdditionalCharges = FEES.platform + FEES.convenience + FEES.service + FEES.processing // exactly 50

  const baseRent = vehicle ? vehicle.price * duration : 0
  const taxableAmount = duration > 0 ? baseRent + totalAdditionalCharges : 0
  const gstAmount = Number((taxableAmount * 0.18).toFixed(2))
  const rentalTotal = Number((taxableAmount + gstAmount).toFixed(2))
  const securityDeposit = 500
  const totalAmountPayable = duration > 0 ? Number((rentalTotal + securityDeposit).toFixed(2)) : 0

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault()

    if (duration <= 0) {
      toast.error('Please select valid rental dates.')
      return
    }

    if (!agreedToRequirements) {
      toast.error('You must verify driving requirements checklist.')
      return
    }

    setBookingSubmitLoading(true)
    try {
      await createBooking({
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        vehicleImage: vehicle.image,
        pricePerDay: vehicle.price,
        startDate,
        endDate,
        pickupTime,
        returnTime,
        pickupLocation: pickupCity,
        duration,
        totalPrice: totalAmountPayable,
        paymentMethod,
        status: 'Confirmed',
      })

      toast.success('Payment Successful! Booking Confirmed! 🎉')
      navigate('/dashboard')
    } catch {
      toast.error('Booking checkout failed. Please try again.')
    } finally {
      setBookingSubmitLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="booking-page-loading">
        <div className="spinner spinner-dark" />
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="booking-page-error">
        <div className="container text-center">
          <ArrowLeft size={24} style={{ marginBottom: '16px', color: 'var(--color-danger)' }} />
          <h2>Booking Error</h2>
          <p>{error || 'Vehicle not found'}</p>
          <Link to="/vehicles" className="btn btn-primary mt-md">Back to Vehicle List</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="booking-checkout-page">
      <div className="container">
        {/* Breadcrumb navigation */}
        <div className="booking-breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <ChevronRight size={14} />
          <Link to="/vehicles" className="breadcrumb-link">Vehicles</Link>
          <ChevronRight size={14} />
          <Link to={`/vehicles/${vehicle.id}`} className="breadcrumb-link">{vehicle.name}</Link>
          <ChevronRight size={14} />
          <span className="breadcrumb-active">Checkout</span>
        </div>

        {/* Header */}
        <div className="booking-header">
          <h1>Secure Booking Checkout</h1>
          <p>Complete your booking details and confirm your ride instantly.</p>
        </div>

        {/* ── Two Column Page Layout ── */}
        <div className="booking-layout">
          {/* Left Column: Form & Details */}
          <div className="booking-main">
            <form onSubmit={handleCheckoutSubmit} className="booking-form-sections">
              
              {/* SECTION 1: Trip Details */}
              <div className="booking-card-section">
                <h2>1. Trip Details</h2>
                <div className="booking-form-grid">
                  <div className="booking-input-wrapper full-width">
                    <label htmlFor="city-select">Pickup Location</label>
                    <div className="booking-input-icon-container">
                      <MapPin className="booking-icon" size={18} />
                      <select
                        id="city-select"
                        value={pickupCity}
                        onChange={(e) => setPickupCity(e.target.value)}
                        className="booking-select"
                      >
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pickup date & time */}
                  <div className="booking-input-wrapper">
                    <label htmlFor="pickup-date">Pickup Date</label>
                    <div className="booking-input-icon-container">
                      <Calendar className="booking-icon" size={18} />
                      <input
                        type="date"
                        id="pickup-date"
                        value={startDate}
                        min={getTodayString()}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="booking-date-input"
                      />
                    </div>
                  </div>

                  <div className="booking-input-wrapper">
                    <label htmlFor="pickup-time">Pickup Time</label>
                    <div className="booking-input-icon-container">
                      <Clock className="booking-icon" size={18} />
                      <input
                        type="time"
                        id="pickup-time"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        required
                        className="booking-date-input"
                      />
                    </div>
                  </div>

                  {/* Return date & time */}
                  <div className="booking-input-wrapper">
                    <label htmlFor="return-date">Return Date</label>
                    <div className="booking-input-icon-container">
                      <Calendar className="booking-icon" size={18} />
                      <input
                        type="date"
                        id="return-date"
                        value={endDate}
                        min={startDate || getTodayString()}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className="booking-date-input"
                      />
                    </div>
                  </div>

                  <div className="booking-input-wrapper">
                    <label htmlFor="return-time">Return Time</label>
                    <div className="booking-input-icon-container">
                      <Clock className="booking-icon" size={18} />
                      <input
                        type="time"
                        id="return-time"
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}
                        required
                        className="booking-date-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Requirements & Specifications checklist */}
              <div className="booking-card-section">
                <h2>2. Included Features &amp; Requirements</h2>
                <div className="booking-check-grid">
                  {/* Included features */}
                  <div className="booking-check-column">
                    <h3>Included With Ride</h3>
                    <ul className="booking-features-list">
                      <li>
                        <Check className="check-success" size={16} />
                        <span>Sanitized Helmet (Boot locked)</span>
                      </li>
                      <li>
                        <Check className="check-success" size={16} />
                        <span>Anti-Theft Active GPS tracker</span>
                      </li>
                      <li>
                        <Check className="check-success" size={16} />
                        <span>Comprehensive 3rd Party Insurance</span>
                      </li>
                      <li>
                        <Check className="check-success" size={16} />
                        <span>{vehicle.type === 'Electric' ? 'Fast charger standard in boot' : 'Full fuel tank at delivery'}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Rider requirements */}
                  <div className="booking-check-column">
                    <h3>Rider Eligibility</h3>
                    <ul className="booking-features-list text-muted">
                      <li>
                        <Check className="check-success" size={16} />
                        <span>Minimum age of 18 years old</span>
                      </li>
                      <li>
                        <Check className="check-success" size={16} />
                        <span>Original, active Driving License</span>
                      </li>
                      <li>
                        <Check className="check-success" size={16} />
                        <span>Consent to mandatory helmet wear</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="booking-acceptance-alert">
                  <label className="booking-checkbox-label-card">
                    <input
                      type="checkbox"
                      checked={agreedToRequirements}
                      onChange={(e) => setAgreedToRequirements(e.target.checked)}
                      className="booking-checkbox-native"
                    />
                    <span className="booking-checkbox-custom-box">
                      <Check size={12} strokeWidth={3} className="booking-check-svg" />
                    </span>
                    <span className="booking-checkbox-text-card">
                      I verify that I hold an original Driving License and meet the age requirements to operate this {vehicle.type.toLowerCase()}.
                    </span>
                  </label>
                </div>
              </div>

              {/* SECTION 3: GST Transparency ("How Your Total is Calculated") */}
              <div className="booking-card-section">
                <h2>3. How Your Total is Calculated</h2>
                <p className="booking-section-desc">We operate with 100% cost transparency. Here is the step-by-step calculation formula used by our servers:</p>
                <div className="booking-formula-card">
                  <div className="booking-formula-row">
                    <div className="formula-part">
                      <span className="formula-label">Base Rent</span>
                      <span className="formula-math">₹{vehicle.price} × {duration > 0 ? duration : 0} days</span>
                    </div>
                    <span className="formula-operator">+</span>
                    <div className="formula-part">
                      <span className="formula-label">Additional Charges</span>
                      <span className="formula-math">₹{totalAdditionalCharges} (Capped fee)</span>
                    </div>
                    <span className="formula-operator">=</span>
                    <div className="formula-part highlight">
                      <span className="formula-label">Taxable Amount</span>
                      <span className="formula-math">₹{taxableAmount}</span>
                    </div>
                  </div>

                  <div className="booking-formula-row mt-sm">
                    <div className="formula-part">
                      <span className="formula-label">Taxable Amount</span>
                      <span className="formula-math">₹{taxableAmount}</span>
                    </div>
                    <span className="formula-operator">×</span>
                    <div className="formula-part">
                      <span className="formula-label">GST Rate</span>
                      <span className="formula-math">18% Standard</span>
                    </div>
                    <span className="formula-operator">=</span>
                    <div className="formula-part highlight">
                      <span className="formula-label">GST Taxes</span>
                      <span className="formula-math">₹{gstAmount}</span>
                    </div>
                  </div>

                  <div className="booking-formula-row mt-sm">
                    <div className="formula-part">
                      <span className="formula-label">Taxable Amount + GST</span>
                      <span className="formula-math">₹{taxableAmount} + ₹{gstAmount}</span>
                    </div>
                    <span className="formula-operator">+</span>
                    <div className="formula-part">
                      <span className="formula-label">Refundable Deposit</span>
                      <span className="formula-math">₹{securityDeposit} (Returned)</span>
                    </div>
                    <span className="formula-operator">=</span>
                    <div className="formula-part total">
                      <span className="formula-label">Final Payable</span>
                      <span className="formula-math">₹{totalAmountPayable}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Trust Policies */}
              <div className="booking-card-section">
                <h2>4. Safe Ride Trust Guarantees</h2>
                <div className="booking-trust-grid">
                  <div className="booking-trust-card">
                    <Shield size={20} className="trust-icon" />
                    <div>
                      <h4>Refundable Deposit Timeline</h4>
                      <p>The ₹500 security deposit is automatically refunded within 5–7 business days after vehicle inspection.</p>
                    </div>
                  </div>

                  <div className="booking-trust-card">
                    <Activity size={20} className="trust-icon" />
                    <div>
                      <h4>Flexible Cancellation Policy</h4>
                      <p>Enjoy a 100% refund for cancellations up to 24 hours prior. 50% refund from 12-24 hours prior. No refunds under 6 hours.</p>
                    </div>
                  </div>

                  <div className="booking-trust-card">
                    <Lock size={20} className="trust-icon" />
                    <div>
                      <h4>PCI DSS Secure Gateway</h4>
                      <p>Your payment transaction is secured by end-to-end standard token routing and zero plaintext storage protocols.</p>
                    </div>
                  </div>

                  <div className="booking-trust-card">
                    <Phone size={20} className="trust-icon" />
                    <div>
                      <h4>24/7 Roadside Assistance</h4>
                      <p>Encountered issues? Reach out to support@wavygo.in or compliance helpline +91 99999 99999 for instant relief.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 5: Payment Method */}
              <div className="booking-card-section">
                <h2>5. Secure Payment Checkout</h2>
                <p className="booking-section-desc">Select your preferred payment channel to settle the rental deposit transaction:</p>
                <div className="booking-payments-radio-group">
                  <label className={`booking-payment-card ${paymentMethod === 'upi' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment-method"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="booking-radio-native"
                    />
                    <div className="payment-card-content">
                      <span className="payment-radio-custom" />
                      <div className="payment-info">
                        <strong>Instant UPI Settle</strong>
                        <p>Pay instantly with GPay, PhonePe, or Paytm UPI nodes.</p>
                      </div>
                    </div>
                  </label>

                  <label className={`booking-payment-card ${paymentMethod === 'card' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment-method"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="booking-radio-native"
                    />
                    <div className="payment-card-content">
                      <span className="payment-radio-custom" />
                      <div className="payment-info">
                        <strong>Credit / Debit Cards</strong>
                        <p>Visa, MasterCard, or RuPay tokens accepted securely.</p>
                      </div>
                    </div>
                  </label>

                  <label className={`booking-payment-card ${paymentMethod === 'netbanking' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="payment-method"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                      className="booking-radio-native"
                    />
                    <div className="payment-card-content">
                      <span className="payment-radio-custom" />
                      <div className="payment-info">
                        <strong>Direct Net Banking</strong>
                        <p>Settle instantly from HDFC, ICICI, SBI, or other major banks.</p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Submit Checkout Action Button */}
                <button
                  type="submit"
                  className={`btn btn-primary btn-lg w-full mt-lg booking-submit-btn ${
                    !agreedToRequirements || duration <= 0 || bookingSubmitLoading ? 'btn-disabled' : ''
                  }`}
                  disabled={!agreedToRequirements || duration <= 0 || bookingSubmitLoading}
                >
                  {bookingSubmitLoading ? (
                    <>
                      <span className="spinner" style={{ marginRight: '8px' }} />
                      Processing Settle...
                    </>
                  ) : (
                    <>
                      <Lock size={18} style={{ marginRight: '8px' }} />
                      Pay &amp; Confirm Booking (₹{duration > 0 ? totalAmountPayable : '0'})
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Sticky Booking Summary Sidebar */}
          <aside className="booking-sidebar">
            <div className="booking-summary-card">
              
              {/* Bike Preview */}
              <div className="booking-summary-bike">
                <img
                  src={vehicle.image || '/images/activa-6g.webp'}
                  alt={vehicle.name}
                  className="summary-bike-img"
                />
                <div className="summary-bike-info">
                  <h3>{vehicle.name}</h3>
                  <span className="badge badge-mint">{vehicle.type}</span>
                  <div className="summary-rating">
                    <Star size={14} fill="#F59E0B" color="#F59E0B" />
                    <span>{vehicle.rating} ({vehicle.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Trip details overview */}
              <div className="booking-summary-trip-details">
                <div className="summary-trip-row">
                  <MapPin size={16} />
                  <span>Pickup City: <strong>{pickupCity}</strong></span>
                </div>
                <div className="summary-trip-row">
                  <Calendar size={16} />
                  <span>
                    Duration: <strong>{duration > 0 ? `${duration} days` : 'Not Selected'}</strong>
                  </span>
                </div>
                {startDate && endDate && (
                  <div className="summary-trip-dates">
                    <div>
                      <span>Pickup:</span>
                      <strong>{startDate} at {pickupTime}</strong>
                    </div>
                    <div>
                      <span>Return:</span>
                      <strong>{endDate} at {returnTime}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Highly Transparent pricing breakdown */}
              <div className="booking-summary-pricing">
                <h3>Pricing Breakdown</h3>
                
                <div className="pricing-rows-group">
                  {/* Base Rent */}
                  <div className="pricing-breakdown-row">
                    <span>Base Rent ({duration > 0 ? duration : 0} days)</span>
                    <span>₹{baseRent}</span>
                  </div>

                  {/* Platform fee breakdown (Capped at ₹50) */}
                  <div className="pricing-fee-section">
                    <div className="fee-section-header">
                      <span>Additional Platform Charges</span>
                      <span className="fee-total">₹{totalAdditionalCharges}</span>
                    </div>

                    <div className="fee-items-list">
                      {/* Platform Fee */}
                      <div className="fee-item">
                        <div className="fee-item-label">
                          <span>Platform Fee</span>
                          <div
                            className="fee-tooltip-trigger"
                            onMouseEnter={() => setActiveTooltip('platform')}
                            onMouseLeave={() => setActiveTooltip(null)}
                          >
                            <HelpCircle size={13} />
                            <AnimatePresence>
                              {activeTooltip === 'platform' && (
                                <motion.div
                                  className="fee-tooltip-bubble"
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 8 }}
                                >
                                  Contributes to hosting, updates, and maintenance of our secure cloud server infrastructure.
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <span>₹{FEES.platform}</span>
                      </div>

                      {/* Convenience Fee */}
                      <div className="fee-item">
                        <div className="fee-item-label">
                          <span>Convenience Fee</span>
                          <div
                            className="fee-tooltip-trigger"
                            onMouseEnter={() => setActiveTooltip('convenience')}
                            onMouseLeave={() => setActiveTooltip(null)}
                          >
                            <HelpCircle size={13} />
                            <AnimatePresence>
                              {activeTooltip === 'convenience' && (
                                <motion.div
                                  className="fee-tooltip-bubble"
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 8 }}
                                >
                                  Covers payment processing charges levied by UPI, credit card networks, and net banking nodes.
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <span>₹{FEES.convenience}</span>
                      </div>

                      {/* Service Fee */}
                      <div className="fee-item">
                        <div className="fee-item-label">
                          <span>Service Fee</span>
                          <div
                            className="fee-tooltip-trigger"
                            onMouseEnter={() => setActiveTooltip('service')}
                            onMouseLeave={() => setActiveTooltip(null)}
                          >
                            <HelpCircle size={13} />
                            <AnimatePresence>
                              {activeTooltip === 'service' && (
                                <motion.div
                                  className="fee-tooltip-bubble"
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 8 }}
                                >
                                  Covers physical bike checks, helmet sanitation, and 24/7 emergency roadside backup services.
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <span>₹{FEES.service}</span>
                      </div>

                      {/* Digital Processing Fee */}
                      <div className="fee-item">
                        <div className="fee-item-label">
                          <span>Processing Fee</span>
                          <div
                            className="fee-tooltip-trigger"
                            onMouseEnter={() => setActiveTooltip('processing')}
                            onMouseLeave={() => setActiveTooltip(null)}
                          >
                            <HelpCircle size={13} />
                            <AnimatePresence>
                              {activeTooltip === 'processing' && (
                                <motion.div
                                  className="fee-tooltip-bubble"
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 8 }}
                                >
                                  Covers document processing, driver KYC audit verification, and digital receipt generation.
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        <span>₹{FEES.processing}</span>
                      </div>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="pricing-breakdown-row highlight border-top">
                    <span>Subtotal (Taxable)</span>
                    <span>₹{taxableAmount}</span>
                  </div>

                  {/* GST */}
                  <div className="pricing-breakdown-row">
                    <span>GST (18% Standard)</span>
                    <span>₹{gstAmount}</span>
                  </div>

                  {/* Rental Total */}
                  <div className="pricing-breakdown-row highlight border-top">
                    <span>Rental Total</span>
                    <span>₹{rentalTotal}</span>
                  </div>

                  {/* Security Deposit */}
                  <div className="pricing-breakdown-row border-top">
                    <div className="deposit-label">
                      <span>Refundable Security Deposit</span>
                      <span className="deposit-badge">Refundable</span>
                    </div>
                    <span>₹{securityDeposit}</span>
                  </div>

                  {/* Total Amount Payable */}
                  <div className="pricing-breakdown-row total-row">
                    <span>Total Amount Payable</span>
                    <span>₹{totalAmountPayable}</span>
                  </div>
                </div>

              </div>

              {/* Secure payment assurance */}
              <div className="booking-checkout-assurance-card">
                <Lock size={14} />
                <span>100% Encrypted checkout transaction.</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
