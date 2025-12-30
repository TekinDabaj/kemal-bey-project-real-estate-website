'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { X, MapPin, Search } from 'lucide-react'

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

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export default function MapPicker({ isOpen, onClose, onConfirm, initialLat, initialLng, t }: Props) {
  const [selectedLat, setSelectedLat] = useState(initialLat || 41.0082)
  const [selectedLng, setSelectedLng] = useState(initialLng || 28.9784)
  const [map, setMap] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Load Google Maps script
  useEffect(() => {
    if (!isOpen) return

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      console.error('Google Maps API key not found')
      return
    }

    if (window.google?.maps) {
      setIsLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => setIsLoaded(true)
    document.head.appendChild(script)

    return () => {
      // Cleanup if needed
    }
  }, [isOpen])

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !isOpen || !mapRef.current || map) return

    const newMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: selectedLat, lng: selectedLng },
      zoom: 14,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: false,
    })

    const newMarker = new window.google.maps.Marker({
      position: { lat: selectedLat, lng: selectedLng },
      map: newMap,
      draggable: true,
    })

    // Click to place marker
    newMap.addListener('click', (e: any) => {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      newMarker.setPosition({ lat, lng })
      setSelectedLat(lat)
      setSelectedLng(lng)
    })

    // Drag marker
    newMarker.addListener('dragend', () => {
      const position = newMarker.getPosition()
      setSelectedLat(position.lat())
      setSelectedLng(position.lng())
    })

    // Search autocomplete
    if (searchInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
        types: ['address'],
      })

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat()
          const lng = place.geometry.location.lng()
          newMap.setCenter({ lat, lng })
          newMap.setZoom(16)
          newMarker.setPosition({ lat, lng })
          setSelectedLat(lat)
          setSelectedLng(lng)
        }
      })
    }

    setMap(newMap)
    setMarker(newMarker)
  }, [isLoaded, isOpen])

  // Update marker position when initial values change
  useEffect(() => {
    if (marker && initialLat && initialLng) {
      marker.setPosition({ lat: initialLat, lng: initialLng })
      map?.setCenter({ lat: initialLat, lng: initialLng })
      setSelectedLat(initialLat)
      setSelectedLng(initialLng)
    }
  }, [initialLat, initialLng, marker, map])

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      setMap(null)
      setMarker(null)
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
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search address..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
            />
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative" style={{ minHeight: '400px' }}>
          {!isLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full" />
          )}
        </div>

        {/* Coordinates Display */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-500 mb-2">{t.mapInstructions}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">{t.latitude}:</span>
              <span className="font-mono bg-white px-2 py-1 rounded border border-slate-200">{selectedLat.toFixed(6)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">{t.longitude}:</span>
              <span className="font-mono bg-white px-2 py-1 rounded border border-slate-200">{selectedLng.toFixed(6)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition text-sm"
          >
            {t.closeMap}
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg font-medium transition text-sm"
          >
            {t.confirmLocation}
          </button>
        </div>
      </div>
    </div>
  )
}
