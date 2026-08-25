import { CourierCard } from '../../components/courier/CourierCard'
import { JobBidCard } from '../../components/courier/JobBidCard'
import { RouteCard } from '../../components/courier/RouteCard'
import { mockJobs } from '../../data/mockData'
import { useCouriers } from '../../hooks/useCouriers'

export const CourierDashboardPage = () => {
  const couriers = useCouriers()

  return (
    <div className='space-y-4'>
      {couriers.map((courier) => (
        <CourierCard key={courier.id} courier={courier} profile={courier.profile} />
      ))}
      <RouteCard />
      <div className='grid gap-3 md:grid-cols-2'>
        {mockJobs.map((job) => (
          <JobBidCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}
