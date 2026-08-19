import type { Job } from '../../types'
import { currency } from '../../utils/formatters'
import { Card } from '../common/Card'

export const JobCard = ({ job }: { job: Job }) => (
  <Card className='space-y-1'>
    <h4 className='font-semibold text-slate-900'>{job.title}</h4>
    <p className='text-sm text-slate-600'>{job.address}</p>
    <p className='text-sm capitalize text-slate-700'>Status: {job.status.replace('_', ' ')}</p>
    <p className='text-sm font-medium text-emerald-700'>{currency(job.price)}</p>
  </Card>
)
