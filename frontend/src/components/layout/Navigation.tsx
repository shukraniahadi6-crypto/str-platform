import Link from 'next/link';

export function Navigation({ links }: { links: { href: string; label: string }[] }) {
  return (
    <nav className='space-y-1'>
      {links.map((link) => (
        <Link key={link.href} className='block rounded px-2 py-1 hover:bg-slate-100' href={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
