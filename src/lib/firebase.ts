import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { firebaseConfig as config } from '../firebaseConfig'

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId)

let app: FirebaseApp | null = null
let authInstance: Auth | null = null
let dbInstance: Firestore | null = null

if (isFirebaseConfigured) {
  app = initializeApp(config)
  authInstance = getAuth(app)
  dbInstance = getFirestore(app)
}

export const auth = authInstance
export const db = dbInstance
export const googleProvider = new GoogleAuthProvider()
