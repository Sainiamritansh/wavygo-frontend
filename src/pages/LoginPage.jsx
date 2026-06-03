import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { loginUser } from '../services/authService'
import './LoginPage.css'

const LoginPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter a valid email address'
    }
    if (!form.password.trim()) {
      newErrors.password = 'Password is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await loginUser(form.email, form.password)
      toast.success('Welcome back! 🎉')
      navigate('/dashboard')
    } catch {
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    toast('Password reset link sent to your email!', { icon: '📧' })
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    toast.success('Signed in with Google! 🎉')
    navigate('/dashboard')
  }

  return (
    <div className="login-page">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="login-logo">WavyGo</div>

        <h1 className="login-heading">Welcome Back 👋</h1>
        <p className="login-subtext">Log in to access your rides and bookings</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
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
              autoComplete="email"
            />
            <label className="floating-label">Email address</label>
            {errors.email && <span className="input-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className={`input-group ${errors.password ? 'has-error' : ''}`}>
            <Lock size={18} className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className={`input-field login-password-input ${errors.password ? 'error' : ''}`}
              placeholder=" "
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <label className="floating-label">Password</label>
            <button
              type="button"
              className="login-eye-toggle"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && <span className="input-error">{errors.password}</span>}
          </div>

          {/* Forgot password */}
          <div className="login-forgot-row">
            <button type="button" className="login-forgot-link" onClick={handleForgotPassword}>
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`btn btn-primary login-submit-btn ${loading ? 'btn-disabled' : ''}`}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">or</div>

        {/* Google */}
        <button
          className={`btn btn-outline login-google-btn ${googleLoading ? 'btn-disabled' : ''}`}
          onClick={handleGoogleLogin}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <span className="spinner spinner-dark" />
          ) : (
            <>
              <svg className="login-google-icon" viewBox="0 0 24 24" width="20" height="20">
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

        {/* Footer links */}
        <p className="login-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="login-footer-link">
            Sign Up
          </Link>
        </p>
        <Link to="/terms" className="login-terms-link">
          Terms & Privacy
        </Link>
      </motion.div>
    </div>
  )
}

export default LoginPage
