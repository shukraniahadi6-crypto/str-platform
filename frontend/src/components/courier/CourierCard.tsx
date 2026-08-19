import type { Courier, User } from '../../types'
import { Card } from '../common/Card'

export const CourierCard = ({ courier, profile }: { courier: Courier; profile?: User }) => (
  <Card className='space-y-1'>
    <h4 className='font-semibold text-slate-900'>{profile?.name ?? 'Courier'}</h4>
    <p className='text-sm text-slate-600'>Vehicle: {courier.vehicleType}</p>
    <p className='text-sm text-slate-600'>Rating: {courier.rating}</p>
    <p className='text-sm text-slate-600'>Completed jobs: {courier.completedJobs}</p>
  </Card>
)
