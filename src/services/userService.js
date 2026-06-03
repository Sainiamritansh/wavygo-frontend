// ============================================================
// WavyGo — User Service
// ============================================================

import apiClient from './apiClient'
import { USE_MOCK_DATA } from '../config/env'
import { user } from '../data/mockData'
import { getUser } from '../utils/auth'

export const getUserProfile = async () => {
  // TODO: Connect to GET /api/user/profile
  if (!USE_MOCK_DATA) {
    return (await apiClient.get('/user/profile')).data
  }
  // Retrieve the dynamically logged in user or fallback to standard mock user
  return getUser() || user
}

export const getUserBookings = async () => {
  // TODO: Connect to GET /api/user/bookings
  if (!USE_MOCK_DATA) {
    return (await apiClient.get('/user/bookings')).data
  }
  // Load dynamic bookings made during this session from localStorage
  const saved = localStorage.getItem('wavygo_bookings')
  return saved ? JSON.parse(saved) : []
}

export const getUserStats = async () => {
  // TODO: Connect to GET /api/user/stats
  if (!USE_MOCK_DATA) {
    return (await apiClient.get('/user/stats')).data
  }
  const u = getUser() || user
  return {
    totalRides: u.totalRides ?? 0,
    kmDriven: u.kmDriven ?? 0,
    co2Saved: u.co2Saved ?? '0kg',
    ecoPoints: u.ecoPoints ?? 0,
  }
}


