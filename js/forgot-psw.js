document.getElementById('password-reset-form').addEventListener('submit', function (event) {
  event.preventDefault();

  var email = document.getElementById('email').value.trim();

  // Validate email and username
  var valid = validateEmail(email) 

  if (valid) {
      fetch('https://to-do-app-fv27.onrender.com/forgot-password', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: email })
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to reset password');
          }
          return response.json();
      })
      .then(data => {
          document.getElementById('message').textContent = data.message;
      })
      .catch(error => {
          document.getElementById('message').textContent = error.message;
      });
  }
});

// Live validation for email
document.getElementById('email').addEventListener('keyup', function () {
  validateField(this);
});


// Function to validate a single field
function validateField(inputField) {
  var fieldName = inputField.name;
  var fieldValue = inputField.value.trim();
  var errorElement = document.getElementById(fieldName + 'Error');
  errorElement.textContent = '';
  switch (fieldName) {
      case 'email':
          if (fieldValue === '') {
              errorElement.textContent = 'Email is required';
          } else if (!validateEmail(fieldValue)) {
              errorElement.textContent = 'Invalid email';
          }
          break;   
  }
}

// Function to validate email format
function validateEmail(email) {
  var re = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
}

