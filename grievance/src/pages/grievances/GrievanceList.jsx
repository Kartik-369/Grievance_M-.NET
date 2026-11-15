import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  FileText,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import {
  fetchGrievances,
  deleteGrievance,
  fetchCategories,
  fetchStatuses,
  fetchPriorities,
} from './grievanceApi'
import GrievanceFilters from './GrievanceFilters'
import GrievanceCard from './GrievanceCard'

export default function GrievanceList({ user }) {
  const navigate = useNavigate()
  const isAdmin = user?.role === 'Admin'

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // Filter options from backend
  const [categories, setCategories] = useState([])
  const [statuses, setStatuses] = useState([])
  const [priorities, setPriorities] = useState([])

  // Active filters
  const [filters, setFilters] = useState({
    categoryId: '',
    statusId: '',
    priorityId: '',
    searchTitle: '',
    from: '2026-01-01',
    to: '2026-12-31',
  })

  // Load backend filter metadata once
  useEffect(() => {
    async function loadMeta() {
      try {
        const [cats, stats, pris] = await Promise.all([
          fetchCategories(),
          fetchStatuses(),
          fetchPriorities(),
        ])
        setCategories(cats)
        setStatuses(stats)
        setPriorities(pris)
      } catch (err) {
        console.error('Failed to load filter metadata:', err)
      }
    }
    loadMeta()
  }, [])

  // Fetch grievances from backend API
  const loadGrievances = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchGrievances({
        pageNumber: page,
        pageSize,
        categoryId: filters.categoryId || null,
        statusId: filters.statusId || null,
        priorityId: filters.priorityId || null,
        searchTitle: filters.searchTitle || null,
      })

      let items = res?.items || []
      if (!isAdmin && user?.userId) {
        items = items.filter((g) => !g.raisedBy || g.raisedBy === user.userId)
      }

      setList(items)
      setTotalPages(res?.totalPages || 1)
      setTotalCount(res?.totalCount || items.length)
    } catch (err) {
      console.error('Error fetching grievances:', err)
      setError('Failed to fetch grievances from server.')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, filters, isAdmin, user?.userId])

  useEffect(() => {
    loadGrievances()
  }, [loadGrievances])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleResetFilters = () => {
    setFilters({
      categoryId: '',
      statusId: '',
      priorityId: '',
      searchTitle: '',
      from: '2026-01-01',
      to: '2026-12-31',
    })
    setPage(1)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this grievance? This action cannot be undone.')) return
    try {
      await deleteGrievance(id)
      setList((prev) => prev.filter((g) => g.id !== id && g.grievanceId !== id))
      setTotalCount((c) => Math.max(0, c - 1))
    } catch (err) {
      alert('Failed to delete grievance: ' + err.message)
    }
  }

  const pendingCount = list.filter((g) => g.statusId === 1).length
  const completeCount = list.filter((g) => g.statusId === 3).length

  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <div className="text-lg font-bold text-slate-900">
            {isAdmin ? 'All Grievances' : 'My Grievances'}
          </div>
          <div className="text-[13px] text-slate-500 mt-0.5">
            {user?.name || user?.firstName} &middot; {user?.role} &middot;{' '}
            <span className="font-semibold text-slate-700">{totalCount} total entries</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadGrievances}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>

          {!isAdmin && (
            <button
              onClick={() => navigate('/grievances/new')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Plus size={13} /> New Grievance
            </button>
          )}
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <FileText size={14} className="text-blue-600" /> Active Records
          </div>
          <span className="text-sm font-bold text-slate-800">{totalCount}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between">
          <div className="text-xs text-amber-700 flex items-center gap-1.5 font-medium">
            <Clock size={14} className="text-amber-500" /> Pending Review
          </div>
          <span className="text-sm font-bold text-amber-700">{pendingCount}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between col-span-2 sm:col-span-1">
          <div className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
            <CheckCircle2 size={14} className="text-emerald-500" /> Resolved
          </div>
          <span className="text-sm font-bold text-emerald-700">{completeCount}</span>
        </div>
      </div>

      {/* Dynamic Backend-Connected Filters */}
      <GrievanceFilters
        categories={categories}
        statuses={statuses}
        priorities={priorities}
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {error && (
        <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 size={24} className="animate-spin text-blue-600" />
          <span className="text-xs">Fetching grievances from server...</span>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
          <div className="font-semibold text-slate-800 mb-1">No grievances found</div>
          <div className="text-xs mb-4">No records match the current filters or search term.</div>
          <button
            onClick={handleResetFilters}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            {list.map((g) => (
              <GrievanceCard
                key={g.id || g.grievanceId}
                grievance={g}
                isAdmin={isAdmin}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 px-1">
              <div className="text-xs text-slate-500">
                Page <span className="font-medium text-slate-800">{page}</span> of{' '}
                <span className="font-medium text-slate-800">{totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-2.5 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-2.5 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
