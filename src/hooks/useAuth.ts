import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
    setLoading(false)
  }

  const signIn = async (email: string, password: string) => { 
    console.log('Attempting login with:', email) 
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: email.trim(), 
      password: password.trim() 
    }) 
    console.log('Login result:', { data, error }) 
    if (error) throw error 
    return data 
  } 
  const signOut = async () => { await supabase.auth.signOut() }
  const isAdmin = profile?.role === 'admin'

  return { profile, loading, isAdmin, signIn, signOut }
}
