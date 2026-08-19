import { Link } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'

export const HomePage = () => (
  <div className='mx-auto grid w-full max-w-7xl gap-4 px-4 py-8'>
    <Card className='space-y-4'>
      <h1 className='text-3xl font-bold text-slate-900'>Eco-friendly pickup marketplace</h1>
      <p className='text-slate-600'>
        Connect customers and verified couriers for smart trash pickup, recycling, and tracking.
      </p>
      <div className='flex flex-wrap gap-2'>
        <Link to='/customer/create-job'>
          <Button>Request Pickup</Button>
        </Link>
        <Link to='/auth/login'>
          <Button variant='secondary'>Sign In</Button>
        </Link>
      </div>
    </Card>
  </div>
)
