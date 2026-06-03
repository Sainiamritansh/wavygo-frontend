import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Github, Twitter, Instagram, Linkedin } from 'lucide-react'
import './Footer.css'

const Footer = () => {
  const handleComingSoon = (label) => {
    toast(`${label} — coming soon!`)
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-brand-logo">WavyGo</div>
            <p className="footer-brand-tagline">
              Green mobility for India's streets
            </p>
          </div>

          {/* Company */}
          <div className="footer-column">
            <h4 className="footer-column-title">Company</h4>
            <div className="footer-column-links">
              <button
                className="footer-link"
                onClick={() => handleComingSoon('About')}
              >
                About
              </button>
              <button
                className="footer-link"
                onClick={() => handleComingSoon('Careers')}
              >
                Careers
              </button>
              <button
                className="footer-link"
                onClick={() => handleComingSoon('Contact')}
              >
                Contact
              </button>
            </div>
          </div>

          {/* Legal */}
          <div className="footer-column">
            <h4 className="footer-column-title">Legal</h4>
            <div className="footer-column-links">
              <Link to="/terms" className="footer-link">
                Terms &amp; Conditions
              </Link>
              <button
                className="footer-link"
                onClick={() => handleComingSoon('Privacy Policy')}
              >
                Privacy Policy
              </button>
            </div>
          </div>

          {/* Recognition */}
          <div className="footer-column">
            <h4 className="footer-column-title">Recognition</h4>
            <div className="footer-column-links">
              <button
                className="footer-link"
                onClick={() => handleComingSoon('Awards')}
              >
                Awards
              </button>
              <button
                className="footer-link"
                onClick={() => handleComingSoon('Press')}
              >
                Press
              </button>
              <button
                className="footer-link"
                onClick={() => handleComingSoon('Partners')}
              >
                Partners
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; 2026 WavyGo. All rights reserved.
          </p>
          <div className="footer-socials">
            <a
              href="#"
              className="footer-social-icon"
              aria-label="GitHub"
              onClick={(e) => e.preventDefault()}
            >
              <Github size={18} />
            </a>
            <a
              href="#"
              className="footer-social-icon"
              aria-label="Twitter"
              onClick={(e) => e.preventDefault()}
            >
              <Twitter size={18} />
            </a>
            <a
              href="#"
              className="footer-social-icon"
              aria-label="Instagram"
              onClick={(e) => e.preventDefault()}
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              className="footer-social-icon"
              aria-label="LinkedIn"
              onClick={(e) => e.preventDefault()}
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
