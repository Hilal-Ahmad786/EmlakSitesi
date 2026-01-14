'use client';

import { usePathname } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  Heart,
  Search,
  Bell,
  Calendar,
  Clock,
  Settings,
  LogOut,
} from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useAlerts } from '@/context/AlertsContext';
import { useAppointments } from '@/context/AppointmentsContext';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  locale: string;
}

export function DashboardSidebar({ locale }: DashboardSidebarProps) {
  const t = useTranslations('Dashboard');
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const { activeAlertCount } = useAlerts();
  const { upcomingAppointments } = useAppointments();

  const navItems = [
    {
      href: `/${locale}/dashboard`,
      label: t('nav.overview'),
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: `/${locale}/dashboard/favorites`,
      label: t('nav.favorites'),
      icon: Heart,
      badge: favorites.length,
    },
    {
      href: `/${locale}/dashboard/searches`,
      label: t('nav.savedSearches'),
      icon: Search,
    },
    {
      href: `/${locale}/dashboard/alerts`,
      label: t('nav.alerts'),
      icon: Bell,
      badge: activeAlertCount,
    },
    {
      href: `/${locale}/dashboard/appointments`,
      label: t('nav.appointments'),
      icon: Calendar,
      badge: upcomingAppointments.length,
    },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside className="bg-white rounded-xl border border-border overflow-hidden">
      {/* User Profile Section */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-semibold">
            U
          </div>
          <div>
            <h3 className="font-semibold">{t('welcomeBack')}</h3>
            <p className="text-sm text-white/70">{t('guestUser')}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-lg transition-colors',
                    active
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={cn(
                        'px-2 py-0.5 text-xs font-semibold rounded-full',
                        active ? 'bg-white text-primary' : 'bg-primary text-white'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="my-4 border-t border-border" />

        {/* Secondary Navigation */}
        <ul className="space-y-1">
          <li>
            <Link
              href={`/${locale}/dashboard`}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Clock size={20} />
              <span className="font-medium">{t('nav.recentlyViewed')}</span>
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/contact`}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Settings size={20} />
              <span className="font-medium">{t('nav.settings')}</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors">
          <LogOut size={20} />
          <span className="font-medium">{t('nav.signOut')}</span>
        </button>
      </div>
    </aside>
  );
}
