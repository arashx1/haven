import { useApp, type Route } from '@/context/AppContext';
import { Home, Brain, Images, Users, LifeBuoy } from 'lucide-react';

const NAV_ITEMS: { route: Route; label: string; icon: typeof Home }[] = [
  { route: 'my-day', label: 'My Day', icon: Home },
  { route: 'play', label: 'Play', icon: Brain },
  { route: 'memories', label: 'Memories', icon: Images },
  { route: 'people', label: 'My People', icon: Users },
  { route: 'help', label: 'Help', icon: LifeBuoy },
];

export function BottomNav() {
  const { route, navigate } = useApp();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-cream-200 shadow-[0_-4px_20px_-4px_rgba(61,53,48,0.08)]">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="flex items-stretch justify-around gap-1 py-2">
          {NAV_ITEMS.map(({ route: navRoute, label, icon: Icon }) => {
            const active = route === navRoute || (navRoute === 'memories' && route === 'memory-detail') || (navRoute === 'people' && route === 'person-detail');
            return (
              <button
                key={navRoute}
                onClick={() => navigate(navRoute)}
                className={`nav-item flex-1 ${active ? 'nav-item-active' : 'nav-item-inactive'}`}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
              >
                <Icon
                  className={`w-7 h-7 sm:w-8 sm:h-8 ${active ? 'text-honey-600' : ''}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className="text-xs sm:text-sm font-bold leading-tight">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
