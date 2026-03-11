import { useRef } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

const FOCUS_ZOOM = 15

function markerSvg(fill, stroke) {
  return `<svg width="26" height="38" viewBox="0 0 26 38" xmlns="http://www.w3.org/2000/svg"><path d="M13 1C6.4 1 1 6.3 1 12.9c0 9.2 10.6 22.1 11 22.6.5.6 1.5.6 2 0 .5-.5 11-13.4 11-22.6C25 6.3 19.6 1 13 1z" fill="${fill}" stroke="${stroke}" stroke-width="2"/><circle cx="13" cy="13" r="5" fill="#F8F7F4"/></svg>`
}

const defaultIcon = L.divIcon({
  className: 'custom-hawker-marker',
  html: markerSvg('#F59E0B', '#B45309'),
  iconSize: [26, 38],
  iconAnchor: [13, 38],
  popupAnchor: [0, -32],
})

function HawkerMarker({ hawker, markerRef }) {
  const map = useMap()
  const markerInstanceRef = useRef(null)

  return (
    <Marker
      ref={(instance) => {
        markerInstanceRef.current = instance
        if (instance) markerRef(instance)
      }}
      position={[hawker.lat, hawker.lng]}
      icon={defaultIcon}
      eventHandlers={{
        mouseover: (event) => {
          event.target.openPopup()
        },
        click: (event) => {
          map.flyTo([hawker.lat, hawker.lng], FOCUS_ZOOM, { duration: 0.7 })
          // Re-open popup once the fly animation finishes so details stay visible.
          map.once('moveend', () => {
            event.target.openPopup()
          })
        },
      }}
    >
      <Popup>
        <div className="min-w-56 space-y-1 text-sm text-slate-700">
          <p className="text-base font-semibold text-slate-900">{hawker.name}</p>
          <p>{hawker.address || 'Address not available'}</p>
          <p>
            <span className="font-medium">Postal Code:</span>{' '}
            <span className="font-mono">{hawker.postalCode || 'Unknown'}</span>
          </p>
        </div>
      </Popup>
    </Marker>
  )
}

export default HawkerMarker
