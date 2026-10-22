-- Haven production care model. Apply after the original schema, once, in Supabase SQL Editor.
-- Additive: existing user records are retained. Legacy reminders.done is no longer used.
begin;
create extension if not exists pgcrypto;
alter table public.profiles add column if not exists care_condition text not null default 'dementia';
alter table public.profiles add column if not exists timezone text not null default 'UTC';

create table if not exists public.caregiver_access (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 caregiver_id uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 unique(owner_id,caregiver_id), check(owner_id<>caregiver_id)
);
alter table public.caregiver_access enable row level security;
create or replace function public.can_access_care(owner uuid)
returns boolean language sql stable security definer set search_path=public as $$
 select auth.uid() is not null and (auth.uid()=owner or exists(select 1 from public.caregiver_access where owner_id=owner and caregiver_id=auth.uid()));
$$;
revoke all on function public.can_access_care(uuid) from public;
grant execute on function public.can_access_care(uuid) to authenticated;
drop policy if exists "Care members read access" on public.caregiver_access;
create policy "Care members read access" on public.caregiver_access for select to authenticated using(owner_id=auth.uid() or caregiver_id=auth.uid());
drop policy if exists "Owners revoke access" on public.caregiver_access;
create policy "Owners revoke access" on public.caregiver_access for delete to authenticated using(owner_id=auth.uid());

drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Care members view profiles" on public.profiles;
create policy "Care members view profiles" on public.profiles for select to authenticated using(public.can_access_care(id));
-- Original owner-only profile insert/update policies remain in place.
do $$
declare t text;
begin
 foreach t in array array['reminders','memories','people'] loop
   execute format('drop policy if exists %I on public.%I','Users manage their own '||t,t);
   execute format('drop policy if exists %I on public.%I','Care members manage records',t);
   execute format('create policy %I on public.%I for all to authenticated using(public.can_access_care(user_id)) with check(public.can_access_care(user_id))','Care members manage records',t);
   execute format('create index if not exists %I on public.%I(user_id)',t||'_user_id_idx',t);
 end loop;
end $$;

create table if not exists public.care_invitations(
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 recipient_email text not null,
 token_hash text not null unique,
 expires_at timestamptz not null default now()+interval '24 hours',
 accepted_at timestamptz,
 created_at timestamptz not null default now()
);
alter table public.care_invitations enable row level security;
-- No client policies: access is only through narrowly scoped functions.
create or replace function public.create_care_invitation(recipient text)
returns text language plpgsql security definer set search_path=public,extensions as $$
declare token text;
begin
 if auth.uid() is null then raise exception 'Sign in first'; end if;
 if recipient is null or recipient !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then raise exception 'Enter a valid email'; end if;
 if lower(trim(recipient))=lower(auth.jwt()->>'email') then raise exception 'Invite a different account'; end if;
 if (select count(*) from public.care_invitations where owner_id=auth.uid() and created_at>now()-interval '1 hour')>=10 then raise exception 'Too many invitations. Try again in an hour.'; end if;
 update public.care_invitations set expires_at=now() where owner_id=auth.uid() and recipient_email=lower(trim(recipient)) and accepted_at is null;
 token=encode(gen_random_bytes(32),'hex');
 insert into public.care_invitations(owner_id,recipient_email,token_hash) values(auth.uid(),lower(trim(recipient)),encode(digest(token,'sha256'),'hex'));
 return token;
end $$;
create or replace function public.accept_care_invitation(invitation_code text)
returns void language plpgsql security definer set search_path=public,extensions as $$
declare invitation public.care_invitations; verified_email text;
begin
 if auth.uid() is null then raise exception 'Sign in first'; end if;
 select lower(email) into verified_email from auth.users where id=auth.uid() and email_confirmed_at is not null;
 if verified_email is null then raise exception 'Verify your account email first'; end if;
 select * into invitation from public.care_invitations where token_hash=encode(digest(invitation_code,'sha256'),'hex') and recipient_email=verified_email and expires_at>now() and accepted_at is null for update;
 if not found then raise exception 'Invitation is invalid, expired, already used, or addressed to another email'; end if;
 insert into public.caregiver_access(owner_id,caregiver_id) values(invitation.owner_id,auth.uid()) on conflict(owner_id,caregiver_id) do nothing;
 update public.care_invitations set accepted_at=now() where id=invitation.id;
end $$;
create or replace function public.list_care_members(owner uuid)
returns table(id uuid,caregiver_id uuid,caregiver_name text)
language sql stable security definer set search_path=public as $$
 select a.id,a.caregiver_id,p.full_name from public.caregiver_access a join public.profiles p on p.id=a.caregiver_id where a.owner_id=owner and public.can_access_care(owner);
$$;
revoke all on function public.create_care_invitation(text),public.accept_care_invitation(text),public.list_care_members(uuid) from public;
grant execute on function public.create_care_invitation(text),public.accept_care_invitation(text),public.list_care_members(uuid) to authenticated;

create table if not exists public.reminder_events(
 id uuid primary key default gen_random_uuid(),
 reminder_id uuid not null references public.reminders(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 occurrence_date date not null,
 completed_at timestamptz,
 snoozed_until timestamptz,
 actor_id uuid references auth.users(id) on delete set null,
 unique(reminder_id,occurrence_date)
);
create index if not exists reminder_events_day_idx on public.reminder_events(user_id,occurrence_date);
alter table public.reminder_events enable row level security;
drop policy if exists "Care members view occurrences" on public.reminder_events;
create policy "Care members view occurrences" on public.reminder_events for select to authenticated using(public.can_access_care(user_id));
create table if not exists public.care_activity(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 actor_id uuid references auth.users(id) on delete set null,
 actor_name text not null default '',
 action text not null,
 subject text not null,
 created_at timestamptz not null default now()
);
create index if not exists care_activity_owner_time_idx on public.care_activity(user_id,created_at desc);
alter table public.care_activity enable row level security;
drop policy if exists "Care members view activity" on public.care_activity;
create policy "Care members view activity" on public.care_activity for select to authenticated using(public.can_access_care(user_id));

create or replace function public.record_reminder_action(reminder uuid,action text,occurrence_on date default null)
returns void language plpgsql security definer set search_path=public as $$
declare item public.reminders; care_zone text; occurrence date; current_day date; already_done timestamptz;
begin
 if auth.uid() is null then raise exception 'Sign in first'; end if;
 select * into item from public.reminders where id=reminder for update;
 if not found or not public.can_access_care(item.user_id) then raise exception 'Reminder unavailable'; end if;
 if action not in ('complete','snooze') or action is null then raise exception 'Invalid reminder action'; end if;
 select timezone into care_zone from public.profiles where id=item.user_id;
 current_day=(now() at time zone coalesce(care_zone,'UTC'))::date;
 occurrence=coalesce(occurrence_on,current_day);
 if occurrence<>current_day and not (
   occurrence=current_day-1 and exists(select 1 from public.reminder_events where reminder_id=reminder and occurrence_date=occurrence and completed_at is null and snoozed_until >= (current_day::timestamp at time zone coalesce(care_zone,'UTC')))
 ) then raise exception 'The schedule day has changed. Refresh and try again.'; end if;
 select completed_at into already_done from public.reminder_events where reminder_id=reminder and occurrence_date=occurrence;
 if already_done is not null then return; end if;
 insert into public.reminder_events(reminder_id,user_id,occurrence_date,completed_at,snoozed_until,actor_id)
 values(reminder,item.user_id,occurrence,case when action='complete' then now() end,case when action='snooze' then now()+interval '15 minutes' end,auth.uid())
 on conflict(reminder_id,occurrence_date) do update set completed_at=excluded.completed_at,snoozed_until=excluded.snoozed_until,actor_id=excluded.actor_id;
 insert into public.care_activity(user_id,actor_id,actor_name,action,subject)
 values(item.user_id,auth.uid(),coalesce((select full_name from public.profiles where id=auth.uid()),''),action,item.title);
end $$;
revoke all on function public.record_reminder_action(uuid,text,date) from public;
grant execute on function public.record_reminder_action(uuid,text,date) to authenticated;

create or replace function public.log_care_change()
returns trigger language plpgsql security definer set search_path=public as $$
declare row_data jsonb;
begin
 row_data=case when TG_OP='DELETE' then to_jsonb(old) else to_jsonb(new) end;
 if auth.uid() is not null then
 insert into public.care_activity(user_id,actor_id,actor_name,action,subject)
 values((row_data->>'user_id')::uuid,auth.uid(),coalesce((select full_name from public.profiles where id=auth.uid()),''),lower(TG_OP)||'_'||TG_TABLE_NAME,coalesce(row_data->>'title',row_data->>'name','Care record'));
 end if;
 if TG_OP='DELETE' then return old; else return new; end if;
end $$;
do $$
declare t text;
begin foreach t in array array['reminders','memories','people'] loop
 execute format('drop trigger if exists care_change_log on public.%I',t);
 execute format('create trigger care_change_log after insert or update or delete on public.%I for each row execute function public.log_care_change()',t);
end loop; end $$;

create table if not exists public.support_requests(
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 message text not null check(length(trim(message)) between 10 and 3000),
 created_at timestamptz not null default now()
);
alter table public.support_requests enable row level security;
drop policy if exists "Users submit own requests" on public.support_requests;
create policy "Users submit own requests" on public.support_requests for insert to authenticated with check(user_id=auth.uid());

create or replace function public.validate_care_profile()
returns trigger language plpgsql set search_path=public as $$
begin
 if new.care_condition not in ('dementia','parkinsons','stroke','mci','healthy_aging') then raise exception 'Invalid care focus'; end if;
 if not exists(select 1 from pg_timezone_names where name=new.timezone) then raise exception 'Invalid time zone'; end if;
 return new;
end $$;
drop trigger if exists validate_care_profile on public.profiles;
create trigger validate_care_profile before insert or update on public.profiles for each row execute function public.validate_care_profile();
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
declare zone text;
begin
 zone=new.raw_user_meta_data->>'timezone';
 if zone is null or not exists(select 1 from pg_timezone_names where name=zone) then zone='UTC'; end if;
 insert into public.profiles(id,full_name,timezone) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''),zone) on conflict(id) do nothing;
 return new;
end $$;
insert into public.profiles(id,full_name)
select id,coalesce(raw_user_meta_data->>'full_name','') from auth.users on conflict(id) do nothing;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('care-photos','care-photos',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists "Care members read photos" on storage.objects;
create policy "Care members read photos" on storage.objects for select to authenticated using(bucket_id='care-photos' and public.can_access_care((storage.foldername(name))[1]::uuid));
drop policy if exists "Care members add photos" on storage.objects;
create policy "Care members add photos" on storage.objects for insert to authenticated with check(bucket_id='care-photos' and public.can_access_care((storage.foldername(name))[1]::uuid));
drop policy if exists "Care members delete photos" on storage.objects;
create policy "Care members delete photos" on storage.objects for delete to authenticated using(bucket_id='care-photos' and public.can_access_care((storage.foldername(name))[1]::uuid));

-- Email verification must be performed by Auth, never by an insert trigger.
drop trigger if exists tr_auto_confirm_new_user on auth.users;
drop function if exists public.auto_confirm_new_user();

-- Explicit least-privilege API grants, independent of project defaults.
revoke all on public.profiles,public.reminders,public.memories,public.people,public.games,
 public.caregiver_access,public.care_invitations,public.reminder_events,public.care_activity,public.support_requests from anon,authenticated;
grant select,insert,update on public.profiles to authenticated;
grant select,insert,update,delete on public.reminders,public.memories,public.people to authenticated;
grant select on public.games,public.reminder_events,public.care_activity to authenticated;
grant select,delete on public.caregiver_access to authenticated;
grant insert on public.support_requests to authenticated;
alter policy "Users can insert their own profile" on public.profiles to authenticated with check ((select auth.uid())=id);
alter policy "Users can update their own profile" on public.profiles to authenticated using ((select auth.uid())=id) with check ((select auth.uid())=id);
alter policy "Signed-in users can view games" on public.games to authenticated using (true);

-- Keep privileged implementations outside the exposed API schema.
create schema if not exists private;
revoke all on schema private from public,anon;
grant usage on schema private to authenticated;
alter function public.can_access_care(uuid) set schema private;
revoke all on function private.can_access_care(uuid) from public,anon,authenticated;
grant execute on function private.can_access_care(uuid) to authenticated;
create function public.can_access_care(owner uuid) returns boolean
language sql stable security invoker set search_path='' as $$ select * from private.can_access_care(owner); $$;
revoke all on function public.can_access_care(uuid) from public,anon;
grant execute on function public.can_access_care(uuid) to authenticated;
alter function public.create_care_invitation(text) set schema private;
revoke all on function private.create_care_invitation(text) from public,anon,authenticated;
grant execute on function private.create_care_invitation(text) to authenticated;
create function public.create_care_invitation(recipient text) returns text
language sql  security invoker set search_path='' as $$ select * from private.create_care_invitation(recipient); $$;
revoke all on function public.create_care_invitation(text) from public,anon;
grant execute on function public.create_care_invitation(text) to authenticated;
alter function public.accept_care_invitation(text) set schema private;
revoke all on function private.accept_care_invitation(text) from public,anon,authenticated;
grant execute on function private.accept_care_invitation(text) to authenticated;
create function public.accept_care_invitation(invitation_code text) returns void
language sql  security invoker set search_path='' as $$ select * from private.accept_care_invitation(invitation_code); $$;
revoke all on function public.accept_care_invitation(text) from public,anon;
grant execute on function public.accept_care_invitation(text) to authenticated;
alter function public.list_care_members(uuid) set schema private;
revoke all on function private.list_care_members(uuid) from public,anon,authenticated;
grant execute on function private.list_care_members(uuid) to authenticated;
create function public.list_care_members(owner uuid) returns table(id uuid,caregiver_id uuid,caregiver_name text)
language sql stable security invoker set search_path='' as $$ select * from private.list_care_members(owner); $$;
revoke all on function public.list_care_members(uuid) from public,anon;
grant execute on function public.list_care_members(uuid) to authenticated;
alter function public.record_reminder_action(uuid,text,date) set schema private;
revoke all on function private.record_reminder_action(uuid,text,date) from public,anon,authenticated;
grant execute on function private.record_reminder_action(uuid,text,date) to authenticated;
create function public.record_reminder_action(reminder uuid,action text,occurrence_on date default null) returns void
language sql  security invoker set search_path='' as $$ select * from private.record_reminder_action(reminder,action,occurrence_on); $$;
revoke all on function public.record_reminder_action(uuid,text,date) from public,anon;
grant execute on function public.record_reminder_action(uuid,text,date) to authenticated;
alter function public.log_care_change() set schema private;
revoke all on function private.log_care_change() from public,anon,authenticated;
alter function public.validate_care_profile() set schema private;
revoke all on function private.validate_care_profile() from public,anon,authenticated;
alter function public.handle_new_user() set schema private;
revoke all on function private.handle_new_user() from public,anon,authenticated;
create index if not exists caregiver_access_caregiver_idx on public.caregiver_access(caregiver_id);
create index if not exists care_invitations_owner_idx on public.care_invitations(owner_id,created_at);
create index if not exists reminder_events_actor_idx on public.reminder_events(actor_id);
create index if not exists care_activity_actor_idx on public.care_activity(actor_id);
create index if not exists support_requests_user_idx on public.support_requests(user_id);
notify pgrst, 'reload schema';
commit;
