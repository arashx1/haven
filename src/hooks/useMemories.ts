import { useApp } from '@/context/AppContext';
import { useCloudCollection } from './useCloudCollection';
import { memoryService } from '@/services/api';
import type { Memory } from '@/data/catalog';
export function useMemories() {
  const {patientId} = useApp();
  const collection = useCloudCollection('memories:' + patientId, () => memoryService.getAll(patientId));
  return {...collection,memories:collection.data,
    addMemory:(memory:Omit<Memory,'id'>) => collection.mutate(() => memoryService.create(memory,patientId)),
    deleteMemory:(id:string) => collection.mutate(() => memoryService.delete(id,patientId)),
  };
}
