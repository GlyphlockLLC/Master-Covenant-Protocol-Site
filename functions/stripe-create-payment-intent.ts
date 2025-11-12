/**
 * Create Stripe Payment Intent
 * 
 * Creates a payment intent for consultation booking
 * 
 * @param {string} consultationId - Consultation record ID
 * @param {number} amount - Amount in USD cents (e.g., 29900 = $299.00)
 * @param {string} email - Customer email
 * @param {string} name - Customer name
 * @returns {object} Payment intent with client_secret
 */

export default async function handler({ consultationId, amount, email, name }, { secrets, entities }) {
  try {
    const STRIPE_SECRET_KEY = secrets.STRIPE_SECRET_KEY;
    
    if (!STRIPE_SECRET_KEY) {
      throw new Error('Stripe secret key not configured');
    }

    // Create Stripe payment intent
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        amount: amount.toString(),
        currency: 'usd',
        'metadata[consultation_id]': consultationId,
        'metadata[customer_email]': email,
        'metadata[customer_name]': name,
        description: `GlyphLock Security Consultation - ${name}`,
        receipt_email: email,
        'automatic_payment_methods[enabled]': 'true'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create payment intent');
    }

    const paymentIntent = await response.json();

    // Update consultation with payment intent ID
    await entities.Consultation.update(consultationId, {
      stripe_payment_intent_id: paymentIntent.id,
      transaction_id: `TX${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };

  } catch (error) {
    console.error('Stripe payment intent creation failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}