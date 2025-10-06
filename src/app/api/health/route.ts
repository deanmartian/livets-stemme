import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Basic health check
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      region: process.env.VERCEL_REGION || 'unknown',
      version: '5.0.0',
      services: {
        database: 'checking...',
        ai: 'checking...',
        payments: 'checking...'
      }
    }

    // Check Supabase connection
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        healthCheck.services.database = 'configured'
      } else {
        healthCheck.services.database = 'not configured'
      }
    } catch (error) {
      healthCheck.services.database = 'error'
    }

    // Check AI services
    try {
      if (process.env.OPENAI_API_KEY && process.env.ELEVENLABS_API_KEY) {
        healthCheck.services.ai = 'configured'
      } else {
        healthCheck.services.ai = 'not configured'
      }
    } catch (error) {
      healthCheck.services.ai = 'error'
    }

    // Check Stripe
    try {
      if (process.env.STRIPE_SECRET_KEY) {
        healthCheck.services.payments = 'configured'
      } else {
        healthCheck.services.payments = 'not configured'
      }
    } catch (error) {
      healthCheck.services.payments = 'error'
    }

    return NextResponse.json(healthCheck, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 500 }
    )
  }
}

export async function HEAD(request: NextRequest) {
  // Simple HEAD request for uptime monitoring
  return new NextResponse(null, { status: 200 })
}
