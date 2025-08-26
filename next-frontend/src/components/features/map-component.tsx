'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Issue } from '@/types'

// Fix for default markers in Next.js
type LeafletIcon = {
  Default: {
    prototype: Record<string, unknown>
    mergeOptions: (options: Record<string, string>) => void
  }
}

const leafletIcon = L.Icon as unknown as LeafletIcon
delete leafletIcon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapComponentProps {
  issues: Issue[]
  onMapClick?: (lat: number, lng: number) => void
  selectedIssue?: Issue | null
  center?: [number, number]
  zoom?: number
}

export function MapComponent({ 
  issues, 
  onMapClick, 
  selectedIssue,
  center = [28.6139, 77.2090], 
  zoom = 13 
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView(center, zoom)
    mapInstanceRef.current = map

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Handle map clicks
    if (onMapClick) {
      map.on('click', (e) => {
        onMapClick(e.latlng.lat, e.latlng.lng)
      })
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [center, zoom, onMapClick])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker)
    })
    markersRef.current = []

    // Add issue markers
    issues.forEach(issue => {
      if (!mapInstanceRef.current) return

      const marker = L.marker([issue.location.lat, issue.location.lng])
        .addTo(mapInstanceRef.current)

      // Create popup content
      const popupContent = `
        <div class="p-2 min-w-[200px]">
          <h3 class="font-semibold text-lg mb-2">${issue.title}</h3>
          <p class="text-sm text-gray-600 mb-2">${issue.description}</p>
          <div class="flex items-center justify-between">
            <span class="text-xs px-2 py-1 rounded-full bg-gray-100">${issue.category}</span>
            <span class="text-xs px-2 py-1 rounded-full ${
              issue.status === 'Open' ? 'bg-red-100 text-red-800' :
              issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }">${issue.status}</span>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            Reported by: ${issue.user.username}
          </div>
          <div class="mt-1 text-xs text-gray-500">
            Upvotes: ${issue.upvotes}
          </div>
        </div>
      `

      marker.bindPopup(popupContent)
      markersRef.current.push(marker)

      // Open popup if this is the selected issue
      if (selectedIssue && selectedIssue.id === issue.id) {
        marker.openPopup()
      }
    })
  }, [issues, selectedIssue])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-lg shadow-lg"
      style={{ minHeight: '400px' }}
    />
  )
}
