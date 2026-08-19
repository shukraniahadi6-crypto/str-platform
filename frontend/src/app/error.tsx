'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <div className='mx-auto max-w-xl p-8'>
      <h2 className='text-2xl font-semibold'>Something went wrong.</h2>
      <button className='mt-4 rounded bg-slate-900 px-4 py-2 text-white' onClick={reset}>Try again</button>
    </div>
  );
}
