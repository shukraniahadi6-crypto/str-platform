import { Card } from '../../components/common/Card'
import { mockEarnings } from '../../data/mockData'
import { currency } from '../../utils/formatters'

export const CourierEarningsPage = () => (
  <Card className='space-y-2'>
    <h1 className='text-xl font-bold'>Earnings Dashboard</h1>
    <p>Week: {mockEarnings.week}</p>
    <p>Total: {currency(mockEarnings.total)}</p>
    <p>Pending payout: {currency(mockEarnings.payoutsPending)}</p>
  </Card>
)
