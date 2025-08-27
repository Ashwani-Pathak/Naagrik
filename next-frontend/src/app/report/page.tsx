'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowLeft, 
  MapPin, 
  Upload, 
  AlertCircle,
  Camera,
  FileImage
} from 'lucide-react'
import { auth, api } from '@/lib/api'
import { CreateIssueData } from '@/types'

// Dynamic import for map component to avoid SSR issues
const MapComponent = dynamic(
  () => import('@/components/features/map-component').then(mod => ({ default: mod.MapComponent })),
  { ssr: false }
)

export default function ReportIssuePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: { lat: 28.6139, lng: 77.2090 }
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')

  // Check authentication on mount
  useEffect(() => {
    if (!auth.isLoggedIn()) {
      router.push('/login')
    }
  }, [router])

  const categories = [
    'Road',
    'Pothole', 
    'Lighting',
    'Electricity',
    'Water Supply',
    'Waste Management',
    'Public Safety',
    'Healthcare',
    'Education',
    'Transportation',
    'Environment',
    'Other'
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, location: { lat, lng } }))
    if (errors.location) {
      setErrors(prev => ({ ...prev, location: '' }))
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      setSelectedFiles([files[0]]) // Only take the first file, like in original
      
      // Upload image immediately like in original implementation
      handleImageUpload(files[0])
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      const response = await api.upload<{ url: string }>('/upload', file, 'image')
      setUploadedImageUrl(response.url)
      console.log('Image uploaded successfully:', response.url)
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image. You can still submit without an image.')
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setIsSubmitting(true)

      // Create issue data matching backend expectations
      const issueData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        photo: uploadedImageUrl || undefined // Include uploaded image URL if available
      }

      console.log('Creating issue:', issueData)

      // Create the issue using the API
      const response = await api.post('/issues', issueData)
      console.log('Issue created successfully:', response)

      // Show success message and redirect
      alert('Issue reported successfully!')
      router.push('/')
    } catch (error) {
      console.error('Failed to create issue:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create issue. Please try again.'
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Report New Issue</h1>
              <p className="text-gray-600">Help improve your community by reporting local issues</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="space-y-6">
                {/* Issue Details Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Issue Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Issue Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Brief description of the issue"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength={100}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                          errors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Provide detailed information about the issue..."
                        rows={6}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                          errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength={500}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        {formData.description.length}/500 characters
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Photo Upload Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Add Photos (Optional)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="file-upload"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-3"
                      >
                        <Upload className="w-8 h-8 text-gray-400" />
                        <div>
                          <p className="text-gray-600 font-medium">Click to upload a photo</p>
                          <p className="text-sm text-gray-500">One photo, up to 5MB</p>
                        </div>
                      </label>
                    </div>

                    {/* Selected File & Upload Status */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileImage className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{selectedFiles[0].name}</span>
                            {uploadedImageUrl && (
                              <span className="text-xs text-green-600 font-medium">✓ Uploaded</span>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedFiles([])
                              setUploadedImageUrl('')
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Map Section - Fixed container with proper height constraints */}
              <div className="space-y-6">
                <Card className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Issue Location
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Click on the map to mark the exact location of the issue
                    </p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="w-full h-[450px] relative">
                      <MapComponent
                        issues={[]}
                        onMapClick={handleMapClick}
                        selectedLocation={formData.location}
                        showAddMarker={true}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Location Info */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-2">Selected Location:</p>
                      <p>Latitude: {formData.location.lat.toFixed(6)}</p>
                      <p>Longitude: {formData.location.lng.toFixed(6)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="px-8 py-3 text-lg"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Issue Report'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
