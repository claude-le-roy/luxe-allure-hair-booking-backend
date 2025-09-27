-- Create profiles table with role-based access
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role text CHECK (role IN ('customer', 'staff', 'admin')) DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles RLS policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Only admins can create profiles"
ON public.profiles FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their own profile, admins can update all"
ON public.profiles FOR UPDATE
USING (auth.uid() = id OR has_role(auth.uid(), 'admin'::app_role));

-- Update bookings RLS policies for role-based access
DROP POLICY IF EXISTS "Users can view their own bookings, admins view all" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings, admins update all" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

-- New bookings policies with profiles table integration
CREATE POLICY "Customers can view their own bookings, staff/admin view all"
ON public.bookings FOR SELECT
USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

CREATE POLICY "Customers can create their own bookings"
ON public.bookings FOR INSERT
WITH CHECK (
  user_id = auth.uid() OR 
  user_id IS NULL OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

CREATE POLICY "Only staff/admin can update bookings"
ON public.bookings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

CREATE POLICY "Only staff/admin can delete bookings"
ON public.bookings FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('staff', 'admin')
  )
);

-- Create trigger for updating updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();