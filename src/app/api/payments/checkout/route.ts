import { NextRequest, NextResponse } from 'next/server'
import { StripeService } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      priceId,
      customerId,
      customerEmail,
      customerName,
      successUrl,
      cancelUrl
    } = body

    if (!priceId) {
      return NextResponse.json(
        { error: 'Pris-ID er påkrevd' },
        { status: 400 }
      )
    }

    let finalCustomerId = customerId

    // Create customer if not provided
    if (!customerId && customerEmail && customerName) {
      finalCustomerId = await StripeService.createCustomer({
        email: customerEmail,
        name: customerName,
        metadata: {
          source: 'livets-stemme-checkout'
        }
      })
    }

    if (!finalCustomerId) {
      return NextResponse.json(
        { error: 'Kunde-informasjon er påkrevd' },
        { status: 400 }
      )
    }

    // Create checkout session
    const result = await StripeService.createCheckoutSession(
      finalCustomerId,
      priceId,
      successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`
    )

    if (!result.success) {
      return NextResponse.json(
        { error: result.errorMessage },
        { status: 500 }
      )
    }

    return NextResponse.json({
      sessionId: result.sessionId,
      customerId: finalCustomerId
    })
  } catch (error) {
    console.error('Checkout creation error:', error)
    return NextResponse.json(
      { error: 'Kunne ikke starte betalingsprosess' },
      { status: 500 }
    )
  }
}
