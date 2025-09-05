import { useSupabase } from '@/contexts/SupabaseContext'

// A simple hook to access auth context
export const useAuth = () => {
  const context = useSupabase()
  return context
}