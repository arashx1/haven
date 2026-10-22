import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeTime,zonedClock,isDue,phoneHref,selectOccurrence} from '../src/utils/reminders.ts';
test('normalizes old 12-hour data and new clock inputs without noon/midnight ambiguity',()=>{
  assert.equal(normalizeTime('12:00 AM'),'00:00');
  assert.equal(normalizeTime('12:00 PM'),'12:00');
  assert.equal(normalizeTime('9:05 pm'),'21:05');
  assert.equal(normalizeTime('07:30:00'),'07:30');
});
test('rejects malformed or out-of-range reminder times',()=>{
  for(const input of ['25:00','12:60','00:30 PM','13:15 AM','later','-1:00','7:5','07:30:60','07:30:99','']) assert.throws(()=>normalizeTime(input));
});
test('uses the patient timezone across day boundaries',()=>{
  const instant=new Date('2026-10-22T20:00:00Z');
  assert.deepEqual(zonedClock(instant,'Asia/Kolkata'),{day:'2026-10-23',time:'01:30'});
  assert.deepEqual(zonedClock(instant,'America/Los_Angeles'),{day:'2026-10-22',time:'13:00'});
});
test('handles daylight saving jump without inventing local time',()=>{
  assert.deepEqual(zonedClock(new Date('2026-03-08T06:59:00Z'),'America/New_York'),{day:'2026-03-08',time:'01:59'});
  assert.deepEqual(zonedClock(new Date('2026-03-08T07:00:00Z'),'America/New_York'),{day:'2026-03-08',time:'03:00'});
});
test('completed tasks never become due again within an occurrence',()=>{
  assert.equal(isDue({done:true,time:'09:00'},new Date('2026-10-22T10:00:00Z'),'UTC'),false);
});
test('snooze blocks due status until the exact persisted deadline',()=>{
  const task={done:false,time:'09:00',snoozedUntil:'2026-10-22T10:15:00Z'};
  assert.equal(isDue(task,new Date('2026-10-22T10:14:59Z'),'UTC'),false);
  assert.equal(isDue(task,new Date('2026-10-22T10:15:00Z'),'UTC'),true);
});
test('future tasks are not overdue',()=>{
  assert.equal(isDue({done:false,time:'09:00'},new Date('2026-10-22T08:59:00Z'),'UTC'),false);
  assert.equal(isDue({done:false,time:'09:00'},new Date('2026-10-22T09:00:00Z'),'UTC'),true);
});
test('a snooze crossing midnight stays in force until the timestamp',()=>{
  assert.equal(isDue({done:false,time:'23:55',snoozedUntil:'2026-10-23T00:10:00Z'},new Date('2026-10-23T00:05:00Z'),'UTC'),false);
});
test('dial links normalize real numbers and reject placeholders or URI injection',()=>{
  assert.equal(phoneHref('+91 (98765) 43210'),'tel:+919876543210');
  for(const input of ['N/A','','123','javascript:alert(1)','+123;ext=99','++919876543210']) assert.equal(phoneHref(input),null);
});


test('retains a pending previous-day snooze after midnight',()=>{
  const carry={occurrence_date:'2026-10-22',completed_at:null,snoozed_until:'2026-10-23T00:10:00Z'};
  assert.equal(selectOccurrence([carry],'2026-10-23','UTC'),carry);
  assert.equal(selectOccurrence([{...carry,completed_at:'2026-10-23T00:12:00Z'}],'2026-10-23','UTC'),undefined);
});
test('today completion takes precedence over a previous occurrence',()=>{
  const previous={occurrence_date:'2026-10-22',completed_at:null,snoozed_until:'2026-10-23T00:10:00Z'};
  const today={occurrence_date:'2026-10-23',completed_at:'2026-10-23T09:00:00Z',snoozed_until:null};
  assert.equal(selectOccurrence([previous,today],'2026-10-23','UTC'),today);
});
