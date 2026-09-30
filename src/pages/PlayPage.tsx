import { PageHeader, SuccessToast, LoadingState, ErrorState } from '@/components/UI';
import { GameThumbnail } from '@/components/Illustration';
import { useGames } from '@/hooks/useGames';
import { useApp } from '@/context/AppContext';
import type { GameCategory } from '@/data/mockData';
import {
  Puzzle,
  Users,
  Palette,
  Play,
  Sparkles,
  Activity,
  MessageSquare,
  Volume2,
  ArrowLeft,
  CheckCircle,
  Heart,
  Star,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { useSubscription } from '@/hooks/useSubscription';

// Interactive mini-game components
import { MemoryMatchGame } from '@/components/games/MemoryMatchGame';
import { FamiliarFacesGame } from '@/components/games/FamiliarFacesGame';
import { SteadyTapGame } from '@/components/games/SteadyTapGame';
import { BubbleCatchGame } from '@/components/games/BubbleCatchGame';
import { WordConnectGame } from '@/components/games/WordConnectGame';
import { SentenceBuilderGame } from '@/components/games/SentenceBuilderGame';
import { ItemSortingGame } from '@/components/games/ItemSortingGame';
import { RoutineOrderGame } from '@/components/games/RoutineOrderGame';
import { ZenBloomGame } from '@/components/games/ZenBloomGame';
import { BreathingGame } from '@/components/games/BreathingGame';

const gameIcons: Record<string, typeof Puzzle> = {
  puzzle: Puzzle,
  users: Users,
  palette: Palette,
  activity: Activity,
  sparkles: Sparkles,
  messageSquare: MessageSquare,
  volume2: Volume2,
};

interface CategoryTab {
  id: 'all' | GameCategory;
  label: string;
  emoji: string;
  conditionHint?: string;
}

const CATEGORIES: CategoryTab[] = [
  { id: 'all', label: 'All Activities', emoji: '✨' },
  { id: 'memory', label: 'Memory', emoji: '🧠', conditionHint: 'dementia' },
  { id: 'motor', label: 'Gentle Touch', emoji: '✋', conditionHint: 'parkinsons' },
  { id: 'speech', label: 'Words & Voice', emoji: '🗣️', conditionHint: 'stroke' },
  { id: 'focus', label: 'Daily Focus', emoji: '🧩', conditionHint: 'mci' },
  { id: 'zen', label: 'Peace & Calm', emoji: '🌸', conditionHint: 'healthy_aging' },
];

export function PlayPage({ onUpgrade }: { onUpgrade?: () => void }) {
  const { games, loading, error } = useGames();
  const { isPro } = useSubscription();

  const { careCondition } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'all' | GameCategory>('all');
  const [playingGameId, setPlayingGameId] = useState<string | null>(null);
  const [lastFinishedTitle, setLastFinishedTitle] = useState<string | null>(null);

  const activeGame = useMemo(
    () => games.find((g) => g.id === playingGameId),
    [games, playingGameId]
  );

  const filteredGames = useMemo(() => {
    if (selectedCategory === 'all') return games;
    return games.filter((g) => g.category === selectedCategory);
  }, [games, selectedCategory]);

  const handleFinish = (gameTitle: string) => {
    setPlayingGameId(null);
    setLastFinishedTitle(gameTitle);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Play & Relax"
        subtitle="Simple, gentle games to brighten your day."
        icon={
          <div className="w-12 h-12 rounded-2xl bg-sage-100 flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-sage-600" />
          </div>
        }
        showBack={false}
      />

      {/* RevenueCat upgrade banner (shown to free users only) */}
      {!isPro && !playingGameId && (
        <div
          className="rounded-2xl mb-4 p-4 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a)', border: '2px solid #f59e0b' }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
            <Star className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-amber-900 text-sm">Unlock all games with Haven Plus</p>
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                1 Month Free
              </span>
            </div>
            <p className="text-amber-800 text-xs">Try all games, memories &amp; caregiver tools free for 30 days. Cancel anytime.</p>
          </div>
          <button
            type="button"
            onClick={onUpgrade}
            style={{ cursor: 'pointer', padding: '8px 16px', borderRadius: '999px', background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: 'white', fontWeight: 700, fontSize: '13px', border: 'none', whiteSpace: 'nowrap' }}
          >
            Try 1 Month Free
          </button>
        </div>
      )}

      {/* Active Game Player Frame */}

      {playingGameId && activeGame ? (
        <div className="animate-scaleIn">
          {/* Top navigation bar inside game */}
          <div className="card-base p-4 mb-6 flex flex-wrap items-center justify-between gap-3 border-2 border-sage-200">
            <button
              onClick={() => setPlayingGameId(null)}
              className="btn-secondary text-base py-2.5 px-4 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Games</span>
            </button>

            <div className="flex items-center gap-2 text-right">
              <span className="px-3 py-1 bg-sage-100 text-sage-800 font-bold rounded-full text-sm">
                {activeGame.categoryLabel}
              </span>
              <span className="hidden sm:inline text-xs font-semibold text-ink-400">
                {activeGame.recommendedFor}
              </span>
            </div>
          </div>

          {/* Interactive Game View */}
          <div className="card-base p-6 sm:p-10 border-2 border-sage-100 shadow-md">
            {activeGame.id === 'g1' && <MemoryMatchGame onFinish={() => handleFinish(activeGame.title)} />}
            {activeGame.id === 'g2' && <FamiliarFacesGame onFinish={() => handleFinish(activeGame.title)} />}
            {activeGame.id === 'g3' && <SteadyTapGame onFinish={() => handleFinish(activeGame.title)} />}
            {activeGame.id === 'g4' && <BubbleCatchGame onFinish={() => handleFinish(activeGame.title)} />}
            {activeGame.id === 'g5' && <WordConnectGame onFinish={() => handleFinish(activeGame.title)} />}
            {activeGame.id === 'g6' && <SentenceBuilderGame onFinish={() => handleFinish(activeGame.title)} />}
            {activeGame.id === 'g7' && <ItemSortingGame onFinish={() => handleFinish(activeGame.title)} />}
            {activeGame.id === 'g8' && <RoutineOrderGame onFinish={() => handleFinish(activeGame.title)} />}
            {activeGame.id === 'g9' && <ZenBloomGame onFinish={() => handleFinish(activeGame.title)} />}
            {activeGame.id === 'g10' && <BreathingGame onFinish={() => handleFinish(activeGame.title)} />}

            {/* Fallback for any other game */}
            {!['g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10'].includes(activeGame.id) && (
              <div className="text-center py-8">
                <p className="text-2xl font-bold text-ink-800 mb-4">{activeGame.title}</p>
                <p className="text-ink-500 mb-6">{activeGame.description}</p>
                <button
                  onClick={() => handleFinish(activeGame.title)}
                  className="btn-success"
                >
                  <CheckCircle className="w-5 h-5" />
                  Complete Activity
                </button>
              </div>
            )}
          </div>
        </div>
      ) : loading ? (
        <LoadingState message="Loading your games..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          {/* Category Filter Pills */}
          <div className="mb-6 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
            <div className="flex gap-2 min-w-max">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const isRecommendedForUser =
                  careCondition && cat.conditionHint === careCondition;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-2xl font-extrabold text-base flex items-center gap-2 transition-all cursor-pointer shadow-sm border-2 ${
                      isSelected
                        ? 'bg-sage-600 text-white border-sage-600 scale-102 shadow-md'
                        : 'bg-white hover:bg-cream-100 text-ink-700 border-cream-200'
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                    {isRecommendedForUser && (
                      <span className="w-2.5 h-2.5 rounded-full bg-honey-400 ring-2 ring-white animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Condition-tailored prompt if user has active condition */}
          {careCondition && careCondition !== 'dementia' && selectedCategory === 'all' && (
            <div className="card-base p-4 mb-6 bg-gradient-to-r from-sage-50 to-cream-100 border border-sage-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sage-200 flex items-center justify-center text-sage-800 shrink-0">
                  <Heart className="w-5 h-5 fill-sage-600" />
                </div>
                <div>
                  <p className="font-extrabold text-ink-800 text-sm sm:text-base">
                    Activities Picked for You Today
                  </p>
                  <p className="text-xs sm:text-sm text-ink-500">
                    Enjoy any game you like at your own comfortable pace.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGames.map((game, idx) => {
              const Icon = gameIcons[game.icon] ?? Puzzle;
              return (
                <div
                  key={game.id}
                  className="card-base p-5 flex flex-col animate-slideUp border-2 border-cream-200 hover:border-sage-300 transition-all shadow-sm hover:shadow-md"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <GameThumbnail
                    icon={<Icon className="w-14 h-14" strokeWidth={1.8} />}
                    gradient={game.gradient}
                    className="w-full aspect-[16/10] mb-4 rounded-2xl"
                  />

                  {/* Category & Condition tags */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-cream-200 text-ink-700">
                      {game.categoryLabel}
                    </span>
                    <span className="text-xs font-bold text-sage-700 truncate">
                      {game.recommendedFor}
                    </span>
                  </div>

                  <p className="font-display font-extrabold text-ink-800 text-xl mb-1">
                    {game.title}
                  </p>
                  <p className="text-ink-500 text-sm mb-3 flex-1">
                    {game.description}
                  </p>

                  {/* Benefit hint */}
                  <div className="p-2.5 bg-cream-100 rounded-xl mb-4 text-xs font-semibold text-ink-600 border border-cream-200">
                    💡 {game.benefit}
                  </div>

                  <button
                    onClick={() => setPlayingGameId(game.id)}
                    className="btn-primary w-full text-lg py-3 flex items-center justify-center gap-2 shadow-md active:scale-98"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Play Now
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {lastFinishedTitle && (
        <SuccessToast
          message={`Wonderful! You played "${lastFinishedTitle}" today ⭐`}
          onClose={() => setLastFinishedTitle(null)}
        />
      )}
    </div>
  );
}
