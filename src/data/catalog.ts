export type Language = 'en' | 'zh' | 'fr' | 'es' | 'hi' | 'bn' | 'as';

export const LANGUAGES: { code: Language; label: string; nativeLabel: string }[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'zh', label: 'Chinese (Singapore)', nativeLabel: '中文' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'as', label: 'Assamese', nativeLabel: 'অসমীয়া' },
];

export type TextScale = 1 | 2 | 3 | 4;

export type CareCondition = 'dementia' | 'parkinsons' | 'stroke' | 'mci' | 'healthy_aging';

export interface ConditionInfo {
  id: CareCondition;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  iconName: 'Brain' | 'Activity' | 'HeartPulse' | 'Sparkles' | 'Sun';
  color: string;
  tips: string[];
}

export const CONDITIONS: ConditionInfo[] = [
  {
    id: 'dementia',
    title: 'Dementia & Alzheimer’s Support',
    tagline: 'Memory reassurance, gentle routines, and familiar family faces.',
    description: 'Specialized for memory loss, confusion, and anxiety. Focuses on safe daily rhythms and photo recognition.',
    badge: 'Memory & Reassurance',
    iconName: 'Brain',
    color: 'honey',
    tips: [
      'Speak in short, reassuring sentences with loving tone.',
      'Maintain consistent daily meal and medication timings.',
      'Review family photos together to stimulate positive emotional memories.',
    ],
  },
  {
    id: 'parkinsons',
    title: 'Parkinson’s Disease & Mobility',
    tagline: 'Daily routines and comfortable, large touch controls.',
    description: 'Optimized for Parkinson’s care with dopamine/levodopa exact-time alarms, hydration prompts, and high-contrast large buttons.',
    badge: 'Motor & Timing Precision',
    iconName: 'Activity',
    color: 'teal',
    tips: [
      'Punctual medicine timing is vital for "on/off" motor control.',
      'Encourage gentle stretching and hydration before meals.',
      'Use large button interface to ease interaction during tremors.',
    ],
  },
  {
    id: 'stroke',
    title: 'Post-Stroke & Aphasia Recovery',
    tagline: 'Visual communication cards, speech recovery, and cognitive rebuilding.',
    description: 'Designed for stroke survivors recovering speech and motor skills, featuring pictorial flashcards and daily speech exercises.',
    badge: 'Speech & Everyday Communication',
    iconName: 'HeartPulse',
    color: 'coral',
    tips: [
      'Allow extra time for responses without finishing sentences.',
      'Use picture cards to communicate wants and feelings.',
      'Celebrate small daily milestones in routine tasks.',
    ],
  },
  {
    id: 'mci',
    title: 'Mild Cognitive Impairment (MCI)',
    tagline: 'Mental sharpness, daily task lists, and active independence.',
    description: 'For seniors experiencing early memory shifts who want to stay active, independent, and intellectually engaged.',
    badge: 'Sharpness & Autonomy',
    iconName: 'Sparkles',
    color: 'amber',
    tips: [
      'Encourage daily puzzle games and memory recall.',
      'Promote independent completion of daily checklists.',
      'Stay socially active and maintain outdoor walks.',
    ],
  },
  {
    id: 'healthy_aging',
    title: 'Senior Living & Loneliness Support',
    tagline: 'Social check-ins, family calls, hydration, and wellbeing.',
    description: 'A comforting digital companion for elderly individuals to stay connected with family, take vitamins, and feel loved.',
    badge: 'Wellness & Connection',
    iconName: 'Sun',
    color: 'sage',
    tips: [
      'Schedule regular family calls and video visits.',
      'Set reminders for daily water intake and light walks.',
      'Encourage sharing life stories and favorite songs.',
    ],
  },
];
export interface Reminder {
  id: string;
  type: 'medicine' | 'meal' | 'appointment' | 'activity' | 'call' | 'task';
  title: string;
  time: string;
  description: string;
  done: boolean;
  occurrenceDate?: string;
  snoozedUntil?: string | null;
  completedAt?: string | null;
  icon: string;
}

export interface Memory {
  id: string;
  title: string;
  description: string;
  year: string;
  image: string;
  caption: string;
  detail: string;
}

export interface Person {
  id: string;
  name: string;
  relationship: string;
  image: string;
  info: string;
  phone: string;
}

export type GameCategory = 'memory' | 'motor' | 'speech' | 'focus' | 'zen';

export interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  category: GameCategory;
  categoryLabel: string;
  conditionTarget?: 'dementia' | 'parkinsons' | 'stroke' | 'mci' | 'healthy_aging' | 'all';
  recommendedFor: string;
  benefit: string;
}

export interface Patient {
  name: string;
  greetingName: string;
}

export const activityCatalog: Game[] = [
  // Category 1: Memory & Reminiscence
  {
    id: 'g1',
    title: 'Picture Matching',
    description: 'Find matching pairs of gentle nature and animal cards.',
    icon: 'puzzle',
    gradient: 'from-honey-300 to-honey-500',
    category: 'memory',
    categoryLabel: 'Memory',
    conditionTarget: 'dementia',
    recommendedFor: 'Remembering & Smiles',
    benefit: 'Keeps memory fresh and active',
  },
  {
    id: 'g2',
    title: 'Familiar Faces',
    description: 'See loved ones and remember cherished family and friends.',
    icon: 'users',
    gradient: 'from-sage-300 to-sage-500',
    category: 'memory',
    categoryLabel: 'Memory',
    conditionTarget: 'dementia',
    recommendedFor: 'Family & Friends',
    benefit: 'Connect with people who love you',
  },

  // Category 2: Gentle Rhythm & Motor
  {
    id: 'g3',
    title: 'Steady Rhythm Tap',
    description: 'Tap gently on the pulsing circle at an easy, relaxed pace.',
    icon: 'activity',
    gradient: 'from-amber-300 to-amber-500',
    category: 'motor',
    categoryLabel: 'Gentle Touch',
    conditionTarget: 'parkinsons',
    recommendedFor: 'Easy Rhythm',
    benefit: 'Gentle finger tapping practice',
  },
  {
    id: 'g4',
    title: 'Peaceful Bubble Catch',
    description: 'Tap soft floating bubbles at your own relaxed speed.',
    icon: 'sparkles',
    gradient: 'from-teal-300 to-teal-500',
    category: 'motor',
    categoryLabel: 'Gentle Touch',
    conditionTarget: 'parkinsons',
    recommendedFor: 'Relaxed Tapping',
    benefit: 'Gentle tapping with no rush',
  },

  // Category 3: Speech & Words
  {
    id: 'g5',
    title: 'Word & Object Connect',
    description: 'Name everyday objects like tea and water with gentle cues.',
    icon: 'messageSquare',
    gradient: 'from-sky-300 to-sky-500',
    category: 'speech',
    categoryLabel: 'Words & Voice',
    conditionTarget: 'stroke',
    recommendedFor: 'Everyday Words',
    benefit: 'Practice words easily with pictures',
  },
  {
    id: 'g6',
    title: 'Sentence Companion',
    description: 'Complete heartwarming daily sentences using simple words.',
    icon: 'volume2',
    gradient: 'from-indigo-300 to-indigo-500',
    category: 'speech',
    categoryLabel: 'Words & Voice',
    conditionTarget: 'stroke',
    recommendedFor: 'Reading & Talking',
    benefit: 'Put simple daily phrases together',
  },

  // Category 4: Daily Focus & Routine
  {
    id: 'g7',
    title: 'Daily Item Sorting',
    description: 'Put everyday items into the room where they belong.',
    icon: 'palette',
    gradient: 'from-coral-300 to-coral-500',
    category: 'focus',
    categoryLabel: 'Daily Focus',
    conditionTarget: 'mci',
    recommendedFor: 'Everyday Routine',
    benefit: 'Organize simple items at home',
  },
  {
    id: 'g8',
    title: 'Morning Routine Order',
    description: 'Put morning steps in their natural, calming order.',
    icon: 'puzzle',
    gradient: 'from-violet-300 to-violet-500',
    category: 'focus',
    categoryLabel: 'Daily Focus',
    conditionTarget: 'mci',
    recommendedFor: 'Morning Steps',
    benefit: 'Remember morning routines with ease',
  },

  // Category 5: Peace & Breathing
  {
    id: 'g9',
    title: 'Zen Flower Bloom',
    description: 'Tap colorful petals to bloom beautiful flowers.',
    icon: 'sparkles',
    gradient: 'from-emerald-300 to-emerald-500',
    category: 'zen',
    categoryLabel: 'Peace & Calm',
    conditionTarget: 'healthy_aging',
    recommendedFor: 'Joy & Calm',
    benefit: 'Peaceful moments and happy thoughts',
  },
  {
    id: 'g10',
    title: 'Serene Breathing Circle',
    description: 'Follow the gentle expanding ring for slow, relaxing breaths.',
    icon: 'activity',
    gradient: 'from-rose-300 to-rose-500',
    category: 'zen',
    categoryLabel: 'Peace & Calm',
    conditionTarget: 'healthy_aging',
    recommendedFor: 'Gentle Breaths',
    benefit: 'Deep breathing to feel peaceful',
  },
];
