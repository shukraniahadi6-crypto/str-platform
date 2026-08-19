import { NavLink } from 'react-router-dom'

interface SidebarItem {
  label: string
  to: string
}

export const Sidebar = ({ items }: { items: SidebarItem[] }) => (
  <aside className='w-full rounded-xl border border-slate-200 bg-white p-4 lg:w-72'>
    <nav className='space-y-1'>
      {items.map((item) => (
        <NavLink
          key={item.to}
          className={({ isActive }) =>
            `block rounded-md px-3 py-2 text-sm ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`
          }
          to={item.to}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
)
