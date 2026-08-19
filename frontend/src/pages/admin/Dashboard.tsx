import { ReportCard } from '../../components/admin/ReportCard'

export const AdminDashboardPage = () => (
  <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
    <ReportCard title='Active Users' value='1,240' />
    <ReportCard title='Open Jobs' value='136' />
    <ReportCard title='Revenue (MTD)' value='$48,400' />
    <ReportCard title='Disputes' value='7' />
  </div>
)
