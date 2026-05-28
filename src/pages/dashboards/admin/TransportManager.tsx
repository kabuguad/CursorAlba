import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Bus, Plus, Pencil, Trash2, X, Users, Loader2, MapPin, Wrench } from 'lucide-react'
import { useTransportRoutes, useVehicles, useTransportStats, useCreateRoute, useUpdateRoute, useDeleteRoute, useCreateVehicle, useUpdateVehicle } from '../../../hooks/useAdminData'
import { useToast } from '../../../contexts/ToastContext'
import { unwrap } from '../../../services/mockApi'
import type { TransportRoute, Vehicle } from '../../../services/transportService'
import { transportService } from '../../../services/transportService'
import { useQuery } from '@tanstack/react-query'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4 shrink-0">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>, document.body,
  )
}

const BLANK_ROUTE: Omit<TransportRoute, 'id'> = { name: '', description: '', stops: [], vehicleId: null, driverId: null, driverName: '', driverPhone: '', capacity: 35, feePerTerm: 10000, status: 'active' }
const BLANK_VEHICLE: Omit<Vehicle, 'id'> = { registration: '', make: '', model: '', capacity: 40, routeId: null, status: 'active', lastService: '', nextService: '' }

export function TransportManager() {
  const { showToast } = useToast()
  const { data: routes = [], isLoading: routesLoading } = useTransportRoutes()
  const { data: vehicles = [] } = useVehicles()
  const { data: stats } = useTransportStats()
  const createRoute = useCreateRoute()
  const updateRoute = useUpdateRoute()
  const deleteRoute = useDeleteRoute()
  const createVehicle = useCreateVehicle()
  const updateVehicle = useUpdateVehicle()

  const [tab, setTab] = useState<'routes' | 'vehicles'>('routes')
  const [routeForm, setRouteForm] = useState(false)
  const [vehicleForm, setVehicleForm] = useState(false)
  const [editingRoute, setEditingRoute] = useState<TransportRoute | null>(null)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [delConfirm, setDelConfirm] = useState<string | null>(null)
  const [routeDraft, setRouteDraft] = useState<Omit<TransportRoute, 'id'>>(BLANK_ROUTE)
  const [vehicleDraft, setVehicleDraft] = useState<Omit<Vehicle, 'id'>>(BLANK_VEHICLE)
  const [stopInput, setStopInput] = useState('')

  const { data: routeStudents = [] } = useQuery({
    queryKey: ['transport', 'routeStudents', selectedRoute],
    queryFn: () => selectedRoute ? transportService.getRouteStudents(selectedRoute).then(unwrap) : Promise.resolve([]),
    enabled: !!selectedRoute,
  })

  const saveRoute = async () => {
    try {
      if (editingRoute) {
        await updateRoute.mutateAsync({ id: editingRoute.id, data: routeDraft }).then(unwrap)
        showToast('Route updated ✓')
      } else {
        await createRoute.mutateAsync(routeDraft).then(unwrap)
        showToast('Route created ✓')
      }
      setRouteForm(false); setEditingRoute(null)
    } catch (e) { showToast((e as Error).message) }
  }

  const saveVehicle = async () => {
    try {
      if (editingVehicle) {
        await updateVehicle.mutateAsync({ id: editingVehicle.id, data: vehicleDraft }).then(unwrap)
        showToast('Vehicle updated ✓')
      } else {
        await createVehicle.mutateAsync(vehicleDraft).then(unwrap)
        showToast('Vehicle added ✓')
      }
      setVehicleForm(false); setEditingVehicle(null)
    } catch (e) { showToast((e as Error).message) }
  }

  const delRoute = async (id: string) => {
    await deleteRoute.mutateAsync(id)
    setDelConfirm(null); showToast('Route deleted')
  }

  const addStop = () => {
    if (stopInput.trim()) {
      setRouteDraft({ ...routeDraft, stops: [...routeDraft.stops, stopInput.trim()] })
      setStopInput('')
    }
  }

  const VEHICLE_STATUS_COLORS = { active: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400', maintenance: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', retired: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400' }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transport Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Routes, vehicles, and student assignments</p>
        </div>
        <button onClick={() => { if (tab === 'routes') { setRouteDraft(BLANK_ROUTE); setEditingRoute(null); setRouteForm(true) } else { setVehicleDraft(BLANK_VEHICLE); setEditingVehicle(null); setVehicleForm(true) } }}
          className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">
          <Plus className="h-4 w-4" /> {tab === 'routes' ? 'Add Route' : 'Add Vehicle'}
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          {[
            { label: 'Active Routes', value: stats.activeRoutes, icon: MapPin },
            { label: 'Vehicles', value: stats.totalVehicles, icon: Bus },
            { label: 'Students on Transport', value: stats.studentsOnTransport, icon: Users },
            { label: 'In Maintenance', value: stats.vehiclesMaintenance, icon: Wrench },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
              <div className="flex items-center gap-2 mb-1"><s.icon className="h-4 w-4 text-[#E8B84B]" /><p className="text-xs font-semibold text-gray-400 uppercase">{s.label}</p></div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-gray-200 dark:border-gray-700">
        {(['routes', 'vehicles'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition border-b-2 -mb-px ${tab === t ? 'border-[#E8B84B] text-[#E8B84B]' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Routes */}
      {tab === 'routes' && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {routesLoading ? <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div> :
              routes.map(r => {
                const vehicle = vehicles.find(v => v.id === r.vehicleId)
                return (
                  <div key={r.id} onClick={() => setSelectedRoute(r.id)}
                    className={`rounded-2xl border p-5 cursor-pointer transition ${selectedRoute === r.id ? 'border-[#E8B84B] bg-[#E8B84B]/5' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8B84B]/15">
                          <Bus className="h-5 w-5 text-[#E8B84B]" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{r.name}</p>
                          <p className="text-xs text-gray-400">{r.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={e => { e.stopPropagation(); setRouteDraft({ name: r.name, description: r.description, stops: r.stops, vehicleId: r.vehicleId, driverId: r.driverId, driverName: r.driverName, driverPhone: r.driverPhone, capacity: r.capacity, feePerTerm: r.feePerTerm, status: r.status }); setEditingRoute(r); setRouteForm(true) }}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={e => { e.stopPropagation(); setDelConfirm(r.id) }}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                      <div><p className="text-gray-400">Driver</p><p className="font-medium text-gray-700 dark:text-gray-300">{r.driverName}</p></div>
                      <div><p className="text-gray-400">Vehicle</p><p className="font-medium text-gray-700 dark:text-gray-300">{vehicle?.registration ?? 'Unassigned'}</p></div>
                      <div><p className="text-gray-400">Fee/Term</p><p className="font-medium text-gray-700 dark:text-gray-300">KES {r.feePerTerm.toLocaleString()}</p></div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {r.stops.map(s => <span key={s} className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-[10px] text-gray-500 dark:text-gray-400">{s}</span>)}
                    </div>
                    <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${r.status === 'active' ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500'}`}>{r.status}</span>
                  </div>
                )
              })
            }
          </div>
          {/* Route students */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="border-b border-gray-200 dark:border-gray-700 px-5 py-4">
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {selectedRoute ? `Students on Route` : 'Select a route'}
              </p>
            </div>
            <div className="p-4">
              {!selectedRoute ? (
                <p className="text-xs text-gray-400 text-center py-8">Click a route to see assigned students</p>
              ) : routeStudents.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">No students on this route</p>
              ) : (
                <ul className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {routeStudents.map(s => (
                    <li key={s.id} className="flex items-center gap-2.5 py-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8B84B]/15 text-[10px] font-bold text-[#0d1b0d] dark:text-[#E8B84B]">
                        {s.firstName[0]}{s.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{s.firstName} {s.lastName}</p>
                        <p className="text-[10px] text-gray-400">{s.grade} · {s.admNo}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Vehicles */}
      {tab === 'vehicles' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map(v => {
            const route = routes.find(r => r.id === v.routeId)
            return (
              <div key={v.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white font-mono">{v.registration}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{v.make} {v.model}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setVehicleDraft({ registration: v.registration, make: v.make, model: v.model, capacity: v.capacity, routeId: v.routeId, status: v.status, lastService: v.lastService, nextService: v.nextService }); setEditingVehicle(v); setVehicleForm(true) }}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600"><Pencil className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><p className="text-gray-400">Capacity</p><p className="font-medium text-gray-700 dark:text-gray-300">{v.capacity} seats</p></div>
                  <div><p className="text-gray-400">Route</p><p className="font-medium text-gray-700 dark:text-gray-300">{route?.name ?? 'Unassigned'}</p></div>
                  <div><p className="text-gray-400">Last Service</p><p className="font-medium text-gray-700 dark:text-gray-300">{v.lastService}</p></div>
                  <div><p className="text-gray-400">Next Service</p><p className="font-medium text-gray-700 dark:text-gray-300">{v.nextService}</p></div>
                </div>
                <span className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${VEHICLE_STATUS_COLORS[v.status]}`}>{v.status}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Route form */}
      <Modal open={routeForm} onClose={() => setRouteForm(false)} title={editingRoute ? 'Edit Route' : 'Add Transport Route'}>
        <div className="space-y-4">
          <div><label className={LABEL}>Route Name</label><input className={INP} value={routeDraft.name} onChange={e => setRouteDraft({ ...routeDraft, name: e.target.value })} /></div>
          <div><label className={LABEL}>Description</label><input className={INP} value={routeDraft.description} onChange={e => setRouteDraft({ ...routeDraft, description: e.target.value })} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={LABEL}>Driver Name</label><input className={INP} value={routeDraft.driverName} onChange={e => setRouteDraft({ ...routeDraft, driverName: e.target.value })} /></div>
            <div><label className={LABEL}>Driver Phone</label><input className={INP} value={routeDraft.driverPhone} onChange={e => setRouteDraft({ ...routeDraft, driverPhone: e.target.value })} /></div>
            <div><label className={LABEL}>Capacity</label><input type="number" className={INP} value={routeDraft.capacity} onChange={e => setRouteDraft({ ...routeDraft, capacity: +e.target.value })} /></div>
            <div><label className={LABEL}>Fee Per Term (KES)</label><input type="number" className={INP} value={routeDraft.feePerTerm} onChange={e => setRouteDraft({ ...routeDraft, feePerTerm: +e.target.value })} /></div>
            <div>
              <label className={LABEL}>Vehicle</label>
              <select className={INP} value={routeDraft.vehicleId ?? ''} onChange={e => setRouteDraft({ ...routeDraft, vehicleId: e.target.value || null })}>
                <option value="">None</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.registration} ({v.make})</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Status</label>
              <select className={INP} value={routeDraft.status} onChange={e => setRouteDraft({ ...routeDraft, status: e.target.value as 'active' | 'inactive' })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className={LABEL}>Stops</label>
            <div className="flex gap-2 mb-2">
              <input className={INP} placeholder="Add stop…" value={stopInput} onChange={e => setStopInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addStop()} />
              <button onClick={addStop} className="rounded-lg px-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 text-sm font-medium">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {routeDraft.stops.map((s, i) => (
                <span key={i} className="flex items-center gap-1 rounded-full bg-[#E8B84B]/15 px-3 py-1 text-xs font-medium text-[#0d1b0d] dark:text-[#E8B84B]">
                  {s}
                  <button onClick={() => setRouteDraft({ ...routeDraft, stops: routeDraft.stops.filter((_, j) => j !== i) })} className="text-gray-400 hover:text-red-500 ml-1"><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setRouteForm(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={saveRoute} className="rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">{editingRoute ? 'Save' : 'Create'}</button>
          </div>
        </div>
      </Modal>

      {/* Vehicle form */}
      <Modal open={vehicleForm} onClose={() => setVehicleForm(false)} title={editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}>
        <div className="space-y-4">
          <div><label className={LABEL}>Registration</label><input className={INP} placeholder="e.g. KCH 123A" value={vehicleDraft.registration} onChange={e => setVehicleDraft({ ...vehicleDraft, registration: e.target.value })} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={LABEL}>Make</label><input className={INP} placeholder="e.g. Isuzu" value={vehicleDraft.make} onChange={e => setVehicleDraft({ ...vehicleDraft, make: e.target.value })} /></div>
            <div><label className={LABEL}>Model</label><input className={INP} placeholder="e.g. NQR" value={vehicleDraft.model} onChange={e => setVehicleDraft({ ...vehicleDraft, model: e.target.value })} /></div>
            <div><label className={LABEL}>Capacity</label><input type="number" className={INP} value={vehicleDraft.capacity} onChange={e => setVehicleDraft({ ...vehicleDraft, capacity: +e.target.value })} /></div>
            <div>
              <label className={LABEL}>Status</label>
              <select className={INP} value={vehicleDraft.status} onChange={e => setVehicleDraft({ ...vehicleDraft, status: e.target.value as Vehicle['status'] })}>
                <option value="active">Active</option>
                <option value="maintenance">In Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            <div><label className={LABEL}>Last Service</label><input type="date" className={INP} value={vehicleDraft.lastService} onChange={e => setVehicleDraft({ ...vehicleDraft, lastService: e.target.value })} /></div>
            <div><label className={LABEL}>Next Service</label><input type="date" className={INP} value={vehicleDraft.nextService} onChange={e => setVehicleDraft({ ...vehicleDraft, nextService: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setVehicleForm(false)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={saveVehicle} className="rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">{editingVehicle ? 'Save' : 'Add'}</button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!delConfirm} onClose={() => setDelConfirm(null)} title="Delete Route?">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">This will permanently delete the route. Students assigned to this route will need to be reassigned.</p>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDelConfirm(null)} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
          <button onClick={() => delConfirm && delRoute(delConfirm)} className="rounded-xl bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600">Delete</button>
        </div>
      </Modal>
    </div>
  )
}
