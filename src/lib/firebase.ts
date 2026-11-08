import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth'
import { initializeFirestore, type Firestore } from 'firebase/firestore'
import { firebaseConfig as config } from '../firebaseConfig'

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId)

let app: FirebaseApp | null = null
let authInstance: Auth | null = null
let dbInstance: Firestore | null = null

if (isFirebaseConfigured) {
  app = initializeApp(config)
  authInstance = getAuth(app)
  // 表單裡沒填的欄位會是 undefined（例如付款方式、備註）——Firestore 預設禁止寫入 undefined，
  // 這裡讓它自動忽略，行為跟本機 localStorage 模式一致，避免存檔時默默失敗。
  dbInstance = initializeFirestore(app, { ignoreUndefinedProperties: true })
}

export const auth = authInstance
export const db = dbInstance
export const googleProvider = new GoogleAuthProvider()
