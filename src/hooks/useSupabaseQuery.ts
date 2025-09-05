import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { PostgrestResponse } from '@supabase/supabase-js'

// A custom hook for Supabase queries with loading and error states
export const useSupabaseQuery = <T,>(queryFn: () => Promise<PostgrestResponse<T>>) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await queryFn()
        
        if (result.error) {
          setError(result.error.message)
        } else {
          setData(result.data as T)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await queryFn()
      
      if (result.error) {
        setError(result.error.message)
      } else {
        setData(result.data as T)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, refetch }
}

// Example usage:
// const { data, loading, error, refetch } = useSupabaseQuery(
//   () => supabase.from('profiles').select('*')
// )