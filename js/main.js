  // ========= VALIDATIONS
  // Live Validations
document.getElementById('names').addEventListener('keyup', function() {
  validateField(this);
});

document.getElementById('email').addEventListener('keyup', function() {
  validateField(this);
});

document.getElementById('username').addEventListener('keyup', function() {
  validateField(this);
});

document.getElementById('password').addEventListener('keyup', function() {
  validateField(this);
});

document.getElementById('confirm-password').addEventListener('keyup', function() {
  validateField(this);
});

// document.getElementById('agree').addEventListener('change', function() {
//   validateCheckbox(this);
// });


function validateForm(event) {
    event.preventDefault(); 
  
    var names = document.getElementById('names').value.trim();
    var email = document.getElementById('email').value.trim();
    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value.trim();
    var confirmPassword = document.getElementById('confirm-password').value.trim();
    // var agreeCheckbox = document.getElementById('agree');
    // var newsletterCheckbox = document.getElementById('newsletter');
    var namesError = document.getElementById('namesError');
    var emailError = document.getElementById('emailError');
    var usernameError = document.getElementById('usernameError');
    var passwordError = document.getElementById('passwordError');
    var confirmPasswordError = document.getElementById('confirmPasswordError');
    var agreeLabel = document.querySelector('label[for="agree"]') ;
    var agreeLink = document.querySelector('.terms');
    var valid = true;
  
    // Reset previous error messages
    namesError.textContent = '';
    emailError.textContent = '';
    usernameError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';
  
    // Validate names
    if (names === '') {
      namesError.textContent = 'Names are required';
      valid = false;
    } else if (names.length < 5 || /\d/.test(names)) {
      namesError.textContent = 'Names should be at least 5 characters long';
      valid = false;
    }
  
    // Validate email
    if (email === '') {
      emailError.textContent = 'Email is required';
      valid = false;
    } else if (!validateEmail(email)) {
      emailError.textContent = 'Invalid email';
      valid = false;
    }
  
    // Validate username
    if (username === '') {
      usernameError.textContent = 'Username is required';
      valid = false;
    } else if (!/^[a-zA-Z][a-zA-Z0-9_]{2,}$/.test(username)) {
      usernameError.textContent = 'Username should be at least 3 characters long';
      valid = false;
    }
  
    // Validate password
    if (password === '') {
      passwordError.textContent = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      passwordError.textContent = 'Password should be at least 6 characters long';
      valid = false;
    } else if (!isPasswordStrong(password)) {
      passwordError.textContent = 'Password requires capital & lowercase letters, number & special character';
      valid = false;
    }
  
    // Validate confirm password
    if (confirmPassword === '') {
      confirmPasswordError.textContent = 'Match Password is required';
      valid = false;
    } else if (password !== confirmPassword) {
      confirmPasswordError.textContent = 'Passwords do not match';
      valid = false;
    }

    // // Validate agree checkbox
    // if (!agreeCheckbox.checked) {
    //     agreeLabel.style.color = 'red';
    //     agreeLink.style.color = 'red';
    //     agreeCheckbox.style.border = '1px solid red';
    //     valid = false;
    //   } else {
    //     agreeLabel.style.color = '';
    //     agreeLink.style.color = '';
    //     agreeCheckbox.style.borderColor = ''; 
    //   }
      
  
   
    // If form validation passes, send data to server
    if (valid) {
      var formData = {
          names: names,
          email: email,
          username: username,
          password: password,
          confirmPassword: confirmPassword,
          // agree: agreeCheckbox.checked,
          // newsletter: newsletterCheckbox.checked 
      };
      
      // Send form data to server
      fetch('https://to-do-app-fv27.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        return response.json();
    })
    .then(data => {
        console.log('Registration successful:', data);
        showSuccessMessage();
        clearForm();
        window.location.href = "/index.html";
    })
    .catch(error => {
        console.error('Registration error:', error);       
        showError(error.message.includes('Username or email already exists') ? 'Username or email already exists' : 'Registration failed. Please try again later.');
    });
  }
  
    return valid; 
}

function validateField(inputField) {
    var fieldName = inputField.name;
    var fieldValue = inputField.value.trim();
    var errorElement = document.getElementById(fieldName + 'Error');
    errorElement.textContent = ''; 
    switch (fieldName) {
        case 'names':
        if (fieldValue === '') {
            errorElement.textContent = 'Names are required';
        } else if (fieldValue.length < 5 || /\d/.test(fieldValue)) {
            errorElement.textContent = 'Names should be at least 5 characters';
        }
        break;
        case 'email':
        if (fieldValue === '') {
            errorElement.textContent = 'Email is required';
        } else if (!validateEmail(fieldValue)) {
            errorElement.textContent = 'Invalid email';
        }
        break;
        case 'username':
        if (fieldValue === '') {
            errorElement.textContent = 'Username is required';
        } else if (!/^[a-zA-Z][a-zA-Z0-9_]{2,}$/.test(fieldValue)) {
            errorElement.textContent = 'Username should be at least 3 characters long ';
        }
        break;
        case 'password':
            if (fieldValue === '') {
                errorElement.textContent = 'Password is required';
            } else if (fieldValue.length < 6) {
                errorElement.textContent = 'Password should be at least 6 characters long';
            } else if (!isPasswordStrong(fieldValue)) {
                errorElement.textContent = 'Password requires capital and lowercase letters, number & special character';
            }
        break;
        case 'confirm-password':
        var password = document.getElementById('password').value.trim();
        if (fieldValue === '') {
            errorElement.textContent = 'Match Password is required';
        } else if (fieldValue !== password) {
            errorElement.textContent = 'Passwords do not match';
        }
        break;
        default:
        break;
    }
}

function validateEmail(email) {
    var re = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

function isPasswordStrong(password) {
    // Password should be at least 6 characters long and contain capital and lowercase letters, and special characters
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/;
    return re.test(password);
}


function showSuccessMessage() {
    var successMessage = document.getElementById('SignupSent');
    successMessage.textContent = 'Account created successful!';
    setTimeout(function() {
        successMessage.textContent = '';
    }, 3500); 
}

function showError(message) {
  var errorMessageElement = document.getElementById('SignupSent');
  errorMessageElement.textContent = message;
  errorMessageElement.style.color = 'red';
  errorMessageElement.style.textAlign = 'center';

  setTimeout(function () {
    errorMessageElement.textContent = '';
  }, 3000);
}


function clearForm() {
    document.getElementById('names').value = '';
    document.getElementById('email').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirm-password').value = '';
    // document.getElementById('agree').checked = false;
}


//  // PASSWORD VISIBILITY
//   const passwordInput = document.getElementById('password');
//   const toggleVisibilityBtn = document.getElementById('togglePasswordVisibility');

//   toggleVisibilityBtn.addEventListener('click', function() {
//     const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
//     passwordInput.setAttribute('type', type);
//   });

    // PASSWORD VISIBILITY =======
    function myFunction() {
      var x = document.getElementById("password");
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    }