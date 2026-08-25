import { Card } from '../components/common/Card'

export const ErrorPage = () => (
  <Card>
    <h1 className='text-xl font-bold text-red-700'>Application Error</h1>
    <p className='mt-2 text-sm text-slate-600'>An unexpected error occurred. Please retry or contact support.</p>
  </Card>
)
