
-- First, let's check if the trigger exists and recreate it properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create an improved handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Insert into users table first
  INSERT INTO public.users (id, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')::user_role
  );
  
  -- Insert into profiles table
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.phone, '')
  );
  
  -- If the user is a doctor, create doctor profile
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'patient') = 'doctor' THEN
    INSERT INTO public.doctor_profiles (
      id, 
      license_number, 
      specialization, 
      qualification
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'license_number', ''),
      COALESCE(NEW.raw_user_meta_data->>'specialization', ''),
      COALESCE(NEW.raw_user_meta_data->>'qualification', '')
    );
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Make sure the profiles table allows empty full_name temporarily
ALTER TABLE public.profiles ALTER COLUMN full_name DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN full_name SET DEFAULT '';

-- Add the NOT NULL constraint back with a proper default
UPDATE public.profiles SET full_name = 'User' WHERE full_name IS NULL OR full_name = '';
ALTER TABLE public.profiles ALTER COLUMN full_name SET NOT NULL;
