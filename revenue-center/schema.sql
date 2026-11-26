-- ÇAĞBAŞ Revenue Center — başlangıç D1 şeması taslağı
-- Henüz uygulanmadı. Ayrı bir D1 veritabanına uygulanmalıdır.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS revenue_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('ads','affiliate','sponsor','store','referral')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','paused','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS revenue_entries (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('earning','commission','expense','refund','adjustment')),
  amount_minor INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TRY',
  reference_code TEXT,
  description TEXT,
  occurred_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_id) REFERENCES revenue_sources(id)
);

CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT,
  commission_model TEXT,
  commission_rate REAL,
  status TEXT NOT NULL DEFAULT 'prospect' CHECK (status IN ('prospect','active','paused','closed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sponsor_campaigns (
  id TEXT PRIMARY KEY,
  sponsor_name TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  agreed_amount_minor INTEGER,
  currency TEXT NOT NULL DEFAULT 'TRY',
  disclosure_text TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','published','completed','cancelled')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS digital_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_minor INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'TRY',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','archived')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  order_reference TEXT UNIQUE,
  amount_minor INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'TRY',
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES digital_products(id)
);

CREATE INDEX IF NOT EXISTS idx_revenue_entries_occurred_at ON revenue_entries(occurred_at);
CREATE INDEX IF NOT EXISTS idx_revenue_entries_source_id ON revenue_entries(source_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
