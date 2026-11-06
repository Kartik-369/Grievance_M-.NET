import React from 'react'
import { Search, Filter, X } from 'lucide-react'

export default function GrievanceFilters({ categories = [], filters, onChange, onReset }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Filter size={12} /> Filter Grievances
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full border border-slate-300 rounded-md pl-8 pr-3 py-1.5 text-sm"
            value={filters.searchTitle || ''}
            onChange={(e) => onChange('searchTitle', e.target.value)}
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
        </div>
        <select
          className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-sm"
          value={filters.categoryId || ''}
          onChange={(e) => onChange('categoryId', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id || c.categoryId} value={c.id || c.categoryId}>{c.name || c.categoryName}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
