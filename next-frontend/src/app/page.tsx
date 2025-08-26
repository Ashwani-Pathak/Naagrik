'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Layout } from '@/components/layout/layout'
import { IssueList } from '@/components/features/issue-list'
import { AddIssueModal } from '@/components/features/add-issue-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { auth } from '@/lib/api'
import { Issue, CreateIssueData } from '@/types'

// Dynamic import for map component to avoid SSR issues
const MapComponent = dynamic(
  () => import('@/components/features/map-component').then(mod => ({ default: mod.MapComponent })),
  { ssr: false }
)

function HomePage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    try {
      setIsLoading(true)
      // Mock data for development
      const mockIssues: Issue[] = [
        {
          id: '1',
          title: 'Pothole on Main Street',
          description: 'Large pothole causing traffic issues',
          category: 'Road',
          status: 'Open',
          location: { lat: 28.6139, lng: 77.2090 },
          upvotes: 5,
          userId: '1',
          user: { id: '1', username: 'john_doe', email: 'john@example.com', role: 'user', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Broken Streetlight',
          description: 'Streetlight not working since last week',
          category: 'Lighting',
          status: 'In Progress',
          location: { lat: 28.6129, lng: 77.2100 },
          upvotes: 3,
          userId: '2',
          user: { id: '2', username: 'jane_smith', email: 'jane@example.com', role: 'user', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      setIssues(mockIssues)
    } catch (error) {
      console.error('Failed to fetch issues:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    if (auth.isLoggedIn()) {
      setSelectedLocation({ lat, lng })
      setShowAddModal(true)
    } else {
      alert('Please login to report an issue')
    }
  }

  const handleAddIssue = async (data: CreateIssueData) => {
    try {
      setIsSubmitting(true)
      
      // Mock creating issue
      const newIssue: Issue = {
        id: Math.random().toString(),
        title: data.title,
        description: data.description,
        category: data.category,
        status: 'Open',
        location: data.location,
        upvotes: 0,
        userId: '1',
        user: { id: '1', username: 'current_user', email: 'user@example.com', role: 'user', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setIssues(prev => [newIssue, ...prev])
      setShowAddModal(false)
      setSelectedLocation(null)
    } catch (error) {
      console.error('Failed to create issue:', error)
      alert('Failed to create issue. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpvote = async (issueId: string) => {
    if (!auth.isLoggedIn()) {
      alert('Please login to upvote')
      return
    }

    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, upvotes: issue.upvotes + 1 }
        : issue
    ))
  }

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || issue.category === selectedCategory
    const matchesStatus = !selectedStatus || issue.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = [...new Set(issues.map(issue => issue.category))].sort()
  const statuses = ['Open', 'In Progress', 'Resolved']

  const openIssues = issues.filter(issue => issue.status === 'Open').length
  const inProgressIssues = issues.filter(issue => issue.status === 'In Progress').length
  const resolvedIssues = issues.filter(issue => issue.status === 'Resolved').length

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
            NAAGRIK
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Empowering <span className="text-indigo-600 font-semibold">Communities</span> for a Better Tomorrow
          </p>
          <p className="text-gray-500 mb-8">
            Report, track, and resolve local issues together. Your voice, your city, your change.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{issues.length}</div>
              <div className="text-sm text-gray-600">Total Issues</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{openIssues}</div>
              <div className="text-sm text-gray-600">Open</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{inProgressIssues}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{resolvedIssues}</div>
              <div className="text-sm text-gray-600">Resolved</div>
            </div>
          </div>

          {auth.isLoggedIn() && (
            <Button 
              onClick={() => setShowAddModal(true)}
              size="lg"
              className="gap-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Report New Issue
            </Button>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Section */}
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Interactive Map</span>
                  <span className="text-sm text-gray-500 font-normal">
                    Click to report an issue
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full pb-6">
                <MapComponent
                  issues={filteredIssues}
                  onMapClick={handleMapClick}
                  selectedIssue={selectedIssue}
                />
              </CardContent>
            </Card>

            {/* Issues List Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Filter & Search</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search issues..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    
                    <select
                      className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Issues ({filteredIssues.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <IssueList
                    issues={filteredIssues}
                    onIssueSelect={setSelectedIssue}
                    selectedIssue={selectedIssue}
                    onUpvote={handleUpvote}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Add Issue Modal */}
      <AddIssueModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setSelectedLocation(null)
        }}
        onSubmit={handleAddIssue}
        isLoading={isSubmitting}
        selectedLocation={selectedLocation}
      />
    </Layout>
  )
}

export default HomePage
