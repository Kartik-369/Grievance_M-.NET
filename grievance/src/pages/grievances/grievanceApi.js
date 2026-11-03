import { api } from '../../services/api'
import { GRIEVANCES } from '../../data/dummy'

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
