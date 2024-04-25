// Function to handle login authentication
function handleLogin(emailUsername, password, rememberMe) {
    fetch('https://to-do-app-fv27.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        emailUsername: emailUsername,
        password: password,
        rememberMe
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then(data => {
        console.log('Login successful:', data);
        showSuccessMessage();
        clearLoginForm();
        // If rememberMe is checked, store token in cookie
        if (rememberMe && data.token) {
          document.cookie = `token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60};`;
        }
        window.location.href = '/task.html'; 
      })
      .catch(error => {

        handleLoginError(error);
      });
  }
  
  // Function to check if the user has a token cookie when the page loads
  document.addEventListener('DOMContentLoaded', function () {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('='));
    const tokenCookie = cookies.find(cookie => cookie[0] === 'token');
    if (tokenCookie) {
      window.location.href = '/task.html'; // Redirect to task page
    }
  });
  
  // Function to handle login form submission
  document.getElementById('LoginForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    var emailUsername = document.getElementById('email-username').value.trim();
    var password = document.getElementById('password').value.trim();
  
    // Validate email/username and password
    var valid = validateLoginForm(emailUsername, password);
  
    if (valid) {
      handleLogin(emailUsername, password);
    }
  });

  // ==== VALIDATIONS
  function isPasswordStrong(password) {
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,}$/;
    return re.test(password);
}

// Live Validations
document.getElementById('email-username').addEventListener('input', function() {
  validateLoginForm(this.value, document.getElementById('password').value);
});

document.getElementById('password').addEventListener('input', function() {
  validateLoginForm(document.getElementById('email-username').value, this.value);
});
  
  // Function to validate login form fields
  function validateLoginForm(emailUsername, password) {
    var emailUsernameError = document.getElementById('email-usernameError');
    var passwordError = document.getElementById('password-Error');
    var valid = true;
  
    // Reset previous error messages
    emailUsernameError.textContent = '';
    passwordError.textContent = '';
  
    // Validate email/username
    if (emailUsername === '') {
      emailUsernameError.textContent = 'Email is required';
      valid = false;
    } else if (!/^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailUsername)) {
      emailUsernameError.textContent = 'Invalid email';
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
  
    return valid;
  }


  function handleLoginError(error) {
    var errorMessageElement = document.getElementById('LoginSent');
    errorMessageElement.textContent = 'Incorrect email or passwor';
    errorMessageElement.style.color = 'red';
    errorMessageElement.style.textAlign = 'center';
  
 
    setTimeout(function () {
      errorMessageElement.textContent = '';
    }, 3000);
  }
  
  // Function to show success message
  function showSuccessMessage() {
    var successMessageElement = document.getElementById('LoginSent');
    successMessageElement.textContent = 'Login successful!';
    successMessageElement.style.color = 'green';
    successMessageElement.style.textAlign = 'center';
    setTimeout(function () {
      successMessageElement.textContent = '';
    }, 3000);
  }
  
  // Function to clear login form fields
  function clearLoginForm() {
    document.getElementById('email-username').value = '';
    document.getElementById('password').value = '';
  }
  

    // PASSWORD VISIBILITY =======
  function myFunction() {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }