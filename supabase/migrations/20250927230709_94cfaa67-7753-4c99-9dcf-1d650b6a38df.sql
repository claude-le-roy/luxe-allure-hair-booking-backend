-- Temporarily allow authenticated users to insert their own profile
-- This is needed for the first admin to create their profile
DROP POLICY IF EXISTS "Only admins can create profiles" ON public.profiles;

CREATE POLICY "Users can create their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Update the profiles policies to allow users to insert their own profile initially
-- We'll need this for the bootstrap process