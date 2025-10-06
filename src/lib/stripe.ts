import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20'
})

export interface SubscriptionPlan {
  id: string
  name: string
  nameNorwegian: string
  description: string
  descriptionNorwegian: string
  price: number
  currency: 'NOK'
  interval: 'month' | 'year'
  features: string[]
  featuresNorwegian: string[]
  stripePriceId: string
  popular?: boolean
}

export interface PaymentResult {
  success: boolean
  sessionId?: string
  errorMessage?: string
  subscriptionId?: string
}

export interface CustomerInfo {
  email: string
  name: string
  metadata?: Record<string, string>
}

export class StripeService {
  // Norwegian subscription plans
  static readonly SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Gratis',
      nameNorwegian: 'Gratis',
      description: 'Perfect for getting started',
      descriptionNorwegian: 'Perfekt for å komme i gang',
      price: 0,
      currency: 'NOK',
      interval: 'month',
      features: [
        '3 stories per month',
        'Basic recording quality',
        'Share with 2 family members',
        'Email support'
      ],
      featuresNorwegian: [
        '3 historier per måned',
        'Standard opptakskvalitet',
        'Del med 2 familiemedlemmer',
        'E-post support'
      ],
      stripePriceId: '', // Free plan has no Stripe price
    },
    {
      id: 'premium',
      name: 'Premium',
      nameNorwegian: 'Premium',
      description: 'Full access to all features',
      descriptionNorwegian: 'Full tilgang til alle funksjoner',
      price: 149,
      currency: 'NOK',
      interval: 'month',
      features: [
        'Unlimited stories',
        'High-quality recording',
        'Voice cloning with ElevenLabs',
        'AI story assistance',
        'Share with unlimited family',
        'Automatic transcription',
        'Priority support'
      ],
      featuresNorwegian: [
        'Ubegrenset historier',
        'Høykvalitets opptak',
        'Stemmekloning med ElevenLabs',
        'AI historieassistanse',
        'Del med ubegrenset familie',
        'Automatisk transkripsjon',
        'Prioritert support'
      ],
      stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID!,
      popular: true
    },
    {
      id: 'family',
      name: 'Family',
      nameNorwegian: 'Familie',
      description: 'Perfect for large families',
      descriptionNorwegian: 'Perfekt for store familier',
      price: 249,
      currency: 'NOK',
      interval: 'month',
      features: [
        'Everything in Premium',
        'Up to 10 family accounts',
        'Family story collections',
        'Collaborative storytelling',
        'Family analytics dashboard',
        'Custom family domain'
      ],
      featuresNorwegian: [
        'Alt i Premium',
        'Opptil 10 familiekontoer',
        'Familie historiesamlinger',
        'Samarbeidshistorier',
        'Familie analyseoversikt',
        'Tilpasset familiedomene'
      ],
      stripePriceId: process.env.STRIPE_FAMILY_PRICE_ID!
    }
  ]

  // Create Stripe customer
  static async createCustomer(customerInfo: CustomerInfo): Promise<string> {
    try {
      const customer = await stripe.customers.create({
        email: customerInfo.email,
        name: customerInfo.name,
        metadata: {
          source: 'livets-stemme',
          ...customerInfo.metadata
        }
      })

      return customer.id
    } catch (error) {
      console.error('Failed to create Stripe customer:', error)
      throw new Error('Kunne ikke opprette kundekonto')
    }
  }

  // Create subscription checkout session
  static async createCheckoutSession(
    customerId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<PaymentResult> {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        locale: 'no', // Norwegian locale
        currency: 'nok',
        billing_address_collection: 'required',
        tax_id_collection: { enabled: true }, // For Norwegian tax numbers
        subscription_data: {
          metadata: {
            source: 'livets-stemme'
          }
        },
        customer_update: {
          address: 'auto',
          name: 'auto'
        }
      })

      return {
        success: true,
        sessionId: session.id
      }
    } catch (error) {
      console.error('Checkout session creation failed:', error)
      return {
        success: false,
        errorMessage: 'Kunne ikke starte betalingsprosess'
      }
    }
  }

  // Create one-time payment for voice cloning credits
  static async createVoiceCloningPayment(
    customerId: string,
    credits: number,
    successUrl: string,
    cancelUrl: string
  ): Promise<PaymentResult> {
    try {
      // Price per voice cloning credit (NOK)
      const pricePerCredit = 29
      const totalAmount = credits * pricePerCredit * 100 // Stripe uses øre

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price_data: {
              currency: 'nok',
              product_data: {
                name: `Stemmekloning Kreditter (${credits} stk)`,
                description: 'Lag dine egne stemmer med AI-teknologi',
                images: ['https://your-domain.com/voice-cloning-icon.jpg']
              },
              unit_amount: pricePerCredit * 100,
            },
            quantity: credits,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        locale: 'no',
        currency: 'nok',
        metadata: {
          type: 'voice_cloning_credits',
          credits: credits.toString()
        }
      })

      return {
        success: true,
        sessionId: session.id
      }
    } catch (error) {
      console.error('Voice cloning payment failed:', error)
      return {
        success: false,
        errorMessage: 'Kunne ikke behandle betaling for stemmekloning'
      }
    }
  }

  // Get customer's subscription status
  static async getSubscriptionStatus(customerId: string): Promise<{
    isActive: boolean
    plan: string | null
    currentPeriodEnd: Date | null
    cancelAtPeriodEnd: boolean
    subscriptionId: string | null
  }> {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1
      })

      if (subscriptions.data.length === 0) {
        return {
          isActive: false,
          plan: null,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          subscriptionId: null
        }
      }

      const subscription = subscriptions.data[0]
      const priceId = subscription.items.data[0]?.price.id
      const plan = this.SUBSCRIPTION_PLANS.find(p => p.stripePriceId === priceId)

      return {
        isActive: true,
        plan: plan?.id || 'unknown',
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        subscriptionId: subscription.id
      }
    } catch (error) {
      console.error('Failed to get subscription status:', error)
      return {
        isActive: false,
        plan: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        subscriptionId: null
      }
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      })
      return true
    } catch (error) {
      console.error('Failed to cancel subscription:', error)
      return false
    }
  }

  // Reactivate cancelled subscription
  static async reactivateSubscription(subscriptionId: string): Promise<boolean> {
    try {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      })
      return true
    } catch (error) {
      console.error('Failed to reactivate subscription:', error)
      return false
    }
  }

  // Update subscription plan
  static async updateSubscriptionPlan(
    subscriptionId: string,
    newPriceId: string
  ): Promise<boolean> {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId)

      await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: 'create_prorations'
      })

      return true
    } catch (error) {
      console.error('Failed to update subscription:', error)
      return false
    }
  }

  // Get customer's payment methods
  static async getPaymentMethods(customerId: string) {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      })

      return paymentMethods.data.map(pm => ({
        id: pm.id,
        brand: pm.card?.brand,
        last4: pm.card?.last4,
        expMonth: pm.card?.exp_month,
        expYear: pm.card?.exp_year
      }))
    } catch (error) {
      console.error('Failed to get payment methods:', error)
      return []
    }
  }

  // Handle webhook events
  static async handleWebhook(
    body: string,
    signature: string
  ): Promise<{ success: boolean; event?: Stripe.Event }> {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )

      // Handle different event types
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
          break

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          await this.handleSubscriptionChange(event.data.object as Stripe.Subscription)
          break

        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice)
          break

        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice)
          break
      }

      return { success: true, event }
    } catch (error) {
      console.error('Webhook handling failed:', error)
      return { success: false }
    }
  }

  // Private webhook handlers
  private static async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    // Update user subscription status in your database
    console.log('Checkout completed for customer:', session.customer)
  }

  private static async handleSubscriptionChange(subscription: Stripe.Subscription) {
    // Update user subscription in your database
    console.log('Subscription changed:', subscription.id)
  }

  private static async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    // Handle successful payment
    console.log('Payment succeeded for:', invoice.customer)
  }

  private static async handlePaymentFailed(invoice: Stripe.Invoice) {
    // Handle failed payment - send notification to user
    console.log('Payment failed for:', invoice.customer)
  }
}

// Norwegian pricing formatter
export function formatNorwegianPrice(amount: number, currency: string = 'NOK'): string {
  return new Intl.NumberFormat('no-NO', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

// VAT calculator for Norwegian prices
export function calculateNorwegianVAT(amount: number): {
  amountWithoutVAT: number
  vatAmount: number
  totalAmount: number
} {
  const vatRate = 0.25 // 25% VAT in Norway
  const amountWithoutVAT = amount / (1 + vatRate)
  const vatAmount = amount - amountWithoutVAT

  return {
    amountWithoutVAT: Math.round(amountWithoutVAT * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    totalAmount: amount
  }
}
