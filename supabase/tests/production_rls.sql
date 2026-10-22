-- STAGING ONLY. Synthetic fixtures and all changes are rolled back.
-- Execute after schema.sql and the production migration, as postgres in SQL Editor.
begin;
insert into auth.users(id,email,email_confirmed_at,raw_user_meta_data) values
 ('10000000-0000-4000-8000-000000000001','owner@haven.test',now(),'{"full_name":"Owner","timezone":"UTC"}'),
 ('10000000-0000-4000-8000-000000000002','helper@haven.test',now(),'{"full_name":"Helper","timezone":"UTC"}'),
 ('10000000-0000-4000-8000-000000000003','outsider@haven.test',now(),'{"full_name":"Outsider","timezone":"UTC"}');
insert into public.reminders(id,user_id,type,title,time) values
 ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','task','Test routine','09:00');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000003","email":"outsider@haven.test","role":"authenticated"}',true);
do $$ begin
 if exists(select 1 from public.reminders where id='20000000-0000-4000-8000-000000000001') then raise exception 'FAIL: outsider can read patient data'; end if;
 begin
  perform public.record_reminder_action('20000000-0000-4000-8000-000000000001','complete');
  raise exception 'FAIL: outsider could complete reminder';
 exception when others then if SQLERRM like 'FAIL:%' then raise; end if; end;
end $$;
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","email":"owner@haven.test","role":"authenticated"}',true);
select set_config('test.invitation',public.create_care_invitation('helper@haven.test'),true);
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000003","email":"outsider@haven.test","role":"authenticated"}',true);
do $$ begin
 begin
  perform public.accept_care_invitation(current_setting('test.invitation'));
  raise exception 'FAIL: wrong email accepted invitation';
 exception when others then if SQLERRM like 'FAIL:%' then raise; end if; end;
end $$;
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000002","email":"helper@haven.test","role":"authenticated"}',true);
select public.accept_care_invitation(current_setting('test.invitation'));
do $$ begin
 if not exists(select 1 from public.reminders where id='20000000-0000-4000-8000-000000000001') then raise exception 'FAIL: helper cannot read shared data'; end if;
 begin
  perform public.accept_care_invitation(current_setting('test.invitation'));
  raise exception 'FAIL: invitation reused';
 exception when others then if SQLERRM like 'FAIL:%' then raise; end if; end;
end $$;
select public.record_reminder_action('20000000-0000-4000-8000-000000000001','complete');
select public.record_reminder_action('20000000-0000-4000-8000-000000000001','complete');
do $$ begin
 if (select count(*) from public.reminder_events where reminder_id='20000000-0000-4000-8000-000000000001' and completed_at is not null)<>1 then raise exception 'FAIL: duplicate completion'; end if;
end $$;
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","email":"owner@haven.test","role":"authenticated"}',true);
delete from public.caregiver_access where caregiver_id='10000000-0000-4000-8000-000000000002';
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000002","email":"helper@haven.test","role":"authenticated"}',true);
do $$ begin
 if exists(select 1 from public.reminders where id='20000000-0000-4000-8000-000000000001') then raise exception 'FAIL: revoked helper can still read'; end if;
 if exists(select 1 from public.care_activity where user_id='10000000-0000-4000-8000-000000000001') then raise exception 'FAIL: revoked helper can read activity'; end if;
end $$;
reset role;
rollback;
