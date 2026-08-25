import type { PropsWithChildren } from 'react'
import { Sidebar } from './Sidebar'

export const DashboardLayout = ({
  items,
  children,
}: PropsWithChildren<{ items: { label: string; to: string }[] }>) => (
  <div className='mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 lg:flex-row'>
    <Sidebar items={items} />
    <main className='flex-1 space-y-4'>{children}</main>
  </div>
)
