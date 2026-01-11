'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/admin/utils';
import {
  LayoutDashboard,
  Building2,
  MapPin,
  FileText,
  Users,
  MessageSquare,
  Settings,
  Search,
  Image,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Globe,
  Link2,
  FileSearch,
  BarChart3,
} from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
  badge?: number;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: 'Properties',
    href: '/admin/properties',
    icon: <Building2 size={20} />,
  },
  {
    label: 'Neighborhoods',
    href: '/admin/neighborhoods',
    icon: <MapPin size={20} />,
  },
  {
    label: 'Blog',
    href: '/admin/blog',
    icon: <FileText size={20} />,
  },
  {
    label: 'Leads',
    href: '/admin/leads',
    icon: <MessageSquare size={20} />,
    badge: 5,
  },
  {
    label: 'SEO',
    icon: <Search size={20} />,
    children: [
      { label: 'Global SEO', href: '/admin/seo?tab=global' },
      { label: 'Redirects', href: '/admin/seo?tab=redirects' },
      { label: 'Sitemap', href: '/admin/seo?tab=sitemap' },
      { label: 'Robots.txt', href: '/admin/seo?tab=robots' },
    ],
  },
  {
    label: 'Media Library',
    href: '/admin/media',
    icon: <Image size={20} />,
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: <Users size={20} />,
  },
  {
    label: 'Settings',
    icon: <Settings size={20} />,
    children: [
      { label: 'General', href: '/admin/settings' },
      { label: 'Contact', href: '/admin/settings/contact' },
      { label: 'Social Media', href: '/admin/settings/social' },
      { label: 'Analytics', href: '/admin/settings/analytics' },
    ],
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export function AdminSidebar({ isOpen, onClose, locale }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['SEO', 'Settings']);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
  };

  const isChildActive = (children: { label: string; href: string }[]) => {
    return children.some(child => isActive(child.href));
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-primary-dark text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <Link href={`/${locale}/admin/dashboard`} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent-gold rounded-lg flex items-center justify-center font-bold text-primary-dark">
              M
            </div>
            <span className="font-serif text-lg">Admin Panel</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.label}>
                {item.children ? (
                  // Expandable item
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.label)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isChildActive(item.children)
                          ? 'bg-white/10 text-white'
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {expandedItems.includes(item.label) ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>

                    {expandedItems.includes(item.label) && (
                      <ul className="mt-1 ml-8 space-y-1">
                        {item.children.map(child => (
                          <li key={child.href}>
                            <Link
                              href={`/${locale}${child.href}`}
                              className={cn(
                                'block px-3 py-2 rounded-lg text-sm transition-colors',
                                isActive(child.href)
                                  ? 'bg-accent-gold text-primary-dark font-medium'
                                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  // Single item
                  <Link
                    href={`/${locale}${item.href}`}
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive(item.href!)
                        ? 'bg-accent-gold text-primary-dark'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Globe size={20} />
            <span>View Website</span>
          </Link>
          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-red-400 transition-colors mt-1"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
