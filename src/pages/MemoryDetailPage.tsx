import { useApp } from '@/context/AppContext';
import { useMemories } from '@/hooks/useMemories';
import { PageHeader, ErrorState } from '@/components/UI';
import { Illustration } from '@/components/Illustration';
import { Volume2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export function MemoryDetailPage() {
  const { selectedMemoryId, goBack } = useApp();
  const { memories, error, refresh } = useMemories();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const memory = memories.find((m) => m.id === selectedMemoryId);

  const handleListen = () => {
    if (!memory) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${memory.caption}. ${memory.detail}`);
      utterance.rate = 0.88;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <PageHeader title="My Memories" />
        <ErrorState message={error} onRetry={refresh} />
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Memory not found" />
        <button onClick={goBack} className="btn-secondary">
          <ArrowLeft className="w-6 h-6" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title={memory.title} subtitle={memory.year} />

      <div className="card-base overflow-hidden animate-scaleIn">
        {memory.image && memory.image.startsWith('data:') ? (
          <img src={memory.image} alt={memory.title} className="w-full aspect-[4/3] object-cover" />
        ) : (
          <Illustration id={memory.image} label={memory.title} className="w-full aspect-[4/3]" rounded="rounded-none" />
        )}

        <div className="p-6 sm:p-8">
          <p className="text-2xl font-display font-extrabold text-ink-800 mb-3">{memory.caption}</p>
          <p className="text-xl text-ink-600 leading-relaxed mb-6">{memory.detail}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleListen}
              className="btn-primary flex-1 text-xl"
              aria-label="Listen to memory description"
            >
              <Volume2 className={`w-7 h-7 ${isSpeaking ? 'animate-bounce text-yellow-200' : ''}`} />
              {isSpeaking ? 'Listening...' : 'Listen to Story'}
            </button>
            <button onClick={goBack} className="btn-secondary flex-1 text-xl">
              <ArrowLeft className="w-6 h-6" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
