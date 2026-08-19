import { Card } from '../common/Card'

export const EcoImpactCard = ({ points }: { points: number }) => (
  <Card>
    <h3 className='text-lg font-semibold text-slate-900'>Eco Impact</h3>
    <p className='mt-2 text-sm text-slate-600'>Estimated CO₂ savings and recycling contribution.</p>
    <p className='mt-3 text-2xl font-bold text-emerald-700'>{points} pts</p>
  </Card>
)
