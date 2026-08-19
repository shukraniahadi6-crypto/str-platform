import { useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { createPaymentIntent } from '../services/payments'

export const CheckoutPaymentPage = () => {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    const result = await createPaymentIntent(25)
    setLoading(false)
    toast.success(`Mock Stripe intent created: ${result.clientSecret}`)
  }

  return (
    <Card className='space-y-3'>
      <h1 className='text-xl font-bold'>Checkout & Payment</h1>
      <p className='text-sm text-slate-600'>Ready for Stripe Elements integration.</p>
      <Button disabled={loading} onClick={handlePayment}>
        {loading ? 'Processing...' : 'Pay $25'}
      </Button>
    </Card>
  )
}
