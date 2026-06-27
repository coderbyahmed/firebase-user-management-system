import { auth } from '../config/firebase.js'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { redirectIfLoggedIn } from './authGuard.js'

redirectIfLoggedIn()

const form = document.getElementById('signupForm')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const confirmInput = document.getElementById('confirmPassword')
const signupBtn = document.getElementById('signupBtn')
const btnText = document.getElementById('btnText')
const btnSpinner = document.getElementById('btnSpinner')
const togglePassword = document.getElementById('togglePassword')
const emailError = document.getElementById('emailError')
const passwordError = document.getElementById('passwordError')
const confirmError = document.getElementById('confirmError')

const passwordHint = document.getElementById('passwordHint')

togglePassword.addEventListener('click', () => {
  const type = passwordInput.type === 'password' ? 'text' : 'password'
  passwordInput.type = type
  togglePassword.querySelector('i').className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash'
})

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

passwordInput.addEventListener('input', () => {
  if (passwordInput.value.length >= 8) {
    passwordHint.className = 'mt-1 text-xs text-green-500'
    passwordHint.innerHTML = '<i class="fas fa-check-circle mr-1"></i> Must be at least 8 characters'
  } else {
    passwordHint.className = 'mt-1 text-xs text-gray-400'
    passwordHint.innerHTML = '<i class="far fa-circle mr-1"></i> Must be at least 8 characters'
  }
})

function setLoading(isLoading) {
  if (isLoading) {
    signupBtn.disabled = true
    btnText.style.display = 'none'
    btnSpinner.style.display = 'inline-block'
  } else {
    signupBtn.disabled = false
    btnText.style.display = 'inline'
    btnSpinner.style.display = 'none'
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = emailInput.value.trim()
  const password = passwordInput.value
  const confirm = confirmInput.value

  let isValid = true
  emailError.classList.add('hidden')
  passwordError.classList.add('hidden')
  confirmError.classList.add('hidden')
  emailInput.classList.remove('is-invalid')
  passwordInput.classList.remove('is-invalid')
  confirmInput.classList.remove('is-invalid')

  if (!validateEmail(email)) {
    emailError.textContent = 'Please enter a valid email address'
    emailError.classList.remove('hidden')
    emailInput.classList.add('is-invalid')
    isValid = false
  }

  if (password.length < 8) {
    passwordError.textContent = 'Password must be at least 8 characters long'
    passwordError.classList.remove('hidden')
    passwordInput.classList.add('is-invalid')
    isValid = false
  }

  if (password !== confirm) {
    confirmError.textContent = 'Passwords do not match'
    confirmError.classList.remove('hidden')
    confirmInput.classList.add('is-invalid')
    isValid = false
  }

  if (!isValid) return

  setLoading(true)

  try {
    await createUserWithEmailAndPassword(auth, email, password)

    await Swal.fire({
      icon: 'success',
      title: 'Account Created!',
      text: 'Your account has been created successfully. Please sign in.',
      confirmButtonColor: '#667eea'
    })

    window.location.href = 'index.html'
  } catch (error) {
    console.error('Signup error:', error.code, error.message)
    let message = 'An error occurred during signup'
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists'
        break
      case 'auth/invalid-email':
        message = 'Invalid email format'
        break
      case 'auth/weak-password':
        message = 'Password is too weak'
        break
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later'
        break
      case 'auth/configuration-not-found':
        message = 'Firebase Authentication is not enabled. Please enable Email/Password sign-in in Firebase Console.'
        break
      case 'auth/operation-not-allowed':
        message = 'Email/Password sign-in is not enabled in Firebase Console.'
        break
    }
    Swal.fire({
      icon: 'error',
      title: 'Signup Failed',
      text: message,
      confirmButtonColor: '#667eea'
    })
  } finally {
    setLoading(false)
  }
})
