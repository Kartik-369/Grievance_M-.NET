import { api } from '../../services/api'
import { CATEGORIES, STATUSES, PRIORITIES, GRIEVANCES } from '../../data/dummy'

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
    if (pageNumber) params.append('pageNumber', pageNumber)
    if (pageSize) params.append('pageSize', pageSize)
    if (categoryId) params.append('categoryId', categoryId)
    if (statusId) params.append('statusId', statusId)
    if (priorityId) params.append('priorityId', priorityId)
    if (searchTitle?.trim()) params.append('searchTitle', searchTitle.trim())
    const query = params.toString() ? `?${params.toString()}` : ''
    return await api.get(`/grievance${query}`)
  } catch (error) {
    return { items: GRIEVANCES.slice((pageNumber - 1) * pageSize, pageNumber * pageSize), pageNumber, pageSize, totalCount: GRIEVANCES.length, totalPages: Math.ceil(GRIEVANCES.length / pageSize) }
  }
}

export async function fetchGrievanceById(id) {
  const numericId = typeof id === 'string' && id.startsWith('GRV-') ? id.replace('GRV-', '') : id
  return await api.get(`/grievance/${numericId}`)
}

export async function createGrievance(payload) {
  return await api.post('/grievance', payload)
}

export async function fetchCategories() {
  try { return await api.get('/grievancecategory') } catch { return CATEGORIES }
}

export async function fetchStatuses() {
  try { return await api.get('/status') } catch { return STATUSES }
}

export async function fetchPriorities() {
  try { return await api.get('/priority') } catch { return PRIORITIES }
}

export async function fetchGrievanceHistory(grievanceId) {
  try {
    const numericId = typeof grievanceId === 'string' && grievanceId.startsWith('GRV-') ? grievanceId.replace('GRV-', '') : grievanceId
    const res = await api.get('/grievancehistory')
    return (Array.isArray(res) ? res : res?.data || []).filter(h => String(h.grievanceId) === String(numericId))
  } catch { return [] }
}

export async function addGrievanceHistory({ grievanceId, status, remarks, updatedBy }) {
  const numericId = typeof grievanceId === 'string' && grievanceId.startsWith('GRV-') ? Number(grievanceId.replace('GRV-', '')) : Number(grievanceId)
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
    const numericId = typeof grievanceId === 'string' && grievanceId.startsWith('GRV-') ? grievanceId.replace('GRV-', '') : grievanceId
    const res = await api.get('/grievanceassignment')
    return (Array.isArray(res) ? res : res?.data || []).filter(a => String(a.grievanceId) === String(numericId))
  } catch { return [] }
}

export async function assignGrievance({ grievanceId, assignedTo }) {
  const numericId = typeof grievanceId === 'string' && grievanceId.startsWith('GRV-') ? Number(grievanceId.replace('GRV-', '')) : Number(grievanceId)
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
    return (Array.isArray(res) ? res : res?.data || []).filter(u => u.roleName === 'Admin' || u.roleId === 1)
  } catch {
    return [{ userId: 1, firstName: 'Kartik', lastName: 'Admin', email: 'admin@gms.com' }]
  }
}
