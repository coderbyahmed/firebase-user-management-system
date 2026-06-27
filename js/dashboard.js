import { auth, db } from '../config/firebase.js'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore'
import { requireAuth } from './authGuard.js'

requireAuth()

const userCol = collection(db, 'users')

const displayEmail = document.getElementById('displayEmail')
const logoutBtn = document.getElementById('logoutBtn')

const form = document.getElementById('userForm')
const fullNameInput = document.getElementById('fullName')
const emailInput = document.getElementById('email')
const ageInput = document.getElementById('age')
const cityInput = document.getElementById('city')
const professionInput = document.getElementById('profession')
const editUserId = document.getElementById('editUserId')

const addBtn = document.getElementById('addBtn')
const updateBtn = document.getElementById('updateBtn')
const resetBtn = document.getElementById('resetBtn')

const usersTableBody = document.getElementById('usersTableBody')
const viewModal = document.getElementById('viewModal')
const closeModal = document.getElementById('closeModal')
const userDetailsContainer = document.getElementById('userDetailsContainer')

const totalUsersEl = document.getElementById('totalUsers')
const activeUsersEl = document.getElementById('activeUsers')
const totalCitiesEl = document.getElementById('totalCities')
const totalProfessionsEl = document.getElementById('totalProfessions')

let allUsers = []

onAuthStateChanged(auth, (user) => {
  if (user) {
    displayEmail.textContent = user.email
    localStorage.setItem('loggedInUser', JSON.stringify({ email: user.email, uid: user.uid }))
    fetchUsers()
  } else {
    window.location.href = 'index.html'
  }
})

logoutBtn.addEventListener('click', async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You will be logged out of your account',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#667eea',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Logout'
  })

  if (result.isConfirmed) {
    try {
      await signOut(auth)
      localStorage.removeItem('loggedInUser')
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out successfully',
        timer: 1500,
        showConfirmButton: false
      })
      setTimeout(() => {
        window.location.href = 'index.html'
      }, 1500)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: error.message,
        confirmButtonColor: '#667eea'
      })
    }
  }
})

function resetForm() {
  form.reset()
  editUserId.value = ''
  addBtn.style.display = 'inline-flex'
  updateBtn.style.display = 'none'
  fullNameInput.focus()
}

resetBtn.addEventListener('click', resetForm)

function validateForm() {
  if (!fullNameInput.value.trim()) {
    Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Full name is required', confirmButtonColor: '#667eea' })
    fullNameInput.focus()
    return false
  }
  if (!emailInput.value.trim()) {
    Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Email is required', confirmButtonColor: '#667eea' })
    emailInput.focus()
    return false
  }
  if (!ageInput.value.trim() || parseInt(ageInput.value) < 1 || parseInt(ageInput.value) > 150) {
    Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Please enter a valid age (1-150)', confirmButtonColor: '#667eea' })
    ageInput.focus()
    return false
  }
  if (!cityInput.value.trim()) {
    Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'City is required', confirmButtonColor: '#667eea' })
    cityInput.focus()
    return false
  }
  if (!professionInput.value.trim()) {
    Swal.fire({ icon: 'warning', title: 'Validation Error', text: 'Profession is required', confirmButtonColor: '#667eea' })
    professionInput.focus()
    return false
  }
  return true
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  if (!validateForm()) return

  const originalHTML = addBtn.innerHTML
  addBtn.disabled = true
  addBtn.innerHTML = '<span class="spinner"></span> Saving...'

  const userData = {
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    age: ageInput.value.trim(),
    city: cityInput.value.trim(),
    profession: professionInput.value.trim(),
    userId: auth.currentUser.uid,
    createdAt: new Date().toISOString()
  }

  try {
    const docRef = await addDoc(userCol, userData)
    addBtn.disabled = false
    addBtn.innerHTML = originalHTML
    Swal.fire({
      icon: 'success',
      title: 'User Added!',
      text: `${userData.fullName} has been added successfully`,
      timer: 1500,
      showConfirmButton: false
    })
    resetForm()
    await fetchUsers()
  } catch (error) {
    addBtn.disabled = false
    addBtn.innerHTML = originalHTML
    Swal.fire({
      icon: 'error',
      title: 'Failed to Add User',
      text: error.message,
      confirmButtonColor: '#667eea'
    })
  }
})

updateBtn.addEventListener('click', async () => {
  if (!validateForm()) return
  if (!editUserId.value) return

  const originalHTML = updateBtn.innerHTML
  updateBtn.disabled = true
  updateBtn.innerHTML = '<span class="spinner"></span> Updating...'

  const userData = {
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    age: ageInput.value.trim(),
    city: cityInput.value.trim(),
    profession: professionInput.value.trim()
  }

  try {
    const userRef = doc(db, 'users', editUserId.value)
    await updateDoc(userRef, userData)
    updateBtn.disabled = false
    updateBtn.innerHTML = originalHTML
    Swal.fire({
      icon: 'success',
      title: 'User Updated!',
      text: `${userData.fullName}'s information has been updated`,
      timer: 1500,
      showConfirmButton: false
    })
    resetForm()
    await fetchUsers()
  } catch (error) {
    updateBtn.disabled = false
    updateBtn.innerHTML = originalHTML
    Swal.fire({
      icon: 'error',
      title: 'Failed to Update User',
      text: error.message,
      confirmButtonColor: '#667eea'
    })
  }
})

async function fetchUsers() {
  try {
    const q = query(userCol, where('userId', '==', auth.currentUser.uid))
    const snapshot = await getDocs(q)
    allUsers = []
    snapshot.forEach((doc) => {
      allUsers.push({ id: doc.id, ...doc.data() })
    })
    allUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    renderTable()
    updateStats()
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Failed to Load Users',
      text: error.message,
      confirmButtonColor: '#667eea'
    })
  }
}

function renderTable() {
  if (allUsers.length === 0) {
    usersTableBody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <i class="fas fa-users-slash"></i>
            <h4>No Users Found</h4>
            <p>Add your first user using the form above.</p>
          </div>
        </td>
      </tr>
    `
    return
  }

  usersTableBody.innerHTML = allUsers.map((user, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><strong>${escapeHtml(user.fullName)}</strong></td>
      <td>${escapeHtml(user.email)}</td>
      <td>${escapeHtml(user.age)}</td>
      <td>${escapeHtml(user.city)}</td>
      <td>${escapeHtml(user.profession)}</td>
      <td>
        <button class="action-btn view" onclick="window.viewUser('${user.id}')" title="View Details">
          <i class="fas fa-eye"></i>
        </button>
        <button class="action-btn edit" onclick="window.editUser('${user.id}')" title="Edit User">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete" onclick="window.deleteUser('${user.id}', this)" title="Delete User">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('')
}

function escapeHtml(text) {
  if (!text) return ''
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function updateStats() {
  totalUsersEl.textContent = allUsers.length
  activeUsersEl.textContent = allUsers.filter(u => u.age && parseInt(u.age) >= 18).length
  const cities = new Set(allUsers.map(u => u.city?.toLowerCase().trim()).filter(Boolean))
  totalCitiesEl.textContent = cities.size
  const professions = new Set(allUsers.map(u => u.profession?.toLowerCase().trim()).filter(Boolean))
  totalProfessionsEl.textContent = professions.size
}

window.viewUser = async (id) => {
  try {
    const userRef = doc(db, 'users', id)
    const snapshot = await getDoc(userRef)

    if (!snapshot.exists()) {
      Swal.fire({ icon: 'error', title: 'Not Found', text: 'User not found', confirmButtonColor: '#667eea' })
      return
    }

    const data = snapshot.data()
    if (data.userId !== auth.currentUser.uid) {
      Swal.fire({ icon: 'error', title: 'Access Denied', text: 'You can only view your own records', confirmButtonColor: '#667eea' })
      return
    }

    const user = { id: snapshot.id, ...data }

    userDetailsContainer.innerHTML = `
      <div class="user-detail">
        <span class="detail-label"><i class="fas fa-user mr-2 text-[#667eea]"></i>Full Name</span>
        <span class="detail-value">${escapeHtml(user.fullName)}</span>
      </div>
      <div class="user-detail">
        <span class="detail-label"><i class="fas fa-envelope mr-2 text-[#667eea]"></i>Email</span>
        <span class="detail-value">${escapeHtml(user.email)}</span>
      </div>
      <div class="user-detail">
        <span class="detail-label"><i class="fas fa-calendar mr-2 text-[#667eea]"></i>Age</span>
        <span class="detail-value">${escapeHtml(user.age)} years</span>
      </div>
      <div class="user-detail">
        <span class="detail-label"><i class="fas fa-city mr-2 text-[#667eea]"></i>City</span>
        <span class="detail-value">${escapeHtml(user.city)}</span>
      </div>
      <div class="user-detail">
        <span class="detail-label"><i class="fas fa-briefcase mr-2 text-[#667eea]"></i>Profession</span>
        <span class="detail-value">${escapeHtml(user.profession)}</span>
      </div>
      <div class="user-detail">
        <span class="detail-label"><i class="fas fa-clock mr-2 text-[#667eea]"></i>Created At</span>
        <span class="detail-value">${new Date(user.createdAt).toLocaleString()}</span>
      </div>
    `

    viewModal.classList.add('active')
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: error.message, confirmButtonColor: '#667eea' })
  }
}

window.editUser = async (id) => {
  try {
    const userRef = doc(db, 'users', id)
    const snapshot = await getDoc(userRef)

    if (!snapshot.exists()) {
      Swal.fire({ icon: 'error', title: 'Not Found', text: 'User not found', confirmButtonColor: '#667eea' })
      return
    }

    const user = snapshot.data()
    if (user.userId !== auth.currentUser.uid) {
      Swal.fire({ icon: 'error', title: 'Access Denied', text: 'You can only edit your own records', confirmButtonColor: '#667eea' })
      return
    }

    fullNameInput.value = user.fullName || ''
    emailInput.value = user.email || ''
    ageInput.value = user.age || ''
    cityInput.value = user.city || ''
    professionInput.value = user.profession || ''
    editUserId.value = id

    addBtn.style.display = 'none'
    updateBtn.style.display = 'inline-flex'

    window.scrollTo({ top: 0, behavior: 'smooth' })
    fullNameInput.focus()
  } catch (error) {
    Swal.fire({ icon: 'error', title: 'Error', text: error.message, confirmButtonColor: '#667eea' })
  }
}

window.deleteUser = async (id, btn) => {
  const user = allUsers.find(u => u.id === id)

  const result = await Swal.fire({
    title: 'Delete User?',
    text: user ? `Are you sure you want to delete ${user.fullName}?` : 'This action cannot be undone',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel'
  })

  if (!result.isConfirmed) return

  const targetUser = allUsers.find(u => u.id === id)
  if (targetUser && targetUser.userId !== auth.currentUser.uid) {
    Swal.fire({ icon: 'error', title: 'Access Denied', text: 'You can only delete your own records', confirmButtonColor: '#667eea' })
    return
  }

  const originalHTML = btn.innerHTML
  btn.disabled = true
  btn.innerHTML = '<span class="spinner"></span>'

  try {
    const userRef = doc(db, 'users', id)
    await deleteDoc(userRef)

    btn.disabled = false
    btn.innerHTML = originalHTML

    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: 'User has been deleted successfully',
      timer: 1500,
      showConfirmButton: false
    })

    if (editUserId.value === id) resetForm()
    await fetchUsers()
  } catch (error) {
    btn.disabled = false
    btn.innerHTML = originalHTML
    Swal.fire({
      icon: 'error',
      title: 'Failed to Delete User',
      text: error.message,
      confirmButtonColor: '#667eea'
    })
  }
}

closeModal.addEventListener('click', () => {
  viewModal.classList.remove('active')
})

viewModal.addEventListener('click', (e) => {
  if (e.target === viewModal) {
    viewModal.classList.remove('active')
  }
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    viewModal.classList.remove('active')
  }
})
