-- Create categories table
CREATE TABLE IF NOT EXISTS doc_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for categories
ALTER TABLE doc_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read doc_categories" ON doc_categories FOR SELECT USING (true);
CREATE POLICY "Authenticated insert doc_categories" ON doc_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update doc_categories" ON doc_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete doc_categories" ON doc_categories FOR DELETE TO authenticated USING (true);


-- Create documentations table
CREATE TABLE IF NOT EXISTS documentations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT, -- Markdown content
  excerpt TEXT, -- Short description for cards
  category_id UUID REFERENCES doc_categories(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for documentations
ALTER TABLE documentations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published documentations" ON documentations FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
CREATE POLICY "Authenticated all documentations" ON documentations FOR ALL TO authenticated USING (true) WITH CHECK (true);
