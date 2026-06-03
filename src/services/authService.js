// ============================================================
// WavyGo — Auth Service
// ============================================================

import apiClient from './apiClient'
import { USE_MOCK_DATA } from '../config/env'
import { saveToken, removeToken, saveUser, removeUser } from '../utils/auth'

export const loginUser = async (email, password) => {
  // TODO: Connect to POST /api/auth/login
  if (!USE_MOCK_DATA) {
    const { data } = await apiClient.post('/auth/login', { email, password })
    if (data.token) {
      saveToken(data.token)
    }
    return data
  }

  // Simulate 600ms network delay
  await new Promise((resolve) => setTimeout(resolve, 600))
  
  // Look up matching user from registered users in localStorage
  const registeredUsersStr = localStorage.getItem('wavygo_registered_users')
  const registeredUsers = registeredUsersStr ? JSON.parse(registeredUsersStr) : []
  let matchedUser = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase())
  
  if (!matchedUser) {
    // If logging in with Rohan's email, fallback to default mock user
    if (email.toLowerCase() === 'rohan@example.com') {
      matchedUser = {
        name: 'Rohan',
        email: 'rohan@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
        totalRides: 12,
        kmDriven: 348,
        co2Saved: '27kg',
        ecoPoints: 540,
      }
    } else {
      // Create a default profile matching this email
      const defaultName = email.split('@')[0]
      const capitalizedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1)
      matchedUser = {
        name: capitalizedName,
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(capitalizedName)}`,
        totalRides: 0,
        kmDriven: 0,
        co2Saved: '0kg',
        ecoPoints: 0,
      }
    }
  }

  const mockResponse = {
    success: true,
    token: 'mock-jwt-token-abc123',
    user: matchedUser,
  }
  
  saveToken(mockResponse.token)
  saveUser(matchedUser)
  return mockResponse
}

export const signupUser = async (formData) => {
  // TODO: Connect to POST /api/auth/signup
  if (!USE_MOCK_DATA) {
    const { data } = await apiClient.post('/auth/signup', formData)
    if (data.token) {
      saveToken(data.token)
    }
    return data
  }

  // Simulate 600ms network delay
  await new Promise((resolve) => setTimeout(resolve, 600))
  
  const newUser = {
    name: formData.fullName,
    email: formData.email,
    phone: formData.phone || '',
    city: formData.city || '',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.fullName)}`,
    totalRides: 0,
    kmDriven: 0,
    co2Saved: '0kg',
    ecoPoints: 0,
  }

  // Add to registered users store in localStorage
  const registeredUsersStr = localStorage.getItem('wavygo_registered_users')
  const registeredUsers = registeredUsersStr ? JSON.parse(registeredUsersStr) : []
  
  if (!registeredUsers.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase())) {
    registeredUsers.push(newUser)
    localStorage.setItem('wavygo_registered_users', JSON.stringify(registeredUsers))
  }
  
  const mockResponse = {
    success: true,
    token: 'mock-jwt-token-xyz789',
    message: 'Account created successfully',
  }
  
  saveToken(mockResponse.token)
  saveUser(newUser)
  return mockResponse
}

export const logoutUser = () => {
  removeToken()
  removeUser()
}


