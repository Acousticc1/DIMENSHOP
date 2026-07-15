-- DIMENSHOP Storage Setup Migration
-- Configures storage buckets for product images and GLB models with strict RLS policies

-- 1. Create Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('product-images', 'product-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']), -- 10MB limit
  ('models', 'models', true, 52428800, ARRAY['model/gltf-binary', 'application/octet-stream']) -- 50MB limit
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for product-images bucket

-- Allow public read access to product images
CREATE POLICY "Public Read Access for Images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated sellers to upload images
CREATE POLICY "Sellers can upload product images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'seller'::public.user_role
    )
  );

-- Allow sellers to delete own uploaded images
CREATE POLICY "Sellers can delete own images" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'product-images' AND
    (owner = auth.uid()::text OR auth.uid()::text = (regexp_match(name, '^([^/]+)'))[1])
  );

-- 3. Storage Policies for models bucket

-- Allow public read access to GLB models
CREATE POLICY "Public Read Access for Models" ON storage.objects
  FOR SELECT USING (bucket_id = 'models');

-- Allow service role (FastAPI Backend / Celery Worker) to manage models bucket
CREATE POLICY "Service Role can manage models" ON storage.objects
  FOR ALL TO service_role USING (bucket_id = 'models') WITH CHECK (bucket_id = 'models');
