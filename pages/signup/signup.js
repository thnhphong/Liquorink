const togglePass = document.getElementById('toggle-password')
const toggleConfirmPass = document.getElementById('toggle-confirm-password')
const passInput = document.getElementById('password')
const confirmPassInput = document.getElementById('confirm-password')
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password')
const signUpBtn = document.querySelector('.signup_btn')
const passwordError = document.getElementById('password-error')
const confirmPasswordError = document.getElementById('confirm-password-error')
const dobInput = document.getElementById("dob")

/* color */
const errorColor = getComputedStyle(document.documentElement).getPropertyValue('--error')
const successColor = getComputedStyle(document.documentElement).getPropertyValue('--success')
togglePass.addEventListener('click', () => {
  const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password'
  passInput.setAttribute('type', type)
  togglePass.classList.toggle('fa-eye-slash')
  togglePass.classList.toggle('fa-eye')
})
toggleConfirmPass.addEventListener('click', () => {
  const type = confirmPassInput.getAttribute('type') === 'password' ? 'text' : 'password'
  confirmPassInput.setAttribute('type', type)
  toggleConfirmPass.classList.toggle('fa-eye-slash')
  toggleConfirmPass.classList.toggle('fa-eye')
})
const showPassword = document.getElementById('showPassword')
showPassword.addEventListener('click', () => {
  const passType = passInput.getAttribute('type')
  const confirmPassType = confirmPassInput.getAttribute('type')
  if(passType === 'password' && confirmPassType === 'password'){
    passInput.setAttribute('type', 'text')
    confirmPassInput.setAttribute('type', 'text')
    togglePass.classList.add('fa-eye')
    togglePass.classList.remove('fa-eye-slash')
    toggleConfirmPass.classList.add('fa-eye')
    toggleConfirmPass.classList.remove('fa-eye-slash')
  }else{
    passInput.setAttribute('type', 'password')
    confirmPassInput.setAttribute('type', 'password')
    togglePass.classList.add('fa-eye-slash')
    togglePass.classList.remove('fa-eye')
    toggleConfirmPass.classList.add('fa-eye-slash')
    toggleConfirmPass.classList.remove('fa-eye')
  }
})
passwordInput.addEventListener('input', checking)
function checking(){
  const password = passInput.value
  const confirmPassword = confirmPassInput.value

  const minLength = password.length >= 8
  document.getElementById('minLength').checked = minLength

  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const isCaseValid = hasLowercase && hasUppercase
  document.getElementById('case').checked = isCaseValid

  const hasNumber = /\d/.test(password)
  document.getElementById('number').checked = hasNumber
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  document.getElementById('specialChar').checked = hasSpecialChar

  let valid = true 
  confirmPasswordError.style.display = 'none'
  if(password !== confirmPassword){
    confirmPasswordError.textContent = 'Passwords do not match'
    confirmPasswordError.style.display = 'block'
    valid = false
  }
  const dobVal = dobInput.value
  if (!isValidAge(dobVal)) {
    console.log(dobVal)
    document.querySelector("#dob + .error-message").textContent = "You are under 18, you are not allowed!";
    document.querySelector("#dob + .error-message").style.display = 'block';
    document.querySelector("#dob + .error-message").style.color = errorColor.trim()
  } else {
    document.querySelector("#dob + .error-message").textContent = "You are more than 18!";
    document.querySelector("#dob + .error-message").style.display = 'block';
  }
  if(minLength && isCaseValid && hasNumber && hasSpecialChar){
    signUpBtn.disabled = false
  }else{
    signUpBtn.disabled = true
  }
}
function isValidAge(dob){
  const dobDate = new Date(dob)
  const currentDate = new Date()

  let age = currentDate.getFullYear() - dobDate.getFullYear()
  const monDiff = currentDate.getMonth() - dobDate.getMonth()
  const dayDiff = currentDate.getDate() - dobDate.getDate()

  if(monDiff < 0 || (monDiff === 0 && dayDiff < 0)){
    age--;
  }
  return age >= 18;
}
confirmPasswordInput.addEventListener('input', checking)
passwordInput.addEventListener('input', checking)
dobInput.addEventListener('input', checking)
document.querySelector('.signup_btn').addEventListener('click', (e) => {
  e.preventDefault()
  const name = document.getElementById('name').value 
  const email = document.getElementById('email').value 
  const password = document.getElementById('password').value 
  const dob = document.getElementById('dob').value 
  const signupBtn = document.querySelector('.signup_btn')
  signupBtn.disabled = true

  const formData = new FormData()
  formData.append('name', name)
  formData.append('email', email)
  formData.append('password', password)
  formData.append('dob', dob)

  fetch('signup.php', {
    method: "POST",
    body: formData
  })
  .then(response => response.text())
  .then(data => {
    document.querySelectorAll('.error-message').forEach(msg => msg.style.display = 'none')
    if (data.includes("already taken")) {
            if (data.includes("Username and email are already taken")) {
            document.querySelector("#name + .error-message").textContent = "This name is already taken.";
            document.querySelector("#name + .error-message").style.display = 'block';
            document.querySelector("#email + .error-message").textContent = "This email is already taken.";
            document.querySelector("#email + .error-message").style.display = 'block';
            }else if (data.includes("Name already taken")) {
                document.querySelector("#name + .error-message").textContent = "This name is already taken.";
                document.querySelector("#name + .error-message").style.display = 'block';
                console.log("error at name")
            }else if (data.includes("Invalid email format")){
                document.querySelector("#email + .error-message").textContent = "Invalid email format.";
                document.querySelector("#email + .error-message").style.display = 'block';
            } else if (data.includes("Email already taken")) {
                document.querySelector("#email + .error-message").textContent = "This email is already taken.";
                document.querySelector("#email + .error-message").style.display = 'block';
                console.log("error at email")
            }else if(data.includes("You must be at least 18 years old to sign up.")){
                console.log(document.querySelector("#dob + .error-message").textContent = "You are under 18, you are not allowed!")
                console.log("Age restriction error displayed.");
            } else {
                // General error message
                document.querySelector(".error-message").textContent = data;
                document.querySelector(".error-message").style.display = 'block';
            }
    }else{
      const name = document.getElementById('name').value
      window.location.href = `../../welcome.php?name=${encodeURIComponent(name)}`
    }
  })
  .catch(error => {
    console.error('Error: ', error)
  })
  .finally(() => {
    signupBtn.disabled = false
  })
})
