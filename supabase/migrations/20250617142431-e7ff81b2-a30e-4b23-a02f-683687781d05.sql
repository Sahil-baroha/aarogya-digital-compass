
-- Create ABHA ID validation table
CREATE TABLE public.abha_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  abha_id VARCHAR(14) NOT NULL UNIQUE,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'failed', 'expired')),
  verification_token TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verification_attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE
);

-- Create Aadhaar OTP verification table
CREATE TABLE public.aadhaar_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  aadhaar_number VARCHAR(12) NOT NULL,
  otp_hash TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'failed', 'expired')),
  otp_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  attempts_count INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE
);

-- Create enhanced audit logs for medical data access
CREATE TABLE public.medical_data_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  accessed_user_id UUID REFERENCES auth.users(id) NOT NULL,
  access_type TEXT NOT NULL CHECK (access_type IN ('view', 'create', 'update', 'delete', 'download')),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('profile', 'medical_history', 'vitals', 'documents', 'prescriptions', 'appointments')),
  resource_id UUID,
  ip_address INET,
  user_agent TEXT,
  access_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create security settings table
CREATE TABLE public.user_security_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  two_factor_enabled BOOLEAN DEFAULT false,
  login_notifications BOOLEAN DEFAULT true,
  data_access_notifications BOOLEAN DEFAULT true,
  session_timeout_minutes INTEGER DEFAULT 480, -- 8 hours
  require_reauth_for_sensitive BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.abha_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aadhaar_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_data_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for ABHA verifications
CREATE POLICY "Users can view their own ABHA verifications"
  ON public.abha_verifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ABHA verifications"
  ON public.abha_verifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ABHA verifications"
  ON public.abha_verifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS policies for Aadhaar verifications
CREATE POLICY "Users can view their own Aadhaar verifications"
  ON public.aadhaar_verifications
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Aadhaar verifications"
  ON public.aadhaar_verifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Aadhaar verifications"
  ON public.aadhaar_verifications
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS policies for medical data access logs
CREATE POLICY "Users can view logs where they are the accessor or accessed"
  ON public.medical_data_access_logs
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = accessed_user_id);

CREATE POLICY "System can insert access logs"
  ON public.medical_data_access_logs
  FOR INSERT
  WITH CHECK (true); -- System-level insertions

-- RLS policies for security settings
CREATE POLICY "Users can view their own security settings"
  ON public.user_security_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own security settings"
  ON public.user_security_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own security settings"
  ON public.user_security_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to validate ABHA ID format
CREATE OR REPLACE FUNCTION public.validate_abha_id(abha_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- ABHA ID is 14 digits
  RETURN abha_id ~ '^[0-9]{14}$';
END;
$$;

-- Create function to validate Aadhaar number format
CREATE OR REPLACE FUNCTION public.validate_aadhaar_number(aadhaar_number TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  -- Aadhaar is 12 digits
  RETURN aadhaar_number ~ '^[0-9]{12}$';
END;
$$;

-- Create function to log medical data access
CREATE OR REPLACE FUNCTION public.log_medical_data_access(
  p_user_id UUID,
  p_accessed_user_id UUID,
  p_access_type TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_access_reason TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.medical_data_access_logs (
    user_id,
    accessed_user_id,
    access_type,
    resource_type,
    resource_id,
    ip_address,
    user_agent,
    access_reason
  ) VALUES (
    p_user_id,
    p_accessed_user_id,
    p_access_type,
    p_resource_type,
    p_resource_id,
    p_ip_address,
    p_user_agent,
    p_access_reason
  );
END;
$$;

-- Create trigger to automatically create security settings for new users
CREATE OR REPLACE FUNCTION public.create_user_security_settings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_security_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created_security_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_security_settings();

-- Add updated_at triggers
CREATE TRIGGER update_abha_verifications_updated_at
  BEFORE UPDATE ON public.abha_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_security_settings_updated_at
  BEFORE UPDATE ON public.user_security_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
