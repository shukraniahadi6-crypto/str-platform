import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export function Header() {
  return (
    <header className='border-b bg-white'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3'>
        <Link href='/' className='font-bold'>{APP_NAME}</Link>
        <nav className='flex gap-3 text-sm'>
          <Link href='/login'>Login</Link>
          <Link href='/signup'>Sign up</Link>
        </nav>
      </div>
    </header>
  );
}
