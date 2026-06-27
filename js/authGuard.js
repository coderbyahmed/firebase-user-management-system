import { auth } from '../config/firebase.js'
import { onAuthStateChanged } from 'firebase/auth'

export function checkAuth() {
  return new Promise((resolve) => {
    const stored = localStorage.getItem('loggedInUser')
    onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify({
          email: user.email,
          uid: user.uid
        }))
        resolve(true)
      } else {
        localStorage.removeItem('loggedInUser')
        resolve(false)
      }
    })
    if (stored && !auth.currentUser) {
      setTimeout(() => {
        if (!localStorage.getItem('loggedInUser')) {
          localStorage.removeItem('loggedInUser')
          resolve(false)
        }
      }, 2000)
    }
  })
}

export function requireAuth() {
  checkAuth().then((isLoggedIn) => {
    if (!isLoggedIn) {
      window.location.href = 'index.html'
    }
  })
}

export function redirectIfLoggedIn() {
  checkAuth().then((isLoggedIn) => {
    if (isLoggedIn) {
      window.location.href = 'dashboard.html'
    }
  })
}
