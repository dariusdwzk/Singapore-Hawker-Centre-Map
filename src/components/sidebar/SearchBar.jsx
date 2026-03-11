import { useEffect, useState } from 'react'

function SearchBar({ value, onChange }) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(draft)
    }, 200)

    return () => {
      clearTimeout(timer)
    }
  }, [draft, onChange])

  return (
    <div>
      <label htmlFor="search" className="mb-1 block text-sm font-semibold text-slate-700">
        Search Hawker Centre
      </label>
      <div className="relative">
        <input
          id="search"
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Search hawker centres..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm focus:border-amber-500 focus:outline-none"
        />
        {draft ? (
          <button
            type="button"
            onClick={() => setDraft('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
            aria-label="Clear search"
          >
            x
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default SearchBar
