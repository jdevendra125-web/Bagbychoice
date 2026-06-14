-- =============================================
-- Bag By Choice - Initial Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(10,2),
  discount_percent INTEGER DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
  category TEXT DEFAULT 'handbag',
  images TEXT[] DEFAULT '{}',
  is_listed BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 1 CHECK (stock_quantity >= 0),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL DEFAULT 'BBC-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0'),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  customer_city TEXT DEFAULT '',
  customer_pincode TEXT DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]',
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- STORE SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO store_settings (key, value) VALUES
  ('store_name', 'Bag By Choice'),
  ('tagline', 'Choose your style, carry your confidence'),
  ('phone', '8850417119'),
  ('instagram', '@BAGBY CHOICE'),
  ('announcement', 'Free delivery on orders above ₹999 • Premium Quality Imported Collection')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Products: public can read listed products, admin manages all
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view listed products"
  ON products FOR SELECT
  USING (is_listed = true);

CREATE POLICY "Service role manages products"
  ON products FOR ALL
  USING (auth.role() = 'service_role');

-- Orders: anyone can insert (place order), admin manages all
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can place orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role manages orders"
  ON orders FOR ALL
  USING (auth.role() = 'service_role');

-- Store settings: public can read
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read store settings"
  ON store_settings FOR SELECT
  USING (true);

CREATE POLICY "Service role manages settings"
  ON store_settings FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================
-- STORAGE BUCKET
-- Run this separately in Supabase dashboard > Storage
-- Or via the Supabase CLI:
--   supabase storage create product-images --public
-- =============================================
-- CREATE BUCKET product-images (public = true)
-- Policy: allow public reads, service_role for writes
