import { Link } from 'react-router-dom'
import { Button } from '../components/common/Button'

export const NotFoundPage = () => (
  <div className='mx-auto max-w-xl px-4 py-14 text-center'>
    <h1 className='text-3xl font-bold text-slate-900'>404</h1>
    <p className='mt-2 text-slate-600'>The page you requested does not exist.</p>
    <Link to='/' className='mt-5 inline-block'>
      <Button>Back to Home</Button>
    </Link>
  </div>
)
