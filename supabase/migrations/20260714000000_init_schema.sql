-- DIMENSHOP Init Schema Migration
-- Creates custom types, public schemas, tables, indices, triggers, and RLS policies

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE public.product_status AS ENUM ('draft', 'processing', 'active', 'archived');
CREATE TYPE public.processing_job_status AS ENUM ('queued', 'downloading', 'reconstructing', 'meshing', 'optimizing', 'exporting', 'completed', 'failed');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE public.notification_type AS ENUM ('order', 'processing', 'system', 'promotion');

-- 2. Tables

-- Users table (profile linked to auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role public.user_role NOT NULL DEFAULT 'buyer'::public.user_role,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon_url TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL CONSTRAINT price_positive CHECK (price >= 0),
  compare_at_price DECIMAL(12,2) CONSTRAINT compare_price_positive CHECK (compare_at_price >= 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CONSTRAINT stock_non_negative CHECK (stock_quantity >= 0),
  status public.product_status NOT NULL DEFAULT 'draft'::public.product_status,
  model_url TEXT,
  has_3d_model BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Product Images table
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Processing Jobs table (COLMAP pipelines)
CREATE TABLE public.processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status public.processing_job_status NOT NULL DEFAULT 'queued'::public.processing_job_status,
  progress INTEGER NOT NULL DEFAULT 0 CONSTRAINT progress_range CHECK (progress >= 0 AND progress <= 100),
  error_message TEXT,
  model_url TEXT,
  pipeline_metadata JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Addresses table
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL DEFAULT 'Home',
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  address_id UUID REFERENCES public.addresses(id) ON DELETE RESTRICT NOT NULL,
  order_number TEXT NOT NULL UNIQUE,
  subtotal DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
  tax DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (tax >= 0),
  shipping_cost DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (shipping_cost >= 0),
  total DECIMAL(12,2) NOT NULL CHECK (total >= 0),
  status public.order_status NOT NULL DEFAULT 'pending'::public.order_status,
  payment_status public.payment_status NOT NULL DEFAULT 'pending'::public.payment_status,
  payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Order Items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CONSTRAINT quantity_positive CHECK (quantity > 0),
  unit_price DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(12,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Cart Items table
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CONSTRAINT cart_quantity_positive CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, product_id)
);

-- Wishlists table
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, product_id)
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type public.notification_type NOT NULL DEFAULT 'system'::public.notification_type,
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Indexes for Optimization
CREATE INDEX idx_products_seller ON public.products(seller_id);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_product_images_product ON public.product_images(product_id);
CREATE INDEX idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_order_items_seller ON public.order_items(seller_id);
CREATE INDEX idx_cart_items_user ON public.cart_items(user_id);
CREATE INDEX idx_wishlists_user ON public.wishlists(user_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id) WHERE is_read = FALSE;

-- 4. Automatically Update Updated_at Trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trigger_update_products BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trigger_update_processing_jobs BEFORE UPDATE ON public.processing_jobs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trigger_update_orders BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Sync auth.users to public.users Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, avatar_url, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'buyer'::public.user_role),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.phone
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Row Level Security Policies

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT TO authenticated, anon USING (true);

-- Products policies
CREATE POLICY "Anyone can view active products" ON public.products 
  FOR SELECT TO authenticated, anon USING (status = 'active'::public.product_status);
CREATE POLICY "Sellers can view own products" ON public.products 
  FOR SELECT TO authenticated USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can create products" ON public.products 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id AND EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'seller'::public.user_role
  ));
CREATE POLICY "Sellers can update own products" ON public.products 
  FOR UPDATE TO authenticated USING (auth.uid() = seller_id) WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete own products" ON public.products 
  FOR DELETE TO authenticated USING (auth.uid() = seller_id);

-- Product Images policies
CREATE POLICY "Anyone can view product images" ON public.product_images 
  FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Sellers can manage images of own products" ON public.product_images
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.products 
      WHERE id = product_id AND seller_id = auth.uid()
    )
  );

-- Processing Jobs policies
CREATE POLICY "Sellers can view own jobs" ON public.processing_jobs 
  FOR SELECT TO authenticated USING (auth.uid() = seller_id);
CREATE POLICY "Backend service can manage all jobs" ON public.processing_jobs 
  FOR ALL TO service_role USING (true);

-- Addresses policies
CREATE POLICY "Users can manage own addresses" ON public.addresses 
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Buyers can view own orders" ON public.orders 
  FOR SELECT TO authenticated USING (auth.uid() = buyer_id);
CREATE POLICY "Sellers can view relevant orders" ON public.orders 
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.order_items 
      WHERE order_id = id AND seller_id = auth.uid()
    )
  );
CREATE POLICY "Buyers can create own orders" ON public.orders 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = buyer_id);

-- Order Items policies
CREATE POLICY "Buyers can view own order items" ON public.order_items 
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND buyer_id = auth.uid()
    )
  );
CREATE POLICY "Sellers can view own order items" ON public.order_items 
  FOR SELECT TO authenticated USING (auth.uid() = seller_id);

-- Cart Items policies
CREATE POLICY "Users can manage own cart" ON public.cart_items 
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Wishlists policies
CREATE POLICY "Users can manage own wishlist" ON public.wishlists 
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can manage own notifications" ON public.notifications 
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
