'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Heart, User } from 'lucide-react';

const tabs = [
  { href: '/home', icon: Flame, label: 'Discover' },
  { href: '/matches', icon: Heart, label: 'Matches' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav({ active }: { active: string }) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 bottom-safe border-t border-white/5 bg-[#0A0A0F]/90 backdrop-blur-xl">
      {tabs.map(({ href, icon: Icon, label }) => {
        const isActive = pathname.startsWith(href);
        return (
          <Link key={href} href={href} className="flex flex-col items-center gap-0.5 py-2 px-6 relative">
            <Icon
              size={24}
              className={`transition-colors ${isActive ? 'text-primary' : 'text-gray-600'}`}
              fill={isActive ? 'currentColor' : 'none'}
            />
            {isActive && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
