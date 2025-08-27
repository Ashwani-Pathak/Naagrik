import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { IssueStatus } from '@/types'

interface Params {
  id: string
}

// PUT /api/issues/[id]/status - Update issue status (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // Check authentication and admin role
    const user = verifyToken(request)
    if (!user) {
      return Response.json({ message: 'No token, authorization denied' }, { status: 401 })
    }
    if (user.role !== 'ADMIN') {
      return Response.json({ message: 'Admin access required' }, { status: 403 })
    }
    
    const { status } = await request.json()
    
    if (!['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
      return Response.json(
        { message: 'Invalid status' },
        { status: 400 }
      )
    }

    const issue = await prisma.issue.update({
      where: { id: params.id },
      data: { status: status as IssueStatus },
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

    if (!issue) {
      return Response.json(
        { message: 'Issue not found' },
        { status: 404 }
      )
    }

    return Response.json(issue)
  } catch (error) {
    console.error('Update status error:', error)
    return Response.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/issues/[id]/status - Delete issue (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    // Check authentication and admin role
    const user = verifyToken(request)
    if (!user) {
      return Response.json({ message: 'No token, authorization denied' }, { status: 401 })
    }
    if (user.role !== 'ADMIN') {
      return Response.json({ message: 'Admin access required' }, { status: 403 })
    }
    
    const issue = await prisma.issue.delete({
      where: { id: params.id }
    })
    
    if (!issue) {
      return Response.json(
        { message: 'Issue not found' },
        { status: 404 }
      )
    }

    return Response.json({ message: 'Issue deleted' })
  } catch (error) {
    console.error('Delete issue error:', error)
    return Response.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}
