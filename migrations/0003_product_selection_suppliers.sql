CREATE TABLE IF NOT EXISTS product_selection_suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL COLLATE NOCASE UNIQUE,
  shop_url TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE product_styles ADD COLUMN supplier_id INTEGER REFERENCES product_selection_suppliers(id);
ALTER TABLE product_selection_items ADD COLUMN supplier_name_snapshot TEXT;
ALTER TABLE product_selection_items ADD COLUMN supplier_url_snapshot TEXT;
