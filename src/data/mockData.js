// ============================================================
// WavyGo — Centralized Mock Data
// ============================================================
// Backend dev replaces this file's exports with real API responses.
// All dummy data lives here — NO hardcoded data in components.

// ── Vehicles ──────────────────────────────────────────────
export const vehicles = [
  {
    id: 1,
    name: "Honda Activa 6G",
    type: "Scooter",
    price: 150,
    rating: 4.5,
    reviews: 128,
    tag: "For Commute",
    available: true,
    image: "/images/activa-6g.webp",
  },
  {
    id: 2,
    name: "Ather 450X Gen 3",
    type: "Electric",
    price: 200,
    rating: 4.8,
    reviews: 214,
    tag: "Electric Vehicles",
    available: true,
    image: "/images/ather-450x.webp",
  },
  {
    id: 3,
    name: "Ola S1 Pro",
    type: "Electric",
    price: 180,
    rating: 4.7,
    reviews: 189,
    tag: "Electric Vehicles",
    available: false,
    image: "/images/ola-s1-pro.webp",
  },
  {
    id: 4,
    name: "TVS Jupiter",
    type: "Scooter",
    price: 140,
    rating: 4.3,
    reviews: 95,
    tag: "Weekend Getaway",
    available: true,
    image: "/images/tvs-jupiter.webp",
  },
  {
    id: 5,
    name: "Royal Enfield Classic 350",
    type: "Motorcycle",
    price: 400,
    rating: 4.9,
    reviews: 302,
    tag: "Weekend Getaway",
    available: true,
    image: "/images/royal-enfield-classic-350.webp",
  },
  {
    id: 6,
    name: "Bajaj Chetak EV",
    type: "Electric",
    price: 160,
    rating: 4.6,
    reviews: 143,
    tag: "Electric Vehicles",
    available: true,
    image: "/images/bajaj-chetak-ev.webp",
  },
]

// ── User ──────────────────────────────────────────────────
export const user = {
  name: "Rohan",
  email: "rohan@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan",
  totalRides: 12,
  kmDriven: 348,
  co2Saved: "27kg",
  ecoPoints: 540,
  bookings: [],
}

// ── Homepage Stats ─────────────────────────────────────────
export const stats = [
  { label: "Bikes Listed", value: "500+", raw: 500 },
  { label: "Happy Vendors", value: "50+", raw: 50 },
  { label: "Cities Active", value: "10+", raw: 10 },
  { label: "App Rating", value: "4.8★", raw: 4.8 },
]

// ── Locations Dropdown (Signup) ────────────────────────────
export const cities = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Jaipur",
]
