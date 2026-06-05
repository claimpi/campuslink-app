'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Heart, User } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { href: '/home', icon: Flame, label: 'Discover' },
  { href: '/matches', icon: Heart, label: 'Matches' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="tab-bar">
      {tabs.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link key={href} href={href} className="flex flex-col items-center justify-center gap-1 flex-1 py-2">
            <div className="relative">
              <Icon
                size={24}
                className={`transition-all duration-200 ${isActive ? 'text-primary scale-110' : 'text-gray-600'}`}
                fill={isActive ? 'currentColor' : 'none'}
                strokeWidth={isActive ? 0 : 2}
              />
              {isActive && (
                <motion.div
                  layoutId="tab-dot"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
