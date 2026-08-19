import { useParams } from 'react-router-dom'
import { Card } from '../../components/common/Card'
import { useJobs } from '../../hooks/useJobs'
import { currency, dateTime } from '../../utils/formatters'

export const CustomerJobDetailsPage = () => {
  const { id } = useParams()
  const { jobs } = useJobs()
  const job = jobs.find((item) => item.id === id)

  if (!job) return <Card>Job not found.</Card>

  return (
    <Card className='space-y-2'>
      <h1 className='text-xl font-bold'>{job.title}</h1>
      <p>{job.address}</p>
      <p>Status: {job.status}</p>
      <p>Price: {currency(job.price)}</p>
      <p>Created: {dateTime(job.createdAt)}</p>
    </Card>
  )
}
