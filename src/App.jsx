import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import VehiclesPage from './pages/VehiclesPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import TermsPage from './pages/TermsPage'
import DashboardPage from './pages/DashboardPage'
import VehicleDetailsPage from './pages/VehicleDetailsPage'
import BookingPage from './pages/BookingPage'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
}

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-wrapper"
    >
      {children}
    </motion.div>
  )
}

function App() {
  const location = useLocation()

  const isAuthPage = ['/login', '/signup'].includes(location.pathname)

  return (
    <>
      {!isAuthPage && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <HomePage />
              </PageWrapper>
            }
          />
          <Route
            path="/vehicles"
            element={
              <PageWrapper>
                <VehiclesPage />
              </PageWrapper>
            }
          />
          <Route
            path="/vehicles/:id"
            element={
              <PageWrapper>
                <VehicleDetailsPage />
              </PageWrapper>
            }
          />
          <Route
            path="/booking/:id"
            element={
              <PageWrapper>
                <BookingPage />
              </PageWrapper>
            }
          />
          <Route
            path="/login"
            element={
              <PageWrapper>
                <LoginPage />
              </PageWrapper>
            }
          />
          <Route
            path="/signup"
            element={
              <PageWrapper>
                <SignupPage />
              </PageWrapper>
            }
          />
          <Route
            path="/terms"
            element={
              <PageWrapper>
                <TermsPage />
              </PageWrapper>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PageWrapper>
                <DashboardPage />
              </PageWrapper>
            }
          />
        </Routes>
      </AnimatePresence>
      {!isAuthPage && <Footer />}
    </>
  )
}

export default App