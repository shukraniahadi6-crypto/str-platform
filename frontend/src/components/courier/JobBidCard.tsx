import type { Job } from '../../types'
import { currency } from '../../utils/formatters'
import { Button } from '../common/Button'
import { Card } from '../common/Card'

export const JobBidCard = ({ job }: { job: Job }) => (
  <Card className='space-y-2'>
    <h4 className='font-semibold text-slate-900'>{job.title}</h4>
    <p className='text-sm text-slate-600'>{job.address}</p>
    <div className='flex items-center justify-between'>
      <span className='text-sm font-medium text-emerald-700'>{currency(job.price)}</span>
      <Button variant='secondary'>Place Bid</Button>
    </div>
  </Card>
)
