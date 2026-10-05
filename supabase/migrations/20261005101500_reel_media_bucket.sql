-- Public marketing Reel/Gift uploads only; paid lesson-videos stays private.
-- Writes require an admin-authorized signed upload URL. No anonymous write policy.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('reel-media', 'reel-media', true, 52428800,
  array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime','video/x-m4v'])
on conflict (id) do nothing;
