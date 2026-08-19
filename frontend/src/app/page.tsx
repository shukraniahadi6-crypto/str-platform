import Link from 'next/link';
import { Card } from '@/components/common/Card';

export default function LandingPage() {
  return (
    <div className='mx-auto max-w-7xl space-y-10 px-4 py-10'>
      <section className='space-y-4'>
        <h1 className='text-4xl font-bold'>Schedule smarter pickups with STR</h1>
        <p className='max-w-2xl text-slate-600'>
          Real-time eco-friendly trash pickup marketplace connecting customers, couriers, and city operations.
        </p>
        <div className='flex gap-3'>
          <Link className='rounded bg-green-600 px-4 py-2 text-white' href='/signup'>Get started</Link>
          <Link className='rounded border px-4 py-2' href='/login'>Sign in</Link>
        </div>
      </section>
      <section className='grid gap-4 md:grid-cols-3'>
        {['Vendor dashboard', 'Courier earnings', 'Admin analytics'].map((title) => (
          <Card key={title}><h2 className='font-semibold'>{title}</h2><p className='text-sm text-slate-600'>Operational tools with real-time updates.</p></Card>
        ))}
      </section>
    </div>
  );
}
