-- Default new listings to expire 24 hours after insert (was 3 days in initial_schema).
alter table listing
  alter column expires_at set default (now() + interval '24 hours');
