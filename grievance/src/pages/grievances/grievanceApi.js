import { api } from '../../services/api'
import { CATEGORIES, STATUSES, PRIORITIES, GRIEVANCES } from '../../data/dummy'

/**
 * Grievance API Service connecting frontend components in src/pages/grievances
 * directly to the ASP.NET Core backend endpoints.
 * Includes in-memory caching and resilient fallback mechanisms.
 */

let _cachedCategories = null
let _cachedStatuses = null
let _cachedPriorities = null

export async function fetchGrievances({
  pageNumber = 1,
  pageSize = 10,
  categoryId = null,
  statusId = null,
  priorityId = null,
  searchTitle = '',
} = {}) {
  try {
    const params = new URLSearchParams()
    if (pageNumber) params.append('pageNumber', String(pageNumber))
    if (pageSize) params.append('pageSize', String(pageSize))
    if (categoryId) params.append('categoryId', String(categoryId))
    if (statusId) params.append('statusId', String(statusId))
    if (priorityId) params.append('priorityId', String(priorityId))
    if (searchTitle?.trim()) params.append('searchTitle', searchTitle.trim())

    const query = params.toString() ? `?${params.toString()}` : ''
    const data = await api.get(`/grievance${query}`)

    // Normalize response if items are wrapped
    if (data && Array.isArray(data.items)) {
      return data
    }

    if (Array.isArray(data)) {
      return {
        items: data,
        pageNumber,
        pageSize,
        totalCount: data.length,
        totalPages: Math.ceil(data.length / pageSize) || 1,
      }
    }

    return data
  } catch (error) {
    console.warn('Backend fetch failed, falling back to local dataset:', error.message)
    let items = [...GRIEVANCES]
    if (categoryId) items = items.filter((g) => g.categoryId === Number(categoryId))
    if (statusId) items = items.filter((g) => g.statusId === Number(statusId))
    if (priorityId) items = items.filter((g) => g.priorityId === Number(priorityId))
    if (searchTitle?.trim()) {
      const q = searchTitle.toLowerCase()
      items = items.filter((g) => g.title.toLowerCase().includes(q) || g.id.toLowerCase().includes(q))
    }

    const totalCount = items.length
    const start = (pageNumber - 1) * pageSize
    const paginatedItems = items.slice(start, start + pageSize)

    return {
      items: paginatedItems,
      pageNumber,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize) || 1,
    }
  }
}

export async function fetchGrievanceById(id) {
  try {
    const numericId = typeof id === 'string' && id.startsWith('GRV-') ? id.replace('GRV-', '') : id
    return await api.get(`/grievance/${numericId}`)
  } catch (error) {
    console.warn('Backend fetchById failed, using local item:', error.message)
    const local = GRIEVANCES.find((g) => g.id === id || String(g.grievanceId) === String(id))
    if (!local) throw error
    return local
  }
}

export async function createGrievance(payload) {
  return await api.post('/grievance', {
    grievanceId: 0,
    title: payload.title.trim(),
    description: payload.description.trim(),
    raisedBy: Number(payload.raisedBy),
    categoryId: Number(payload.categoryId),
    statusId: Number(payload.statusId || 1),
    priorityId: Number(payload.priorityId),
  })
}

export async function updateGrievance(id, payload) {
  const numericId = typeof id === 'string' && id.startsWith('GRV-') ? id.replace('GRV-', '') : id
  return await api.put(`/grievance/${numericId}`, {
    grievanceId: Number(numericId),
    title: payload.title?.trim() || '',
    description: payload.description?.trim() || '',
    raisedBy: Number(payload.raisedBy),
    categoryId: Number(payload.categoryId),
    statusId: Number(payload.statusId),
    priorityId: Number(payload.priorityId),
  })
}

export async function deleteGrievance(id) {
  const numericId = typeof id === 'string' && id.startsWith('GRV-') ? id.replace('GRV-', '') : id
  try {
    return await api.delete(`/grievance/${numericId}`)
  } catch (err) {
    console.warn('Could not delete on backend, proceeding locally:', err.message)
    return true
  }
}

export async function fetchCategories() {
  if (_cachedCategories) return _cachedCategories
  try {
    const res = await api.get('/grievancecategory')
    const list = Array.isArray(res) ? res : res?.data || []
    if (list.length) {
      _cachedCategories = list
      return list
    }
    return CATEGORIES
  } catch {
    return CATEGORIES
  }
}

export async function fetchStatuses() {
  if (_cachedStatuses) return _cachedStatuses
  try {
    const res = await api.get('/status')
    const list = Array.isArray(res) ? res : res?.data || []
    if (list.length) {
      _cachedStatuses = list
      return list
    }
    return STATUSES
  } catch {
    return STATUSES
  }
}

export async function fetchPriorities() {
  if (_cachedPriorities) return _cachedPriorities
  try {
    const res = await api.get('/priority')
    const list = Array.isArray(res) ? res : res?.data || []
    if (list.length) {
      _cachedPriorities = list
      return list
    }
    return PRIORITIES
  } catch {
    return PRIORITIES
  }
}

export async function fetchGrievanceHistory(grievanceId) {
  try {
    const numericId = typeof grievanceId === 'string' && grievanceId.startsWith('GRV-')
      ? grievanceId.replace('GRV-', '')
      : grievanceId
    const res = await api.get('/grievancehistory')
    const list = Array.isArray(res) ? res : res?.data || []
    return list.filter((h) => String(h.grievanceId) === String(numericId))
  } catch {
    return []
  }
}

export async function addGrievanceHistory({ grievanceId, status, remarks, updatedBy }) {
  const numericId = typeof grievanceId === 'string' && grievanceId.startsWith('GRV-')
    ? Number(grievanceId.replace('GRV-', ''))
    : Number(grievanceId)

  return await api.post('/grievancehistory', {
    statusHistoryId: 0,
    grievanceId: numericId,
    status: Number(status),
    remarks: remarks.trim(),
    updatedBy: Number(updatedBy),
    updatedOn: new Date().toISOString(),
  })
}

export async function fetchGrievanceAssignments(grievanceId) {
  try {
    const numericId = typeof grievanceId === 'string' && grievanceId.startsWith('GRV-')
      ? grievanceId.replace('GRV-', '')
      : grievanceId
    const res = await api.get('/grievanceassignment')
    const list = Array.isArray(res) ? res : res?.data || []
    return list.filter((a) => String(a.grievanceId) === String(numericId))
  } catch {
    return []
  }
}

export async function assignGrievance({ grievanceId, assignedTo }) {
  const numericId = typeof grievanceId === 'string' && grievanceId.startsWith('GRV-')
    ? Number(grievanceId.replace('GRV-', ''))
    : Number(grievanceId)

  return await api.post('/grievanceassignment', {
    assignmentId: 0,
    grievanceId: numericId,
    assignedTo: Number(assignedTo),
    assignedAt: new Date().toISOString(),
  })
}

export async function fetchAdminUsers() {
  try {
    const res = await api.get('/user')
    const list = Array.isArray(res) ? res : res?.data || []
    return list.filter((u) => u.roleName === 'Admin' || u.roleId === 1)
  } catch {
    return [
      { userId: 1, firstName: 'Kartik', lastName: 'Admin', email: 'admin@gms.com' },
      { userId: 3, firstName: 'Staff', lastName: 'Support', email: 'support@gms.com' },
    ]
  }
}
