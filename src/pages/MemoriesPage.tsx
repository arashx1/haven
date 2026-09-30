import { useApp } from '@/context/AppContext';
import { useMemories } from '@/hooks/useMemories';
import { PageHeader, EmptyState, LoadingState, ErrorState } from '@/components/UI';
import { Illustration } from '@/components/Illustration';
import { Images, FolderOpen } from 'lucide-react';

export function MemoriesPage() {
  const { navigate } = useApp();
  const { memories, loading, error, refresh } = useMemories();

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="My Memories"
        subtitle="Cherished moments and family photos."
        icon={
          <div className="w-12 h-12 rounded-2xl bg-coral-100 flex items-center justify-center">
            <Images className="w-7 h-7 text-coral-600" />
          </div>
        }
        showBack={false}
      />

      {loading && <LoadingState message="Loading your memories..." />}
      {error && <ErrorState message={error} onRetry={refresh} />}

      {!loading && !error && memories.length === 0 && (
        <EmptyState
          icon={<Images className="w-10 h-10" />}
          title="No memories yet"
          message="Your family helper will add your special memories here."
        />
      )}

      {!loading && !error && memories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {memories.map((memory, idx) => (
            <div
              key={memory.id}
              className="card-base card-hover overflow-hidden animate-slideUp"
              style={{ animationDelay: `${idx * 100}ms` }}
              onClick={() => navigate('memory-detail', { memoryId: memory.id })}
            >
              {memory.image && memory.image.startsWith('data:') ? (
                <img src={memory.image} alt={memory.title} className="w-full aspect-[4/3] object-cover" />
              ) : (
                <Illustration id={memory.image} className="w-full aspect-[4/3]" rounded="rounded-none" />
              )}
              <div className="p-5">
                <p className="font-display font-extrabold text-ink-800 text-2xl mb-1">{memory.title}</p>
                <p className="text-ink-500 text-lg mb-1">{memory.description}</p>
                <p className="text-honey-600 font-bold text-base">{memory.year}</p>
                <button className="btn-secondary w-full mt-4 text-lg">
                  <FolderOpen className="w-5 h-5" />
                  See Photo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
