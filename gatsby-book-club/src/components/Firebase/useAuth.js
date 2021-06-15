import { useEffect, useState } from "react"
import getFirebaseInstance from "./firebase"
import loadFirebaseDependencies from "./loadFirebaseDependencies"

function useAuth() {
  const [user, setUser] = useState(null)
  const [firebase, setFirebase] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe
    let publicProfileUnsubscribe

    loadFirebaseDependencies.then(app => {
      const firebaseInstance = getFirebaseInstance(app)
      setFirebase(firebaseInstance)

      unsubscribe = firebaseInstance.auth.onAuthStateChanged(userResult => {
        if (userResult) {
          publicProfileUnsubscribe = firebaseInstance.getUserProfile({
            userId: userResult.uid,
            onSnapshot: result => {
              firebaseInstance.auth.currentUser
                .getIdTokenResult(true)
                .then(token => {
                  setUser({
                    ...userResult,
                    isAdmin: token.claims.admin,
                    username: result.empty ? null : result.docs[0].id,
                  })
                })
            },
          })
        } else {
          publicProfileUnsubscribe && publicProfileUnsubscribe()
          setUser(null)
        }

        setLoading(false)
      })
    })

    return () => !!unsubscribe && unsubscribe()
  }, [])

  return { user, firebase, loading }
}

export default useAuth
