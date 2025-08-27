import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { CreateIssueData } from '@/types'

// GET /api/issues - Get all issues
export async function GET() {
  try {
    const issues = await prisma.issue.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            avatar: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return Response.json(issues)
  } catch (error) {
    console.error('Fetch issues error:', error)
    return Response.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}

// POST /api/issues - Create new issue (authenticated)
export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const data: CreateIssueData = await request.json()
    
    if (!data.title || !data.description || !data.category || !data.location) {
      return Response.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    const issue = await prisma.issue.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        photo: data.photo,
        location: {
          lat: data.location.lat,
          lng: data.location.lng
        },
        createdBy: user.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            avatar: true
          }
        }
      }
    })

    return Response.json(issue, { status: 201 })
  } catch (error) {
    console.error('Create issue error:', error)
    return Response.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
})
