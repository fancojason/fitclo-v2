PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS product_styles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  style_no TEXT NOT NULL COLLATE NOCASE UNIQUE,
  main_image_key TEXT NOT NULL,
  available_sizes TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_style_color_charts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  style_id INTEGER NOT NULL REFERENCES product_styles(id) ON DELETE CASCADE,
  object_key TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_style_charts_style
  ON product_style_color_charts(style_id, sort_order);

CREATE TABLE IF NOT EXISTS product_selection_counters (
  selection_date TEXT PRIMARY KEY,
  last_value INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product_selection_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  selection_id TEXT NOT NULL UNIQUE,
  idempotency_key TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_selection_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL REFERENCES product_selection_submissions(id) ON DELETE CASCADE,
  style_no_snapshot TEXT NOT NULL,
  color_snapshot TEXT NOT NULL,
  xs INTEGER,
  s INTEGER,
  m INTEGER,
  l INTEGER,
  xl INTEGER,
  total INTEGER NOT NULL CHECK (total > 0)
);

CREATE INDEX IF NOT EXISTS idx_product_selection_items_submission
  ON product_selection_items(submission_id);

CREATE TABLE IF NOT EXISTS product_selection_login_attempts (
  ip_hash TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  window_started_at INTEGER NOT NULL
);
