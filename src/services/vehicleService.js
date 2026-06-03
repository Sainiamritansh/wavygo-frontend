// ============================================================
// WavyGo — Vehicle Service
// ============================================================

import apiClient from './apiClient'
import { USE_MOCK_DATA } from '../config/env'
import { vehicles } from '../data/mockData'

export const getVehicles = async () => {
  if (!USE_MOCK_DATA) {
    return (await apiClient.get('/vehicles')).data
  }
  return vehicles
}

export const getVehicleById = async (id) => {
  // TODO: Connect to GET /api/vehicles/:id
  if (!USE_MOCK_DATA) {
    return (await apiClient.get(`/vehicles/${id}`)).data
  }
  return vehicles.find((v) => v.id === Number(id))
}

export const getVehiclesByTag = async (tag) => {
  if (!USE_MOCK_DATA) {
    return (await apiClient.get(`/vehicles?tag=${tag}`)).data
  }
  if (tag === 'All') return vehicles
  return vehicles.filter((v) => v.tag === tag)
}

