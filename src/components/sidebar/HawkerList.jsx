import { REGION_LABELS } from '../../constants/regions'

function HawkerList({ hawkers, selectedId, onSelect }) {
  if (hawkers.length === 0) {
    return <p className="p-4 text-sm text-slate-500">No hawker centres match your current filters.</p>
  }

  return (
    <ul className="divide-y divide-slate-200">
      {hawkers.map((hawker, index) => {
        const isSelected = selectedId === hawker.id

        return (
          <li
            key={hawker.id}
            className="list-fade-in"
            style={{ animationDelay: `${Math.min(index * 45, 420)}ms` }}
          >
            <button
              type="button"
              onClick={() => onSelect(hawker.id)}
              className={`w-full border-l-4 px-4 py-3 text-left transition ${
                isSelected
                  ? 'border-l-amber-500 bg-amber-50'
                  : 'border-l-transparent hover:border-l-amber-300 hover:bg-amber-50/40'
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">{hawker.name}</p>
              <p className="text-xs text-slate-600">{hawker.address || 'Address not available'}</p>
              <p className="mt-1 text-xs text-slate-500">
                {REGION_LABELS[hawker.region] ?? 'Unknown'} | {hawker.postalCode || 'Unknown'}
              </p>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default HawkerList
