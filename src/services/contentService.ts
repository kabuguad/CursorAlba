import { mockGet, mockPost, mockPut, mockDelete, newId } from './mockApi'
import { getDB, mutateDB } from './db'
import type { MediaAsset } from './db'
import { addAudit } from './auditService'

export type { MediaAsset }

export const contentService = {
  // Media Library
  listMedia: () => mockGet(() => getDB().mediaAssets.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))),

  uploadMedia: (data: { name: string; url: string; type: MediaAsset['type']; size: string; category: string; uploadedBy: string }) => mockPost(() => {
    const asset: MediaAsset = {
      id: newId('MDA'),
      ...data,
      uploadedAt: new Date().toISOString(),
      usedIn: [],
    }
    mutateDB(db => { db.mediaAssets.push(asset) })
    addAudit({ action: 'CREATE', resource: 'MediaAsset', resourceId: asset.id, details: `Uploaded: ${asset.name}` })
    return asset
  }),

  deleteMedia: (id: string) => mockDelete(() => {
    mutateDB(db => { db.mediaAssets = db.mediaAssets.filter(a => a.id !== id) })
    addAudit({ action: 'DELETE', resource: 'MediaAsset', resourceId: id, details: 'Media deleted' })
  }),

  // Settings (content-related subset)
  getSettings: () => mockGet(() => getDB().settings),

  updateSettings: (data: Partial<typeof getDB extends () => infer R ? R extends { settings: infer S } ? S : never : never>) => mockPut(() => {
    mutateDB(db => { Object.assign(db.settings, data) })
    addAudit({ action: 'UPDATE', resource: 'Settings', resourceId: null, details: 'School settings updated' })
    return getDB().settings
  }),
}
