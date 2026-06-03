// ============================================================
// WavyGo — Booking Service
// ============================================================

import apiClient from './apiClient'
import { USE_MOCK_DATA } from '../config/env'

export const createBooking = async (bookingData) => {
  // TODO: Connect to POST /api/bookings
  if (!USE_MOCK_DATA) {
    return (await apiClient.post('/bookings', bookingData)).data
  }

  // Simulate 600ms network delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  // Retrieve current bookings list
  const saved = localStorage.getItem('wavygo_bookings')
  const bookings = saved ? JSON.parse(saved) : []

  // Add the new booking
  const newBooking = {
    id: Math.floor(Math.random() * 1000000),
    ...bookingData,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  }

  bookings.push(newBooking)
  localStorage.setItem('wavygo_bookings', JSON.stringify(bookings))

  return {
    success: true,
    booking: newBooking,
  }
}
