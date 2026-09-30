import { useState, useEffect } from 'react';
import type { Game } from '@/data/mockData';
import { gameService } from '@/services/api';

interface UseGamesResult {
  games: Game[];
  loading: boolean;
  error: string | null;
}

export function useGames(): UseGamesResult {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await gameService.getAll();
        if (!cancelled) {
          if (res.error) setError(res.error);
          else setGames(res.data);
        }
      } catch {
        if (!cancelled) setError('Could not load games. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { games, loading, error };
}
