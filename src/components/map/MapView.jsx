import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import HawkerMarker from './HawkerMarker'

const SINGAPORE_CENTER = [1.3521, 103.8198]
const DEFAULT_ZOOM = 12
const FOCUS_ZOOM = 15

function MarkerLayer({ hawkers, selectedId, regionFilter }) {
  const map = useMap()
  const markerRefs = useRef({})
  const previousRegionRef = useRef(regionFilter)

  useEffect(() => {
    if (previousRegionRef.current === regionFilter) {
      return
    }

    previousRegionRef.current = regionFilter

    if (regionFilter === 'all') {
      map.flyTo(SINGAPORE_CENTER, DEFAULT_ZOOM, { duration: 0.7 })
      return
    }

    if (!hawkers.length) {
      return
    }

    const regionBounds = hawkers.map((hawker) => [hawker.lat, hawker.lng])
    map.flyToBounds(regionBounds, {
      padding: [36, 36],
      maxZoom: 13,
      duration: 0.7,
    })
  }, [regionFilter, hawkers, map])

  useEffect(() => {
    if (!selectedId) {
      return
    }

    const marker = markerRefs.current[selectedId]
    if (!marker) {
      return
    }

    const markerLocation = marker.getLatLng()
    map.flyTo(markerLocation, FOCUS_ZOOM, { duration: 0.7 })
    marker.openPopup()
  }, [selectedId, map])

  return hawkers.map((hawker) => (
    <HawkerMarker
      key={hawker.id}
      hawker={hawker}
      markerRef={(instance) => {
        if (instance) {
          markerRefs.current[hawker.id] = instance
        }
      }}
    />
  ))
}

function MapView({ hawkers, selectedId, regionFilter }) {
  return (
    <div className="h-[58vh] w-full md:h-full">
      <MapContainer center={SINGAPORE_CENTER} zoom={DEFAULT_ZOOM} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerLayer
          hawkers={hawkers}
          selectedId={selectedId}
          regionFilter={regionFilter}
        />
      </MapContainer>
    </div>
  )
}

export default MapView
