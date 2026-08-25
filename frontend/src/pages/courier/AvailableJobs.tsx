import { JobBidCard } from '../../components/courier/JobBidCard'
import { mockJobs } from '../../data/mockData'

export const CourierAvailableJobsPage = () => (
  <div className='grid gap-3 md:grid-cols-2'>
    {mockJobs.map((job) => (
      <JobBidCard key={job.id} job={job} />
    ))}
  </div>
)
