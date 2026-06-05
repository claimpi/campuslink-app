'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Heart, User, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { href: '/home', icon: Flame, label: 'Discover' },
  { href: '/matches', icon: Heart, label: 'Matches' },
  { href: '/likes', icon: Star, label: 'Likes' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="tab-bar">
      {tabs.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link key={href} href={href} className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2">
            <div className="relative">
              <Icon
                size={24}
                className={`transition-all duration-200 ${isActive ? 'text-primary' : 'text-gray-600'}`}
                fill={isActive ? 'currentColor' : 'none'}
                strokeWidth={isActive ? 0 : 1.8}
              />
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
