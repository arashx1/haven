import { useApp } from '@/context/AppContext';
import { useReminders } from '@/hooks/useReminders';
import { SuccessToast } from '@/components/UI';
import { Pill, Utensils, PhoneCall, Gamepad2, CalendarClock, Check, Clock, X } from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, typeof Pill> = {
  pill: Pill,
  utensils: Utensils,
  phone: PhoneCall,
  gamepad: Gamepad2,
  appointment: CalendarClock,
  task: CalendarClock,
};

export function ReminderOverlay() {
  const { activeReminderId, setActiveReminderId, patientName } = useApp();
  const { reminders, completeReminder } = useReminders();
  const [showSuccess, setShowSuccess] = useState(false);

  const reminder = reminders.find((r) => r.id === activeReminderId);
  if (!reminder) return null;

  const Icon = iconMap[reminder.icon] ?? Pill;

  const handleComplete = () => {
    completeReminder(reminder.id);
    setActiveReminderId(null);
    setShowSuccess(true);
  };

  const handleLater = () => {
    setActiveReminderId(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/50 backdrop-blur-sm animate-fadeIn">
        <div className="relative bg-white rounded-3xl shadow-lift p-8 max-w-md w-full text-center animate-scaleIn">
          <button
            onClick={handleLater}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-ink-400 transition"
            aria-label="Close reminder"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-honey-100 flex items-center justify-center animate-gentlePulse">
            <Icon className="w-10 h-10 text-honey-600" />
          </div>

          <p className="text-lg text-ink-400 font-semibold mb-1">Hello {patientName},</p>
          <p className="text-2xl font-display font-extrabold text-ink-800 mb-2">
            It's time to {reminder.title.toLowerCase()}.
          </p>
          <p className="text-lg text-ink-500 mb-6">{reminder.time}</p>

          <div className="flex flex-col gap-3">
            <button onClick={handleComplete} className="btn-success w-full text-xl">
              <Check className="w-7 h-7" />
              I Took It
            </button>
            <button onClick={handleLater} className="btn-secondary w-full text-xl">
              <Clock className="w-6 h-6" />
              Remind Me Later
            </button>
          </div>
        </div>
      </div>

      {showSuccess && (
        <SuccessToast
          message="You completed this task ⭐"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  );
}
