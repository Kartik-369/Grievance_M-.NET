import React from 'react'
import { Search, Filter, X } from 'lucide-react'

export default function GrievanceFilters({
  categories = [],
  statuses = [],
  priorities = [],
  filters,
  onChange,
  onReset,
}) {
  const hasActiveFilters = Boolean(filters.categoryId || filters.statusId || filters.priorityId || filters.searchTitle)

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Filter size={12} /> Filter & Search Grievances
        </div>
        {hasActiveFilters && (
          <button onClick={onReset} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer">
            <X size={12} /> Clear all filters
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full border border-slate-300 rounded-md pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:border-blue-600"
            value={filters.searchTitle || ''}
            onChange={(e) => onChange('searchTitle', e.target.value)}
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
        </div>
        <select
          className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-600"
          value={filters.categoryId || ''}
          onChange={(e) => onChange('categoryId', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id || c.categoryId} value={c.id || c.categoryId}>{c.name || c.categoryName}</option>
          ))}
        </select>
        <select
          className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-600"
          value={filters.statusId || ''}
          onChange={(e) => onChange('statusId', e.target.value)}
        >
          <option value="">All Statuses</option>
          {statuses.map((s) => (
            <option key={s.id || s.statusID || s.statusId} value={s.id || s.statusID || s.statusId}>{s.name || s.statusName}</option>
          ))}
        </select>
        <select
          className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-600"
          value={filters.priorityId || ''}
          onChange={(e) => onChange('priorityId', e.target.value)}
        >
          <option value="">All Priorities</option>
          {priorities.map((p) => (
            <option key={p.id || p.priorityId} value={p.id || p.priorityId}>{p.name || p.priorityName}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
        <span className="font-medium">Date Range:</span>
        <input type="date" className="border border-slate-300 rounded px-2 py-1 text-xs" value={filters.from || '2026-01-01'} onChange={(e) => onChange('from', e.target.value)} />
        <span>to</span>
        <input type="date" className="border border-slate-300 rounded px-2 py-1 text-xs" value={filters.to || '2026-12-31'} onChange={(e) => onChange('to', e.target.value)} />
      </div>
    </div>
  )
}
