'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error)
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function register(formData: FormData) {
  try {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { error: 'Email and password are required' }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error('Register error:', error)
      return { error: error.message }
    }

    // Check if user already exists by looking at identities
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      return { error: 'User with this email already exists. Please login instead.' }
    }

    // Check if user was created but no session (email confirmation required)
    if (data.user && !data.session) {
      return { success: 'Registration successful! Please check your email to confirm your account, then login.' }
    }

    return { success: 'Registration successful! You can now login.' }
  } catch (error) {
    console.error('Register action error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function logout() {
  const supabase = await createClient()
  
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}