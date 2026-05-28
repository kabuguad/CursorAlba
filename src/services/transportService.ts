import { mockGet, mockPost, mockPut, mockDelete, newId } from './mockApi'
import { getDB, mutateDB } from './db'
import type { TransportRoute, Vehicle } from './db'
import { addAudit } from './auditService'

export type { TransportRoute, Vehicle }

export const transportService = {
  listRoutes: () => mockGet(() => getDB().transportRoutes),

  createRoute: (data: Omit<TransportRoute, 'id'>) => mockPost(() => {
    const route: TransportRoute = { id: newId('RTE'), ...data }
    mutateDB(db => { db.transportRoutes.push(route) })
    addAudit({ action: 'CREATE', resource: 'TransportRoute', resourceId: route.id, details: `Route created: ${route.name}` })
    return route
  }),

  updateRoute: (id: string, data: Partial<TransportRoute>) => mockPut(() => {
    let updated: TransportRoute | undefined
    mutateDB(db => {
      const idx = db.transportRoutes.findIndex(r => r.id === id)
      if (idx < 0) throw new Error('Route not found')
      db.transportRoutes[idx] = { ...db.transportRoutes[idx], ...data }
      updated = db.transportRoutes[idx]
    })
    addAudit({ action: 'UPDATE', resource: 'TransportRoute', resourceId: id, details: `Route updated: ${updated?.name}` })
    return updated!
  }),

  deleteRoute: (id: string) => mockDelete(() => {
    mutateDB(db => { db.transportRoutes = db.transportRoutes.filter(r => r.id !== id) })
    addAudit({ action: 'DELETE', resource: 'TransportRoute', resourceId: id, details: 'Route deleted' })
  }),

  listVehicles: () => mockGet(() => getDB().vehicles),

  createVehicle: (data: Omit<Vehicle, 'id'>) => mockPost(() => {
    const v: Vehicle = { id: newId('VEH'), ...data }
    mutateDB(db => { db.vehicles.push(v) })
    addAudit({ action: 'CREATE', resource: 'Vehicle', resourceId: v.id, details: `Vehicle added: ${v.registration}` })
    return v
  }),

  updateVehicle: (id: string, data: Partial<Vehicle>) => mockPut(() => {
    let updated: Vehicle | undefined
    mutateDB(db => {
      const idx = db.vehicles.findIndex(v => v.id === id)
      if (idx < 0) throw new Error('Vehicle not found')
      db.vehicles[idx] = { ...db.vehicles[idx], ...data }
      updated = db.vehicles[idx]
    })
    addAudit({ action: 'UPDATE', resource: 'Vehicle', resourceId: id, details: `Vehicle updated: ${updated?.registration}` })
    return updated!
  }),

  getRouteStudents: (routeId: string) => mockGet(() => {
    return getDB().students.filter(s => s.transportRouteId === routeId && s.status === 'active')
  }),

  assignStudentToRoute: (studentId: string, routeId: string | null) => mockPut(() => {
    mutateDB(db => {
      const s = db.students.find(x => x.id === studentId)
      if (s) s.transportRouteId = routeId
    })
    addAudit({ action: 'UPDATE', resource: 'Student', resourceId: studentId, details: `Transport route → ${routeId ?? 'none'}` })
    return true
  }),

  getStats: () => mockGet(() => {
    const db = getDB()
    return {
      totalRoutes: db.transportRoutes.length,
      activeRoutes: db.transportRoutes.filter(r => r.status === 'active').length,
      totalVehicles: db.vehicles.length,
      vehiclesMaintenance: db.vehicles.filter(v => v.status === 'maintenance').length,
      studentsOnTransport: db.students.filter(s => s.transportRouteId && s.status === 'active').length,
      totalCapacity: db.vehicles.reduce((s, v) => s + v.capacity, 0),
    }
  }),
}
