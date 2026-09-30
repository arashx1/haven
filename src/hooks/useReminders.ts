import { useState, useEffect, useCallback } from 'react';
import type { Reminder } from '@/data/mockData';
import { reminderService } from '@/services/api';

interface UseRemindersResult {
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  completeReminder: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'done'>) => void;
  deleteReminder: (id: string) => Promise<void>;
  refresh: () => void;
}

export function useReminders(): UseRemindersResult {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reminderService.getAll();
      if (res.error) {
        setError(res.error);
      } else {
        setReminders(res.data);
      }
    } catch {
      setError('Could not load reminders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const completeReminder = useCallback((id: string) => {
    setReminders((rs) => rs.map((r) => (r.id === id ? { ...r, done: true } : r)));
    reminderService.complete(id);
  }, []);

  const addReminder = useCallback((reminder: Omit<Reminder, 'id' | 'done'>) => {
    reminderService.create(reminder).then((res) => {
      if (res.data) setReminders((rs) => [...rs, res.data]);
    });
  }, []);

  const deleteReminder = useCallback(async (id: string) => {
    await reminderService.delete(id);
    setReminders((rs) => rs.filter((r) => r.id !== id));
  }, []);

  return {
    reminders,
    loading,
    error,
    completeReminder,
    addReminder,
    deleteReminder,
    refresh: fetchReminders,
  };
}
