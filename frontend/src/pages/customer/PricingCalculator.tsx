import { useMemo, useState } from 'react'
import { Card } from '../../components/common/Card'
import { Input } from '../../components/common/Input'
import { currency } from '../../utils/formatters'

export const PricingCalculatorPage = () => {
  const [bags, setBags] = useState(1)
  const [distance, setDistance] = useState(1)

  const total = useMemo(() => bags * 6 + distance * 1.5, [bags, distance])

  return (
    <Card className='space-y-3'>
      <h1 className='text-xl font-bold'>Pricing Calculator</h1>
      <label className='block text-sm'>
        Bags
        <Input type='number' value={bags} onChange={(e) => setBags(Number(e.target.value))} />
      </label>
      <label className='block text-sm'>
        Distance (km)
        <Input type='number' value={distance} onChange={(e) => setDistance(Number(e.target.value))} />
      </label>
      <p className='font-semibold text-emerald-700'>Estimated total: {currency(total)}</p>
    </Card>
  )
}
