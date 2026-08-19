import { Navigation } from '@/components/layout/Navigation';

export function Sidebar({ links }: { links: { href: string; label: string }[] }) {
  return (
    <aside className='w-64 border-r bg-white p-4'>
      <Navigation links={links} />
    </aside>
  );
}
