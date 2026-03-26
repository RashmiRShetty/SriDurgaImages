-- Create Categories Table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Subcategories Table
CREATE TABLE subcategories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(category_id, name)
);

-- Create Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount_price DECIMAL(10, 2),
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Product Images Table
CREATE TABLE product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Create policies (Public read for now, Admin write)
-- Note: In a real app, you'd use auth.uid() for admin checks.
-- For this demo, we'll allow public read and authenticated write.

CREATE POLICY "Public Read Categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public Read Subcategories" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read Product Images" ON product_images FOR SELECT USING (true);

-- For simplicity in this task, let's allow all actions for now. 
-- In production, restrict INSERT/UPDATE/DELETE to authenticated admin users.
CREATE POLICY "Allow All for Admin" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All for Admin" ON subcategories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All for Admin" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All for Admin" ON product_images FOR ALL USING (true) WITH CHECK (true);

-- Insert some initial categories
INSERT INTO categories (name) VALUES ('Living Room'), ('Bedroom'), ('Kitchen'), ('Office');
