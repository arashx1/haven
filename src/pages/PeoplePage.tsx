import { useApp } from '@/context/AppContext';
import { usePeople } from '@/hooks/usePeople';
import { PageHeader, EmptyState, LoadingState, ErrorState } from '@/components/UI';
import { Illustration } from '@/components/Illustration';
import { Users, Heart } from 'lucide-react';

export function PeoplePage() {
  const { navigate } = useApp();
  const { people, loading, error, refresh } = usePeople();

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="My People"
        subtitle="The loved ones in your life."
        icon={
          <div className="w-12 h-12 rounded-2xl bg-cream-200 flex items-center justify-center">
            <Users className="w-7 h-7 text-ink-600" />
          </div>
        }
        showBack={false}
      />

      {loading && <LoadingState message="Loading your people..." />}
      {error && <ErrorState message={error} onRetry={refresh} />}

      {!loading && !error && people.length === 0 && (
        <EmptyState
          icon={<Users className="w-10 h-10" />}
          title="No people added yet"
          message="Your family helper will add important people here for you."
        />
      )}

      {!loading && !error && people.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {people.map((person, idx) => (
            <div
              key={person.id}
              className="card-base card-hover overflow-hidden animate-slideUp"
              style={{ animationDelay: `${idx * 100}ms` }}
              onClick={() => navigate('person-detail', { personId: person.id })}
            >
              {person.image && person.image.startsWith('data:') ? (
                <img src={person.image} alt={person.name} className="w-full aspect-square object-cover object-top" />
              ) : (
                <Illustration id={person.image} label={person.name} className="w-full aspect-square" rounded="rounded-none" />
              )}
              <div className="p-5 text-center">
                <p className="font-display font-extrabold text-ink-800 text-3xl mb-1">{person.name}</p>
                <p className="text-honey-600 font-bold text-lg mb-4">{person.relationship}</p>
                <button className="btn-primary w-full text-lg">
                  <Heart className="w-5 h-5 fill-current" />
                  See {person.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
