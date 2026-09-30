import { useState, useEffect, useCallback } from 'react';
import type { Person } from '@/data/mockData';
import { peopleService } from '@/services/api';

interface UsePeopleResult {
  people: Person[];
  loading: boolean;
  error: string | null;
  addPerson: (person: Omit<Person, 'id'>) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;
  clearPeople: () => Promise<void>;
  restorePeople: () => Promise<void>;
  refresh: () => void;
}

export function usePeople(): UsePeopleResult {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPeople = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await peopleService.getAll();
      if (res.error) {
        setError(res.error);
      } else {
        setPeople(res.data);
      }
    } catch {
      setError('Could not load people. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  const addPerson = useCallback(async (person: Omit<Person, 'id'>) => {
    const res = await peopleService.create(person);
    if (res.data) setPeople((ps) => [...ps, res.data]);
  }, []);

  const deletePerson = useCallback(async (id: string) => {
    await peopleService.delete(id);
    setPeople((ps) => ps.filter((p) => p.id !== id));
  }, []);

  const clearPeople = useCallback(async () => {
    const res = await peopleService.clearDemo();
    setPeople(res.data);
  }, []);

  const restorePeople = useCallback(async () => {
    const res = await peopleService.restoreDefaults();
    setPeople(res.data);
  }, []);

  return {
    people,
    loading,
    error,
    addPerson,
    deletePerson,
    clearPeople,
    restorePeople,
    refresh: fetchPeople,
  };
}
