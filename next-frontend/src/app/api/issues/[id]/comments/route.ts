import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

interface Params {
  id: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { text } = await request.json()
    
    if (!text) {
      return Response.json(
        { message: 'Comment text required' },
        { status: 400 }
      )
    }

    const user = verifyToken(request)
    if (!user) {
      return Response.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const comment = await prisma.comment.create({
      data: {
        text: text,
        issueId: params.id,
        createdBy: user.userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    })
    
    return Response.json(comment, { status: 201 })
  } catch (error) {
    console.error('Comment creation error:', error)
    return Response.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}
