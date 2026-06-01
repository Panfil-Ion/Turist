CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE location_category AS ENUM (
  'park', 'museum', 'winery', 'gallery', 'restaurant', 'landmark', 'other'
);

CREATE TYPE weather_exposure AS ENUM ('outdoor', 'indoor', 'mixed');

CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');

CREATE TABLE locations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT NOT NULL UNIQUE,
  name_ro          TEXT NOT NULL,
  name_en          TEXT NOT NULL,
  description_en   TEXT NOT NULL,
  lat              NUMERIC(10, 7) NOT NULL,
  lng              NUMERIC(10, 7) NOT NULL,
  category         location_category NOT NULL,
  weather_exposure weather_exposure NOT NULL DEFAULT 'mixed',
  is_free_tier     BOOLEAN NOT NULL DEFAULT false,
  video_path       TEXT NOT NULL,
  thumb_path       TEXT,
  zone_key         TEXT NOT NULL,
  sort_order       SMALLINT NOT NULL DEFAULT 0,
  taxi_fare_min    INTEGER NOT NULL,
  taxi_fare_max    INTEGER NOT NULL,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_locations_category ON locations(category);
CREATE INDEX idx_locations_zone ON locations(zone_key);

CREATE TABLE culinary_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id  UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  dish_name_ro TEXT NOT NULL,
  dish_name_en TEXT NOT NULL,
  order_this   TEXT NOT NULL,
  avoid_this   TEXT NOT NULL,
  audio_path   TEXT NOT NULL,
  sort_order   SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE users (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id         TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT UNIQUE,
  pass_purchased_at  TIMESTAMPTZ,
  pass_expires_at    TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_pass ON users(pass_expires_at) WHERE pass_expires_at IS NOT NULL;

CREATE TABLE payments (
  id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id   TEXT UNIQUE,
  amount_cents               INTEGER NOT NULL DEFAULT 500,
  currency                   TEXT NOT NULL DEFAULT 'eur',
  status                     payment_status NOT NULL DEFAULT 'pending',
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_user ON payments(user_id);

CREATE OR REPLACE FUNCTION has_active_pass(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = p_user_id
      AND pass_expires_at IS NOT NULL
      AND pass_expires_at > now()
  );
$$;

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE culinary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "locations_read" ON locations FOR SELECT USING (is_active = true);
CREATE POLICY "culinary_read" ON culinary_items FOR SELECT USING (true);
