import { useState, useEffect, useCallback } from 'react';
import type { Memory } from '@/data/mockData';
import { memoryService } from '@/services/api';

interface UseMemoriesResult {
  memories: Memory[];
  loading: boolean;
  error: string | null;
  addMemory: (memory: Omit<Memory, 'id'>) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  clearMemories: () => Promise<void>;
  restoreMemories: () => Promise<void>;
  refresh: () => void;
}

export function useMemories(): UseMemoriesResult {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMemories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await memoryService.getAll();
      if (res.error) {
        setError(res.error);
      } else {
        setMemories(res.data);
      }
    } catch {
      setError('Could not load memories. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  const addMemory = useCallback(async (memory: Omit<Memory, 'id'>) => {
    const res = await memoryService.create(memory);
    if (res.data) setMemories((ms) => [...ms, res.data]);
  }, []);

  const deleteMemory = useCallback(async (id: string) => {
    await memoryService.delete(id);
    setMemories((ms) => ms.filter((m) => m.id !== id));
  }, []);

  const clearMemories = useCallback(async () => {
    const res = await memoryService.clearDemo();
    setMemories(res.data);
  }, []);

  const restoreMemories = useCallback(async () => {
    const res = await memoryService.restoreDefaults();
    setMemories(res.data);
  }, []);

  return {
    memories,
    loading,
    error,
    addMemory,
    deleteMemory,
    clearMemories,
    restoreMemories,
    refresh: fetchMemories,
  };
}
