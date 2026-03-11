import { REGION_OPTIONS } from '../../constants/regions'

function RegionFilter({ value, onChange }) {
  return (
    <div>
      <label htmlFor="region" className="mb-1 block text-sm font-semibold text-slate-700">
        Filter by Region
      </label>
      <select
        id="region"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
      >
        {REGION_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default RegionFilter
