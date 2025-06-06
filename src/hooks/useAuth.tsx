
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface UserProfile {
  id: string
  role: 'patient' | 'doctor' | 'admin' | 'pharmacist'
  full_name: string
  email?: string
  phone?: string
  abha_id?: string
  date_of_birth?: string
  gender?: string
  is_active?: boolean
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, is_active')
        .eq('id', userId)
        .single()

      if (userError) throw userError

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError

      setUserProfile({
        id: userId,
        role: userData.role,
        is_active: userData.is_active,
        ...profileData
      })
    } catch (error) {
      console.error('Error fetching user profile:', error)
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: {
    full_name: string
    role: 'patient' | 'doctor'
    phone?: string
    license_number?: string
    specialization?: string
    qualification?: string
  }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role,
            phone: userData.phone,
            license_number: userData.license_number,
            specialization: userData.specialization,
            qualification: userData.qualification
          }
        }
      })

      if (error) throw error

      toast({
        title: "Success",
        description: userData.role === 'doctor' 
          ? "Account created! Please check your email to verify. Your doctor profile will be reviewed for verification."
          : "Account created successfully! Please check your email to verify your account."
      })

      return { data, error: null }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Signed in successfully!"
      })

      return { data, error: null }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: "Success",
        description: "Signed out successfully!"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  return {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isPatient: userProfile?.role === 'patient',
    isDoctor: userProfile?.role === 'doctor',
    isAdmin: userProfile?.role === 'admin'
  }
}
