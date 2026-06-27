import { auth } from '../config/firebase.js'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { checkAuth, redirectIfLoggedIn } from './authGuard.js'

redirectIfLoggedIn()

const form = document.getElementById('loginForm')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const loginBtn = document.getElementById('loginBtn')
const btnText = document.getElementById('btnText')
const btnSpinner = document.getElementById('btnSpinner')
const togglePassword = document.getElementById('togglePassword')
const rememberMe = document.getElementById('rememberMe')

if (localStorage.getItem('rememberedEmail')) {
  emailInput.value = localStorage.getItem('rememberedEmail')
  rememberMe.checked = true
}

togglePassword.addEventListener('click', () => {
  const type = passwordInput.type === 'password' ? 'text' : 'password'
  passwordInput.type = type
  togglePassword.querySelector('i').className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash'
})

function setLoading(isLoading) {
  if (isLoading) {
    loginBtn.disabled = true
    btnText.style.display = 'none'
    btnSpinner.style.display = 'inline-block'
  } else {
    loginBtn.disabled = false
    btnText.style.display = 'inline'
    btnSpinner.style.display = 'none'
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = emailInput.value.trim()
  const password = passwordInput.value

  if (!email || !password) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Please enter both email and password',
      confirmButtonColor: '#667eea'
    })
    return
  }

  setLoading(true)

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    if (rememberMe.checked) {
      localStorage.setItem('rememberedEmail', email)
    } else {
      localStorage.removeItem('rememberedEmail')
    }

    localStorage.setItem('loggedInUser', JSON.stringify({
      email: user.email,
      uid: user.uid
    }))

    await Swal.fire({
      icon: 'success',
      title: 'Welcome Back!',
      text: 'You have logged in successfully',
      timer: 1500,
      showConfirmButton: false
    })

    window.location.href = 'dashboard.html'
  } catch (error) {
    let message = 'An error occurred during login'
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No account found with this email'
        break
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        message = 'Invalid email or password'
        break
      case 'auth/invalid-email':
        message = 'Invalid email format'
        break
      case 'auth/user-disabled':
        message = 'This account has been disabled'
        break
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later'
        break
    }
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: message,
      confirmButtonColor: '#667eea'
    })
  } finally {
    setLoading(false)
  }
})
