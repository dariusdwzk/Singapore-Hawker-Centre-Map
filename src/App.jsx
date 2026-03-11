import { useMemo, useState } from 'react'
import MapView from './components/map/MapView'
import Sidebar from './components/sidebar/Sidebar'
import ErrorMessage from './components/ui/ErrorMessage'
import LoadingSpinner from './components/ui/LoadingSpinner'
import { useHawkerData } from './hooks/useHawkerData'
import { filterHawkers } from './utils/filterUtils'

function App() {
  const { data, isLoading, error, retry } = useHawkerData()
  const [searchQuery, setSearchQuery] = useState('')
  const [regionFilter, setRegionFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

  const filteredData = useMemo(
    () => filterHawkers(data, searchQuery, regionFilter),
    [data, searchQuery, regionFilter],
  )

  const selectedStillVisible = filteredData.some((hawker) => hawker.id === selectedId)
  const effectiveSelectedId = selectedStillVisible ? selectedId : null

  function handleSearchChange(nextSearchQuery) {
    setSelectedId(null)
    setSearchQuery(nextSearchQuery)
  }

  function handleRegionChange(nextRegionFilter) {
    setSelectedId(null)
    setRegionFilter(nextRegionFilter)
  }

  function handleClearFilters() {
    setSelectedId(null)
    setSearchQuery('')
    setRegionFilter('all')
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={retry} />
  }

  return (
    <main className="h-screen w-full bg-[#F8F7F4]">
      <section className="flex h-full w-full flex-col md:flex-row">
        <Sidebar
          totalCount={data.length}
          filteredCount={filteredData.length}
          searchQuery={searchQuery}
          regionFilter={regionFilter}
          selectedId={effectiveSelectedId}
          hawkers={filteredData}
          onSearchChange={handleSearchChange}
          onRegionChange={handleRegionChange}
          onSelect={setSelectedId}
          onClearFilters={handleClearFilters}
        />

        <div className="h-[58vh] w-full md:h-full md:w-[70%]">
          <MapView
            hawkers={filteredData}
            regionFilter={regionFilter}
            selectedId={effectiveSelectedId}
          />
        </div>
      </section>
    </main>
  )
}

export default App
