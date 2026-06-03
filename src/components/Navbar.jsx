import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { isLoggedIn } from '../utils/auth'
import './Navbar.css'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleHostClick = () => {
    toast('Host onboarding coming soon!')
    setMobileOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const loggedIn = isLoggedIn()

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          WavyGo
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          <Link
            to="/"
            className={`navbar-link${isActive('/') ? ' active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/vehicles"
            className={`navbar-link${isActive('/vehicles') ? ' active' : ''}`}
          >
            Available Vehicles
          </Link>
          <button
            className="navbar-link"
            onClick={handleHostClick}
          >
            Become a Host
          </button>
          {loggedIn && (
            <Link
              to="/dashboard"
              className={`navbar-link${isActive('/dashboard') ? ' active' : ''}`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          {!loggedIn ? (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </>
          ) : (
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              Dashboard
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <div className={`navbar-mobile-menu${mobileOpen ? ' open' : ''}`}>
          <div className="navbar-mobile-links">
            <Link
              to="/"
              className={`navbar-mobile-link${isActive('/') ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/vehicles"
              className={`navbar-mobile-link${isActive('/vehicles') ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              Available Vehicles
            </Link>
            <button
              className="navbar-mobile-link"
              onClick={handleHostClick}
            >
              Become a Host
            </button>
            {loggedIn && (
              <Link
                to="/dashboard"
                className={`navbar-mobile-link${isActive('/dashboard') ? ' active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
          <div className="navbar-mobile-actions">
            {!loggedIn ? (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline btn-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary btn-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link
                to="/dashboard"
                className="btn btn-primary btn-sm"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
