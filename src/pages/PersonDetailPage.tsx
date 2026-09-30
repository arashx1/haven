import { useApp } from '@/context/AppContext';
import { usePeople } from '@/hooks/usePeople';
import { PageHeader, ErrorState } from '@/components/UI';
import { Illustration } from '@/components/Illustration';
import { Phone, Volume2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export function PersonDetailPage() {
  const { selectedPersonId, goBack } = useApp();
  const { people, error, refresh } = usePeople();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callNotice, setCallNotice] = useState<string | null>(null);

  const person = people.find((p) => p.id === selectedPersonId);

  const handleListen = () => {
    if (!person) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = `${person.name}. ${person.relationship}. ${person.info}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.88;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCall = () => {
    if (!person) return;
    setCallNotice(`Calling ${person.name} (${person.phone})...`);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Calling ${person.name} now. Someone who loves you will answer.`);
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
    setTimeout(() => {
      setCallNotice(null);
    }, 4000);
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <PageHeader title="My People" />
        <ErrorState message={error} onRetry={refresh} />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Person not found" />
        <button onClick={goBack} className="btn-secondary">
          <ArrowLeft className="w-6 h-6" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title={person.name} subtitle={person.relationship} />

      {callNotice && (
        <div className="mb-4 p-4 rounded-2xl bg-sage-500 text-white font-bold text-center text-lg shadow-md animate-scaleIn flex items-center justify-center gap-2">
          <Phone className="w-6 h-6 animate-bounce" />
          <span>{callNotice}</span>
        </div>
      )}

      <div className="card-base overflow-hidden animate-scaleIn">
        {person.image && person.image.startsWith('data:') ? (
          <img src={person.image} alt={person.name} className="w-full aspect-square sm:aspect-[4/3] object-cover object-top" />
        ) : (
          <Illustration id={person.image} label={person.name} className="w-full aspect-square sm:aspect-[4/3]" rounded="rounded-none" />
        )}

        <div className="p-6 sm:p-8">
          <p className="text-3xl font-display font-extrabold text-ink-800 mb-2">{person.name}</p>
          <p className="text-xl text-honey-600 font-bold mb-4">{person.relationship}</p>
          <p className="text-xl text-ink-600 leading-relaxed mb-6">{person.info}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCall}
              className="btn-success flex-1 text-xl"
              aria-label={`Call ${person.name}`}
            >
              <Phone className="w-7 h-7" />
              Call {person.name}
            </button>
            <button
              onClick={handleListen}
              className="btn-primary flex-1 text-xl"
              aria-label="Listen to information"
            >
              <Volume2 className={`w-7 h-7 ${isSpeaking ? 'animate-bounce text-yellow-200' : ''}`} />
              {isSpeaking ? 'Listening...' : 'Listen'}
            </button>
          </div>
          <button onClick={goBack} className="btn-secondary w-full mt-3 text-xl">
            <ArrowLeft className="w-6 h-6" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
