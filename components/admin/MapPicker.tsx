'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, MapPin, AlertTriangle } from 'lucide-react'

type Props = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (lat: number, lng: number) => void
  initialLat?: number
  initialLng?: number
  t: {
    selectLocation: string
    mapInstructions: string
    confirmLocation: string
    closeMap: string
    latitude: string
    longitude: string
  }
}

// Loader for Google Maps with modern async pattern
const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Already loaded - check if google.maps exists and has importLibrary
    if (typeof window !== 'undefined' && window.google?.maps && typeof window.google.maps.importLibrary === 'function') {
      resolve()
      return
    }

    // Check if script is already loading
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve())
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps')))
      return
    }

    // Create and load script with async loading
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Maps script'))
    document.head.appendChild(script)
  })
}

export default function MapPicker({ isOpen, onClose, onConfirm, initialLat, initialLng, t }: Props) {
  const [selectedLat, setSelectedLat] = useState(initialLat || 41.0082)
  const [selectedLng, setSelectedLng] = useState(initialLng || 28.9784)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mapRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null)
  const initializedRef = useRef(false)

  // Initialize map with modern APIs
  const initializeMap = useCallback(async () => {
    if (!mapRef.current || initializedRef.current) return

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      setError('Google Maps API key not configured')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Load the script
      await loadGoogleMapsScript(apiKey)

      // Import required libraries using modern importLibrary
      const { Map } = await google.maps.importLibrary('maps') as google.maps.MapsLibrary
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker') as google.maps.MarkerLibrary
      const { Autocomplete } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary

      const initialPosition = { lat: selectedLat, lng: selectedLng }

      // Create map - mapId required for AdvancedMarkerElement
      const map = new Map(mapRef.current, {
        center: initialPosition,
        zoom: 14,
        mapId: '16f5308c3b673f9e269fee5c', // Replace with your Map ID from Google Cloud Console
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: 'greedy',
      })

      // Create custom marker element
      const markerContent = document.createElement('div')
      markerContent.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background: #f59e0b;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 3px solid white;
        ">
          <svg style="transform: rotate(45deg); width: 20px; height: 20px; color: white;" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `

      // Create AdvancedMarkerElement
      const marker = new AdvancedMarkerElement({
        map,
        position: initialPosition,
        content: markerContent,
        gmpDraggable: true,
        title: 'Property Location',
      })

      // Handle marker drag
      marker.addListener('dragend', () => {
        const position = marker.position as google.maps.LatLngLiteral
        if (position) {
          setSelectedLat(position.lat)
          setSelectedLng(position.lng)
        }
      })

      // Handle map click
      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const lat = e.latLng.lat()
          const lng = e.latLng.lng()
          marker.position = { lat, lng }
          setSelectedLat(lat)
          setSelectedLng(lng)
        }
      })

      // Setup Autocomplete for search
      if (searchInputRef.current) {
        const autocomplete = new Autocomplete(searchInputRef.current, {
          fields: ['geometry', 'name', 'formatted_address'],
        })

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (place.geometry?.location) {
            const lat = place.geometry.location.lat()
            const lng = place.geometry.location.lng()
            map.setCenter({ lat, lng })
            map.setZoom(16)
            marker.position = { lat, lng }
            setSelectedLat(lat)
            setSelectedLng(lng)
          }
        })
      }

      mapInstanceRef.current = map
      markerRef.current = marker
      initializedRef.current = true
      setIsLoading(false)

    } catch (err) {
      console.error('Google Maps initialization error:', err)
      setError('Failed to initialize Google Maps. Please check your API key and enabled APIs.')
      setIsLoading(false)
    }
  }, [selectedLat, selectedLng])

  // Initialize when modal opens
  useEffect(() => {
    if (isOpen && !initializedRef.current) {
      initializeMap()
    }
  }, [isOpen, initializeMap])

  // Update marker position when initial values change
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current && initialLat && initialLng) {
      markerRef.current.position = { lat: initialLat, lng: initialLng }
      mapInstanceRef.current.setCenter({ lat: initialLat, lng: initialLng })
      setSelectedLat(initialLat)
      setSelectedLng(initialLng)
    }
  }, [initialLat, initialLng])

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      // Reset for next open
      initializedRef.current = false
      mapInstanceRef.current = null
      markerRef.current = null
      setError(null)
      setIsLoading(true)
    }
  }, [isOpen])

  const handleConfirm = () => {
    onConfirm(selectedLat, selectedLng)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-slate-900">{t.selectLocation}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search address..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
            />
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative" style={{ minHeight: '400px' }}>
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 p-4">
              <div className="text-center max-w-md">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <p className="text-slate-700 font-medium mb-2">Map could not be loaded</p>
                <p className="text-sm text-slate-500 mb-4">{error}</p>
                <div className="text-xs text-left bg-slate-200 p-3 rounded-lg">
                  <p className="font-medium mb-1">Troubleshooting:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600">
                    <li>Enable Maps JavaScript API in Google Cloud Console</li>
                    <li>Enable Places API in Google Cloud Console</li>
                    <li>Add your domain to API key restrictions</li>
                    <li>Check browser console for detailed errors</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2"></div>
                <p className="text-sm text-slate-500">Loading Google Maps...</p>
              </div>
            </div>
          ) : null}
          <div
            ref={mapRef}
            className={`w-full h-full ${isLoading || error ? 'invisible' : 'visible'}`}
            style={{ minHeight: '400px' }}
          />
        </div>

        {/* Coordinates Display */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-500 mb-2">{t.mapInstructions}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">{t.latitude}:</span>
              <span className="font-mono bg-white px-2 py-1 rounded border border-slate-200">
                {selectedLat.toFixed(6)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">{t.longitude}:</span>
              <span className="font-mono bg-white px-2 py-1 rounded border border-slate-200">
                {selectedLng.toFixed(6)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition text-sm font-medium"
          >
            {t.closeMap}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !!error}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-slate-900 rounded-lg font-medium transition text-sm"
          >
            {t.confirmLocation}
          </button>
        </div>
      </div>
    </div>
  )
}
