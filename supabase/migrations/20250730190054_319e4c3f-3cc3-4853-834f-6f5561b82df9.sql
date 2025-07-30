-- Add sort_order column to categories table for sorting functionality
ALTER TABLE public.categories ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Create index for better performance on sorting
CREATE INDEX idx_categories_sort_order ON public.categories(sort_order);

-- Update existing categories to have incremental sort order
UPDATE public.categories 
SET sort_order = (
  SELECT ROW_NUMBER() OVER (PARTITION BY branch_id ORDER BY name)
  FROM public.categories c2 
  WHERE c2.id = categories.id
);