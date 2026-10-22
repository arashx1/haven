import { useApp } from '@/context/AppContext';
import { useCloudCollection } from './useCloudCollection';
import { reminderService } from '@/services/api';
import type { Reminder } from '@/data/catalog';
export function useReminders() {
  const {patientId,timezone} = useApp();
  const collection = useCloudCollection('reminders:' + patientId + ':' + timezone, () => reminderService.getAll(patientId,timezone));
  return {...collection,reminders:collection.data,
    completeReminder:(id:string) => collection.mutate(() => reminderService.complete(id,collection.data.find(r=>r.id===id)?.occurrenceDate)),
    snoozeReminder:(id:string) => collection.mutate(() => reminderService.snooze(id,collection.data.find(r=>r.id===id)?.occurrenceDate)),
    addReminder:(reminder:Omit<Reminder,'id'|'done'>) => collection.mutate(() => reminderService.create(reminder,patientId)),
    deleteReminder:(id:string) => collection.mutate(() => reminderService.delete(id,patientId)),
  };
}
