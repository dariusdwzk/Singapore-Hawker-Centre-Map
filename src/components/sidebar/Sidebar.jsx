import SearchBar from './SearchBar'
import RegionFilter from './RegionFilter'
import HawkerList from './HawkerList'

function Sidebar({
  totalCount,
  filteredCount,
  searchQuery,
  regionFilter,
  selectedId,
  hawkers,
  onSearchChange,
  onRegionChange,
  onSelect,
  onClearFilters,
}) {
  return (
    <aside className="sidebar-grain flex w-full flex-col border-b border-slate-200 bg-[#F8F7F4] md:h-full md:w-[30%] md:border-b-0 md:border-r">
      <div className="space-y-4 p-4 md:p-5">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Singapore Hawker Centre Map</h1>
          <p className="text-xs text-slate-600">Interactive exploration tool</p>
        </div>

        <SearchBar value={searchQuery} onChange={onSearchChange} />
        <RegionFilter value={regionFilter} onChange={onRegionChange} />

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-700">
            Showing <span key={filteredCount} className="count-pop font-mono font-semibold">{filteredCount}</span> of{' '}
            <span className="font-mono font-semibold">{totalCount}</span>
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:border-amber-500 hover:text-amber-700"
          >
            Clear filters
          </button>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto border-t border-slate-200 md:max-h-none md:flex-1">
        <HawkerList hawkers={hawkers} selectedId={selectedId} onSelect={onSelect} />
      </div>
    </aside>
  )
}

export default Sidebar
