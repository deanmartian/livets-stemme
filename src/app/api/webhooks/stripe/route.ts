import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { StripeService } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Mangler Stripe signatur' },
        { status: 400 }
      )
    }

    const result = await StripeService.handleWebhook(body, signature)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Webhook behandling feilet' },
        { status: 400 }
      )
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook feilet' },
      { status: 500 }
    )
  }
}
