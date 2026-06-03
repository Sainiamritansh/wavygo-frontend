import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin } from 'lucide-react'
import { signupUser } from '../services/authService'
import { cities } from '../data/mockData'
import './SignupPage.css'

const getPasswordStrength = (password) => {
  if (!password) return { level: 'empty', width: '0%', label: '', color: 'transparent' }
  if (password.length <= 2) return { level: 'weak', width: '25%', label: 'Weak', color: 'var(--color-danger)' }
  if (password.length <= 6) return { level: 'fair', width: '60%', label: 'Fair', color: 'var(--color-warning)' }
  const hasMixed = /[a-z]/.test(password) && (/[A-Z]/.test(password) || /[0-9]/.test(password))
  if (hasMixed) return { level: 'strong', width: '100%', label: 'Strong', color: 'var(--color-success)' }
  return { level: 'fair', width: '60%', label: 'Fair', color: 'var(--color-warning)' }
}

const SignupPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    city: '',
    agreedToTerms: false,
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const strength = getPasswordStrength(form.password)

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return !value.trim() ? 'Full name is required' : ''
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/\S+@\S+\.\S+/.test(value)) return 'Enter a valid email address'
        return ''
      case 'phone':
        if (!value.trim()) return 'Phone number is required'
        if (!/^\d{10}$/.test(value.replace(/\s/g, ''))) return 'Enter a valid 10-digit number'
        return ''
      case 'password':
        return !value.trim() ? 'Password is required' : ''
      case 'city':
        return !value ? 'Please select a city' : ''
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    setForm((prev) => ({ ...prev, [name]: val }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const validateAll = () => {
    const newErrors = {}
    const fields = ['fullName', 'email', 'phone', 'password', 'city']
    fields.forEach((field) => {
      const error = validateField(field, form[field])
      if (error) newErrors[field] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateAll()) return
    setLoading(true)
    try {
      await signupUser({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        city: form.city,
      })
      toast.success('Account created successfully! 🎉')
      navigate('/dashboard')
    } catch {
      toast.error('Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setGoogleLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    toast.success('Signed in with Google! 🎉')
    navigate('/dashboard')
  }

  const isSubmitDisabled = !form.agreedToTerms || loading

  return (
    <div className="signup-page">
      <motion.div
        className="signup-card"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="signup-logo">WavyGo</div>

        <h1 className="signup-heading">Create Your Account 🚀</h1>
        <p className="signup-subtext">Join WavyGo and start riding green</p>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className={`input-group ${errors.fullName ? 'has-error' : ''}`}>
            <User size={18} className="input-icon" />
            <input
              type="text"
              name="fullName"
              className={`input-field ${errors.fullName ? 'error' : ''}`}
              placeholder=" "
              value={form.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
            />
            <label className="floating-label">Full Name</label>
            {errors.fullName && <span className="input-error">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className={`input-group ${errors.email ? 'has-error' : ''}`}>
            <Mail size={18} className="input-icon" />
            <input
              type="email"
              name="email"
              className={`input-field ${errors.email ? 'error' : ''}`}
              placeholder=" "
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
            />
            <label className="floating-label">Email address</label>
            {errors.email && <span className="input-error">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className={`input-group ${errors.phone ? 'has-error' : ''}`}>
            <Phone size={18} className="input-icon" />
            <span className="signup-phone-prefix">+91</span>
            <input
              type="tel"
              name="phone"
              className={`input-field signup-phone-input ${errors.phone ? 'error' : ''}`}
              placeholder=" "
              value={form.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                setForm((prev) => ({ ...prev, phone: val }))
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }))
              }}
              onBlur={handleBlur}
              autoComplete="tel"
              inputMode="numeric"
            />
            <label className="floating-label signup-phone-label">Phone number</label>
            {errors.phone && <span className="input-error">{errors.phone}</span>}
          </div>

          {/* Password */}
          <div className={`input-group ${errors.password ? 'has-error' : ''}`}>
            <Lock size={18} className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className={`input-field signup-password-input ${errors.password ? 'error' : ''}`}
              placeholder=" "
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
            />
            <label className="floating-label">Password</label>
            <button
              type="button"
              className="signup-eye-toggle"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && <span className="input-error">{errors.password}</span>}

            {/* Strength meter */}
            {form.password && (
              <div className="signup-strength">
                <div className="signup-strength-track">
                  <div
                    className="signup-strength-bar"
                    style={{ width: strength.width, backgroundColor: strength.color }}
                  />
                </div>
                <span className="signup-strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* City */}
          <div className={`input-group ${errors.city ? 'has-error' : ''}`}>
            <MapPin size={18} className="input-icon" />
            <select
              name="city"
              className={`input-field signup-city-select ${errors.city ? 'error' : ''} ${!form.city ? 'signup-city-placeholder' : ''}`}
              value={form.city}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="" disabled>
                Select your city
              </option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && <span className="input-error">{errors.city}</span>}
          </div>

          {/* Terms Checkbox */}
          <label className="signup-checkbox-label">
            <input
              type="checkbox"
              name="agreedToTerms"
              checked={form.agreedToTerms}
              onChange={handleChange}
              className="signup-checkbox-input"
            />
            <span className="signup-checkbox-custom">
              <svg viewBox="0 0 14 11" fill="none" className="signup-checkmark-svg">
                <path d="M1 5.5L5 9.5L13 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="signup-checkbox-text">
              I agree to{' '}
              <Link to="/terms" className="signup-checkbox-link">
                Terms &amp; Conditions
              </Link>{' '}
              and{' '}
              <Link to="/terms" className="signup-checkbox-link">
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className={`btn btn-primary signup-submit-btn ${isSubmitDisabled ? 'btn-disabled' : ''}`}
            disabled={isSubmitDisabled}
          >
            {loading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">or</div>

        {/* Google */}
        <button
          className={`btn btn-outline signup-google-btn ${googleLoading ? 'btn-disabled' : ''}`}
          onClick={handleGoogleSignup}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <span className="spinner spinner-dark" />
          ) : (
            <>
              <svg className="signup-google-icon" viewBox="0 0 24 24" width="20" height="20">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* Footer */}
        <p className="signup-footer">
          Already have an account?{' '}
          <Link to="/login" className="signup-footer-link">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default SignupPage
