import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase'

export const LOCAL_UID = 'local-guest'

interface AuthState {
  uid: string
  displayName: string | null
  photoURL: string | null
  isCloud: boolean // true = synced with Google / Firestore, false = this-device-only
  authLoading: boolean // still checking Firebase auth state
  needsLogin: boolean // show the login screen
  canSync: boolean // whether Firebase is configured at all
  signInWithGoogle: () => Promise<void>
  continueOffline: () => void
  signOutUser: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(isFirebaseConfigured)
  const [offlineChosen, setOfflineChosen] = useState(false)

  useEffect(() => {
    if (!auth) return
    const unsub = onAuthStateChanged(auth, (u) => {
      setFirebaseUser(u)
      setAuthLoading(false)
    })
    return unsub
  }, [])

  async function signInWithGoogle() {
    if (!auth || !googleProvider) return
    await signInWithPopup(auth, googleProvider)
    setOfflineChosen(false)
  }

  function continueOffline() {
    setOfflineChosen(true)
  }

  async function signOutUser() {
    if (auth) await firebaseSignOut(auth)
    setOfflineChosen(false)
  }

  const needsLogin = isFirebaseConfigured && !authLoading && !firebaseUser && !offlineChosen

  const value: AuthState = {
    uid: firebaseUser?.uid ?? LOCAL_UID,
    displayName: firebaseUser?.displayName ?? '布丁',
    photoURL: firebaseUser?.photoURL ?? null,
    isCloud: Boolean(firebaseUser),
    authLoading,
    needsLogin,
    canSync: isFirebaseConfigured,
    signInWithGoogle,
    continueOffline,
    signOutUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
