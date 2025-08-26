'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Layout } from '@/components/layout/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Clock,
  Phone,
  AlertTriangle,
  Shield,
  Flame,
  Heart,
  Users,
  ArrowLeft,
  MapPin
} from 'lucide-react'

interface EmergencyContact {
  title: string
  number: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
}

export default function EmergencyPage() {
  const [locationToast, setLocationToast] = useState('')

  const emergencySteps = [
    { icon: Clock, title: "Stay Calm", color: "text-red-500" },
    { icon: Phone, title: "Call for Help", color: "text-indigo-600" },
    { icon: MapPin, title: "Share Location", color: "text-orange-500" },
    { icon: Shield, title: "Help Others", color: "text-indigo-600" },
    { icon: Users, title: "Wait for Help", color: "text-orange-500" }
  ]

  const emergencyContacts: EmergencyContact[] = [
    {
      title: "Police",
      number: "100",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200"
    },
    {
      title: "Fire",
      number: "101",
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-50 border-orange-200"
    },
    {
      title: "Ambulance",
      number: "102",
      icon: Heart,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 border-indigo-200"
    },
    {
      title: "Women Helpline",
      number: "1091",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200"
    },
    {
      title: "Disaster Mgmt",
      number: "108",
      icon: AlertTriangle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 border-yellow-200"
    }
  ]

  const shareLocation = () => {
    if (!navigator.geolocation) {
      setLocationToast('Geolocation not supported on this device.')
      setTimeout(() => setLocationToast(''), 3000)
      return
    }

    setLocationToast('Fetching your location...')
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6)
        const lng = position.coords.longitude.toFixed(6)
        const locationString = `${lat}, ${lng}`
        
        // Copy to clipboard
        navigator.clipboard.writeText(locationString)
        setLocationToast(`Location copied: ${locationString}`)
        setTimeout(() => setLocationToast(''), 5000)
      },
      () => {
        setLocationToast('Unable to get location. Please enable location services.')
        setTimeout(() => setLocationToast(''), 3000)
      }
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Emergency <span className="text-red-600">Contacts</span>
          </h1>
          <p className="text-xl text-gray-600">
            Quick access to essential emergency numbers for your safety and well-being.
          </p>
        </div>

        {/* Emergency Steps */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What to do in an Emergency</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {emergencySteps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <Icon className={`w-8 h-8 ${step.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Share Location Button */}
        <div className="text-center mb-8">
          <Button
            onClick={shareLocation}
            size="lg"
            className="gap-2 bg-red-600 hover:bg-red-700"
          >
            <MapPin className="w-5 h-5" />
            Share My Location
          </Button>
          
          {locationToast && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-700">{locationToast}</p>
            </div>
          )}
        </div>

        {/* Emergency Contacts */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Emergency Numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => {
              const Icon = contact.icon
              return (
                <Card key={index} className={`hover:shadow-lg transition-shadow border-2 ${contact.bgColor}`}>
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <Icon className={`w-8 h-8 ${contact.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-4">{contact.title}</h3>
                    <a
                      href={`tel:${contact.number}`}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black transition-all shadow-lg hover:shadow-xl`}
                    >
                      <Phone className="w-4 h-4" />
                      {contact.number}
                    </a>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Footer */}
        <div className="text-center space-y-4">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>For more local helplines, contact your city administration.</p>
            <p className="mt-2">&copy; 2024 Naagrik</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
