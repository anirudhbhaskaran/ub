// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/home'},
    { name: 'Services', href: '/services' },
    { name: 'Routes', href: '/routes' },
    { name: 'Procedures', href: '/procedures' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="text-xl font-bold mb-6">🛠️ Builder</div>
      <nav className="space-y-2">
        {links.map(link => (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'block px-3 py-2 rounded-md text-sm font-medium',
              pathname?.startsWith(link.href)
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
