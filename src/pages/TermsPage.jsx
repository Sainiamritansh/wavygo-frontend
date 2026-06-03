import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ChevronDown } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ScrollReveal from '../components/ScrollReveal'
import './TermsPage.css'

const sections = [
  {
    id: 'introduction',
    title: '1. Introduction',
    content: [
      {
        text: 'Welcome to WavyGo. These Terms & Conditions govern your access to and use of the WavyGo website, mobile application, and related services. By accessing or using the platform, you agree to comply with and be bound by these Terms. If you do not agree, you must not use our services.',
      },
      {
        text: 'WavyGo acts as an aggregator connecting independent vehicle rental vendors with verified riders. We reserve the right to amend, update, or revise these Terms at any time without prior individual notice. Continued use of the platform constitutes agreement to the updated Terms.',
      },
    ],
  },
  {
    id: 'eligibility',
    title: '2. Eligibility',
    content: [
      {
        text: 'To rent a vehicle through WavyGo, you must be at least 18 years of age and hold a valid, active driving license appropriate for the category of vehicle booked. International riders must possess a valid International Driving Permit (IDP) along with their national license.',
      },
      {
        callout: true,
        text: 'All users must complete mandatory KYC (Know Your Customer) verification by uploading a government-issued photo ID (such as Aadhaar, PAN, or Passport) and their driving license before initiating any booking request.',
      },
    ],
  },
  {
    id: 'vehicle-usage-rules',
    title: '3. Vehicle Usage Rules',
    content: [
      {
        text: 'Rented vehicles must be operated in strict compliance with all local laws and WavyGo policies. You are responsible for the proper care, safe handling, and clean condition of the vehicle throughout the duration of your rental agreement.',
      },
      {
        callout: true,
        text: 'Prohibited actions include: operating the vehicle under the influence of alcohol or drugs, street racing, off-road driving, carrying hazardous materials, and sub-leasing or transferring the vehicle to any unverified third-party riders.',
      },
      {
        text: 'Riders must respect local speed limits and operate within set regional geo-fences. Violations of usage boundaries or reckless driving habits will result in an immediate penalty and potential account suspension.',
      },
    ],
  },
  {
    id: 'booking-policy',
    title: '4. Booking Policy',
    content: [
      {
        text: 'Bookings are confirmed only upon receipt of full reservation payment and successful validation of driver credentials. All bookings are non-transferable and correspond to a specific chosen vehicle category.',
      },
      {
        text: 'Active rental extensions must be requested through the mobile app at least 3 hours prior to the scheduled return time. Extensions are subject to vehicle availability and will be charged at standard daily rates.',
      },
    ],
  },
  {
    id: 'cancellation-policy',
    title: '5. Cancellation Policy',
    content: [
      {
        text: 'WavyGo operates a transparent tier-based cancellation refund structure to protect both riders and vehicle vendors. Cancellations must be initiated directly through your user dashboard inside the app.',
      },
      {
        callout: true,
        text: 'Cancellations made 24 hours or more before the pickup time receive a full 100% refund. Cancellations between 12 to 24 hours prior are eligible for a 50% refund. No refunds are issued for cancellations requested less than 6 hours prior to pickup or in case of a no-show.',
      },
    ],
  },
  {
    id: 'payment-policy',
    title: '6. Payment Policy',
    content: [
      {
        text: 'All payments are processed securely through our PCI DSS-compliant partner gateways using UPI, credit/debit cards, or net banking. WavyGo does not store sensitive card PINs or CVVs on our servers.',
      },
      {
        callout: true,
        text: 'A fully refundable security deposit of ₹500 to ₹2,000 (varying by vehicle class) is collected at the time of booking. The deposit is refunded back to the source account within 5 to 7 business days following a successful damage inspection upon vehicle return.',
      },
    ],
  },
  {
    id: 'user-responsibilities',
    title: '7. User Responsibilities',
    content: [
      {
        text: 'It is mandatory for both the primary rider and pillion passenger to wear a certified safety helmet at all times when operating the vehicle. Users are solely responsible for paying any traffic violations, parking fines, or toll fees incurred during the active rental period.',
      },
      {
        text: 'Riders must perform a physical inspection of the vehicle prior to driving away. Any pre-existing damage, scratches, or mechanical defects must be documented and reported via the WavyGo app to prevent damage disputes.',
      },
    ],
  },
  {
    id: 'privacy-policy',
    title: '8. Privacy Policy',
    content: [
      {
        text: 'We value your privacy. WavyGo collects personal information including registration profiles, identity records, payment hashes, and ride histories to facilitate safe rental services.',
      },
      {
        callout: true,
        text: 'For the safety and recovery of assets, all WavyGo vehicles are equipped with real-time GPS tracking systems. GPS location data is collected actively during the rental period to monitor vehicle safety and enforce regional geo-fence limits.',
      },
    ],
  },
  {
    id: 'liability-disclaimer',
    title: '9. Liability Disclaimer',
    content: [
      {
        text: 'WavyGo functions as a facilitator platform. We are not liable for direct vehicle breakdowns, vendor defaults, personal injury, property damage, or loss of life resulting from accidents, road hazards, or rider negligence.',
      },
      {
        text: 'In the event of an accident or collision, the rider must first ensure personal safety, contact local emergency services if needed, and immediately file an incident report with WavyGo customer support within 30 minutes of the event.',
      },
    ],
  },
  {
    id: 'contact-information',
    title: '10. Contact Information',
    content: [
      {
        text: 'If you have any questions, clarifications, or disputes regarding these Terms & Conditions or platform operations, please reach out to our legal and customer compliance team.',
      },
      {
        callout: true,
        text: 'Compliance Email: support@wavygo.in | Emergency Helpline: +91 99999 99999 | Corporate Office Address: WavyGo Technologies Pvt. Ltd., Tech Park, Bangalore, KA, India.',
      },
    ],
  },
]

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState(sections[0].id)
  const [expandedMobile, setExpandedMobile] = useState(sections[0].id)
  const [readProgress, setReadProgress] = useState(0)
  const sectionRefs = useRef({})

  // Intersection Observer for sticky sidebar highlights on desktop
  useEffect(() => {
    const observers = []
    sections.forEach((section) => {
      const el = sectionRefs.current[section.id]
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(section.id)
          }
        },
        { rootMargin: '-25% 0px -55% 0px' }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const progress = (window.pageYOffset / totalHeight) * 100
        setReadProgress(progress)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const toggleMobileSection = (id) => {
    setExpandedMobile(expandedMobile === id ? null : id)
  }

  return (
    <div className="terms">
      {/* ── Reading Progress Bar ── */}
      <div className="terms-progress-container">
        <div className="terms-progress-bar" style={{ width: `${readProgress}%` }} />
      </div>

      <div className="container terms-layout">
        {/* Sidebar — Desktop */}
        <aside className="terms-sidebar">
          <h3 className="terms-sidebar-title">Contents</h3>
          <nav className="terms-sidebar-nav">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`terms-sidebar-link ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => scrollToSection(section.id)}
              >
                <span className="terms-sidebar-dot" />
                {section.title}
              </button>
            ))}
          </nav>
          <div className="terms-support-card">
            <Mail size={20} />
            <p>Need help understanding our policies?</p>
            <button
              className="btn btn-primary btn-sm"
              onClick={() =>
                toast.success("Support ticket created! We'll get back to you within 24 hours.")
              }
            >
              Contact Support
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="terms-content">
          <span className="badge badge-mint terms-effective">
            Effective January 1, 2026
          </span>
          <h1 className="terms-title">Terms & Conditions</h1>
          <p className="terms-intro">
            Please read these terms and conditions carefully before using the WavyGo
            platform. By accessing or using our services, you agree to be bound by these
            terms.
          </p>

          {/* Desktop Layout — all sections visible */}
          <div className="terms-sections-desktop">
            {sections.map((section, sIdx) => (
              <ScrollReveal key={section.id}>
                <section
                  className="terms-section"
                  id={section.id}
                  ref={(el) => (sectionRefs.current[section.id] = el)}
                >
                  <div className="terms-section-header">
                    <span className="terms-section-number">{sIdx + 1}</span>
                    <h2>{section.title}</h2>
                  </div>
                  {section.content.map((block, bIdx) =>
                    block.callout ? (
                      <div className="terms-callout" key={bIdx}>
                        <p>{block.text}</p>
                      </div>
                    ) : (
                      <p key={bIdx} className="terms-paragraph">
                        {block.text}
                      </p>
                    )
                  )}
                </section>
              </ScrollReveal>
            ))}
          </div>

          {/* Mobile Experience — Accordion Layout */}
          <div className="terms-sections-mobile">
            {sections.map((section, sIdx) => (
              <div
                className={`terms-accordion ${expandedMobile === section.id ? 'expanded' : ''}`}
                key={section.id}
                ref={(el) => {
                  if (window.innerWidth < 768) sectionRefs.current[section.id] = el
                }}
              >
                <button
                  className="terms-accordion-header"
                  onClick={() => toggleMobileSection(section.id)}
                  aria-expanded={expandedMobile === section.id}
                >
                  <div className="terms-accordion-left">
                    <span className="terms-section-number">{sIdx + 1}</span>
                    <h2>{section.title}</h2>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`terms-accordion-chevron ${expandedMobile === section.id ? 'rotated' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {expandedMobile === section.id && (
                    <motion.div
                      className="terms-accordion-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      {section.content.map((block, bIdx) =>
                        block.callout ? (
                          <div className="terms-callout" key={bIdx}>
                            <p>{block.text}</p>
                          </div>
                        ) : (
                          <p key={bIdx} className="terms-paragraph">
                            {block.text}
                          </p>
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
