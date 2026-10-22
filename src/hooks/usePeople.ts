import { useApp } from '@/context/AppContext';
import { useCloudCollection } from './useCloudCollection';
import { peopleService } from '@/services/api';
import type { Person } from '@/data/catalog';
export function usePeople() {
  const {patientId} = useApp();
  const collection = useCloudCollection('people:' + patientId, () => peopleService.getAll(patientId));
  return {...collection,people:collection.data,
    addPerson:(person:Omit<Person,'id'>) => collection.mutate(() => peopleService.create(person,patientId)),
    deletePerson:(id:string) => collection.mutate(() => peopleService.delete(id,patientId)),
  };
}
