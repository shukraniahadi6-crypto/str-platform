import { Card } from '../../components/common/Card'
import { mockJobs } from '../../data/mockData'

export const AdminJobsPage = () => (
  <Card>
    <h1 className='text-xl font-bold'>Jobs Overview</h1>
    <p className='mt-2 text-sm text-slate-600'>Total tracked jobs: {mockJobs.length}</p>
  </Card>
)
