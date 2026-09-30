import { useApp } from '@/context/AppContext';
import { useReminders } from '@/hooks/useReminders';
import { useTranslation } from 'react-i18next';
import {
  Pill,
  Check,
  Clock,
  Sun,
  Crown,
} from 'lucide-react';
import { useState } from 'react';
import { SuccessToast, LoadingState, ErrorState } from '@/components/UI';
import { ConditionCareModule } from '@/components/ConditionCareModule';

export function MyDayPage() {
  const { t, i18n } = useTranslation();
  const { patientName, careCondition, openPaywall } = useApp();
  const { reminders, loading, error, completeReminder, refresh } = useReminders();
  const [showSuccess, setShowSuccess] = useState(false);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? t('greetingMorning') : hour < 17 ? t('greetingAfternoon') : t('greetingEvening');
  const todayName = now.toLocaleDateString(i18n.language, { weekday: 'long' });
  const dateStr = now.toLocaleDateString(i18n.language, { month: 'long', day: 'numeric' });

  const nextReminder = reminders.find((r) => !r.done);
  const upcoming = reminders.filter((r) => !r.done && r.id !== nextReminder?.id).slice(0, 2);

  const reminderLabel =
    careCondition === 'parkinsons'
      ? 'Next Medicine'
      : careCondition === 'stroke'
      ? 'Therapy Task'
      : careCondition === 'mci'
      ? "Today's Task"
      : careCondition === 'healthy_aging'
      ? 'Daily Wellness'
      : t('medicineTimeLabel');

  const completeButtonLabel =
    careCondition === 'parkinsons'
      ? 'I Took My Medicine'
      : careCondition === 'stroke'
      ? 'I Finished My Exercise'
      : careCondition === 'mci'
      ? 'Done with Task'
      : careCondition === 'healthy_aging'
      ? 'Done for Today'
      : t('tookMedicine');

  const handleComplete = () => {
    if (nextReminder) {
      completeReminder(nextReminder.id);
      setShowSuccess(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Greeting */}
      <div className="text-center mb-6 animate-slideUp">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-honey-100 mb-3">
          <Sun className="w-8 h-8 text-honey-600" />
        </div>
        <h1 className="section-title text-3xl sm:text-4xl mb-1">
          {greeting}, {patientName || 'Elena'} ❤️
        </h1>
        <p className="text-xl text-ink-500 font-semibold">
          {t('todayIs')} {todayName}, {dateStr}
        </p>

        {/* RevenueCat Subscriptions Pill */}
        <div className="mt-3 flex items-center justify-center">
          <button
            onClick={openPaywall}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-300 text-amber-900 text-xs font-semibold shadow-xs hover:shadow-sm transition active:scale-95 cursor-pointer"
            title="View Haven Plus & Family Subscriptions (RevenueCat)"
          >
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>Try Haven Plus Free for 1 Month</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              30-Day Free Trial
            </span>
          </button>
        </div>
      </div>

      {/* Disease-Specific Adaptive Care Hub */}
      <ConditionCareModule />

      {loading && <LoadingState message={t('loadingDay')} />}

      {error && <ErrorState message={error} onRetry={refresh} />}

      {!loading && !error && (
        <>
          {/* Main task card */}
          {nextReminder ? (
            <div className="card-base p-6 sm:p-8 mb-6 border-2 border-honey-200 animate-scaleIn">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-honey-100 flex items-center justify-center shrink-0">
                  <Pill className="w-8 h-8 text-honey-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-honey-600 uppercase tracking-wide">{reminderLabel}</p>
                  <p className="text-3xl font-display font-extrabold text-ink-800">{nextReminder.time}</p>
                </div>
              </div>
              <p className="text-lg text-ink-600 mb-5">{nextReminder.description}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={handleComplete} className="btn-success flex-1 text-xl">
                  <Check className="w-7 h-7" />
                  {completeButtonLabel}
                </button>
                <button className="btn-secondary flex-1">
                  <Clock className="w-6 h-6" />
                  {t('remindLater')}
                </button>
              </div>
            </div>
          ) : (
            <div className="card-base p-8 mb-6 text-center border-2 border-sage-200">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-sage-100 flex items-center justify-center">
                <Check className="w-9 h-9 text-sage-600" />
              </div>
              <p className="text-2xl font-display font-extrabold text-ink-800 mb-1">{t('allDoneTitle')}</p>
              <p className="text-lg text-ink-500">{t('allDoneDesc')}</p>
            </div>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="mb-8">
              <p className="text-lg font-bold text-ink-600 mb-3 px-1">{t('comingUpNext')}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {upcoming.map((r) => (
                  <div key={r.id} className="card-base p-4 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-cream-200 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-ink-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-ink-700 text-lg leading-tight">{r.title}</p>
                      <p className="text-ink-400 text-base">{r.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}


      {showSuccess && (
        <SuccessToast
          message={t('taskCompletedToast')}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}