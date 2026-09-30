import { useApp } from '@/context/AppContext';
import { useReminders } from '@/hooks/useReminders';
import { useMemories } from '@/hooks/useMemories';
import { usePeople } from '@/hooks/usePeople';
import { useState, useRef } from 'react';
import {
  LayoutDashboard,
  Bell,
  Images,
  Users,
  BarChart3,
  Plus,
  Check,
  Phone,
  LogOut,
  Pill,
  Utensils,
  CalendarClock,
  PhoneCall,
  Gamepad2,
  Upload,
  Camera,
  X,
  Trash2,
  RotateCcw,
  Sparkles,
  HeartPulse,
  Activity,
  Brain,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { LoadingState, ErrorState, EmptyState } from '@/components/UI';
import { CONDITIONS, type CareCondition } from '@/data/mockData';

type Tab = 'overview' | 'reminders' | 'memories' | 'people' | 'activity';

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'reminders', label: 'Reminders', icon: Bell },
  { id: 'memories', label: 'Memories', icon: Images },
  { id: 'people', label: 'People', icon: Users },
  { id: 'activity', label: 'Activity', icon: BarChart3 },
];

const reminderTypeIcons: Record<string, typeof Pill> = {
  medicine: Pill,
  meal: Utensils,
  appointment: CalendarClock,
  call: PhoneCall,
  activity: Gamepad2,
  task: CalendarClock,
};

const conditionIcons: Record<string, typeof Brain> = {
  Brain,
  Activity,
  HeartPulse,
  Sparkles,
  Sun,
};

export function CaregiverDashboardPage() {
  const { setCaregiverMode, navigate, patientName, signOut, careCondition, setCareCondition } = useApp();
  const remindersHook = useReminders();
  const memoriesHook = useMemories();
  const peopleHook = usePeople();
  const [tab, setTab] = useState<Tab>('overview');
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [showMemoryForm, setShowMemoryForm] = useState(false);
  const [showPersonForm, setShowPersonForm] = useState(false);

  const {
    reminders,
    completeReminder,
    addReminder,
    deleteReminder,
    loading: rLoading,
    error: rError,
    refresh: rRefresh,
  } = remindersHook;

  const {
    memories,
    addMemory,
    deleteMemory,
    clearMemories,
    restoreMemories,
    loading: mLoading,
    error: mError,
    refresh: mRefresh,
  } = memoriesHook;

  const {
    people,
    addPerson,
    deletePerson,
    clearPeople,
    restorePeople,
    loading: pLoading,
    error: pError,
    refresh: pRefresh,
  } = peopleHook;

  const doneCount = reminders.filter((r) => r.done).length;
  const totalCount = reminders.length;
  const completionRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const handleExit = () => {
    setCaregiverMode(false);
    navigate('my-day');
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-cream-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-honey-400 to-honey-600 flex items-center justify-center shrink-0">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-display font-extrabold text-ink-800 text-lg leading-tight">Helper Dashboard</p>
              <p className="text-ink-400 text-sm leading-tight">Helping {patientName || 'Elena'} with their day</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleExit} className="btn-secondary text-base px-5 py-3">
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Back to My Day</span>
            </button>
            <button
              onClick={signOut}
              className="text-ink-400 font-semibold text-sm hover:text-coral-600 transition px-2"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 overflow-x-auto">
          <div className="flex gap-2 pb-2 min-w-max">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-base transition whitespace-nowrap ${
                  tab === id ? 'bg-honey-500 text-white shadow-warm' : 'text-ink-500 hover:bg-cream-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {tab === 'overview' && (
          <OverviewTab
            doneCount={doneCount}
            totalCount={totalCount}
            completionRate={completionRate}
            reminderCount={reminders.length}
            memoryCount={memories.length}
            peopleCount={people.length}
            setTab={setTab}
            careCondition={careCondition}
            setCareCondition={setCareCondition}
          />
        )}
        {tab === 'reminders' && (
          <RemindersTab
            reminders={reminders}
            completeReminder={completeReminder}
            showForm={showReminderForm}
            setShowForm={setShowReminderForm}
            addReminder={addReminder}
            deleteReminder={deleteReminder}
            loading={rLoading}
            error={rError}
            refresh={rRefresh}
          />
        )}
        {tab === 'memories' && (
          <MemoriesTab
            memories={memories}
            showForm={showMemoryForm}
            setShowForm={setShowMemoryForm}
            addMemory={addMemory}
            deleteMemory={deleteMemory}
            clearMemories={clearMemories}
            restoreMemories={restoreMemories}
            loading={mLoading}
            error={mError}
            refresh={mRefresh}
          />
        )}
        {tab === 'people' && (
          <PeopleTab
            people={people}
            showForm={showPersonForm}
            setShowForm={setShowPersonForm}
            addPerson={addPerson}
            deletePerson={deletePerson}
            clearPeople={clearPeople}
            restorePeople={restorePeople}
            loading={pLoading}
            error={pError}
            refresh={pRefresh}
          />
        )}
        {tab === 'activity' && <ActivityTab reminders={reminders} />}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="card-base p-5 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-display font-extrabold text-ink-800 leading-tight">{value}</p>
        <p className="text-ink-500 text-base leading-tight">{label}</p>
      </div>
    </div>
  );
}

function OverviewTab({
  doneCount, totalCount, completionRate, reminderCount, memoryCount, peopleCount, setTab, careCondition, setCareCondition,
}: {
  doneCount: number; totalCount: number; completionRate: number;
  reminderCount: number; memoryCount: number; peopleCount: number;
  setTab: (t: Tab) => void;
  careCondition: CareCondition;
  setCareCondition: (c: CareCondition) => void;
}) {
  const currentCondition = CONDITIONS.find((c) => c.id === careCondition) || CONDITIONS[0];
  const CurrentIcon = conditionIcons[currentCondition.iconName] || Brain;

  return (
    <div className="animate-fadeIn space-y-6">
      <h2 className="section-title text-2xl">Today's Overview</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Check className="w-7 h-7 text-sage-600" />} label="Tasks Done" value={`${doneCount}/${totalCount}`} color="bg-sage-100" />
        <StatCard icon={<BarChart3 className="w-7 h-7 text-honey-600" />} label="Completion" value={`${completionRate}%`} color="bg-honey-100" />
        <StatCard icon={<Images className="w-7 h-7 text-coral-600" />} label="Memories" value={memoryCount} color="bg-coral-100" />
        <StatCard icon={<Users className="w-7 h-7 text-ink-600" />} label="People" value={peopleCount} color="bg-cream-200" />
      </div>

      {/* Multidisease & Care Condition Focus Card */}
      <div className="card-base p-6 border-2 border-honey-200 shadow-warm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-cream-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-honey-100 text-honey-800 text-xs font-bold uppercase tracking-wider">
                Active Condition Profile
              </span>
              <span className="text-xs text-ink-400 font-semibold">• Tailored for Elderly Care</span>
            </div>
            <h3 className="text-2xl font-bold text-ink-800 mt-1 flex items-center gap-2">
              <CurrentIcon className="w-6 h-6 text-honey-600" />
              {currentCondition.title}
            </h3>
            <p className="text-ink-500 text-sm mt-0.5">{currentCondition.tagline}</p>
          </div>
        </div>

        <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">Switch Condition Focus:</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-5">
          {CONDITIONS.map((cond) => {
            const Icon = conditionIcons[cond.iconName] || Brain;
            const isSelected = careCondition === cond.id;
            return (
              <button
                key={cond.id}
                onClick={() => setCareCondition(cond.id)}
                className={`p-3 rounded-2xl border-2 text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-honey-500 bg-honey-50/80 shadow-xs'
                    : 'border-cream-300 bg-white hover:border-honey-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-honey-500 text-white' : 'bg-cream-100 text-ink-500'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-honey-600" />}
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-ink-800 leading-tight">{cond.title.split('&')[0]}</p>
                  <p className="text-[11px] text-ink-400 mt-0.5 font-medium">{cond.badge}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Clinical Tips for Caregivers */}
        <div className="bg-cream-50 rounded-2xl p-4 border border-cream-300">
          <p className="font-bold text-ink-700 text-sm mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sage-600" /> Caregiver Recommendations for {currentCondition.title}:
          </p>
          <ul className="space-y-1.5 text-xs sm:text-sm text-ink-600">
            {currentCondition.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-honey-600 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card-base p-6">
        <p className="font-bold text-ink-700 text-lg mb-3">Daily Routine Progress</p>
        <div className="w-full h-6 bg-cream-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-sage-400 to-sage-500 rounded-full transition-all duration-500" style={{ width: `${completionRate}%` }} />
        </div>
        <p className="text-ink-500 text-base mt-2">{completionRate}% of today's tasks are complete.</p>
      </div>

      <h3 className="section-title text-xl mb-3">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button onClick={() => setTab('reminders')} className="card-base card-hover p-5 flex items-center gap-3 text-left">
          <div className="w-12 h-12 rounded-xl bg-honey-100 flex items-center justify-center"><Bell className="w-6 h-6 text-honey-600" /></div>
          <div><p className="font-bold text-ink-800 text-lg">Manage Reminders</p><p className="text-ink-400 text-sm">{reminderCount} total</p></div>
        </button>
        <button onClick={() => setTab('memories')} className="card-base card-hover p-5 flex items-center gap-3 text-left">
          <div className="w-12 h-12 rounded-xl bg-coral-100 flex items-center justify-center"><Images className="w-6 h-6 text-coral-600" /></div>
          <div><p className="font-bold text-ink-800 text-lg">Manage Memories</p><p className="text-ink-400 text-sm">{memoryCount} saved (edit/remove demo)</p></div>
        </button>
        <button onClick={() => setTab('people')} className="card-base card-hover p-5 flex items-center gap-3 text-left">
          <div className="w-12 h-12 rounded-xl bg-cream-200 flex items-center justify-center"><Users className="w-6 h-6 text-ink-600" /></div>
          <div><p className="font-bold text-ink-800 text-lg">Manage People</p><p className="text-ink-400 text-sm">{peopleCount} contacts (edit/remove demo)</p></div>
        </button>
      </div>
    </div>
  );
}

function RemindersTab({
  reminders, completeReminder, showForm, setShowForm, addReminder, deleteReminder, loading, error, refresh,
}: {
  reminders: ReturnType<typeof useReminders>['reminders'];
  completeReminder: (id: string) => void;
  showForm: boolean;
  setShowForm: (v: boolean) => void;
  addReminder: ReturnType<typeof useReminders>['addReminder'];
  deleteReminder: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ReturnType<typeof useReminders>['reminders'][number]['type']>('medicine');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !time) return;
    addReminder({ title, time, description: description || title, type, icon: type === 'medicine' ? 'pill' : type === 'meal' ? 'utensils' : type === 'call' ? 'phone' : 'gamepad' });
    setTitle(''); setTime(''); setDescription(''); setType('medicine');
    setShowForm(false);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="section-title text-2xl">Reminders & Schedule</h2>
          <p className="text-ink-400 text-sm">Personalize daily medications and routines.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-base px-5 py-3">
          <Plus className="w-5 h-5" />
          Add Reminder
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-base p-6 mb-6 space-y-4 animate-scaleIn">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-ink-700 mb-1.5">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Morning Medication with Water" className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-base focus:border-honey-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-base font-bold text-ink-700 mb-1.5">Time</label>
              <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 9:00 AM" className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-base focus:border-honey-400 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-base font-bold text-ink-700 mb-1.5">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-base focus:border-honey-400 focus:outline-none">
              <option value="medicine">Medicine</option>
              <option value="meal">Meal</option>
              <option value="appointment">Appointment</option>
              <option value="call">Call Family</option>
              <option value="activity">Activity</option>
              <option value="task">Task</option>
            </select>
          </div>
          <div>
            <label className="block text-base font-bold text-ink-700 mb-1.5">Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short reassuring note for the patient" className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-base focus:border-honey-400 focus:outline-none" />
          </div>
          <button type="submit" className="btn-success text-base px-6 py-3"><Check className="w-5 h-5" /> Save Reminder</button>
        </form>
      )}

      {loading && <LoadingState message="Loading reminders..." />}
      {error && <ErrorState message={error} onRetry={refresh} />}
      {!loading && !error && reminders.length === 0 && (
        <EmptyState icon={<Bell className="w-10 h-10" />} title="No reminders yet" message="Add a reminder to help your loved one stay on track." />
      )}

      {!loading && !error && reminders.length > 0 && (
        <div className="space-y-3">
          {reminders.map((r) => {
            const Icon = reminderTypeIcons[r.type] ?? Pill;
            return (
              <div key={r.id} className={`card-base p-4 flex items-center justify-between gap-4 group ${r.done ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${r.done ? 'bg-sage-100' : 'bg-cream-200'}`}>
                    <Icon className={`w-6 h-6 ${r.done ? 'text-sage-500' : 'text-ink-500'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className={`font-bold text-lg leading-tight ${r.done ? 'line-through text-ink-400' : 'text-ink-800'}`}>{r.title}</p>
                    <p className="text-ink-400 text-sm">{r.time} — {r.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!r.done && (
                    <button onClick={() => completeReminder(r.id)} className="btn-success text-sm px-3.5 py-1.5 shrink-0">
                      <Check className="w-4 h-4" /> Done
                    </button>
                  )}
                  <button
                    onClick={() => deleteReminder(r.id)}
                    className="w-9 h-9 rounded-xl hover:bg-coral-50 text-ink-300 hover:text-coral-600 transition flex items-center justify-center"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MemoriesTab({
  memories, showForm, setShowForm, addMemory, deleteMemory, clearMemories, restoreMemories, loading, error, refresh,
}: {
  memories: ReturnType<typeof useMemories>['memories'];
  showForm: boolean;
  setShowForm: (v: boolean) => void;
  addMemory: ReturnType<typeof useMemories>['addMemory'];
  deleteMemory: (id: string) => Promise<void>;
  clearMemories: () => Promise<void>;
  restoreMemories: () => Promise<void>;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState('');
  const [caption, setCaption] = useState('');
  const [detail, setDetail] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await addMemory({
      title: title.trim(),
      year: year.trim() || new Date().getFullYear().toString(),
      description: description.trim() || title.trim(),
      caption: caption.trim() || title.trim(),
      detail: detail.trim() || description.trim() || title.trim(),
      image: photoPreview || 'memory',
    });
    setSaving(false);
    setTitle(''); setYear(new Date().getFullYear().toString()); setDescription(''); setCaption(''); setDetail('');
    setPhotoPreview('');
    setShowForm(false);
    refresh();
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="section-title text-2xl">Manage Memories</h2>
          <p className="text-ink-400 text-sm">Add real family photos or remove demo memories.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {memories.length > 0 && (
            <button
              onClick={clearMemories}
              className="btn-secondary text-sm py-2.5 px-3 border border-coral-200 text-coral-600 hover:bg-coral-50 flex items-center gap-1.5"
              title="Remove all demo memories to start clean with real photos"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Demo Memories</span>
            </button>
          )}
          <button
            onClick={restoreMemories}
            className="btn-secondary text-sm py-2.5 px-3 border border-cream-300 text-ink-600 hover:bg-cream-200 flex items-center gap-1.5"
            title="Restore sample memory cards"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restore Samples</span>
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-base px-4 py-2.5 flex items-center gap-1.5">
            <Plus className="w-5 h-5" /> Add Memory
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-base p-6 mb-6 space-y-4 animate-scaleIn border-2 border-honey-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink-800 text-lg flex items-center gap-2"><Images className="w-5 h-5 text-coral-500" /> New Memory</h3>
            <button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-ink-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-base font-bold text-ink-700 mb-2 flex items-center gap-1.5">
              <Camera className="w-4 h-4" /> Photo for the Patient
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-cream-300 rounded-xl overflow-hidden hover:border-honey-400 hover:bg-honey-50 transition"
              style={{ minHeight: '120px' }}
            >
              {photoPreview ? (
                <div className="relative">
                  <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setPhotoPreview(''); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-ink-600 hover:bg-coral-100 shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-8">
                  <Upload className="w-8 h-8 text-ink-300" />
                  <p className="text-ink-400 text-sm font-semibold">Click to upload a photo from your device</p>
                  <p className="text-ink-300 text-xs">JPG, PNG, WEBP — shown to the patient</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-ink-700 mb-1.5">Title *</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Wedding Day at the Beach" className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-base focus:border-honey-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-base font-bold text-ink-700 mb-1.5">Year</label>
              <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 1985" className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-base focus:border-honey-400 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-base font-bold text-ink-700 mb-1.5">Short Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short summary of this memory" className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-base focus:border-honey-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-base font-bold text-ink-700 mb-1.5">Caption (headline shown to patient)</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. You looked so happy dancing together! ❤️" className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-base focus:border-honey-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-base font-bold text-ink-700 mb-1.5">Full Story (shown to patient)</label>
            <textarea value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Tell the full story of this memory in warm, comforting words…" rows={3} className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-base focus:border-honey-400 focus:outline-none resize-none" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-success text-base px-6 py-3 flex-1">
              <Check className="w-5 h-5" /> {saving ? 'Saving…' : 'Save Memory'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-base px-5 py-3">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <LoadingState message="Loading memories..." />}
      {error && <ErrorState message={error} onRetry={refresh} />}
      {!loading && !error && memories.length === 0 && (
        <EmptyState icon={<Images className="w-10 h-10" />} title="No memories yet" message="Add a memory with real family photos or click 'Restore Samples' above." />
      )}

      {!loading && !error && memories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {memories.map((m) => (
            <div key={m.id} className="card-base overflow-hidden relative group">
              <button
                onClick={() => deleteMemory(m.id)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 text-ink-400 hover:text-coral-600 hover:bg-coral-50 shadow-md transition flex items-center justify-center opacity-90 group-hover:opacity-100"
                title="Remove this memory"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {m.image && m.image.startsWith('data:') ? (
                <img src={m.image} alt={m.title} className="w-full aspect-[4/3] object-cover" />
              ) : (
                <div className="w-full aspect-[4/3] bg-gradient-to-br from-honey-200 to-honey-400 flex items-center justify-center">
                  <Images className="w-12 h-12 text-honey-700" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-ink-800 text-lg leading-tight">{m.title}</p>
                  <span className="text-ink-400 text-xs font-semibold px-2 py-0.5 rounded-full bg-cream-100">{m.year}</span>
                </div>
                <p className="text-ink-500 text-sm mt-1 line-clamp-2">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PeopleTab({
  people, showForm, setShowForm, addPerson, deletePerson, clearPeople, restorePeople, loading, error, refresh,
}: {
  people: ReturnType<typeof usePeople>['people'];
  showForm: boolean;
  setShowForm: (v: boolean) => void;
  addPerson: ReturnType<typeof usePeople>['addPerson'];
  deletePerson: (id: string) => Promise<void>;
  clearPeople: () => Promise<void>;
  restorePeople: () => Promise<void>;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [info, setInfo] = useState('');
  const [phone, setPhone] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await addPerson({
      name: name.trim(),
      relationship: relationship.trim() || 'Family Member',
      image: photoPreview || 'person',
      info: info.trim() || `${name.trim()} loves and supports you.`,
      phone: phone.trim() || 'N/A',
    });
    setSaving(false);
    setName(''); setRelationship(''); setInfo(''); setPhone('');
    setPhotoPreview('');
    setShowForm(false);
    refresh();
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="section-title text-2xl">Important People & Family</h2>
          <p className="text-ink-400 text-sm">Add real family contacts or remove demo people (Priya, Rohan, Aarav).</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {people.length > 0 && (
            <button
              onClick={clearPeople}
              className="btn-secondary text-sm py-2.5 px-3 border border-coral-200 text-coral-600 hover:bg-coral-50 flex items-center gap-1.5"
              title="Remove demo contacts to add your real family members"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Demo People</span>
            </button>
          )}
          <button
            onClick={restorePeople}
            className="btn-secondary text-sm py-2.5 px-3 border border-cream-300 text-ink-600 hover:bg-cream-200 flex items-center gap-1.5"
            title="Restore sample people"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restore Samples</span>
          </button>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-base px-4 py-2.5 flex items-center gap-1.5">
            <Plus className="w-5 h-5" /> Add Person
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-base p-6 mb-6 space-y-4 animate-scaleIn border-2 border-honey-200">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink-800 text-lg flex items-center gap-2"><Users className="w-5 h-5 text-honey-500" /> New Family Member / Caregiver</h3>
            <button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-cream-100 hover:bg-cream-200 flex items-center justify-center text-ink-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-base font-bold text-ink-700 mb-2 flex items-center gap-1.5">
              <Camera className="w-4 h-4" /> Their Photo
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-cream-300 rounded-xl overflow-hidden hover:border-honey-400 hover:bg-honey-50 transition"
              style={{ minHeight: '120px' }}
            >
              {photoPreview ? (
                <div className="relative">
                  <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover object-top" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setPhotoPreview(''); }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-ink-600 hover:bg-coral-100 shadow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-8">
                  <Upload className="w-8 h-8 text-ink-300" />
                  <p className="text-ink-400 text-sm font-semibold">Click to upload a real photo of this person</p>
                  <p className="text-ink-300 text-xs">JPG, PNG, WEBP — the patient will see this face</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-ink-700 mb-1.5">Full Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Maya Chen" className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-base focus:border-honey-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-base font-bold text-ink-700 mb-1.5">Relationship</label>
              <input value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="e.g. Your Daughter, Primary Caregiver" className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-base focus:border-honey-400 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-base font-bold text-ink-700 mb-1.5">About Them (shown to patient)</label>
            <textarea value={info} onChange={(e) => setInfo(e.target.value)} placeholder="Write a warm, simple description to help the patient remember this person…" rows={3} className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-base focus:border-honey-400 focus:outline-none resize-none" />
          </div>
          <div>
            <label className="block text-base font-bold text-ink-700 mb-1.5">Phone Number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +1 555 123 4567" className="w-full rounded-xl border-2 border-cream-300 bg-white px-4 py-3 text-base focus:border-honey-400 focus:outline-none" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-success text-base px-6 py-3 flex-1">
              <Check className="w-5 h-5" /> {saving ? 'Saving…' : 'Save Person'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-base px-5 py-3">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading && <LoadingState message="Loading people..." />}
      {error && <ErrorState message={error} onRetry={refresh} />}
      {!loading && !error && people.length === 0 && (
        <EmptyState icon={<Users className="w-10 h-10" />} title="No people added yet" message="Add your real family members or click 'Restore Samples' to load demo contacts." />
      )}

      {!loading && !error && people.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((p) => (
            <div key={p.id} className="card-base overflow-hidden relative group">
              <button
                onClick={() => deletePerson(p.id)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 text-ink-400 hover:text-coral-600 hover:bg-coral-50 shadow-md transition flex items-center justify-center opacity-90 group-hover:opacity-100"
                title={`Remove ${p.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              {p.image && p.image.startsWith('data:') ? (
                <img src={p.image} alt={p.name} className="w-full aspect-square object-cover object-top" />
              ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-sage-200 to-cream-200 flex items-center justify-center">
                  <Users className="w-12 h-12 text-sage-600" />
                </div>
              )}
              <div className="p-4">
                <p className="font-bold text-ink-800 text-lg leading-tight">{p.name}</p>
                <p className="text-honey-600 text-sm font-bold">{p.relationship}</p>
                <p className="text-ink-500 text-sm mt-1 line-clamp-2">{p.info}</p>
                <p className="text-ink-400 text-sm mt-2 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {p.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityTab({ reminders }: { reminders: ReturnType<typeof useReminders>['reminders'] }) {
  const done = reminders.filter((r) => r.done);
  const pending = reminders.filter((r) => !r.done);

  return (
    <div className="animate-fadeIn">
      <h2 className="section-title text-2xl mb-4">Patient Activity</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-base p-6">
          <h3 className="font-bold text-ink-700 text-lg mb-3 flex items-center gap-2">
            <Check className="w-5 h-5 text-sage-600" /> Completed Tasks
          </h3>
          {done.length === 0 ? (
            <p className="text-ink-400 text-base">No tasks completed yet today.</p>
          ) : (
            <div className="space-y-2">
              {done.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-3 bg-sage-50 rounded-xl">
                  <Check className="w-5 h-5 text-sage-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-ink-800 text-base">{r.title}</p>
                    <p className="text-ink-400 text-xs">{r.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-base p-6">
          <h3 className="font-bold text-ink-700 text-lg mb-3 flex items-center gap-2">
            <Bell className="w-5 h-5 text-honey-600" /> Pending Tasks
          </h3>
          {pending.length === 0 ? (
            <p className="text-ink-400 text-base">All tasks completed! Great job.</p>
          ) : (
            <div className="space-y-2">
              {pending.map((r) => (
                <div key={r.id} className="flex items-center gap-3 p-3 bg-cream-100 rounded-xl">
                  <Bell className="w-5 h-5 text-honey-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-ink-800 text-base">{r.title}</p>
                    <p className="text-ink-400 text-xs">{r.time} — {r.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
