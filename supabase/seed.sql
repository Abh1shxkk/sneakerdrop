-- SneakerDrop seed data. Run after schema.sql. Re-running updates rows by slug.

insert into public.products
  (slug, name, tagline, description, price_cents, image_url, colorway, accent_hex, availability, featured, sort_order)
values
  ('ember-runner', 'Ember Runner', 'Knit speed, all day.',
   'A sock-like knit upper wrapped around our lightest Cloud-Foam midsole. Built for long city miles and late-night runs.',
   1299900, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
   'Ember Red / Bone', '#C2272D', 'available', true, 1),
  ('volt-pulse', 'Volt Pulse', 'Train loud.',
   'Stable platform, wide forefoot and a grippy rubber outsole for lifting, HIIT and everything in between.',
   1099900, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&q=80',
   'Volt / Black / Sail', '#C6E92B', 'low_stock', true, 2),
  ('apricot-air', 'Apricot Air', 'A classic, softened.',
   'Visible air pocket, suede overlays and a warm apricot accent. The everyday pair that goes with everything.',
   1449900, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200&q=80',
   'Sail / Apricot', '#E8875C', 'available', true, 3),
  ('pastel-cloud', 'Pastel Cloud', 'Stacked sole. Soft colours.',
   'A double-stacked platform in sorbet pastels. Layered leather panels and a padded collar for all-day comfort.',
   1599900, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80',
   'Lavender / Lemon / Mint', '#B9A8E8', 'coming_soon', true, 4),
  ('ghost-court', 'Ghost Court', 'Clean as it gets.',
   'Perforated full-grain leather and a cupsole you can live in. Minimal, all-white, timeless.',
   899900, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&q=80',
   'Triple White', '#D9D2CB', 'sold_out', false, 5),
  ('wheat-trail', 'Wheat Trail', 'Built for weather.',
   'Water-resistant nubuck, a contrast navy collar and an outsole that handles wet streets and gravel paths.',
   1349900, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=80',
   'Wheat / Navy / Gum', '#B8792E', 'available', false, 6),
  ('olive-drift', 'Olive Drift', 'Quiet colour, loud comfort.',
   'A breathable mesh-and-suede runner in muted olive with a bold black logo panel and an energy-return midsole.',
   999900, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1200&q=80',
   'Olive / Black / White', '#6B7046', 'sold_out', false, 7)
on conflict (slug) do update set
  name = excluded.name, tagline = excluded.tagline, description = excluded.description,
  price_cents = excluded.price_cents, image_url = excluded.image_url, colorway = excluded.colorway,
  accent_hex = excluded.accent_hex, availability = excluded.availability,
  featured = excluded.featured, sort_order = excluded.sort_order;

-- Make yourself admin (after creating the user in Authentication → Users):
-- insert into public.admins (user_id)
--   select id from auth.users where email = 'you@example.com'
-- on conflict do nothing;
