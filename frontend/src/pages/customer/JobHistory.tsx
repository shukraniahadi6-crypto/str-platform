import { Card } from '../../components/common/Card'
import { useJobs } from '../../hooks/useJobs'

export const CustomerJobHistoryPage = () => {
  const { jobs } = useJobs()

  return (
    <Card>
      <h1 className='text-xl font-bold'>Job History</h1>
      <ul className='mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600'>
        {jobs.map((job) => (
          <li key={job.id}>{job.title}</li>
        ))}
      </ul>
    </Card>
  )
}
