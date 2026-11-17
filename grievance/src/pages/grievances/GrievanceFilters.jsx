import React from 'react'
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'

export default function GrievanceFilters({
  categories = [],
  statuses = [],
  priorities = [],
  filters,
  onChange,
  onReset,
}) {
  const activeCount = [
    Boolean(filters.categoryId),
    Boolean(filters.statusId),
    Boolean(filters.priorityId),
    Boolean(filters.searchTitle),
    filters.from !== '2026-01-01',
    filters.to !== '2026-12-31',
  ].filter(Boolean).length

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <SlidersHorizontal size={12} className="text-blue-600" /> Filter & Search Grievances
          {activeCount > 0 && (
            <span className="bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded-full text-[10px] font-semibold lowercase">
              {activeCount} active
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer font-medium"
          >
            <X size={12} /> Clear all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        {/* Search Title */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title or ID..."
            className="w-full border border-slate-300 rounded-md pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            value={filters.searchTitle || ''}
            onChange={(e) => onChange('searchTitle', e.target.value)}
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
        </div>

        {/* Categories from backend */}
        <select
          className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          value={filters.categoryId || ''}
          onChange={(e) => onChange('categoryId', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id || c.categoryId} value={c.id || c.categoryId}>
              {c.name || c.categoryName}
            </option>
          ))}
        </select>

        {/* Statuses from backend */}
        <select
          className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          value={filters.statusId || ''}
          onChange={(e) => onChange('statusId', e.target.value)}
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s.id || s.statusID || s.statusId} value={s.id || s.statusID || s.statusId}>
              {s.name || s.statusName}
            </option>
          ))}
        </select>

        {/* Priorities from backend */}
        <select
          className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          value={filters.priorityId || ''}
          onChange={(e) => onChange('priorityId', e.target.value)}
        >
          <option value="">All Priorities</option>
          {priorities.map((p) => (
            <option key={p.id || p.priorityId} value={p.id || p.priorityId}>
              {p.name || p.priorityName}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-500">Quick:</span>
          <button
            type="button"
            onClick={() => onChange('statusId', '')}
            className={`px-2 py-0.5 rounded cursor-pointer ${!filters.statusId ? 'bg-slate-200 text-slate-800 font-medium' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onChange('statusId', '1')}
            className={`px-2 py-0.5 rounded cursor-pointer ${filters.statusId === '1' ? 'bg-amber-100 text-amber-800 font-medium' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => onChange('statusId', '3')}
            className={`px-2 py-0.5 rounded cursor-pointer ${filters.statusId === '3' ? 'bg-emerald-100 text-emerald-800 font-medium' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            Complete
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-500">Date Range:</span>
          <input
            type="date"
            className="border border-slate-300 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-blue-600"
            value={filters.from || '2026-01-01'}
            onChange={(e) => onChange('from', e.target.value)}
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            className="border border-slate-300 rounded px-2 py-0.5 text-xs focus:outline-none focus:border-blue-600"
            value={filters.to || '2026-12-31'}
            onChange={(e) => onChange('to', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
