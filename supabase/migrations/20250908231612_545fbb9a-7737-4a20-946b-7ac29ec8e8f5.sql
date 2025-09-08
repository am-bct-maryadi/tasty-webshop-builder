-- Create banners table
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  position TEXT NOT NULL DEFAULT 'hero' CHECK (position IN ('hero', 'sidebar', 'footer', 'popup', 'after_branch_selection')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 1,
  branch_id UUID NOT NULL,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL DEFAULT CURRENT_DATE + INTERVAL '30 days',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Create policies for banners
CREATE POLICY "Anyone can view active banners" 
ON public.banners 
FOR SELECT 
USING (is_active = true AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE);

CREATE POLICY "Admins can view all banners" 
ON public.banners 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE (users.id)::text = (auth.uid())::text 
    AND users.role IN ('admin', 'super_admin')
    AND users.is_active = true
  )
);

CREATE POLICY "Admins can create banners" 
ON public.banners 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE (users.id)::text = (auth.uid())::text 
    AND users.role IN ('admin', 'super_admin')
    AND users.is_active = true
  )
);

CREATE POLICY "Admins can update banners" 
ON public.banners 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE (users.id)::text = (auth.uid())::text 
    AND users.role IN ('admin', 'super_admin')
    AND users.is_active = true
  )
);

CREATE POLICY "Super admins can delete banners" 
ON public.banners 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE (users.id)::text = (auth.uid())::text 
    AND users.role = 'super_admin'
    AND users.is_active = true
  )
);

-- Add foreign key constraint to branches
ALTER TABLE public.banners 
ADD CONSTRAINT banners_branch_id_fkey 
FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();