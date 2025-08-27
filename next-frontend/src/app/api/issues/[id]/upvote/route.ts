import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

interface Params {
  id: string
}

// POST /api/issues/[id]/upvote - Upvote an issue (public)
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const issue = await prisma.issue.update({
      where: { id: params.id },
      data: {
        upvotes: {
          increment: 1
        }
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

    if (!issue) {
      return Response.json(
        { message: 'Issue not found' },
        { status: 404 }
      )
    }

    return Response.json(issue)
  } catch (error) {
    console.error('Upvote error:', error)
    return Response.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}
