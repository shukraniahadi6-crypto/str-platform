import { Sidebar } from '@/components/layout/Sidebar';

export function DashboardShell({ links, children }: { links: { href: string; label: string }[]; children: React.ReactNode }) {
  return (
    <div className='flex min-h-[calc(100vh-104px)]'>
      <Sidebar links={links} />
      <main className='flex-1 p-6'>{children}</main>
    </div>
  );
}
