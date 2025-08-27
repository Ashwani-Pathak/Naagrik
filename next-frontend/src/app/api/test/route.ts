import { prisma } from '@/lib/db'

export async function POST() {
  try {
    // Test database connection by running a simple query
    const userCount = await prisma.user.count()

    return Response.json({ 
      message: 'API is working!',
      database: 'Connected via Prisma',
      userCount,
      timestamp: new Date().toISOString()
    })
  } catch (error: unknown) {
    return Response.json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
