import { CustomerCard } from '../../components/customer/CustomerCard'
import { EcoImpactCard } from '../../components/customer/EcoImpactCard'
import { JobCard } from '../../components/customer/JobCard'
import { EmptyState } from '../../components/common/EmptyState'
import { LoadingState } from '../../components/common/LoadingState'
import { useJobs } from '../../hooks/useJobs'

export const CustomerDashboardPage = () => {
  const { jobs, loading } = useJobs()
  const points = jobs.reduce((sum, job) => sum + job.ecoPoints, 0)

  return (
    <div className='space-y-4'>
      <CustomerCard />
      <EcoImpactCard points={points} />
      {loading ? <LoadingState /> : null}
      {!loading && jobs.length === 0 ? <EmptyState message='No jobs found.' /> : null}
      <div className='grid gap-3 md:grid-cols-2'>
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}
