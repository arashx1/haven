import { type Reminder, type Memory, type Person, activityCatalog } from '@/data/catalog';
import { supabase } from '@/lib/supabaseClient';
import { normalizeTime, zonedClock, selectOccurrence } from '@/utils/reminders';

export interface ApiResponse<T> { data: T; error: string | null; }
export async function requireUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Your session has expired. Please sign in again.');
  return data.user;
}
async function remove(table: string, id: string, owner: string) {
  await requireUser();
  const { error } = await supabase.from(table).delete().eq('id',id).eq('user_id',owner).select('id').single();
  if (error) throw error;
}
async function resolvePhotos<T extends { image: string }>(rows: T[]): Promise<T[]> {
  return Promise.all(rows.map(async row => {
    if (!row.image.startsWith('storage:')) return row;
    const { data, error } = await supabase.storage.from('care-photos').createSignedUrl(row.image.slice(8),300);
    if (error) throw error;
    return { ...row, image: data.signedUrl };
  }));
}
async function uploadPhoto(image: string, owner: string) {
  if (!image.startsWith('data:')) return image;
  const response = await fetch(image);
  const blob = await response.blob();
  if (!['image/jpeg','image/png','image/webp'].includes(blob.type) || blob.size > 5 * 1024 * 1024) throw new Error('Choose a JPG, PNG, or WebP image under 5 MB.');
  const path = owner + '/' + crypto.randomUUID() + '.' + blob.type.split('/')[1];
  const { error } = await supabase.storage.from('care-photos').upload(path,blob,{contentType:blob.type,upsert:false});
  if (error) throw error;
  return 'storage:' + path;
}
async function createWithPhoto<T extends { image: string }>(table: string, item: T, owner: string) {
  await requireUser();
  const image = await uploadPhoto(item.image, owner);
  const { error } = await supabase.from(table).insert({ ...item, image, user_id: owner });
  if (error) {
    if (image.startsWith('storage:') && image !== item.image) await supabase.storage.from('care-photos').remove([image.slice(8)]);
    throw error;
  }
}
export const reminderService = {
  async getAll(owner: string, timezone: string): Promise<Reminder[]> {
    const day = zonedClock(new Date(),timezone).day;
    const previousDay = new Date(Date.parse(day + 'T00:00:00Z') - 86400000).toISOString().slice(0,10);
    const [reminders, events] = await Promise.all([
      supabase.from('reminders').select('id,type,title,time,description,icon').eq('user_id',owner),
      supabase.from('reminder_events').select('reminder_id,occurrence_date,completed_at,snoozed_until').eq('user_id',owner).gte('occurrence_date',previousDay).lte('occurrence_date',day),
    ]);
    if (reminders.error) throw reminders.error;
    if (events.error) throw events.error;
    return (reminders.data || []).map(row => {
      const event = selectOccurrence((events.data || []).filter(e => e.reminder_id === row.id),day,timezone);
      return {...row, time: normalizeTime(row.time), occurrenceDate:event?.occurrence_date || day, done: Boolean(event?.completed_at), completedAt:event?.completed_at, snoozedUntil:event?.snoozed_until} as Reminder;
    }).sort((a,b) => a.time.localeCompare(b.time));
  },
  async complete(id: string, occurrence?: string) {
    const { error } = await supabase.rpc('record_reminder_action',{ reminder: id, action: 'complete', occurrence_on: occurrence });
    if (error) throw error;
  },
  async snooze(id: string, occurrence?: string) {
    const { error } = await supabase.rpc('record_reminder_action',{ reminder: id, action: 'snooze', occurrence_on: occurrence });
    if (error) throw error;
  },
  async create(reminder: Omit<Reminder,'id'|'done'>, owner: string) {
    await requireUser();
    if (!reminder.title.trim()) throw new Error('Enter a reminder title.');
    const { error } = await supabase.from('reminders').insert({type:reminder.type,title:reminder.title.trim(),time:normalizeTime(reminder.time),description:reminder.description,icon:reminder.icon,user_id:owner});
    if (error) throw error;
  },
  delete: (id: string, owner: string) => remove('reminders',id,owner),
};
export const memoryService = {
  async getAll(owner: string): Promise<Memory[]> {
    const {data,error} = await supabase.from('memories').select('id,title,description,year,image,caption,detail').eq('user_id',owner).order('created_at');
    if (error) throw error;
    return resolvePhotos(data || []);
  },
  create: (item: Omit<Memory,'id'>, owner: string) => createWithPhoto('memories',item,owner),
  delete: (id: string, owner: string) => remove('memories',id,owner),
};
export const peopleService = {
  async getAll(owner: string): Promise<Person[]> {
    const {data,error} = await supabase.from('people').select('id,name,relationship,image,info,phone').eq('user_id',owner).order('created_at');
    if (error) throw error;
    return resolvePhotos(data || []);
  },
  create: (item: Omit<Person,'id'>, owner: string) => createWithPhoto('people',item,owner),
  delete: (id: string, owner: string) => remove('people',id,owner),
};
// Activities are shipped application content, never patient records.
export const gameService = { async getAll() { return {data:activityCatalog,error:null}; } };
