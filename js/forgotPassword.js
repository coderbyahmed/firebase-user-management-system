import { auth } from '../config/firebase.js'
import { sendPasswordResetEmail } from 'firebase/auth'
import { redirectIfLoggedIn } from './authGuard.js'

redirectIfLoggedIn()

const form = document.getElementById('forgotForm')
const emailInput = document.getElementById('email')
const resetBtn = document.getElementById('resetBtn')
const btnText = document.getElementById('btnText')
const btnSpinner = document.getElementById('btnSpinner')

function setLoading(isLoading) {
  if (isLoading) {
    resetBtn.disabled = true
    btnText.style.display = 'none'
    btnSpinner.style.display = 'inline-block'
  } else {
    resetBtn.disabled = false
    btnText.style.display = 'inline'
    btnSpinner.style.display = 'none'
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = emailInput.value.trim()

  if (!email) {
    Swal.fire({
      icon: 'warning',
      title: 'Validation Error',
      text: 'Please enter your email address',
      confirmButtonColor: '#667eea'
    })
    return
  }

  setLoading(true)

  try {
    await sendPasswordResetEmail(auth, email)

    await Swal.fire({
      icon: 'success',
      title: 'Reset Link Sent!',
      text: 'Check your email for the password reset link. It may take a few minutes to arrive.',
      confirmButtonColor: '#667eea'
    })

    form.reset()
  } catch (error) {
    let message = 'An error occurred'
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No account found with this email'
        break
      case 'auth/invalid-email':
        message = 'Invalid email format'
        break
      case 'auth/too-many-requests':
        message = 'Too many requests. Please try again later'
        break
    }
    Swal.fire({
      icon: 'error',
      title: 'Failed to Send Reset Link',
      text: message,
      confirmButtonColor: '#667eea'
    })
  } finally {
    setLoading(false)
  }
})
